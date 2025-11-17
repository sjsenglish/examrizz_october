'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Navbar from '@/components/Navbar';
import './referrals.css';

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface ReferralStats {
  total: number;
  completed: number;
  pending: number;
}

export default function ReferralsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState<ReferralStats>({ total: 0, completed: 0, pending: 0 });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      await fetchReferralData(session.access_token);
    };

    checkAuthAndFetchData();
  }, [router]);

  const fetchReferralData = async (token: string) => {
    try {
      const response = await fetch('/api/referrals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }

      const data = await response.json();
      setReferralCode(data.referralCode);
      setReferralLink(`${window.location.origin}/signup?ref=${data.referralCode}`);
      setStats(data.stats);
      setReferrals(data.referrals);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join me on ExamRizz!');
    const body = encodeURIComponent(`Hey! I've been using ExamRizz for exam prep and thought you might find it useful too. Sign up using my referral link: ${referralLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Hey! Check out ExamRizz - it's great for exam prep! Sign up using my referral link: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Join me on ExamRizz for better exam prep! ${referralLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="referrals-loading">
          <div className="spinner"></div>
          <p>Loading your referrals...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="referrals-container">
        {/* Header Section */}
        <div className="referrals-header">
          <h1 className="referrals-title">Refer Friends & Earn Rewards</h1>
          <p className="referrals-subtitle">Share ExamRizz with your friends and get rewarded when they sign up!</p>
        </div>

        {/* Progress Tracker */}
        <div className="progress-tracker">
          <div className="progress-step completed">
            <div className="progress-circle"></div>
            <span className="progress-label">Share Link</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${stats.total > 0 ? 'completed' : ''}`}>
            <div className="progress-circle"></div>
            <span className="progress-label">Friend Clicks</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${stats.completed > 0 ? 'completed' : ''}`}>
            <div className="progress-circle"></div>
            <span className="progress-label">Friend Signs Up</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className="progress-circle"></div>
            <span className="progress-label">Get Rewarded</span>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="referral-link-section">
          <h2 className="section-title">Your Referral Link</h2>
          <div className="link-container">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="link-input"
            />
            <button onClick={copyToClipboard} className="copy-button">
              {copySuccess ? (
                <span>✓ Copied!</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="share-buttons">
            <button onClick={shareViaEmail} className="share-button email">
              Email
            </button>
            <button onClick={shareViaWhatsApp} className="share-button whatsapp">
              WhatsApp
            </button>
            <button onClick={shareViaTwitter} className="share-button twitter">
              Twitter
            </button>
            <button onClick={shareViaFacebook} className="share-button facebook">
              Facebook
            </button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="referrals-list-section">
          <h2 className="section-title">Your Referrals ({stats.total})</h2>
          <div className="referrals-list">
            {referrals.length === 0 ? (
              <div className="empty-state">
                <p>No referrals yet. Share your link to get started!</p>
              </div>
            ) : (
              referrals.map((referral) => (
                <div key={referral.id} className="referral-item">
                  <div className="referral-info">
                    <span className="referral-email">{referral.referred_email}</span>
                    <span className="referral-date">{formatDate(referral.created_at)}</span>
                  </div>
                  <span className={`referral-status ${referral.status}`}>
                    {referral.status === 'completed' ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Referrals</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Share Your Link</h3>
              <p>Copy your unique referral link and share it with friends via email, WhatsApp, or social media.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Friend Signs Up</h3>
              <p>When your friend clicks your link and creates an account, they'll be automatically tracked as your referral.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Rewarded</h3>
              <p>Once your friend completes their signup, you'll receive exclusive rewards and benefits!</p>
            </div>
          </div>
        </div>

        {/* Terms Section */}
        <div className="terms-section">
          <h3>Referral Program Terms</h3>
          <ul>
            <li>Each unique email address can only be referred once</li>
            <li>Referral rewards are credited after the referred user completes signup</li>
            <li>Self-referrals and fake accounts are not permitted</li>
            <li>ExamRizz reserves the right to modify or discontinue the referral program at any time</li>
          </ul>
        </div>
      </div>
    </>
  );
}
