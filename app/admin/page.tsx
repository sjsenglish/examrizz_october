'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './admin.css';

interface User {
  id: string;
  email?: string;
  full_name?: string;
  discord_id?: string;
  discord_username?: string;
  subscription_tier: 'free' | 'plus' | 'max';
  subscription_status: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      loadUsers();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'team@examrizz.com' && password === 'Edtech2025!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
      loadUsers();
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setUsers([]);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setMessage('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPremium = async (userId: string, tier: 'free' | 'plus' | 'max') => {
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, tier }),
      });

      if (response.ok) {
        setMessage(`User updated to ${tier} tier successfully`);
        loadUsers(); // Reload users to show updated status
      } else {
        const error = await response.json();
        setMessage(`Failed to update user: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
    }
  };

  const filteredUsers = users.filter((user: any) => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.discord_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.discord_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="page-background">
        <Navbar />
        
        {/* Back Button */}
        <Link 
          href="/" 
          style={{
            position: 'absolute',
            top: '90px',
            left: '45px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#333333',
            fontFamily: "'Madimi One', cursive",
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 20
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <div className="admin-container">
          <div className="login-card">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage Premium User Access</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="team@examrizz.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>
              
              {loginError && (
                <div className="error-message">{loginError}</div>
              )}
              
              <button type="submit" className="login-button">
                Login to Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background">
      <Navbar />
      
      {/* Back Button */}
      <Link 
        href="/" 
        style={{
          position: 'absolute',
          top: '90px',
          left: '45px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: "'Madimi One', cursive",
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Failed') || message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="admin-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by email, name, or Discord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={loadUsers} className="refresh-button" disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="loading-state">Loading users...</div>
          ) : (
            <div className="users-grid">
              {filteredUsers.length === 0 ? (
                <div className="no-users">No users found</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h3 className="user-name">{user.full_name || 'No name'}</h3>
                      <p className="user-email">{user.email || 'No email'}</p>
                      {user.discord_username && (
                        <p className="user-discord">Discord: {user.discord_username}</p>
                      )}
                      {user.discord_id && (
                        <p className="user-discord-id">ID: {user.discord_id}</p>
                      )}
                      <p className="user-created">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="user-status">
                      <div className={`status-badge ${user.subscription_tier}`}>
                        {user.subscription_tier.toUpperCase()}
                      </div>
                      <div className="status-text">
                        Status: {user.subscription_status}
                      </div>
                    </div>

                    <div className="user-actions">
                      <button
                        onClick={() => updateUserPremium(user.id, 'plus')}
                        className={`action-button plus ${user.subscription_tier === 'plus' ? 'active' : ''}`}
                        disabled={user.subscription_tier === 'plus'}
                      >
                        Set Plus
                      </button>
                      <button
                        onClick={() => updateUserPremium(user.id, 'max')}
                        className={`action-button max ${user.subscription_tier === 'max' ? 'active' : ''}`}
                        disabled={user.subscription_tier === 'max'}
                      >
                        Set Max
                      </button>
                      <button
                        onClick={() => updateUserPremium(user.id, 'free')}
                        className={`action-button free ${user.subscription_tier === 'free' ? 'active' : ''}`}
                        disabled={user.subscription_tier === 'free'}
                      >
                        Remove Premium
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}