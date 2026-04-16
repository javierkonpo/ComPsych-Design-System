/**
 * Opts every foundations page out of static generation.
 *
 * Foundation pages are 'use client' and read all their values from CSS
 * custom properties at runtime via `getComputedStyle(document.body)`. They
 * render nothing meaningful on the server (no data dependencies, no SEO
 * content that the prerendered HTML improves). Forcing dynamic also avoids
 * a Next.js 15 RSC client-manifest bug that surfaces inconsistently during
 * static generation of client-component pages on some platforms.
 */
export const dynamic = 'force-dynamic';

export default function FoundationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
