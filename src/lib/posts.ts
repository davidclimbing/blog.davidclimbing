import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import { VALIDATION_PATTERNS } from './constants';

// Node types for AST handling
interface CodeNode extends Node {
  type: 'code';
  lang?: string;
  value: string;
}

const postsDir = path.join(process.cwd(), 'src/posts');

// Cache for posts metadata to avoid repeated filesystem reads
let postsMetadataCache: Array<{ slug: string, title: string, date: string, tag?: string[], published?: boolean }> | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1 minute cache

export const getAllPosts = () => {
  const fileNames = fs.readdirSync(postsDir).reverse();
  return fileNames
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      const { content, data } = matter(fileContents);

      return {
        slug,
        content,
        title: data.title,
        date: data.date,
        tag: data.tag || [],
        published: data.published !== false, // 기본값: true (없으면 공개)
      };
    })
    .filter(post => post.published); // 공개된 포스트만 반환
};

// Optimized function to get only metadata without content
export const getAllPostsMetadata = () => {
  const now = Date.now();
  if (postsMetadataCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return postsMetadataCache;
  }

  const fileNames = fs.readdirSync(postsDir).reverse();
  postsMetadataCache = fileNames
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        tag: data.tag || [],
        published: data.published !== false, // 기본값: true (없으면 공개)
      };
    })
    .filter(post => post.published); // 공개된 포스트만 반환

  lastCacheUpdate = now;
  return postsMetadataCache;
};

export async function getPost(slug: string) {
  // 보안: slug 검증 및 Path Traversal 방지
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  // slug 형식 검증 (알파벳, 숫자, 하이픈만 허용)
  if (!VALIDATION_PATTERNS.SLUG.test(slug)) {
    return null;
  }

  // Path Traversal 방지: 경로 정규화 후 postsDir 내부인지 확인
  const filePath = path.join(postsDir, `${slug}.md`);
  const resolvedPath = path.resolve(filePath);
  const resolvedDir = path.resolve(postsDir);

  if (!resolvedPath.startsWith(resolvedDir)) {
    // Path Traversal 시도 감지
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContents);

    // 공개되지 않은 포스트는 null 반환
    if (data.published === false) {
      return null;
    }

    const htmlContent = await processMarkdown(content);

    return {
      slug,
      content: htmlContent,
      title: data.title,
      date: data.date,
      tag: data.tag || [],
      published: data.published !== false,
    };
  } catch {
    return null;
  }
}

// Cache for syntax highlighting to avoid repeated processing
const highlightCache = new Map<string, string>();

// 헤딩 텍스트 추출 헬퍼 함수
function getTextContent(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}

// 헤딩에 ID 속성을 추가하는 커스텀 rehype 플러그인
function rehypeHeadingIds() {
  return (tree: Node) => {
    visit(tree, 'element', (node: any) => {
      if (/^h[1-6]$/.test(node.tagName)) {
        const text = getTextContent(node);
        // slug 생성: 소문자 + 공백을 하이픈으로 + 허용 문자만 유지 + URL 인코딩
        const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '');
        // 한글을 URL 인코딩하여 href와 일치시킴
        const id = encodeURIComponent(slug);
        node.properties = node.properties || {};
        node.properties.id = id;
      }
    });
  };
}

function remarkHighlight() {
  return (tree: Node) => {
    visit(tree, 'code', (node: CodeNode) => {
      const lang = node.lang || 'plaintext';
      const cacheKey = `${lang}:${node.value}`;

      // Check cache first
      const cached = highlightCache.get(cacheKey);
      if (cached) {
        (node as unknown as { type: string }).type = 'html';
        node.value = cached;
        return;
      }

      try {
        const highlightedCode = hljs.highlight(node.value, {
          language: lang || 'plaintext',
        }).value;

        const result = `<pre class="hljs"><code class="language-${lang}">${highlightedCode}</code></pre>`;

        // Cache the result
        highlightCache.set(cacheKey, result);

        // Type assertion for TypeScript
        (node as unknown as { type: string }).type = 'html';
        node.value = result;
      } catch (err) {
        console.error(`Error highlighting language: ${lang}`, err);
        // Fallback to plain text
        const fallback = `<pre><code class="language-${lang}">${node.value}</code></pre>`;
        highlightCache.set(cacheKey, fallback);
        (node as unknown as { type: string }).type = 'html';
        node.value = fallback;
      }
    });
  };
}

async function processMarkdown(markdown: string): Promise<string> {
  // XSS 방어: remark-rehype와 rehype-sanitize를 사용하여 HTML 정화
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHeadingIds)
    .use(rehypeSanitize, {
      // ID 접두어 비활성화 (user-content- 제거)
      clobberPrefix: '',
      // 허용할 태그와 속성 설정
      tagNames: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'del',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'div', 'span',
      ],
      attributes: {
        a: ['href', 'title'],
        img: ['src', 'alt', 'title'],
        code: ['class'],
        pre: ['class'],
        h1: ['id'],
        h2: ['id'],
        h3: ['id'],
        h4: ['id'],
        h5: ['id'],
        h6: ['id'],
        '*': ['class'], // highlight.js 클래스 허용
      },
      protocols: {
        href: ['http', 'https', 'mailto'],
        src: ['http', 'https'],
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: false })
    .process(markdown);

  return result.toString();
}
