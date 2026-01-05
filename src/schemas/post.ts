import type { TocItem } from './toc';

export interface Post {
  title: string;
  date: string;
  content: string;
  slug: string;
  tag?: string[];
  published?: boolean; // 기본값: true (없으면 공개)
  toc?: TocItem[];
}

export type PostSummary = Omit<Post, 'content'>;
