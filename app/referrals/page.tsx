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
        {/* Header SVG */}
        <div className="referrals-header-svg">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202795.svg?alt=media&token=ed23d7cb-8609-4a46-bf91-57d85e1d4a1f"
            alt="Referral Header"
            className="svg-image-header"
          />
        </div>

        {/* Progress Circles SVG - New */}
        <div className="progress-circles-svg">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202796.svg?alt=media&token=94274a83-88a2-4fcc-aaef-e96a232db2fa"
            alt="Progress Steps"
            className="svg-image-progress"
          />
        </div>

        {/* Your Referral Link - Custom Built */}
        <div className="referral-link-section">
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

          {/* Share Buttons */}
          <div className="share-buttons">
            <button onClick={shareViaEmail} className="share-button email">
              <span>📧</span> Email
            </button>
            <button onClick={shareViaWhatsApp} className="share-button whatsapp">
              <span>💬</span> WhatsApp
            </button>
            <button onClick={shareViaTwitter} className="share-button twitter">
              <span>🐦</span> Twitter
            </button>
            <button onClick={shareViaFacebook} className="share-button facebook">
              <span>📘</span> Facebook
            </button>
          </div>
        </div>

        {/* Friends Referred - Custom Built */}
        <div className="friends-referred-section">
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
                  <span className={`friend-status ${referral.status}`}>
                    {referral.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                  </span>
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
            className="svg-image-details"
          />
        </div>

        {/* Details Section 2 */}
        <div className="details-section-2">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202791.svg?alt=media&token=dceeb64f-e8c4-4390-b809-f95d18d284a3"
            alt="Details Section 2"
            className="svg-image-details"
          />
        </div>
      </div>
    </>
  );
}
