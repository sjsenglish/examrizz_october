'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useProfile } from '@/contexts/ProfileContext';
import { useSubscription } from '@/hooks/useSubscription';
import './profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const { tier } = useSubscription();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    discord_username: '',
    school: '',
    rank_in_school: '',
  });

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAuthAndLoadProfile();
  }, [router]);

  // Load profile data into form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        discord_username: profile.discord_username || '',
        school: profile.school || '',
        rank_in_school: profile.rank_in_school || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Build update object - only include username if it's not empty
      const updateData: any = {
        full_name: formData.full_name,
        discord_username: formData.discord_username,
        school: formData.school,
        rank_in_school: formData.rank_in_school,
      };

      // Only update username if user has entered one
      if (formData.username && formData.username.trim() !== '') {
        updateData.username = formData.username.trim();
      }

      const { error } = await (supabase as any)
        .from('user_profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) {
        // Provide more helpful error message for unique constraint violations
        if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
          throw new Error('This username is already taken. Please choose a different one.');
        }
        throw error;
      }

      // Refresh profile to get latest data
      await refreshProfile();

      // Process referral rewards if Discord username was added/updated
      if (formData.discord_username && formData.discord_username.trim() !== '') {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            const rewardResponse = await fetch('/api/referrals/process-rewards', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            });

            if (rewardResponse.ok) {
              const rewardData = await rewardResponse.json();
              if (rewardData.processed) {
                console.log('Referral rewards processed!', rewardData);
                setSuccessMessage('Profile updated! Referral rewards unlocked! 🎁');
                // Clear success message after 5 seconds for reward message
                setTimeout(() => setSuccessMessage(''), 5000);
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error processing referral rewards:', error);
          // Don't fail profile save if reward processing fails
        }
      }

      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update profile');

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const getTierBadge = () => {
    switch (tier) {
      case 'plus':
        return { text: 'Plus Member', icon: '⭐', color: '#7C3AED', bgColor: '#F3E8FF' };
      case 'max':
        return { text: 'Max Member', icon: '👑', color: '#DC2626', bgColor: '#FEF2F2' };
      default:
        return { text: 'Free Member', icon: '🆓', color: '#059669', bgColor: '#ECFDF5' };
    }
  };

  const tierBadge = getTierBadge();

  if (loading || profileLoading) {
    return (
      <div className="profile-page-wrapper">
        <Navbar />
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      <div className="profile-container">
        {/* Header with Purple Ghost Icon */}
        <div className="profile-header">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fpurple%20ghost.svg?alt=media&token=8f68c264-89dd-4563-8858-07b8f9fd87e0"
            alt="Profile"
            className="profile-icon"
          />
          <h1 className="profile-title">Your Profile</h1>
          {tierBadge && (
            <div
              className="profile-tier-badge"
              style={{
                backgroundColor: tierBadge.bgColor,
                color: tierBadge.color,
              }}
            >
              <span className="tier-icon">{tierBadge.icon}</span>
              <span className="tier-text">{tierBadge.text}</span>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="message message-success">
            ✓ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="message message-error">
            ✗ {errorMessage}
          </div>
        )}

        {/* Profile Form */}
        <div className="profile-form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="form-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                className="form-input"
                placeholder="Enter your school name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rank in School</label>
              <input
                type="text"
                value={formData.rank_in_school}
                onChange={(e) => handleInputChange('rank_in_school', e.target.value)}
                className="form-input"
                placeholder="e.g., Top 10%"
              />
            </div>
          </div>
        </div>

        {/* Discord Section - Highlighted */}
        <div className="profile-form-section discord-section">
          <div className="discord-header">
            <h2 className="section-title">Discord Information</h2>
            <span className="discord-badge">Required for Referral Rewards</span>
          </div>
          <p className="discord-description">
            Add your Discord username to receive referral rewards and get help from teachers in our community.
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Discord Username <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.discord_username}
                onChange={(e) => handleInputChange('discord_username', e.target.value)}
                className="form-input discord-input"
                placeholder="e.g., johndoe or johndoe#1234"
              />
              <div className="input-hint">
                Your Discord username (found in Discord app under Settings → My Account)
              </div>
            </div>
          </div>
        </div>

        {/* Account Information - Read Only */}
        <div className="profile-form-section">
          <h2 className="section-title">Account Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                className="form-input readonly"
                readOnly
                disabled
              />
              <div className="input-hint">Email cannot be changed</div>
            </div>

            <div className="form-group">
              <label className="form-label">Member Since</label>
              <input
                type="text"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : ''}
                className="form-input readonly"
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="profile-actions">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`save-button ${saving ? 'saving' : ''}`}
          >
            {saving ? (
              <>
                <div className="button-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="save-icon">✓</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
