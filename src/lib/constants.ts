import path from 'path';

// File system constants
export const POSTS_DIRECTORY = path.join(process.cwd(), 'src/posts');
export const MARKDOWN_EXTENSION = '.md';

// Markdown processing configuration
export const HIGHLIGHT_CONFIG = {
  sanitize: false,
  languages: ['javascript', 'typescript', 'python', 'bash', 'html', 'css', 'json', 'jsx', 'tsx', 'sql', 'yaml', 'xml']
} as const;

// Error messages
export const ERROR_MESSAGES = {
  POST_NOT_FOUND: 'Post not found',
  INVALID_MARKDOWN: 'Invalid markdown content',
  HIGHLIGHT_ERROR: 'Error highlighting code',
  POSTS_DIRECTORY_ERROR: 'Error reading posts directory'
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes in development
  ENABLED: process.env.NODE_ENV !== 'production' // Disable in production for fresh builds
} as const;

// Post metadata validation patterns
export const VALIDATION_PATTERNS = {
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 500
} as const;