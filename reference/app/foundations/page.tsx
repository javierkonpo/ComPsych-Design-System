import { redirect } from 'next/navigation';

/**
 * `/foundations` redirects to the first foundation page (`color`). The old
 * index view duplicated what the sidebar already shows. The redirect is a
 * server-side 307, so the URL bar advances to `/foundations/color` before
 * any client code runs.
 */
export default function FoundationsIndex() {
  redirect('/foundations/color');
}
