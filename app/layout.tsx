import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}