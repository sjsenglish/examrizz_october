'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import './referrals.css';

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  reward_status: string;
  referrer_rewarded_at: string | null;
  referred_rewarded_at: string | null;
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
      setReferralLink(`https://www.examrizzsearch.com/signup?ref=${data.referralCode}`);
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
      <div className="referrals-page-wrapper">
        <Navbar />
        <div className="referrals-loading">
          <div className="spinner"></div>
          <p>Loading your referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="referrals-page-wrapper">
      <Navbar />
      <div className="referrals-container">
        {/* Header SVG */}
        <div className="referrals-header-svg">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202797.svg?alt=media&token=6fd95839-6bd1-4474-859f-2be4fea27fbd"
            alt="Referral Header"
            className="svg-image-unified"
          />
        </div>

        {/* Your Referral Link - Custom Built */}
        <div className="referral-link-section unified-width">
          <h2 className="section-title">Your Referral Link</h2>
          <div className="link-input-wrapper">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="link-input"
            />
            <button onClick={copyToClipboard} className="copy-button">
              {copySuccess ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Friends Referred - Custom Built */}
        <div className="friends-referred-section unified-width">
          <h2 className="section-title">Friends Referred ({stats.total})</h2>
          <div className="friends-list">
            {referrals.length === 0 ? (
              <div className="empty-state">
                <p>No referrals yet. Share your link to get started!</p>
              </div>
            ) : (
              referrals.map((referral) => (
                <div key={referral.id} className="friend-item">
                  <div className="friend-info">
                    <span className="friend-email">{referral.referred_email}</span>
                    <span className="friend-date">{formatDate(referral.created_at)}</span>
                  </div>
                  <div className="friend-status-wrapper">
                    <span className={`friend-status ${referral.status}`}>
                      {referral.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </span>
                    {referral.reward_status === 'completed' && referral.referrer_rewarded_at && (
                      <span className="reward-badge">
                        🎁 +1 Month Plus
                      </span>
                    )}
                    {referral.status === 'pending' && referral.reward_status === 'pending' && (
                      <span className="reward-pending">
                        Waiting for Discord
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Section 1 */}
        <div className="details-section-1">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202792.svg?alt=media&token=7735cfc3-bdb7-453e-af10-c832ccc2bdde"
            alt="Details Section 1"
            className="svg-image-unified"
          />
        </div>

        {/* Details Section 2 */}
        <div className="details-section-2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fhow-it-works-updated.svg?alt=media&token=79d414fa-c586-43f9-964b-a5d18ee3263a"
            alt="Details Section 2"
            className="svg-image-unified"
          />
        </div>
      </div>
    </div>
  );
}
