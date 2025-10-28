'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { NewSwipeableContainer } from '@/components/NewSwipeableContainer';
import ExamSearch from '@/components/ExamSearch';
import './home.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [landingPage, setLandingPage] = useState<'island' | 'search'>('search');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in, default to search page
        setLandingPage('search');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/user-preferences', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const preferences = await response.json();
        setLandingPage(preferences.landing_page || 'search');
      } else {
        setLandingPage('search');
      }
    } catch (error) {
      console.error('Error checking user preferences:', error);
      setLandingPage('search');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: "'Madimi One', cursive",
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (landingPage === 'island') {
    return <NewSwipeableContainer />;
  }

  return <ExamSearch />;
}