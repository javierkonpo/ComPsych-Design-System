import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme-context';
import { Nav } from '@/components/nav';
import { HeaderBar } from '@/components/header-bar';
import './globals.css';

export const metadata: Metadata = {
  title: 'ComPsych DS · Reference',
  description:
    'Live visual reference for the ComPsych Design System. Built from the tokens pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-theme="compsych-gro">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Nav />
            <div className="flex-1 min-w-0 flex flex-col">
              <HeaderBar />
              <main className="flex-1 p-10 max-w-5xl">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
