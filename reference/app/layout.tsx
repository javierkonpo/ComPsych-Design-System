import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-context';
import { Nav } from '@/components/nav';
import './globals.css';

// Inter covers body copy. Chosen because it is the conservative, neutral
// default for design-system reference UIs: it lets the tokens demo carry
// the visual identity rather than the chrome font.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Headlines want Google Sans. Google Sans itself is not distributed on
// Google Fonts (it's reserved for Google's own products), so the CSS
// stack in globals.css tries "Google Sans Text" / "Google Sans" first
// (available locally on many Google devices / ChromeOS / Android), then
// falls back to DM Sans — the canonical free substitute with matching
// humanist-geometric proportions. DM Sans is self-hosted at build time
// via next/font/google, so no runtime dependency.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ComPsych Design System',
  description:
    'A multi-product design system powering web and mobile experiences across ComPsych\u2019s four core products.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body data-theme="compsych-gro">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Nav />
            <div className="flex-1 min-w-0 flex flex-col">
              <main className="flex-1 px-10 py-12 max-w-6xl w-full">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
