'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#F8F8F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{
          fontFamily: "'Madimi One', cursive",
          fontSize: '24px',
          fontWeight: '400',
          color: '#000000',
          margin: '0',
          cursor: 'pointer'
        }}>
          examrizzsearch
        </h1>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* About Us Button */}
        <Link 
          href="/about"
          style={{
            background: '#DBFCFF',
            border: '1px solid #00CED1',
            borderRadius: '20px',
            padding: '8px 16px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '13px',
            fontWeight: '500',
            color: '#000000',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#B3F0F2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#DBFCFF';
          }}
        >
          About Us
        </Link>

        {/* How To Button */}
        <Link 
          href="/help"
          style={{
            background: '#E0FDFF',
            border: '1px solid #00CED1',
            borderRadius: '20px',
            padding: '8px 16px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '13px',
            fontWeight: '500',
            color: '#000000',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#B3F0F2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#E0FDFF';
          }}
        >
          How To
        </Link>

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <>
            {userEmail && (
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '13px',
                color: '#666',
                marginRight: '8px'
              }}>
                {userEmail}
              </span>
            )}
            <button 
              onClick={handleLogout}
              style={{
                background: '#E7E6FF',
                border: '1px solid #4338CA',
                borderRadius: '20px',
                padding: '8px 16px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '13px',
                fontWeight: '500',
                color: '#4338CA',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#DDD6FE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E7E6FF';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogin}
            style={{
              background: '#E7E6FF',
              border: '1px solid #D8C6FF',
              borderRadius: '20px',
              padding: '8px 16px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '13px',
              fontWeight: '500',
              color: '#000000',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#DDD6FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#E7E6FF';
            }}
          >
            Login
          </button>
        )}

        {/* Menu Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              zIndex: 1001
            }}>
              <Link 
                href="/payment"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Payment
              </Link>
              <Link 
                href="/terms-and-conditions"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                T's & C's
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}