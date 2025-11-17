'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { performLogout } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase-client';
import { useSubscription } from '@/hooks/useSubscription';
import './Navbar.css';

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { subscription, tier } = useSubscription();

  // Get member status for display
  const getMemberStatus = () => {
    if (!isLoggedIn) return null;
    
    switch (tier) {
      case 'plus':
        return { text: 'Plus Member', color: '#7C3AED', bgColor: '#F3E8FF' };
      case 'max':
        return { text: 'Max Member', color: '#DC2626', bgColor: '#FEF2F2' };
      default:
        return { text: 'Free', color: '#059669', bgColor: '#ECFDF5' };
    }
  };

  const memberStatus = getMemberStatus();

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
    try {
      // Use the comprehensive logout utility
      await performLogout();
      
      // Force a page refresh to ensure all components reset their state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      window.location.href = '/';
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <nav className="navbar-main">
      <Link href="/" className="navbar-logo-link">
        <h1 className="navbar-logo">
          examrizzsearch
        </h1>
      </Link>

      <div className="navbar-actions">
        {/* About Us Button */}
        <Link href="/about" className="nav-btn nav-btn-about">
          <span className="nav-btn-text">About Us</span>
        </Link>

        {/* How To Button */}
        <Link href="/help" className="nav-btn nav-btn-help">
          <span className="nav-btn-text">How To</span>
        </Link>

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <>
            {userEmail && (
              <span className="nav-user-email">
                {userEmail}
              </span>
            )}
            <button onClick={handleLogout} className="nav-btn nav-btn-logout">
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="nav-btn nav-btn-login">
            Login
          </button>
        )}

        {/* Menu Dropdown */}
        <div className="navbar-dropdown-wrapper">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="navbar-menu-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showDropdown && (
            <div className="navbar-dropdown-menu">
              <Link
                href="/profile"
                className="navbar-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <Link
                href="/referrals"
                className="navbar-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Referrals
              </Link>
              <Link
                href="/payment"
                className="navbar-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Payment
              </Link>
              <Link
                href="/terms-and-conditions"
                className="navbar-dropdown-item"
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