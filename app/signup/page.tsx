'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ensureUserProfile } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase-client';

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  // Step 2 form data
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [school, setSchool] = useState('');
  const [rankInSchool, setRankInSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gcseSubjects, setGcseSubjects] = useState<Array<{subject: string, grade: string}>>([]);
  const [aLevelSubjects, setALevelSubjects] = useState<Array<{subject: string, grade: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  // Check authentication state and handle OAuth redirects
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setAuthLoading(true);
        
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to check authentication status');
          return;
        }

        if (session?.user) {
          // Use the new auth utility to ensure profile exists (fixes Discord auth issues)
          const { user, profile, error: authError } = await ensureUserProfile();
          
          // Only show error if authentication actually failed
          if (authError && authError === 'Not authenticated') {
            setError('Failed to verify account. Please try again.');
            return;
          }
          
          setUser(user);
          
          if (profile) {
            setExistingProfile(profile);
            
            // Check if this is a Discord user
            if (profile.discord_id) {
              setDiscordConnected(true);
              setSuccessMessage('Discord account connected successfully!');
              
              // Pre-fill form with existing data
              if (profile.full_name) setFullName(profile.full_name);
              if (profile.username) setUsername(profile.username);
              if (profile.school) setSchool(profile.school);
              if (profile.rank_in_school) setRankInSchool(profile.rank_in_school);
              if (profile.email) setEmail(profile.email);
              
              // If user already has complete profile, redirect to home
              if (profile.full_name && profile.username) {
                setSuccessMessage('Account setup complete! Redirecting...');
                setTimeout(() => router.push('/'), 2000);
                return;
              } else {
                // Go to step 2 to complete profile
                setCurrentStep(2);
              }
            }
          } else {
            console.log('Profile created but not returned - continuing with signup flow');
          }
        }

        // Check URL for OAuth error parameters
        const urlParams = new URLSearchParams(window.location.search);
        const oauthError = urlParams.get('error');
        const oauthErrorDescription = urlParams.get('error_description');
        
        if (oauthError) {
          setError(`Authentication failed: ${oauthErrorDescription || oauthError}`);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

      } catch (err) {
        console.error('Auth state check error:', err);
        setError('An unexpected error occurred');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        // Re-check profile when user signs in
        checkAuthState();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setExistingProfile(null);
        setDiscordConnected(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleDiscordConnect = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('Connecting to Discord...');
      
      // Check if user is already logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        // User is logged in (Email/Google) - link Discord to existing account
        const { error } = await supabase.auth.linkIdentity({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/signup`
          }
        });
        
        if (error) {
          console.error('Discord linking error:', error);
          setError('Failed to link Discord account: ' + error.message);
          setSuccessMessage('');
        }
      } else {
        // No user logged in - create new Discord account
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/signup`
          }
        });
        
        if (error) {
          console.error('Discord OAuth error:', error);
          setError('Failed to connect with Discord: ' + error.message);
          setSuccessMessage('');
        }
      }
      
      // Note: If successful, user will be redirected and useEffect will handle the rest
    } catch (err) {
      console.error('Discord connection error:', err);
      setError('Failed to connect with Discord. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinNow = () => {
    // Skip Discord connection and go to step 2
    handleNextStep();
  };

  const handleDiscordLogin = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('Signing in with Discord...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/signup`
        }
      });
      
      if (error) {
        console.error('Discord login error:', error);
        setError('Failed to sign in with Discord: ' + error.message);
        setSuccessMessage('');
      }
      // Note: If successful, user will be redirected to home page
    } catch (err) {
      console.error('Discord login error:', err);
      setError('Failed to sign in with Discord. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup`
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        setError('Failed to sign in with Google');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to sign in with Google');
    }
  };

  const addGcseSubject = () => {
    setGcseSubjects([...gcseSubjects, { subject: '', grade: '' }]);
  };

  const addALevelSubject = () => {
    setALevelSubjects([...aLevelSubjects, { subject: '', grade: '' }]);
  };

  const updateGcseSubject = (index: number, field: 'subject' | 'grade', value: string) => {
    const updated = [...gcseSubjects];
    updated[index][field] = value;
    setGcseSubjects(updated);
  };

  const updateALevelSubject = (index: number, field: 'subject' | 'grade', value: string) => {
    const updated = [...aLevelSubjects];
    updated[index][field] = value;
    setALevelSubjects(updated);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is already authenticated (via Discord), update existing profile instead of creating new account
    if (user) {
      return await updateExistingProfile();
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('Creating your account...');

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          }
        }
      });

      if (authError) {
        setError(authError.message);
        setSuccessMessage('');
        return;
      }

      if (data.user) {
        const userId = data.user.id;
        
        // Check if profile already exists (might be created by Discord trigger)
        const { data: existingProfile, error: checkError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing profile:', checkError);
        }

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              email: data.user.email,
              full_name: fullName,
              username: username,
              school: school,
              rank_in_school: rankInSchool
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Profile update error:', updateError);
            setError('Failed to update profile: ' + updateError.message);
            setSuccessMessage('');
            return;
          }
        } else {
          // Create new profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              email: data.user.email,
              full_name: fullName,
              username: username,
              school: school,
              rank_in_school: rankInSchool
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setError('Failed to create profile: ' + profileError.message);
            setSuccessMessage('');
            return;
          }
        }

        await saveGradesForUser(userId);
        
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating existing profile for Discord users
  const updateExistingProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('Updating your profile...');

    try {
      // Update existing profile with form data
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          username: username,
          school: school,
          rank_in_school: rankInSchool
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        setError('Failed to update profile: ' + updateError.message);
        setSuccessMessage('');
        return;
      }

      await saveGradesForUser(user.id);
      
      setSuccessMessage('Profile updated successfully! Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An unexpected error occurred');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to save grades
  const saveGradesForUser = async (userId: string) => {
    try {
      // Store GCSE grades if any
      if (gcseSubjects.length > 0) {
        const gcseGrades = gcseSubjects
          .filter(g => g.subject && g.grade)
          .map(g => ({
            user_id: userId,
            subject: g.subject,
            grade: g.grade
          }));

        if (gcseGrades.length > 0) {
          // Delete existing grades first to avoid conflicts
          await supabase
            .from('user_gcse_grades')
            .delete()
            .eq('user_id', userId);
            
          const { error: gcseError } = await supabase
            .from('user_gcse_grades')
            .insert(gcseGrades);

          if (gcseError) {
            console.error('GCSE grades error:', gcseError);
          }
        }
      }

      // Store A Level grades if any
      if (aLevelSubjects.length > 0) {
        const aLevelGrades = aLevelSubjects
          .filter(g => g.subject && g.grade)
          .map(g => ({
            user_id: userId,
            subject: g.subject,
            grade: g.grade
          }));

        if (aLevelGrades.length > 0) {
          // Delete existing grades first to avoid conflicts
          await supabase
            .from('user_alevel_grades')
            .delete()
            .eq('user_id', userId);
            
          const { error: aLevelError } = await supabase
            .from('user_alevel_grades')
            .insert(aLevelGrades);

          if (aLevelError) {
            console.error('A Level grades error:', aLevelError);
          }
        }
      }
    } catch (err) {
      console.error('Error saving grades:', err);
    }
  };

  // Show loading screen during authentication check
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: '#FFFFFF',
          fontFamily: "'Figtree', sans-serif",
          paddingTop: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', color: '#666666' }}>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (currentStep === 1) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: '#FFFFFF',
          fontFamily: "'Figtree', sans-serif",
          paddingTop: '60px'
        }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 40px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '32px',
            fontWeight: '700',
            color: '#000000',
            margin: '0'
          }}>
            SIGN UP
          </h1>
          
          {/* Steps indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '16px',
            color: '#666666'
          }}>
            <span>Step 1 of 2</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#E7E6FF',
                color: '#4338CA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>
                1
              </div>
              <div style={{
                width: '40px',
                height: '2px',
                background: '#E5E7EB'
              }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#E5E7EB',
                color: '#666666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>
                2
              </div>
              <img 
                src="/icons/rollerskating.svg" 
                alt="Ghost" 
                style={{
                  width: '50px',
                  height: '50px',
                  marginLeft: '10px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {(successMessage || error) && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '400px',
            padding: '16px 20px',
            borderRadius: '8px',
            backgroundColor: successMessage ? '#F0FDF4' : '#FEE2E2',
            border: `1px solid ${successMessage ? '#22C55E' : '#F87171'}`,
            borderLeft: `4px solid ${successMessage ? '#16A34A' : '#EF4444'}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            animation: 'slideInFromRight 0.3s ease-out'
          }}>
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: successMessage ? '#15803D' : '#B91C1C',
              fontWeight: '500'
            }}>
              {successMessage || error}
            </div>
          </div>
        )}

        {/* Main content - Sign up form */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            margin: '0 0 20px 0'
          }}>
            Create Your Account
          </h2>

          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '18px',
            color: '#666666',
            margin: '0 0 40px 0',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            Complete your student profile and join the community
          </p>

          {/* Next Step button - positioned bottom right */}
          <button
            onClick={handleNextStep}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '40px',
              padding: '12px 30px',
              background: '#E7E6FF',
              color: '#4338CA',
              border: '1px solid #4338CA',
              borderRadius: '8px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Next Step
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </div>
      </>
    );
  }

  // Step 2 - Discord Community (Optional)
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        fontFamily: "'Figtree', sans-serif",
        paddingTop: '60px'
      }}>
        {/* Success/Error Messages */}
        {(successMessage || error) && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            maxWidth: '400px',
            padding: '16px 20px',
            borderRadius: '8px',
            backgroundColor: successMessage ? '#F0FDF4' : '#FEE2E2',
            border: `1px solid ${successMessage ? '#22C55E' : '#F87171'}`,
            borderLeft: `4px solid ${successMessage ? '#16A34A' : '#EF4444'}`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            animation: 'slideInFromRight 0.3s ease-out'
          }}>
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: successMessage ? '#15803D' : '#B91C1C',
              fontWeight: '500'
            }}>
              {successMessage || error}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 40px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h1 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '32px',
            fontWeight: '700',
            color: '#000000',
            margin: '0'
          }}>
            SIGN UP
          </h1>
          
          {/* Steps indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '16px',
            color: '#666666'
          }}>
            <span>Step 2 of 2</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#00CED1',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>
                1
              </div>
              <div style={{
                width: '40px',
                height: '2px',
                background: '#00CED1'
              }}></div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#00CED1',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>
                2
              </div>
              <img 
                src="/icons/rollerskating.svg" 
                alt="Ghost" 
                style={{
                  width: '50px',
                  height: '50px',
                  marginLeft: '10px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          minHeight: 'calc(100vh - 140px)'
        }}>
          {/* Left column - Profile Form */}
          <div>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '24px',
              fontWeight: '700',
              color: '#000000',
              margin: '0 0 20px 0'
            }}>
              Complete Your Profile
            </h2>

            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Full Name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#E0F7FA',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#E0F7FA',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="School (Optional)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#E0F7FA',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  value={rankInSchool}
                  onChange={(e) => setRankInSchool(e.target.value)}
                  placeholder="Your rank in your school (Optional)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#E0F7FA',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* GCSE Grades */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0',
                    color: '#000000'
                  }}>
                    GCSE GRADES
                  </h3>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Optional</span>
                </div>

                {gcseSubjects.map((subject, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select
                      value={subject.subject}
                      onChange={(e) => updateGcseSubject(index, 'subject', e.target.value)}
                      style={{
                        flex: '1',
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Subject</option>
                      <option value="Maths">Maths</option>
                      <option value="English Language">English Language</option>
                      <option value="English Literature">English Literature</option>
                      <option value="Combined Science">Combined Science</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Religious Studies">Religious Studies</option>
                      <option value="Art & Design">Art & Design</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Physical Education">Physical Education</option>
                    </select>
                    <select
                      value={subject.grade}
                      onChange={(e) => updateGcseSubject(index, 'grade', e.target.value)}
                      style={{
                        width: '80px',
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Grade</option>
                      <option value="9">9</option>
                      <option value="8">8</option>
                      <option value="7">7</option>
                      <option value="6">6</option>
                      <option value="5">5</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addGcseSubject}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#FFFFFF',
                    border: '2px dashed #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#666666',
                    cursor: 'pointer'
                  }}
                >
                  + Add GCSE Subject
                </button>
              </div>

              {/* A Level Grades */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0',
                    color: '#000000'
                  }}>
                    A LEVEL GRADES
                  </h3>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Optional</span>
                </div>

                {aLevelSubjects.map((subject, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select
                      value={subject.subject}
                      onChange={(e) => updateALevelSubject(index, 'subject', e.target.value)}
                      style={{
                        flex: '1',
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Subject</option>
                      <option value="Maths">Maths</option>
                      <option value="English Literature">English Literature</option>
                      <option value="Biology">Biology</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="History">History</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Business Studies">Business Studies</option>
                      <option value="Economics">Economics</option>
                      <option value="Geography">Geography</option>
                      <option value="Art & Design">Art & Design</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="English Language">English Language</option>
                      <option value="Further Maths">Further Maths</option>
                      <option value="Sociology">Sociology</option>
                    </select>
                    <select
                      value={subject.grade}
                      onChange={(e) => updateALevelSubject(index, 'grade', e.target.value)}
                      style={{
                        width: '80px',
                        padding: '8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Grade</option>
                      <option value="A*">A*</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addALevelSubject}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#FFFFFF',
                    border: '2px dashed #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#666666',
                    cursor: 'pointer'
                  }}
                >
                  + Add A Level Subject
                </button>
              </div>
            </form>
          </div>

          {/* Right column - Discord Community */}
          <div>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '24px',
              fontWeight: '700',
              color: '#000000',
              margin: '0 0 15px 0'
            }}>
              Join the Community! (Optional)
            </h2>
            
            <p style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '16px',
              color: '#666666',
              margin: '0 0 30px 0',
              lineHeight: '1.5'
            }}>
              Connect with other students, get help, and join workshops. You can skip this and add Discord later.
            </p>

            {/* Discord connection status */}
            {user && existingProfile?.discord_id ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #22C55E',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '30px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#15803D',
                  margin: '0 0 8px 0'
                }}>
                  Discord Connected!
                </h3>
                <p style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#16A34A',
                  margin: '0'
                }}>
                  You're all set to join the community discussions.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                marginBottom: '30px'
              }}>
                <button
                  onClick={handleDiscordConnect}
                  disabled={loading || discordConnected}
                  style={{
                    padding: '12px 24px',
                    background: discordConnected ? '#16A34A' : (loading ? '#9CA3AF' : '#00CED1'),
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: (loading || discordConnected) ? 'not-allowed' : 'pointer',
                    opacity: (loading || discordConnected) ? 0.8 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {discordConnected ? '✓ Discord Connected' : (loading ? 'Connecting...' : 'Connect Discord')}
                </button>
              </div>
            )}

            {/* Feature cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {/* Subject Communities */}
              <div style={{
                background: '#E0F7FA',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src="/icons/cowboy-guitar.svg" 
                    alt="Subject Communities" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000000',
                  margin: '0 0 5px 0'
                }}>
                  Subject Communities
                </h3>
                <p style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '11px',
                  color: '#666666',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  Find students with the same subjects
                </p>
              </div>

              {/* Interview Practice */}
              <div style={{
                background: '#E0F7FA',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src="/icons/ghost-karaoke.svg" 
                    alt="Interview Practice" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000000',
                  margin: '0 0 5px 0'
                }}>
                  Interview Practice
                </h3>
                <p style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '11px',
                  color: '#666666',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  Get teacher feedback
                </p>
              </div>

              {/* Live Workshops */}
              <div style={{
                background: '#E0F7FA',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src="/icons/biking.svg" 
                    alt="Live Workshops" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000000',
                  margin: '0 0 5px 0'
                }}>
                  Live Workshops
                </h3>
                <p style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '11px',
                  color: '#666666',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  Join workshops and events
                </p>
              </div>

              {/* Help */}
              <div style={{
                background: '#E0F7FA',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>💬</span>
                </div>
                <h3 style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#000000',
                  margin: '0 0 5px 0'
                }}>
                  Get Help
                </h3>
                <p style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '11px',
                  color: '#666666',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  @ teachers anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Setup button - positioned bottom right */}
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '40px',
            padding: '12px 30px',
            background: loading ? '#9CA3AF' : '#E7E6FF',
            color: loading ? '#FFFFFF' : '#4338CA',
            border: `1px solid ${loading ? '#9CA3AF' : '#4338CA'}`,
            borderRadius: '8px',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>✓</span>
          {loading ? 'Completing Setup...' : 'Complete Setup'}
        </button>
      </div>
    </>
  );
}