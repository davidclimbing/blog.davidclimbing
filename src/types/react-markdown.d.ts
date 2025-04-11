declare module 'react-markdown' {
  import { ComponentType, ReactNode } from 'react';

  export interface Components {
    [key: string]: ComponentType<any>;
  }

  export interface MarkdownProps {
    children: string;
    className?: string;
    components?: Components;
    rehypePlugins?: any[];
    remarkPlugins?: any[];
  }

  const Markdown: ComponentType<MarkdownProps>;
  export default Markdown;
} 