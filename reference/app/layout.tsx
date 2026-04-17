import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-context';
import { Nav } from '@/components/nav';
import { HeaderBar } from '@/components/header-bar';
import './globals.css';

// Inter is loaded via `next/font/google` — self-hosted at build time, no
// runtime dependency added to package.json. Chosen because it is the
// conservative, neutral default for design-system reference UIs: it lets
// the tokens demo carry the visual identity rather than the chrome font.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ComPsych Design System',
  description:
    'A multi-product design system powering web and mobile experiences across ComPsych\u2019s four core products.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body data-theme="compsych-gro">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Nav />
            <div className="flex-1 min-w-0 flex flex-col">
              <HeaderBar />
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
