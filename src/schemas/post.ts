export interface Post {
  title: string;
  date: string;
  content: string;
  slug: string;
  tag?: string[];
}

export type PostSummary = Omit<Post, 'content'>;
