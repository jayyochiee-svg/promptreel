import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptReel',
  description: 'AI-powered video generation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
