"use client";
import { createRef, useEffect } from "react";

export function Utterances() {
  const root = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!root.current) return;
    
    const element = document.createElement("script");

    element.setAttribute("src", "https://utteranc.es/client.js");
    element.setAttribute("repo", "davidclimbing/blog.davidclimbs");
    element.setAttribute("issue-term", "pathname");
    element.setAttribute("label", "comment");
    element.setAttribute("theme", "github-dark");
    element.setAttribute("crossorigin", "anonymous");
    element.async = true;

    root.current.appendChild(element);
  }, [root]);

  return <div ref={root} />;
}
