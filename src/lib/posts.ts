import fs from "fs"
import path from "path"
import matter from "gray-matter";
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';

const postsDir = path.join(process.cwd(), "src/posts");

export const getAllPosts = () => {
  const fileNames = fs.readdirSync(postsDir).reverse();
  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const filePath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const {content, data} = matter(fileContents);
    
    return {
      slug,
      content,
      title: data.title,
      date: data.date
    }
  });
};

export async function getPost(slug: string) {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) return null;
  
  const htmlContent = await processMarkdown(post.content);
  
  return {
    ...post,
    content: htmlContent
  };
}

function remarkHighlight() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      const lang = node.lang || 'plaintext';
      try {
        const highlightedCode = hljs.highlight(node.value, { 
          language: lang || 'plaintext'
        }).value;
        
        node.type = 'html';
        node.value = `<pre class="hljs"><code class="language-${lang}">${highlightedCode}</code></pre>`;
      } catch (err) {
        console.error(`Error highlighting language: ${lang}`, err);
      }
    });
  };
}

async function processMarkdown(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(html, {
      sanitize: false
    })
    .process(markdown);
  
  return result.toString();
}
