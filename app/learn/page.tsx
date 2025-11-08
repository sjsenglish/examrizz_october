'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import './learn.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LearnSession {
  id: string;
  created_at: string;
  updated_at: string;
  first_message: string;
  message_count: number;
  spec_point?: string;
}

interface StudentProfile {
  target_grade: string;
  exam_date: string;
  current_topic?: string;
  total_mastery?: number;
}

interface SpecPointProgress {
  spec_point: string;
  title: string;
  description: string;
  mastery_score: number;
  total_questions: number;
  correct_answers: number;
  last_practiced?: string;
}

interface Subject {
  id: string;
  name: string;
  level: 'GCSE' | 'A-Level';
  grade_achieved?: string;
  target_grade?: string;
}

interface University {
  id: string;
  name: string;
  course: string;
  type: 'firm' | 'insurance' | 'choice';
}

interface Supercurricular {
  id: string;
  type: 'book' | 'lecture' | 'course' | 'experience' | 'competition' | 'other';
  title: string;
  description: string;
  date_completed?: string;
  relevance_to_subject?: string;
}

interface Timeline {
  current_status: string;
  exam_dates: { subject: string; date: string; type: 'mock' | 'real' }[];
  predicted_grades_date?: string;
  application_deadlines: { university: string; deadline: string }[];
}

interface UserProfile {
  id: string;
  subjects: Subject[];
  universities: University[];
  supercurriculars: Supercurricular[];
  timeline: Timeline;
  created_at: string;
  updated_at: string;
}

export default function LearnPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Main view state - 'chat', 'progress', or 'profile'
  const [activeView, setActiveView] = useState<'chat' | 'progress' | 'profile'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Session management state
  const [sessions, setSessions] = useState<LearnSession[]>([]);
  const [showSessionsSidebar, setShowSessionsSidebar] = useState(false);
  
  // Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  
  // Progress tracking state
  const [specPointsProgress, setSpecPointsProgress] = useState<SpecPointProgress[]>([]);
  const [overallMastery, setOverallMastery] = useState<number>(0);
  
  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Auth check - optional login (no redirect)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setUserId(user.id);
        }
      } catch (error) {
        console.log('No user logged in, continuing without auth');
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // Load sessions and current session on mount
  useEffect(() => {
    // Load data regardless of auth status, but handle gracefully when no user
    loadSessions();
    loadCurrentSession();
    loadStudentProfile();
    loadProgressData();
    loadUserProfile();
  }, [userId]);

  const loadSessions = async () => {
    if (!userId) return;
    
    try {
      const { data: sessionsData } = await supabase
        .from('learn_sessions')
        .select(`
          id,
          created_at,
          updated_at,
          spec_point,
          first_message
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (sessionsData) {
        const formattedSessions: LearnSession[] = sessionsData.map(session => ({
          id: session.id,
          created_at: session.created_at,
          updated_at: session.updated_at,
          first_message: session.first_message || 'New maths session',
          message_count: 0, // TODO: Add message count logic
          spec_point: session.spec_point
        }));
        setSessions(formattedSessions);
      }
    } catch (error) {
      console.error('Error loading learn sessions:', error);
    }
  };

  const loadCurrentSession = async () => {
    if (!userId) return;
    
    try {
      const { data: session } = await supabase
        .from('learn_sessions')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (session) {
        await loadSession(session.id);
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId);
      
      // TODO: Load messages from learn_question_attempts or similar table
      // For now, starting with empty messages
      setMessages([]);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const loadStudentProfile = async () => {
    if (!userId) return;
    
    try {
      const { data: profile } = await supabase
        .from('learn_student_subjects')
        .select('target_grade, exam_date')
        .eq('user_id', userId)
        .eq('subject', 'Mathematics') // Focus on maths for now
        .single();

      if (profile) {
        setStudentProfile({
          target_grade: profile.target_grade,
          exam_date: profile.exam_date
        });
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
    }
  };

  const loadProgressData = async () => {
    if (!userId) return;
    
    try {
      // Load spec points progress - for now we'll focus on the main spec points
      // This would ideally come from your learn_student_progress table
      const { data: progressData } = await supabase
        .from('learn_student_progress')
        .select(`
          spec_point,
          mastery_score,
          total_questions,
          correct_answers,
          last_practiced
        `)
        .eq('user_id', userId)
        .order('spec_point');

      if (progressData) {
        // Map the data to include titles and descriptions
        const specPointsWithDetails: SpecPointProgress[] = progressData.map(item => ({
          spec_point: item.spec_point,
          title: getSpecPointTitle(item.spec_point),
          description: getSpecPointDescription(item.spec_point),
          mastery_score: item.mastery_score || 0,
          total_questions: item.total_questions || 0,
          correct_answers: item.correct_answers || 0,
          last_practiced: item.last_practiced
        }));

        setSpecPointsProgress(specPointsWithDetails);
        
        // Calculate overall mastery
        const totalMastery = specPointsWithDetails.reduce((sum, item) => sum + item.mastery_score, 0);
        const averageMastery = specPointsWithDetails.length > 0 ? totalMastery / specPointsWithDetails.length : 0;
        setOverallMastery(averageMastery);
      } else {
        // If no progress data exists, create default entry for Power Rule
        const defaultProgress: SpecPointProgress[] = [{
          spec_point: '7.2',
          title: 'Power Rule',
          description: 'Practice differentiation using the power rule for polynomial functions.',
          mastery_score: 0,
          total_questions: 0,
          correct_answers: 0
        }];
        setSpecPointsProgress(defaultProgress);
        setOverallMastery(0);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      // Fallback to default data
      const defaultProgress: SpecPointProgress[] = [{
        spec_point: '7.2',
        title: 'Power Rule',
        description: 'Practice differentiation using the power rule for polynomial functions.',
        mastery_score: 0,
        total_questions: 0,
        correct_answers: 0
      }];
      setSpecPointsProgress(defaultProgress);
      setOverallMastery(0);
    }
  };

  const getSpecPointTitle = (specPoint: string): string => {
    const specPointTitles: { [key: string]: string } = {
      '7.2': 'Power Rule',
      '7.1': 'Introduction to Differentiation',
      '7.3': 'Product Rule',
      '7.4': 'Quotient Rule',
      '7.5': 'Chain Rule'
    };
    return specPointTitles[specPoint] || `Spec Point ${specPoint}`;
  };

  const getSpecPointDescription = (specPoint: string): string => {
    const specPointDescriptions: { [key: string]: string } = {
      '7.2': 'Practice differentiation using the power rule for polynomial functions.',
      '7.1': 'Understanding derivatives and rates of change.',
      '7.3': 'Differentiate products of functions.',
      '7.4': 'Differentiate quotients of functions.',
      '7.5': 'Differentiate composite functions.'
    };
    return specPointDescriptions[specPoint] || 'Advanced differentiation techniques.';
  };

  const loadUserProfile = async () => {
    if (!userId) return;
    
    try {
      // Load comprehensive user profile from user_profiles table
      const { data: profile } = await supabase
        .from('user_profiles')
        .select(`
          id,
          subjects,
          universities,
          supercurriculars,
          timeline,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await loadUserProfile(); // Reload to get fresh data
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const createNewSession = async () => {
    if (!userId) return;
    
    try {
      const { data: newSession } = await supabase
        .from('learn_sessions')
        .insert({
          user_id: userId,
          spec_point: '7.2', // Default to Power Rule for now
          session_type: 'practice'
        })
        .select('id')
        .single();

      if (newSession) {
        setCurrentSessionId(newSession.id);
        setMessages([]);
        await loadSessions();
        setShowSessionsSidebar(false);
      }
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const startPracticeSession = async (specPoint: string) => {
    if (!userId) return;
    
    try {
      const { data: newSession } = await supabase
        .from('learn_sessions')
        .insert({
          user_id: userId,
          spec_point: specPoint,
          session_type: 'practice'
        })
        .select('id')
        .single();

      if (newSession) {
        setCurrentSessionId(newSession.id);
        setMessages([]);
        await loadSessions();
        setActiveView('chat'); // Switch to chat view
        setShowSessionsSidebar(false);
      }
    } catch (error) {
      console.error('Error starting practice session:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId,
          userId: userId || 'anonymous', // Use 'anonymous' if no user is logged in
          specPoint: '7.2' // Default to Power Rule for now
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'token') {
                assistantMessage += data.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
                
                if (data.sessionId && !currentSessionId) {
                  setCurrentSessionId(data.sessionId);
                }
              } else if (data.type === 'complete') {
                if (data.sessionId && !currentSessionId) {
                  setCurrentSessionId(data.sessionId);
                }
                await loadSessions();
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="learn-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="learn-page" style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Back Button */}
      <Link href="/" className="back-button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Island Hub
      </Link>

      {/* Main Interface */}
      <div className="learn-container">
        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveView('chat')}
          >
            Learn Chat
          </button>
          <button 
            className={`toggle-btn ${activeView === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveView('progress')}
          >
            Progress Dashboard
          </button>
          <button 
            className={`toggle-btn ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveView('profile')}
          >
            Profile
          </button>
        </div>

        {/* Chat View */}
        {activeView === 'chat' && (
          <>
            {/* Chat Area - removed sidebar */}
            <div className="chat-area">
              {/* Messages - removed sidebar toggle */}
              <div className="messages-container">
                <div className="messages-wrapper">
                  {messages.length === 0 ? (
                    <div className="welcome-message">
                      <h2>🧮 Welcome to Learn Chat</h2>
                      <p>I'm your maths tutor AI, here to help you master A-Level Mathematics through personalized practice and feedback.</p>
                      <p>I can help you with:</p>
                      <ul>
                        <li>📚 Spec point 7.2: Power Rule for differentiation</li>
                        <li>✏️ Step-by-step worked solutions</li>
                        <li>🎯 Personalized practice questions</li>
                        <li>📊 Progress tracking and feedback</li>
                      </ul>
                      <p>Ask me anything about the Power Rule, or let me test you with a practice question!</p>
                    </div>
                  ) : (
                    [...messages].reverse().map(message => (
                      <div key={message.id} className={`message ${message.role}`}>
                        <div className="message-content">
                          {message.role === 'assistant' ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          ) : (
                            message.content
                          )}
                        </div>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <div className="chat-input-area">
                <div className="input-wrapper">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about the Power Rule or request a practice question..."
                    disabled={isLoading}
                    rows={1}
                    className="chat-input"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="send-button"
                  >
                    {isLoading ? (
                      <div className="loading-spinner-small"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Progress View */}
        {activeView === 'progress' && (
          <div className="progress-dashboard">
            <div className="progress-header">
              <h2>📊 Progress Dashboard</h2>
              <p>Track your mastery across all A-Level Mathematics topics</p>
            </div>

            {/* Profile Summary */}
            <div className="profile-summary">
              <h3>Your Profile</h3>
              {!userId ? (
                <div className="empty-section">
                  <p>Log in to track your personal progress and goals</p>
                  <Link href="/login" style={{color: '#2563EB', textDecoration: 'underline', fontWeight: 'bold'}}>Log In</Link> or <Link href="/signup" style={{color: '#2563EB', textDecoration: 'underline', fontWeight: 'bold'}}>Sign Up</Link>
                </div>
              ) : studentProfile ? (
                <div className="profile-info">
                  <div className="profile-item">
                    <span className="label">Target Grade:</span>
                    <span className="value">{studentProfile.target_grade}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Exam Date:</span>
                    <span className="value">{new Date(studentProfile.exam_date).toLocaleDateString()}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Overall Mastery:</span>
                    <span className="value">{overallMastery.toFixed(1)}/10</span>
                  </div>
                </div>
              ) : (
                <p>Set up your profile to track progress effectively</p>
              )}
            </div>

            {/* Spec Points Progress */}
            <div className="spec-points-grid">
              <h3>Spec Point Progress</h3>
              {specPointsProgress.length > 0 ? (
                specPointsProgress.map((progress) => (
                  <div key={progress.spec_point} className="spec-point-card">
                    <div className="spec-header">
                      <h4>{progress.spec_point} - {progress.title}</h4>
                      <div className="mastery-score">
                        Mastery: {progress.mastery_score}/10
                      </div>
                    </div>
                    <div className="spec-content">
                      <p>{progress.description}</p>
                      <div className="progress-stats">
                        <span>Questions: {progress.correct_answers}/{progress.total_questions}</span>
                        {progress.last_practiced && (
                          <span>Last practiced: {new Date(progress.last_practiced).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${(progress.mastery_score / 10) * 100}%`}}
                        ></div>
                      </div>
                      <button 
                        className="practice-btn"
                        onClick={() => startPracticeSession(progress.spec_point)}
                      >
                        Practice Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="spec-point-card">
                  <div className="spec-header">
                    <h4>7.2 - Power Rule</h4>
                    <div className="mastery-score">Mastery: 0/10</div>
                  </div>
                  <div className="spec-content">
                    <p>Practice differentiation using the power rule for polynomial functions.</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '0%'}}></div>
                    </div>
                    <button 
                      className="practice-btn"
                      onClick={() => startPracticeSession('7.2')}
                    >
                      Practice Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Coming Soon */}
            <div className="coming-soon">
              <h3>🚀 Coming Soon</h3>
              <ul>
                <li>📈 Overall mastery tracking</li>
                <li>⏱️ Pacing vs exam date</li>
                <li>🎯 Weak area identification</li>
                <li>📝 Topic coverage marking</li>
              </ul>
            </div>
          </div>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <div className="profile-view">
            <div className="profile-header">
              <h2>👤 Your Profile</h2>
              <p>Manage your academic information and goals</p>
              {userId && (
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              )}
            </div>

            {!userId ? (
              <div className="empty-profile">
                <h3>📝 Profile Access</h3>
                <p>Create an account to build your personalized academic profile with subjects, university choices, and learning goals.</p>
                <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px'}}>
                  <Link href="/login" className="setup-profile-btn">Log In</Link>
                  <Link href="/signup" className="setup-profile-btn">Sign Up</Link>
                </div>
              </div>
            ) : isEditingProfile ? (
              <ProfileForm 
                profile={userProfile}
                onSave={saveUserProfile}
                onCancel={() => setIsEditingProfile(false)}
              />
            ) : (
              <ProfileDisplay 
                profile={userProfile} 
                onSetupProfile={() => setIsEditingProfile(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Display Component
const ProfileDisplay = ({ 
  profile, 
  onSetupProfile 
}: { 
  profile: UserProfile | null;
  onSetupProfile: () => void;
}) => {
  if (!profile) {
    return (
      <div className="empty-profile">
        <h3>📝 Complete Your Profile</h3>
        <p>Add your academic information to get personalized learning recommendations.</p>
        <button 
          className="setup-profile-btn"
          onClick={onSetupProfile}
        >
          Set Up Profile
        </button>
      </div>
    );
  }

  return (
    <div className="profile-content">
      {/* Basic Information */}
      <div className="profile-section">
        <h3>📚 Subjects</h3>
        {profile.subjects?.length > 0 ? (
          <div className="subjects-grid">
            {profile.subjects.map((subject) => (
              <div key={subject.id} className="subject-card">
                <div className="subject-header">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-level">{subject.level}</span>
                </div>
                <div className="subject-grades">
                  {subject.grade_achieved && (
                    <div className="grade-item">
                      <span className="label">Achieved:</span>
                      <span className="grade">{subject.grade_achieved}</span>
                    </div>
                  )}
                  {subject.target_grade && (
                    <div className="grade-item">
                      <span className="label">Target:</span>
                      <span className="grade target">{subject.target_grade}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-section">No subjects added yet</p>
        )}
      </div>

      {/* Universities */}
      <div className="profile-section">
        <h3>🎓 University Choices</h3>
        {profile.universities?.length > 0 ? (
          <div className="universities-list">
            {profile.universities.map((uni) => (
              <div key={uni.id} className="university-card">
                <div className="university-info">
                  <h4>{uni.name}</h4>
                  <p>{uni.course}</p>
                  <span className={`choice-type ${uni.type}`}>
                    {uni.type === 'firm' ? 'Firm Choice' : 
                     uni.type === 'insurance' ? 'Insurance Choice' : 
                     'Choice'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-section">No university choices added yet</p>
        )}
      </div>

      {/* Supercurriculars */}
      <div className="profile-section">
        <h3>⭐ Supercurriculars</h3>
        {profile.supercurriculars?.length > 0 ? (
          <div className="supercurriculars-list">
            {profile.supercurriculars.map((item) => (
              <div key={item.id} className="supercurricular-card">
                <div className="supercurricular-header">
                  <span className={`type-badge ${item.type}`}>
                    {item.type}
                  </span>
                  <h4>{item.title}</h4>
                </div>
                <p>{item.description}</p>
                {item.date_completed && (
                  <span className="date">Completed: {new Date(item.date_completed).toLocaleDateString()}</span>
                )}
                {item.relevance_to_subject && (
                  <div className="relevance">
                    <strong>Relevance:</strong> {item.relevance_to_subject}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-section">No supercurriculars added yet</p>
        )}
      </div>

      {/* Timeline */}
      <div className="profile-section">
        <h3>📅 Timeline</h3>
        {profile.timeline ? (
          <div className="timeline-content">
            <div className="current-status">
              <h4>Current Status</h4>
              <p>{profile.timeline.current_status}</p>
            </div>
            
            {profile.timeline.exam_dates?.length > 0 && (
              <div className="exam-dates">
                <h4>Exam Dates</h4>
                {profile.timeline.exam_dates.map((exam, index) => (
                  <div key={index} className="exam-item">
                    <span className="subject">{exam.subject}</span>
                    <span className="date">{new Date(exam.date).toLocaleDateString()}</span>
                    <span className={`exam-type ${exam.type}`}>{exam.type}</span>
                  </div>
                ))}
              </div>
            )}

            {profile.timeline.predicted_grades_date && (
              <div className="predicted-grades">
                <h4>Predicted Grades Date</h4>
                <p>{new Date(profile.timeline.predicted_grades_date).toLocaleDateString()}</p>
              </div>
            )}

            {profile.timeline.application_deadlines?.length > 0 && (
              <div className="application-deadlines">
                <h4>Application Deadlines</h4>
                {profile.timeline.application_deadlines.map((deadline, index) => (
                  <div key={index} className="deadline-item">
                    <span className="university">{deadline.university}</span>
                    <span className="date">{new Date(deadline.deadline).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="empty-section">No timeline information added yet</p>
        )}
      </div>
    </div>
  );
};

// Profile Form Component - Placeholder for now
const ProfileForm = ({ 
  profile, 
  onSave, 
  onCancel 
}: { 
  profile: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}) => {
  return (
    <div className="profile-form">
      <p>Profile editing form will be implemented here...</p>
      <div className="form-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="save-btn" onClick={() => onSave({})}>Save</button>
      </div>
    </div>
  );
};
