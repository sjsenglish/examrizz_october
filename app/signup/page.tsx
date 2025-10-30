'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
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

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleDiscordConnect = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/signup`
        }
      });
      
      if (error) {
        console.error('Discord OAuth error:', error);
        setError('Failed to connect with Discord');
      }
    } catch (err) {
      console.error('Discord connection error:', err);
      setError('Failed to connect with Discord');
    }
  };

  const handleJoinNow = () => {
    // Skip Discord connection and go to step 2
    handleNextStep();
  };

  const handleDiscordLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Discord login error:', error);
        setError('Failed to sign in with Discord');
      }
    } catch (err) {
      console.error('Discord login error:', err);
      setError('Failed to sign in with Discord');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

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
        return;
      }

      if (data.user) {
        const user = data.user; // Store in a const to help TypeScript
        
        // Create user profile with additional data
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            username: username,
            school: school,
            rank_in_school: rankInSchool
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          setError('Failed to create profile: ' + profileError.message);
          return;
        }

        // Store GCSE grades if any
        if (gcseSubjects.length > 0) {
          const gcseGrades = gcseSubjects
            .filter(g => g.subject && g.grade)
            .map(g => ({
              user_id: user.id,
              subject: g.subject,
              grade: g.grade
            }));

          if (gcseGrades.length > 0) {
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
              user_id: user.id,
              subject: g.subject,
              grade: g.grade
            }));

          if (aLevelGrades.length > 0) {
            const { error: aLevelError } = await supabase
              .from('user_alevel_grades')
              .insert(aLevelGrades);

            if (aLevelError) {
              console.error('A Level grades error:', aLevelError);
            }
          }
        }

        router.push('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Main content */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '30px 40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '28px',
            fontWeight: '700',
            color: '#000000',
            margin: '0 0 15px 0'
          }}>
            Join the Community!
          </h2>
          
          <p style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '16px',
            color: '#666666',
            margin: '0 0 30px 0',
            lineHeight: '1.5',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Find other students doing your subjects, help each other out, join workshops, get teacher feedback,
            and @ us teachers whenever you need
          </p>

          {/* Discord connection buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <button
              onClick={handleDiscordConnect}
              style={{
                padding: '12px 24px',
                background: '#00CED1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Connect my Discord
            </button>
            
            <button
              onClick={handleJoinNow}
              style={{
                padding: '12px 24px',
                background: '#E7E6FF',
                color: '#4338CA',
                border: '1px solid #4338CA',
                borderRadius: '8px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Don't have Discord? Join now!
            </button>
          </div>

          {/* Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto 30px'
          }}>
            {/* Subject Communities */}
            <div style={{
              background: '#E0F7FA',
              borderRadius: '12px',
              padding: '25px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 15px',
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
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                margin: '0 0 8px 0'
              }}>
                Subject<br />Communities
              </h3>
              <p style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#666666',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Find students with the same subjects and target unis
              </p>
            </div>

            {/* Interview Practice */}
            <div style={{
              background: '#E0F7FA',
              borderRadius: '12px',
              padding: '25px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 15px',
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
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                margin: '0 0 8px 0'
              }}>
                Interview Practice<br />& PS Reviews
              </h3>
              <p style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#666666',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Submit video/audio answers to our interview question bank or submit your personal statement for teacher feedback.
              </p>
            </div>

            {/* Live Workshops */}
            <div style={{
              background: '#E0F7FA',
              borderRadius: '12px',
              padding: '25px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 15px',
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
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                margin: '0 0 8px 0'
              }}>
                Live Workshops &<br />PS Reviews
              </h3>
              <p style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#666666',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Join workshops for applications and subject prep.
              </p>
            </div>
          </div>

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

  // Step 2 - Profile Setup
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
        {/* Left column - Profile */}
        <div>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            margin: '0 0 20px 0'
          }}>
            Profile
          </h2>

          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              color: '#B91C1C',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

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
                placeholder="School"
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
                placeholder="Your rank in your school"
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
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
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
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English Literature">English Literature</option>
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

        {/* Right column - Sign-up Details */}
        <div>
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '20px',
            fontWeight: '700',
            color: '#000000',
            margin: '0 0 15px 0'
          }}>
            Sign-up Details
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: '#E0F7FA',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{
                width: '100%',
                padding: '16px',
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
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: '#E0F7FA',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Or divider */}
          <div style={{
            textAlign: 'center',
            margin: '15px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#000000'
          }}>
            Or
          </div>

          {/* Social Login Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleDiscordLogin}
              style={{
                width: '100%',
                padding: '12px',
                background: '#E5E7EB',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
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
              Discord Sign Up
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px',
                background: '#E5E7EB',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
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
              Gmail Sign Up
            </button>
          </div>

          {/* Info box */}
          <div style={{
            background: '#F3E8FF',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '16px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#000000'
            }}>
              Why do we ask for your grades?
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#666666',
              margin: '0 0 10px 0',
              lineHeight: '1.4'
            }}>
              We use your GCSE and predicted A Level grades to personalize your learning experience, recommend suitable content, and track your progress toward your target grades.
            </p>
            <p style={{
              fontSize: '12px',
              color: '#666666',
              margin: '0',
              lineHeight: '1.4'
            }}>
              You can skip this and add them later in your profile.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              color: '#EF4444',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              error - {error}
            </div>
          )}

          {/* Confirm button - positioned bottom right */}
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
              border: loading ? 'none' : '1px solid #4338CA',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>✓</span>
            {loading ? 'Creating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}