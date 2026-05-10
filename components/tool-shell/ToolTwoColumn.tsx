'use client';

import type { ReactNode } from 'react';

export default function ToolTwoColumn({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">{children}</div>;
}
