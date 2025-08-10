import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

// Node types for AST handling
interface CodeNode extends Node {
  type: 'code';
  lang?: string;
  value: string;
}

const postsDir = path.join(process.cwd(), 'src/posts');

// Cache for posts metadata to avoid repeated filesystem reads
let postsMetadataCache: Array<{ slug: string, title: string, date: string }> | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1 minute cache

export const getAllPosts = () => {
  const fileNames = fs.readdirSync(postsDir).reverse();
  return fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    const { content, data } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
    };
  });
};

// Optimized function to get only metadata without content
export const getAllPostsMetadata = () => {
  const now = Date.now();
  if (postsMetadataCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return postsMetadataCache;
  }

  const fileNames = fs.readdirSync(postsDir).reverse();
  postsMetadataCache = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
    };
  });

  lastCacheUpdate = now;
  return postsMetadataCache;
};

export async function getPost(slug: string) {
  // Direct file read instead of loading all posts
  const filePath = path.join(postsDir, `${slug}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContents);

    const htmlContent = await processMarkdown(content);

    return {
      slug,
      content: htmlContent,
      title: data.title,
      date: data.date,
    };
  } catch {
    return null;
  }
}

// Cache for syntax highlighting to avoid repeated processing
const highlightCache = new Map<string, string>();

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
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(html, {
      sanitize: false,
    })
    .process(markdown);

  return result.toString();
}
