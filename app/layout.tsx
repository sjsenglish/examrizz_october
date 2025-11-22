import type { Metadata } from 'next';
import { Inter, Figtree, Madimi_One } from 'next/font/google';
import './globals.css';
import { PostHogProvider, PostHogPageView } from '../components/PostHogProvider';
import { ProfileProvider } from '../contexts/ProfileContext';
import { Suspense } from 'react';

// Maintenance mode flag - set to true to show maintenance message
const MAINTENANCE_MODE = true;

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

const madimiOne = Madimi_One({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-madimi'
});

export const metadata: Metadata = {
  title: 'search and solutions',
  description: 'Your gamified learning adventure starts here. Practice, learn, compete, and grow with examrizz.',
  keywords: ['education', 'learning', 'gamified', 'practice', 'study'],
  authors: [{ name: 'examrizz Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
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
      <body className={`${inter.className} ${figtree.className} ${madimiOne.variable} antialiased`}>
        <PostHogProvider>
          <ProfileProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            {MAINTENANCE_MODE ? (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
              }}>
                <div style={{
                  textAlign: 'center',
                  maxWidth: '600px',
                  fontFamily: 'Figtree, system-ui, -apple-system, sans-serif',
                }}>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: '20px',
                  }}>
                    Down for Maintenance
                  </h1>
                  <p style={{
                    fontSize: '18px',
                    color: '#333333',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                  }}>
                    We're sorting out some issues but will be back up and running very soon. Thank you for your patience.
                  </p>
                  <p style={{
                    fontSize: '18px',
                    color: '#333333',
                    lineHeight: '1.6',
                  }}>
                    If you have any questions you need help with in the meantime, send us a message in discord.
                  </p>
                </div>
              </div>
            ) : (
              children
            )}
          </ProfileProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}