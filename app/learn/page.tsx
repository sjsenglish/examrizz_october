'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to competition page
    router.push('/competition');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="loading-spinner"></div>
      <p>Redirecting...</p>
    </div>
  );
}
