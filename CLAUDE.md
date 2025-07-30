# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `yarn dev` (uses Turbopack for faster builds)
- **Build**: `npm run build` or `yarn build` 
- **Production server**: `npm run start` or `yarn start`
- **Lint**: `npm run lint` or `yarn lint`

## Architecture Overview

This is a Next.js 15 blog application with the following key architectural patterns:

### Content Management System
- **Markdown-based posts**: Blog posts are stored as `.md` files in `src/posts/`
- **File-based routing**: Post URLs are generated from filename slugs
- **Static generation**: Posts are statically generated at build time using `generateStaticParams`
- **Frontmatter parsing**: Uses `gray-matter` to extract metadata (title, date, author) from markdown files

### Post Processing Pipeline
- **Markdown to HTML**: Uses `remark` with `remark-html` and `remark-gfm` for GitHub Flavored Markdown
- **Syntax highlighting**: Custom `remarkHighlight` plugin using `highlight.js` with dark theme
- **Post utilities**: `src/lib/posts.ts` handles all post-related operations (getAllPosts, getPost, processMarkdown)

### Type System
- **Post schemas**: TypeScript interfaces in `src/schemas/post.ts` define Post, PostMetadata, PostSummary, and ProcessedPost types
- **Constants**: Centralized configuration in `src/lib/constants.ts` for posts directory, extensions, and error messages

### Styling & UI
- **TailwindCSS**: Primary styling framework with custom SCSS files for additional styling
- **GitHub Markdown CSS**: Uses `github-markdown-css` for consistent markdown rendering
- **Responsive design**: Mobile-first approach with max-width containers (700px)
- **Comments**: Utterances integration for GitHub-based comments

### Key Files Structure
- `src/lib/posts.ts`: Core post processing and retrieval logic
- `src/schemas/post.ts`: TypeScript type definitions for posts
- `src/app/page.tsx`: Homepage displaying post list
- `src/app/posts/[slug]/page.tsx`: Dynamic post page with static generation
- `src/posts/`: Directory containing all markdown blog posts

### Important Notes
- Posts are displayed in reverse chronological order (newest first)
- The build configuration ignores TypeScript and ESLint errors (`ignoreBuildErrors: true`)
- Uses Vercel Analytics for tracking
- Supports syntax highlighting for multiple languages (JS, TS, Python, Bash, HTML, CSS, JSON)