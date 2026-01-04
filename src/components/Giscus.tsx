'use client';

import GiscusComponent from '@giscus/react';

export function Giscus() {
  return (
    <GiscusComponent
      repo="davidclimbing/blog.davidclimbing"
      repoId="R_kgDOOB50Vg"
      category="Announcements"
      categoryId="DIC_kwDOOB50Vs4C0cpJ"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark"
      lang="ko"
      loading="lazy"
    />
  );
}
