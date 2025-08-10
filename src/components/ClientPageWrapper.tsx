'use client';

import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { ReactNode } from 'react';

interface ClientPageWrapperProps {
  children: ReactNode;
}

export default function ClientPageWrapper({
  children,
}: ClientPageWrapperProps) {
  useVisitorTracking();

  return <>{children}</>;
}
