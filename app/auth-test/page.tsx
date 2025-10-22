'use client';

import React, { useState, useEffect } from 'react';
import { supabase, getCurrentUser, ensureTeacherProfile } from '../../lib/supabase.ts';

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('teacher@test.com');
  const [password, setPassword] = useState('testpassword123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userProfile = await ensureTeacherProfile(currentUser.id, currentUser.email || '');
      setProfile(userProfile);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('Error signing up: ' + error.message);
      } else {
        alert('Sign up successful! Check your email for verification.');
        await checkUser();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Error signing in: ' + error.message);
      } else {
        alert('Sign in successful!');
        await checkUser();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Error signing out: ' + error.message);
      } else {
        setUser(null);
        setProfile(null);
        alert('Signed out successfully!');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: "'Figtree', sans-serif" }}>
      <h1>Authentication Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Current Status:</h2>
        <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'Not logged in'}</p>
        <p><strong>Profile:</strong> {profile ? `${profile.full_name} (${profile.role})` : 'No profile'}</p>
      </div>

      {!user ? (
        <div style={{ marginBottom: '20px' }}>
          <h2>Login/Register:</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            />
          </div>
          <button 
            onClick={signIn} 
            disabled={loading}
            style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#0066CC', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <button 
            onClick={signUp} 
            disabled={loading}
            style={{ padding: '10px 20px', backgroundColor: '#00CED1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <h2>Actions:</h2>
          <button 
            onClick={signOut} 
            disabled={loading}
            style={{ padding: '10px 20px', backgroundColor: '#FF4444', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Loading...' : 'Sign Out'}
          </button>
          <div style={{ marginTop: '20px' }}>
            <a href="/teacher" style={{ color: '#0066CC', textDecoration: 'underline' }}>
              Go to Teacher Dashboard
            </a>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Use the default email (teacher@test.com) or enter your own</li>
          <li>Click "Sign Up" to create a new account</li>
          <li>Click "Sign In" to log in with existing credentials</li>
          <li>Once logged in, your teacher profile will be automatically created</li>
          <li>Click "Go to Teacher Dashboard" to test the teacher functionality</li>
        </ol>
      </div>
    </div>
  );
}