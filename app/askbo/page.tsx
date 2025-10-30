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
  updated_at: string;
  title?: string;
  last_edited?: string;
  is_current: boolean;
}

export default function StudyBookPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDraftPopout, setShowDraftPopout] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [draftToSave, setDraftToSave] = useState('');
  const [currentPopupDraft, setCurrentPopupDraft] = useState<DraftVersion | null>(null);
  const [popupDraftContent, setPopupDraftContent] = useState('');

  // Materials state
  const [uploadedFiles, setUploadedFiles] = useState<{
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    created_at: string;
    category?: string;
    title?: string;
    description?: string;
    main_arguments?: string;
    conclusions?: string;
    sources?: string;
    methodology?: string;
    completion_date?: string;
  }[]>([]);
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
    file: null as File | null,
    main_arguments: '',
    conclusions: '',
    sources: '',
    methodology: '',
    completion_date: ''
  });

  // Chat state
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
  const [allUserDrafts, setAllUserDrafts] = useState<DraftVersion[]>([]);
  const [savingDraft, setSavingDraft] = useState<{[key: number]: boolean}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({
    1: true,
    2: false,
    3: false
  });
  const [showVersionHistory, setShowVersionHistory] = useState<{question: number, show: boolean}>({ question: 0, show: false });

  // Categories for materials with real counts
  const getCategoryCount = (categoryId: string) => {
    return uploadedFiles.filter(file => file.category === categoryId).length;
  };

  const categories = [
    { id: 'books', label: 'Books', icon: '/icons/books.svg', count: getCategoryCount('books') },
    { id: 'essays', label: 'Essays', icon: '/icons/essays.svg', count: getCategoryCount('essays') },
    { id: 'moocs', label: 'MOOCs', icon: '/icons/moocs.svg', count: getCategoryCount('moocs') },
    { id: 'lectures', label: 'Lectures', icon: '/icons/lectures.svg', count: getCategoryCount('lectures') },
    { id: 'textbooks', label: 'Textbooks', icon: '/icons/textbooks.svg', count: getCategoryCount('textbooks') },
    { id: 'societies', label: 'Societies', icon: '/icons/societies.svg', count: getCategoryCount('societies') },
    { id: 'challenges', label: 'Challenges', icon: '/icons/academic-challenges.svg', count: getCategoryCount('challenges') },
    { id: 'internships', label: 'Internships', icon: '/icons/internships.svg', count: getCategoryCount('internships') },
    { id: 'academic-papers', label: 'Academic Papers', icon: '/icons/academic-paper.svg', count: getCategoryCount('academic-papers') }
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
        loadAllUserDrafts();
      } else {
        console.error('No user profile found for user:', user.id);
      }
    };
    getCurrentUser();
  }, [user]);

  // Handle clicking outside of category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && event.target instanceof Node && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const loadAllUserDrafts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load all drafts for the drafts page, grouped by latest version
      const { data: drafts, error } = await supabase
        .from('draft_versions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .order('last_edited', { ascending: false });

      if (error) {
        console.error('Error loading all user drafts:', error);
        return;
      }

      setAllUserDrafts(drafts || []);
    } catch (error) {
      console.error('Error loading all user drafts:', error);
    }
  };

  const saveDraftFromChat = async (title: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !draftToSave.trim()) return;

      // Get the next version number for new drafts
      const { data: existingDrafts } = await supabase
        .from('draft_versions')
        .select('version_number')
        .eq('user_id', user.id)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersionNumber = existingDrafts && existingDrafts.length > 0 
        ? existingDrafts[0].version_number + 1 
        : 1;

      // Mark all existing drafts as not current
      await supabase
        .from('draft_versions')
        .update({ is_current: false })
        .eq('user_id', user.id);

      // Save new draft
      const { data, error } = await supabase
        .from('draft_versions')
        .insert({
          user_id: user.id,
          question_number: 1, // Default to question 1 for chat drafts
          version_number: nextVersionNumber,
          content: draftToSave,
          title: title || 'Chat Draft',
          word_count: draftToSave.split(' ').length,
          is_current: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving draft:', error);
        alert('Failed to save draft. Please try again.');
        return;
      }

      // Clear the chat message and close modal
      setCurrentMessage('');
      setDraftToSave('');
      setShowSaveDraftModal(false);
      
      // Refresh drafts
      await loadAllUserDrafts();
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft from chat:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const loadDraftForPopup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load the most recent draft for the popup
      const { data: draft, error } = await supabase
        .from('draft_versions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .order('last_edited', { ascending: false })
        .limit(1)
        .single();

      if (draft) {
        setCurrentPopupDraft(draft);
        setPopupDraftContent(draft.content);
      } else {
        // No existing draft, start with empty content
        setCurrentPopupDraft(null);
        setPopupDraftContent('');
      }
    } catch (error) {
      console.error('Error loading draft for popup:', error);
      setCurrentPopupDraft(null);
      setPopupDraftContent('');
    }
  };

  const saveDraftFromPopup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !popupDraftContent.trim()) return;

      if (currentPopupDraft) {
        // Update existing draft
        const { error } = await supabase
          .from('draft_versions')
          .update({
            content: popupDraftContent,
            word_count: popupDraftContent.split(' ').length,
            last_edited: new Date().toISOString()
          })
          .eq('id', currentPopupDraft.id);

        if (error) {
          console.error('Error updating draft:', error);
          alert('Failed to save draft. Please try again.');
          return;
        }
      } else {
        // Create new draft
        const { data: existingDrafts } = await supabase
          .from('draft_versions')
          .select('version_number')
          .eq('user_id', user.id)
          .order('version_number', { ascending: false })
          .limit(1);

        const nextVersionNumber = existingDrafts && existingDrafts.length > 0 
          ? existingDrafts[0].version_number + 1 
          : 1;

        // Mark all existing drafts as not current
        await supabase
          .from('draft_versions')
          .update({ is_current: false })
          .eq('user_id', user.id);

        const { data, error } = await supabase
          .from('draft_versions')
          .insert({
            user_id: user.id,
            question_number: 1,
            version_number: nextVersionNumber,
            content: popupDraftContent,
            title: 'Quick Draft',
            word_count: popupDraftContent.split(' ').length,
            is_current: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving new draft:', error);
          alert('Failed to save draft. Please try again.');
          return;
        }

        setCurrentPopupDraft(data);
      }

      // Refresh drafts
      await loadAllUserDrafts();
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft from popup:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const deleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('draft_versions')
        .delete()
        .eq('id', draftId);

      if (error) {
        console.error('Error deleting draft:', error);
        alert('Failed to delete draft. Please try again.');
        return;
      }

      // Refresh drafts
      await loadAllUserDrafts();
      alert('Draft deleted successfully!');
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  const editDraft = (draft: DraftVersion) => {
    // Load the draft into the popup for editing
    setCurrentPopupDraft(draft);
    setPopupDraftContent(draft.content);
    setShowDraftPopout(true);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load files directly from Supabase with all metadata
      const { data: files, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading files:', error);
        return;
      }

      setUploadedFiles(files || []);
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

  const handleSaveMaterial = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to save materials');
        return;
      }

      if (!materialForm.file) {
        alert('Please select a file to upload');
        return;
      }

      // Create FormData with file AND metadata
      const formData = new FormData();
      formData.append('file', materialForm.file);
      formData.append('category', materialForm.category || '');
      formData.append('title', materialForm.title || '');
      formData.append('description', materialForm.description || '');
      formData.append('main_arguments', materialForm.main_arguments || '');
      formData.append('conclusions', materialForm.conclusions || '');
      formData.append('sources', materialForm.sources || '');
      formData.append('methodology', materialForm.methodology || '');
      formData.append('completion_date', materialForm.completion_date || '');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      await loadUploadedFiles();
      
      // Reset form
      setMaterialForm({
        category: '',
        title: '',
        description: '',
        tags: '',
        file: null,
        main_arguments: '',
        conclusions: '',
        sources: '',
        methodology: '',
        completion_date: ''
      });
      setShowMaterialModal(false);
      
      alert('Material uploaded successfully!');
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Failed to save material. Please try again.');
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Login/Logout Pill */}
          <button 
            onClick={handleLogout}
            style={{
              background: '#E7E6FF',
              border: '1px solid #4338CA',
              borderRadius: '20px',
              padding: '8px 16px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '13px',
              fontWeight: '500',
              color: '#4338CA',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
          
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
        href="/" 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
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
          border: '1px solid #ddd',
          transition: 'all 0.3s ease',
          zIndex: 100
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Sidebar - Always Visible */}
      <div className="sidebar open">
        <div className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            Statement Drafts
          </button>
          <button 
            className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            Study Materials
          </button>
          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Ask Bo
          </button>
        </div>
      </div>


      {/* Main Content Area */}
      <div className="main-content-area">
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
                  {uploadedFiles.map(file => {
                    const categoryIcon = categories.find(cat => cat.id === file.category)?.icon || '/icons/essays.svg';
                    return (
                      <div key={file.id} className="material-card">
                        <div className="card-header">
                          <img src={categoryIcon} alt={file.category || 'File'} style={{ width: '24px', height: '24px' }} />
                          <div className="card-actions">
                            <button style={{ fontSize: '11px', padding: '4px 8px' }}>Edit</button>
                            <button style={{ fontSize: '11px', padding: '4px 8px' }}>Delete</button>
                          </div>
                        </div>
                        <h3 style={{ fontSize: '14px', margin: '8px 0 4px 0' }}>
                          {file.title || file.file_name}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                          {file.description || 'No description provided'}
                        </p>
                        <div className="file-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#888' }}>
                          <span>{file.category ? categories.find(cat => cat.id === file.category)?.label : 'Uncategorized'}</span>
                          <span>📎 {file.file_type.split('/').pop()?.toUpperCase()}</span>
                        </div>
                        {file.completion_date && (
                          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                            Completed: {file.completion_date}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
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
            <div className="chat-container">
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <h2>Ask Bo</h2>
                    <p>I'm Bo, your personal statement advisor. Ask me anything about your personal statement.</p>
                  </div>
                ) : (
                  messages.map(message => (
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

              <div className="chat-input-fixed">
                <div className="input-container">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Bo anything..."
                    disabled={isLoading}
                    rows={3}
                  />
                  <div className="button-group">
                    <button 
                      onClick={() => {/* TODO: Add teacher functionality */}}
                      className="ask-teacher-btn"
                    >
                      Ask a teacher
                    </button>
                    <button 
                      onClick={() => {
                        if (currentMessage.trim()) {
                          setDraftToSave(currentMessage);
                          setShowSaveDraftModal(true);
                        }
                      }}
                      disabled={!currentMessage.trim()}
                      style={{
                        padding: 'var(--space-16) var(--space-24)',
                        background: '#E7E6FF',
                        color: '#4338CA',
                        border: '1px solid #4338CA',
                        borderRadius: 'var(--border-radius-sm)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: 'fit-content',
                        minWidth: '120px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: 'var(--space-8)'
                      }}
                    >
                      Save as Draft
                    </button>
                    <button 
                      onClick={sendMessage}
                      disabled={isLoading || !currentMessage.trim()}
                      className="send-btn"
                    >
                      {isLoading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="drafts-page">
            <div className="drafts-container">
              <h2 style={{ 
                fontFamily: "'Madimi One', cursive", 
                fontSize: '28px', 
                letterSpacing: '0.04em', 
                marginBottom: '24px',
                color: '#000000'
              }}>
                Personal Statement Drafts
              </h2>
              
              <div className="drafts-grid">
                {allUserDrafts.map((draft, index) => {
                  const formatDate = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - date.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) return 'Today';
                    if (diffDays === 2) return 'Yesterday';
                    if (diffDays <= 7) return `${diffDays} days ago`;
                    return date.toLocaleDateString();
                  };

                  return (
                    <div key={draft.id} className="draft-card">
                      <div className="draft-header">
                        <h3>{draft.title || `Draft ${index + 1}`}</h3>
                        <span className="draft-date">
                          Last edited: {formatDate(draft.last_edited || draft.updated_at)}
                        </span>
                      </div>
                      <div className="draft-preview">
                        <p>{draft.content.substring(0, 150)}...</p>
                      </div>
                      <div className="draft-stats">
                        <span>Word count: {draft.word_count || draft.content.split(' ').length}</span>
                        <span>Character limit: 4,000</span>
                      </div>
                      <div className="draft-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => editDraft(draft)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteDraft(draft.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div 
                  className="new-draft-card"
                  onClick={() => {
                    setCurrentPopupDraft(null);
                    setPopupDraftContent('');
                    setShowDraftPopout(true);
                  }}
                >
                  <div className="new-draft-content">
                    <div className="plus-icon">+</div>
                    <h3>Create New Draft</h3>
                    <p>Start writing your personal statement</p>
                  </div>
                </div>
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: '75%', maxWidth: '900px' }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Add Study Material</h3>
              <button onClick={() => setShowMaterialModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Category</label>
                <div ref={categoryDropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    style={{
                      padding: '10px 40px 10px 12px',
                      fontSize: '14px',
                      border: '1px solid #00CED1',
                      backgroundColor: '#DFF8F9',
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: '400',
                      width: '100%',
                      outline: 'none',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '0'
                    }}
                  >
                    {materialForm.category ? categories.find(cat => cat.id === materialForm.category)?.label : 'Select category'}
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      backgroundColor: '#DFF8F9',
                      border: '1px solid #00CED1',
                      borderTop: 'none',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      <div
                        onClick={() => {
                          setMaterialForm(prev => ({ ...prev, category: '' }));
                          setIsCategoryDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          fontSize: '14px',
                          fontFamily: "'Figtree', sans-serif",
                          fontWeight: '400',
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          backgroundColor: '#DFF8F9',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#95EAEC';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#DFF8F9';
                        }}
                      >
                        Select category
                      </div>
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setMaterialForm(prev => ({ ...prev, category: cat.id }));
                            setIsCategoryDropdownOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '14px',
                            fontFamily: "'Figtree', sans-serif",
                            fontWeight: '400',
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            backgroundColor: materialForm.category === cat.id ? '#95EAEC' : '#DFF8F9',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (materialForm.category !== cat.id) {
                              (e.target as HTMLElement).style.backgroundColor = '#95EAEC';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (materialForm.category !== cat.id) {
                              (e.target as HTMLElement).style.backgroundColor = '#DFF8F9';
                            }
                          }}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Title</label>
                <input 
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Description</label>
                <textarea 
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Main Arguments</label>
                <textarea 
                  value={materialForm.main_arguments}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, main_arguments: e.target.value }))}
                  rows={3}
                  placeholder="Key arguments or findings from this material"
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Conclusions</label>
                <textarea 
                  value={materialForm.conclusions}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, conclusions: e.target.value }))}
                  rows={3}
                  placeholder="Main conclusions or outcomes"
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Sources</label>
                <textarea 
                  value={materialForm.sources}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, sources: e.target.value }))}
                  rows={3}
                  placeholder="Sources referenced in this material"
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Methodology</label>
                <textarea 
                  value={materialForm.methodology}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, methodology: e.target.value }))}
                  rows={3}
                  placeholder="Research methodology or approach used"
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>Completion Date</label>
                <input 
                  type="text"
                  value={materialForm.completion_date}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, completion_date: e.target.value }))}
                  placeholder="e.g., January 2024"
                  style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}
                />
              </div>
              
              <div className="form-group">
                <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>File</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file"
                    onChange={(e) => setMaterialForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ 
                      opacity: 0, 
                      position: 'absolute', 
                      width: '100%', 
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    padding: '10px 12px',
                    border: '1px solid #00CED1',
                    background: '#DFF8F9',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    color: materialForm.file ? '#000000' : '#666666'
                  }}>
                    {materialForm.file ? materialForm.file.name : 'Add your material here'}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={() => setShowMaterialModal(false)}
                  style={{ 
                    backgroundColor: '#D3F6F7', 
                    fontFamily: "'Figtree', sans-serif", 
                    letterSpacing: '0.04em' 
                  }}
                >Cancel</button>
                <button 
                  className="primary" 
                  onClick={handleSaveMaterial}
                  style={{ 
                    backgroundColor: '#E7E6FF', 
                    color: '#000000',
                    fontFamily: "'Figtree', sans-serif", 
                    letterSpacing: '0.04em' 
                  }}
                >Save Material</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Popout Container */}
      {showDraftPopout && (
        <div 
          className="draft-popout-backdrop" 
          onClick={() => setShowDraftPopout(false)}
        >
          <div 
            className="draft-popout" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="draft-popout-header">
              <h3 style={{ 
                fontFamily: "'Madimi One', cursive", 
                fontSize: '18px', 
                margin: '0',
                color: '#000000'
              }}>
                Quick Draft
              </h3>
              <button 
                onClick={() => setShowDraftPopout(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666666'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="draft-popout-content">
              <div className="draft-meta">
                <div className="draft-info">
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: '12px', color: '#666666' }}>
                    {currentPopupDraft ? 
                      `${currentPopupDraft.title} • Version ${currentPopupDraft.version_number}` : 
                      'New Draft'
                    }
                  </span>
                </div>
                <div className="word-count">
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: '12px', color: '#666666' }}>
                    {popupDraftContent.length} / 4,000 characters
                  </span>
                </div>
              </div>
              
              <textarea
                placeholder="Start writing your personal statement here..."
                value={popupDraftContent}
                onChange={(e) => setPopupDraftContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '300px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: '#FAFAFA'
                }}
              />
              
              <div className="draft-actions-row">
                <button 
                  onClick={saveDraftFromPopup}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#E7E6FF',
                    color: '#4338CA',
                    border: '1px solid #4338CA',
                    borderRadius: '6px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => {
                    setShowDraftPopout(false);
                    setActiveTab('drafts');
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#D3F6F7',
                    color: '#000000',
                    border: '1px solid #00CED1',
                    borderRadius: '6px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Open Full Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Draft Modal */}
      {showSaveDraftModal && (
        <div 
          className="modal-backdrop" 
          onClick={() => setShowSaveDraftModal(false)}
        >
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '400px', maxWidth: '90vw' }}
          >
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Madimi One', cursive", fontSize: '18px', margin: '0' }}>
                Save as Draft
              </h3>
              <button onClick={() => setShowSaveDraftModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  fontFamily: "'Figtree', sans-serif", 
                  fontSize: '14px', 
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Draft Title
                </label>
                <input 
                  type="text"
                  placeholder="Enter a title for your draft"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const title = (e.target as HTMLInputElement).value;
                      saveDraftFromChat(title);
                    }
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  fontFamily: "'Figtree', sans-serif", 
                  fontSize: '14px', 
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Preview
                </label>
                <div style={{
                  padding: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {draftToSave.substring(0, 300)}
                  {draftToSave.length > 300 && '...'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowSaveDraftModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#D3F6F7',
                    color: '#000000',
                    border: '1px solid #00CED1',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const titleInput = document.querySelector('input[placeholder="Enter a title for your draft"]') as HTMLInputElement;
                    const title = titleInput?.value || 'Chat Draft';
                    saveDraftFromChat(title);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#E7E6FF',
                    color: '#000000',
                    border: '1px solid #4338CA',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Draft Button */}
      <button
        onClick={() => {
          if (!showDraftPopout) {
            loadDraftForPopup();
          }
          setShowDraftPopout(!showDraftPopout);
        }}
        className="floating-draft-button"
        title="Quick Draft"
      >
        <img 
          src="/icons/learn-hub-book.svg" 
          alt="Quick Draft" 
        />
      </button>
    </div>
  );
}