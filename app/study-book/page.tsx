'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import './study-book.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DraftVersion {
  id: string;
  question_number: number;
  version_number: number;
  content: string;
  word_count: number;
  created_at: string;
}

export default function StudyBookPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [showDropdown, setShowDropdown] = useState(false);

  // Materials state
  const [uploadedFiles, setUploadedFiles] = useState<{id: string, file_name: string, file_type: string, file_path: string, created_at: string}[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingSections, setEditingSections] = useState<{[key: string]: boolean}>({});
  const [sectionNotes, setSectionNotes] = useState<{[key: string]: string}>({});
  const [savingNotes, setSavingNotes] = useState<{[key: string]: boolean}>({});
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    category: '',
    title: '',
    description: '',
    tags: '',
    file: null as File | null
  });

  // Chat state
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Draft workspace state
  const [draftContents, setDraftContents] = useState<{[key: number]: string}>({
    1: '',
    2: '',
    3: ''
  });
  const [draftVersions, setDraftVersions] = useState<{[key: number]: DraftVersion[]}>({
    1: [],
    2: [],
    3: []
  });
  const [savingDraft, setSavingDraft] = useState<{[key: number]: boolean}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({
    1: true,
    2: false,
    3: false
  });
  const [showVersionHistory, setShowVersionHistory] = useState<{question: number, show: boolean}>({ question: 0, show: false });

  // Categories for materials
  const categories = [
    { id: 'books', label: 'Books', icon: '/icons/books.svg', count: 0 },
    { id: 'essays', label: 'Essays', icon: '/icons/essays.svg', count: 0 },
    { id: 'moocs', label: 'MOOCs', icon: '/icons/moocs.svg', count: 0 },
    { id: 'lectures', label: 'Lectures', icon: '/icons/lectures.svg', count: 0 },
    { id: 'textbooks', label: 'Textbooks', icon: '/icons/learn-hub-book.svg', count: 0 },
    { id: 'societies', label: 'Societies', icon: '/icons/love-letter.svg', count: 0 },
    { id: 'challenges', label: 'Challenges', icon: '/icons/academic-challenges.svg', count: 0 },
    { id: 'internships', label: 'Internships', icon: '/icons/internships.svg', count: 0 },
    { id: 'academic-papers', label: 'Academic Papers', icon: '/icons/academic-paper.svg', count: 0 }
  ];

  // Auth protection - check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // Get current user on mount
  useEffect(() => {
    if (!user) return;
    const getCurrentUser = async () => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserId(profile.id);
        loadConversationHistory(profile.id);
        loadUploadedFiles();
        loadDraftVersions(profile.id);
      } else {
        console.error('No user profile found for user:', user.id);
      }
    };
    getCurrentUser();
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (activeTab === 'chat' && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  };

  const loadConversationHistory = async (currentUserId: string) => {
    try {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (conversation) {
        setConversationId(conversation.id);

        const { data: messageHistory } = await supabase
          .from('messages')
          .select('id, role, content, created_at')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });

        if (messageHistory) {
          const formattedMessages = messageHistory.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at)
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const loadDraftVersions = async (currentUserId: string) => {
    try {
      // This would be a new table - we'll handle creation elsewhere
      const { data: versions } = await supabase
        .from('draft_versions')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (versions) {
        const versionsByQuestion: {[key: number]: DraftVersion[]} = { 1: [], 2: [], 3: [] };
        versions.forEach((version: any) => {
          if (versionsByQuestion[version.question_number]) {
            versionsByQuestion[version.question_number].push(version);
          }
        });
        
        setDraftVersions(versionsByQuestion);
        
        // Load current content from latest versions
        const currentContent: {[key: number]: string} = { 1: '', 2: '', 3: '' };
        Object.keys(versionsByQuestion).forEach(qNum => {
          const questionNum = parseInt(qNum);
          const latestVersion = versionsByQuestion[questionNum][0];
          if (latestVersion) {
            currentContent[questionNum] = latestVersion.content;
          }
        });
        setDraftContents(currentContent);
      }
    } catch (error) {
      console.error('Error loading draft versions:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !userId || isLoading) {
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
      const response = await fetch('/api/chat/bo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
          userId
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
                
                if (data.conversationId && !conversationId) {
                  setConversationId(data.conversationId);
                }
              } else if (data.type === 'complete') {
                if (data.conversationId && !conversationId) {
                  setConversationId(data.conversationId);
                }
              } else if (data.type === 'error') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: data.content }
                    : msg
                ));
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const loadUploadedFiles = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(result.files || []);
      }
    } catch (error) {
      console.error('Load files error:', error);
    }
  };

  const saveDraftVersion = async (questionNumber: number) => {
    const content = draftContents[questionNumber];
    if (!content?.trim() || !userId) return;

    setSavingDraft(prev => ({ ...prev, [questionNumber]: true }));

    try {
      // Get current version number
      const currentVersions = draftVersions[questionNumber] || [];
      const nextVersionNumber = currentVersions.length + 1;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Save new version
      const { data, error } = await supabase
        .from('draft_versions')
        .insert({
          user_id: userId,
          question_number: questionNumber,
          version_number: nextVersionNumber,
          content: content,
          word_count: content.split(' ').length,
          is_current: true
        })
        .select()
        .single();

      if (error) throw error;

      // Update state
      setDraftVersions(prev => ({
        ...prev,
        [questionNumber]: [data, ...prev[questionNumber]]
      }));

      console.log(`Draft ${questionNumber} saved as version ${nextVersionNumber}`);
    } catch (error) {
      console.error('Error saving draft version:', error);
    } finally {
      setSavingDraft(prev => ({ ...prev, [questionNumber]: false }));
    }
  };

  const restoreDraftVersion = async (questionNumber: number, version: DraftVersion) => {
    setDraftContents(prev => ({
      ...prev,
      [questionNumber]: version.content
    }));
    setShowVersionHistory({ question: 0, show: false });
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="study-book-new">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '24px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
            <div style={{
              width: '20px',
              height: '2px',
              backgroundColor: '#000000',
              borderRadius: '1px'
            }}></div>
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10000,
              minWidth: '160px',
              padding: '8px 0'
            }}>
              <Link 
                href="/terms-and-conditions"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/payment"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Payment
              </Link>
              <Link 
                href="/help"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#000000',
                  textDecoration: 'none',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F8F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setShowDropdown(false)}
              >
                Help
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Back Button */}
      <Link 
        href="/learn" 
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
        Learn Hub
      </Link>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-container">
          <button 
            className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            Study Materials
          </button>
          <button 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Buddy Chat
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>
      </div>

      {/* User Actions */}
      <div style={{ position: 'absolute', top: '90px', right: '45px', zIndex: 20 }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '9px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #000000',
            fontFamily: "'Figtree', sans-serif",
            fontSize: '13px',
            fontWeight: '500',
            color: '#333333',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content-container">
        {activeTab === 'materials' && (
          <div className="materials-page">
            <div className="materials-layout">
              {/* Left Categories */}
              <div className="categories-panel">
                <h2>Categories</h2>
                <div className="categories-list">
                  {categories.map(category => (
                    <div key={category.id} className="category-item">
                      <img src={category.icon} alt={category.label} />
                      <span>{category.label}</span>
                      <span className="count">{category.count}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="add-material-btn"
                  onClick={() => setShowMaterialModal(true)}
                >
                  + Add Material
                </button>
              </div>

              {/* Right Materials Grid */}
              <div className="materials-grid">
                <h2>Your Materials</h2>
                <div className="materials-cards">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="material-card">
                      <div className="card-header">
                        <img src="/icons/essays.svg" alt="File" />
                        <div className="card-actions">
                          <button>Edit</button>
                          <button>Delete</button>
                        </div>
                      </div>
                      <h3>{file.file_name}</h3>
                      <p>Uploaded file</p>
                      <div className="file-indicator">
                        📎 {file.file_type}
                      </div>
                    </div>
                  ))}
                  
                  {/* Placeholder cards if no files */}
                  {uploadedFiles.length === 0 && (
                    <div className="empty-state">
                      <p>No materials yet. Add your first study material!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-page">
            <div className="chat-layout-new">
              {/* Chat Interface - Now Wider */}
              <div className="chat-interface-wide">
                <div className="chat-header">
                  <h2>Buddy Chat</h2>
                </div>
                
                <div className="chat-messages-scrollable">
                  <div className="messages-container">
                    {messages.map(message => (
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
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="chat-input-area">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Buddy anything..."
                    disabled={isLoading}
                    rows={3}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    className="send-btn"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>

              {/* Right Draft Workspace */}
              <div className="draft-workspace">
                <h3>Draft Workspace</h3>
                
                {[1, 2, 3].map(questionNum => (
                  <div key={questionNum} className="draft-section">
                    <div 
                      className="draft-header"
                      onClick={() => setExpandedSections(prev => ({
                        ...prev,
                        [questionNum]: !prev[questionNum]
                      }))}
                    >
                      <h4>Question {questionNum}</h4>
                      <span className={`expand-icon ${expandedSections[questionNum] ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </div>
                    
                    {expandedSections[questionNum] && (
                      <div className="draft-content">
                        <textarea
                          value={draftContents[questionNum]}
                          onChange={(e) => setDraftContents(prev => ({
                            ...prev,
                            [questionNum]: e.target.value
                          }))}
                          placeholder={`Enter your response for Question ${questionNum}...`}
                          rows={6}
                        />
                        
                        <div className="draft-actions">
                          <button 
                            onClick={() => saveDraftVersion(questionNum)}
                            disabled={savingDraft[questionNum] || !draftContents[questionNum]?.trim()}
                            className="save-version-btn"
                          >
                            {savingDraft[questionNum] ? 'Saving...' : 'Save Version'}
                          </button>
                          
                          <button 
                            onClick={() => setShowVersionHistory({ question: questionNum, show: true })}
                            disabled={draftVersions[questionNum]?.length === 0}
                            className="view-history-btn"
                          >
                            View History ({draftVersions[questionNum]?.length || 0})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-page">
            <h2>User Profile</h2>
            <div className="profile-content">
              <div className="profile-card">
                <img src="/svg/ghost.svg" alt="Profile" className="profile-avatar" />
                <h3>Welcome back!</h3>
                <p>Email: {user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showVersionHistory.show && (
        <div className="modal-backdrop" onClick={() => setShowVersionHistory({ question: 0, show: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Version History - Question {showVersionHistory.question}</h3>
              <button onClick={() => setShowVersionHistory({ question: 0, show: false })}>×</button>
            </div>
            <div className="modal-content">
              {draftVersions[showVersionHistory.question]?.slice(0, 10).map((version, index) => (
                <div key={version.id} className="version-item">
                  <div className="version-header">
                    <span>Version {version.version_number}</span>
                    <span>{new Date(version.created_at).toLocaleString()}</span>
                    <span>{version.word_count} words</span>
                  </div>
                  <div className="version-preview">
                    {version.content.substring(0, 100)}...
                  </div>
                  <button 
                    onClick={() => restoreDraftVersion(showVersionHistory.question, version)}
                    className="restore-btn"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="modal-backdrop" onClick={() => setShowMaterialModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Study Material</h3>
              <button onClick={() => setShowMaterialModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <input 
                  type="text"
                  value={materialForm.tags}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Comma separated tags"
                />
              </div>
              
              <div className="form-group">
                <label>File (Optional)</label>
                <input 
                  type="file"
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
              </div>
              
              <div className="form-actions">
                <button onClick={() => setShowMaterialModal(false)}>Cancel</button>
                <button className="primary">Save Material</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}