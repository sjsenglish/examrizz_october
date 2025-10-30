'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDiscordLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred with Discord login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred with Google login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        paddingTop: '80px'
      }}>
      {/* Login Modal */}
      <div style={{
        background: '#FFFFFF',
        border: '2px solid #000000',
        borderRadius: '12px',
        padding: '40px 50px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Close button */}
        <Link href="/" style={{
          position: 'absolute',
          top: '15px',
          right: '20px',
          textDecoration: 'none',
          color: '#666666',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          ×
        </Link>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Figtree', sans-serif",
          fontSize: '24px',
          fontWeight: '700',
          color: '#000000',
          margin: '0 0 30px 0',
          textAlign: 'left'
        }}>
          LOGIN
        </h1>

        {/* Error message */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            color: '#B91C1C',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: '#E0F7FA',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: '#E0F7FA',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: loading ? '#9CA3AF' : '#E7E6FF',
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px'
            }}
          >
            {loading ? 'Signing In...' : 'Log In'}
          </button>

          {/* Or divider */}
          <div style={{
            textAlign: 'center',
            margin: '24px 0',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '14px',
            color: '#666666'
          }}>
            Or
          </div>

          {/* Social Login Buttons */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={handleDiscordLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#9CA3AF' : '#5865F2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.201 0 2.176 1.068 2.157 2.38 0 1.311-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.2 0 2.176 1.068 2.157 2.38 0 1.311-.956 2.38-2.157 2.38z"/>
              </svg>
              Discord Login
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#9CA3AF' : '#E5E7EB',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Gmail Login
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <div style={{
          textAlign: 'left',
          fontFamily: "'Figtree', sans-serif",
          fontSize: '14px',
          color: '#666666'
        }}>
          <span style={{ textDecoration: 'underline' }}>No account yet?</span>{' '}
          <button
            onClick={handleSignUpClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#000000',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            SIGN UP →
          </button>
        </div>

        {/* Ghost illustration */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-60px',
          width: '120px',
          height: '120px'
        }}>
          <img 
            src="/icons/ghost-karaoke.svg" 
            alt="Ghost" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
    </>
  );
}