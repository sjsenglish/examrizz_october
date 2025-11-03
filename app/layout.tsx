import type { Metadata } from 'next';
import { Inter, Figtree } from 'next/font/google';
import './globals.css';
import { PostHogProvider, PostHogPageView } from '../components/PostHogProvider';
import { Suspense } from 'react';

// Optimize font loading with proper fallbacks
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
});

const figtree = Figtree({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'examrizz - Gamified Learning Platform',
  description: 'Your gamified learning adventure starts here. Practice, learn, compete, and grow with examrizz.',
  keywords: ['education', 'learning', 'gamified', 'practice', 'study'],
  authors: [{ name: 'examrizz Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Font preloading handled by Next.js font optimization */}
      </head>
      <body className={`${inter.className} ${figtree.className} antialiased`}>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}