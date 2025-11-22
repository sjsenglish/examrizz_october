'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import { useProfile } from '@/contexts/ProfileContext';
import { useSubscription } from '@/hooks/useSubscription';
import { UserProfile } from '@/lib/auth-utils';
import './study-book.css';

interface UsageInfo {
  total_cost: number;
  total_tokens: number;
  limit: number;
  remaining: number;
  percentage_used: number;
}


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
  
  // Use profile context instead of local state
  const { 
    profile: userProfile, 
    loading: profileLoading, 
    error: profileError, 
    refreshProfile,
    updateProfileCache,
    saveProfileAndUpdateCache 
  } = useProfile();
  
  // Get subscription information
  const { subscription, tier } = useSubscription();
  
  // Get member status display info
  const getMemberStatus = () => {
    switch (tier) {
      case 'plus':
        return { text: 'Plus Member', icon: '⭐', color: '#7C3AED', bgColor: '#F3E8FF' };
      case 'max':
        return { text: 'Max Member', icon: '👑', color: '#DC2626', bgColor: '#FEF2F2' };
      default:
        return { text: 'Free Member', icon: '🆓', color: '#059669', bgColor: '#ECFDF5' };
    }
  };
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDraftPopout, setShowDraftPopout] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [draftToSave, setDraftToSave] = useState('');
  const [currentPopupDraft, setCurrentPopupDraft] = useState<DraftVersion | null>(null);
  const [popupDraftContent, setPopupDraftContent] = useState('');
  const [showDraftVersionsModal, setShowDraftVersionsModal] = useState(false);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

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
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
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
  
  // Interview chat state
  const [interviewMessages, setInterviewMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentInterviewMessage, setCurrentInterviewMessage] = useState('');
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [interviewConversationId, setInterviewConversationId] = useState<string | null>(null);
  
  // Teacher help state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketResult, setTicketResult] = useState<{success: boolean, message: string, ticketId?: string} | null>(null);

  // Discord info modal state
  const [isDiscordInfoModalOpen, setIsDiscordInfoModalOpen] = useState(false);
  const [manualDiscordUsername, setManualDiscordUsername] = useState('');
  const [manualDiscordId, setManualDiscordId] = useState('');

  // Usage tracking state
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);

  // Profile editing state (keep local for form management)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    username: '',
    school: '',
    rank_in_school: '',
    target_degree: '',
    gcse_grades: [] as Array<{subject: string, grade: string}>,
    a_level_grades: [] as Array<{subject: string, grade: string}>
  });

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

  // Auth check - required login (redirect to /login if not authenticated)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          // No user found, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.log('Auth error, redirecting to login');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // Get current user on mount and ensure profile exists
  useEffect(() => {
    if (!user) return;
    
    // Debounce to prevent multiple simultaneous calls
    const timeoutId = setTimeout(async () => {
      const getCurrentUser = async () => {
      try {
        // First attempt: try to get existing profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        let profile: UserProfile | null = profileData as UserProfile | null;
        
        // If profile exists, use it
        if (profile && !profileError) {
          setUserId(profile.id);
          loadConversationHistory(profile.id);
          loadUploadedFiles();
          loadDraftVersions(profile.id);
          loadAllUserDrafts();
          return;
        }

        // Profile doesn't exist - create it (with race condition protection)
        const newProfile: any = {
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Add provider-specific data
        const provider = user.app_metadata?.provider;
        if (provider === 'discord') {
          const userMetadata = user.user_metadata || {};
          newProfile.discord_id = userMetadata.provider_id || userMetadata.sub || userMetadata.id;
          newProfile.discord_username = userMetadata.username || userMetadata.global_name || userMetadata.name;
          newProfile.discord_avatar = userMetadata.avatar_url || userMetadata.picture;
          newProfile.discord_discriminator = userMetadata.discriminator;
          newProfile.discord_linked_at = new Date().toISOString();
        } else if (provider === 'google') {
          const userMetadata = user.user_metadata || {};
          newProfile.full_name = userMetadata.full_name || userMetadata.name;
        }

        // Use upsert to handle race conditions (creates if not exists, ignores if exists)
        const { data: createdProfile, error: createError } = await (supabase as any)
          .from('user_profiles')
          .upsert([newProfile], {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        if (createError) {
          // If upsert failed, try one more time to fetch existing profile (silently)
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (existingProfile) {
            profile = existingProfile as UserProfile;
          } else {
            // Profile creation failed completely - exit gracefully
            return;
          }
        } else {
          profile = createdProfile as UserProfile | null;
        }
        
        if (profile) {
          setUserId(profile.id);
          loadConversationHistory(profile.id);
          loadUploadedFiles();
          loadDraftVersions(profile.id);
          loadAllUserDrafts();
        }
      } catch (error) {
        // Silent error handling - don't log since functionality works
      }
      };
      
      await getCurrentUser();
    }, 100); // 100ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [user]);

  // Fetch usage info when userId is available
  useEffect(() => {
    if (userId) {
      fetchUsageInfo();
    }
  }, [userId]);

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

  // Auto-hide success ticket results after 10 seconds
  useEffect(() => {
    if (ticketResult?.success) {
      const timer = setTimeout(() => {
        setTicketResult(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [ticketResult]);

  // Auto-hide usage limit notification after 8 seconds
  useEffect(() => {
    if (showUsageLimitModal) {
      const timer = setTimeout(() => {
        setShowUsageLimitModal(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showUsageLimitModal]);

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
        setConversationId((conversation as any).id);

        const { data: messageHistory } = await supabase
          .from('messages')
          .select('id, role, content, created_at')
          .eq('conversation_id', (conversation as any).id)
          .order('created_at', { ascending: true });

        if (messageHistory) {
          const formattedMessages = (messageHistory as any[]).map(msg => ({
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

      // Load ALL drafts for the drafts page (all versions)
      const { data: drafts, error } = await supabase
        .from('draft_versions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Show newest first

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
        .eq('question_number', 1) // Default to question 1 for chat drafts
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersionNumber = existingDrafts && (existingDrafts as any[]).length > 0
        ? (existingDrafts as any[])[0].version_number + 1
        : 1;

      // First, insert the new version (not marked as current yet)
      const { data: newDraft, error: insertError } = await supabase
        .from('draft_versions')
        .insert({
          user_id: user.id,
          question_number: 1, // Default to question 1 for chat drafts
          version_number: nextVersionNumber,
          content: draftToSave,
          title: title || `Personal Statement v${nextVersionNumber}`,
          word_count: draftToSave.split(' ').length,
          is_current: false // Set to false initially
        } as any)
        .select()
        .single();

      if (insertError) {
        console.error('Error saving new draft version:', insertError);
        alert('Failed to save draft. Please try again.');
        return;
      }

      // Then mark all other drafts for this question as not current
      await (supabase as any)
        .from('draft_versions')
        .update({ is_current: false })
        .eq('user_id', user.id)
        .eq('question_number', 1)
        .neq('id', (newDraft as any).id);

      // Finally, mark the new draft as current
      const { error: updateError } = await (supabase as any)
        .from('draft_versions')
        .update({ is_current: true })
        .eq('id', (newDraft as any).id);

      if (updateError) {
        console.error('Error marking draft as current:', updateError);
        // Draft is saved but not marked as current - not a critical error
      }

      // Clear the chat message and close modal
      setCurrentMessage('');
      setDraftToSave('');
      setShowSaveDraftModal(false);
      
      // Refresh drafts
      await loadAllUserDrafts();
      
      alert(`Draft saved as version ${nextVersionNumber}!`);
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
        setCurrentPopupDraft(draft as any);
        setPopupDraftContent((draft as any).content);
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

      // Always create a new version instead of updating existing ones
      // Get the next version number for this specific question
      const { data: existingDrafts } = await supabase
        .from('draft_versions')
        .select('version_number')
        .eq('user_id', user.id)
        .eq('question_number', 1)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersionNumber = existingDrafts && (existingDrafts as any[]).length > 0
        ? (existingDrafts as any[])[0].version_number + 1
        : 1;

      // First, insert the new version (not marked as current yet)
      const { data: newDraft, error: insertError } = await supabase
        .from('draft_versions')
        .insert({
          user_id: user.id,
          question_number: 1,
          version_number: nextVersionNumber,
          content: popupDraftContent,
          title: currentPopupDraft?.title || `Personal Statement v${nextVersionNumber}`,
          word_count: popupDraftContent.split(' ').length,
          is_current: false // Set to false initially
        } as any)
        .select()
        .single();

      if (insertError) {
        console.error('Error saving new draft version:', insertError);
        alert('Failed to save draft. Please try again.');
        return;
      }

      // Then mark all other drafts for this question as not current
      await (supabase as any)
        .from('draft_versions')
        .update({ is_current: false })
        .eq('user_id', user.id)
        .eq('question_number', 1)
        .neq('id', (newDraft as any).id);

      // Finally, mark the new draft as current
      const { error: updateError } = await (supabase as any)
        .from('draft_versions')
        .update({ is_current: true })
        .eq('id', (newDraft as any).id);

      if (updateError) {
        console.error('Error marking draft as current:', updateError);
        // Draft is saved but not marked as current - not a critical error
      }

      setCurrentPopupDraft(newDraft);

      // Refresh drafts
      await loadAllUserDrafts();
      alert(`Draft saved as version ${nextVersionNumber}!`);
      setShowDraftPopout(false);
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
    setShowDraftVersionsModal(false);
    setShowDraftPopout(true);
  };

  // Fetch usage information
  const fetchUsageInfo = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/usage?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUsageInfo(data.monthlyUsage);
      }
    } catch (error) {
      console.error('Error fetching usage info:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) {
      return;
    }

    // If no user is logged in, show a helpful message
    if (!userId) {
      const loginPromptMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hi! To have full conversations and save your progress, please log in or sign up. You can still browse the interface and see how it works!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: currentMessage.trim(),
        timestamp: new Date()
      }, loginPromptMessage]);
      setCurrentMessage('');
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

      if (!response.ok) {
        if (response.status === 402) {
          // Usage limit exceeded
          const errorData = await response.json();
          setUsageError(errorData.message);
          setUsageInfo(errorData.usage);
          setShowUsageLimitModal(true);
          return;
        }
        throw new Error('Failed to send message');
      }

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
                // Refresh usage info after successful message
                fetchUsageInfo();
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
  
  const sendInterviewMessage = async () => {
    if (!currentInterviewMessage.trim() || isInterviewLoading) {
      return;
    }

    // If no user is logged in, show a helpful message
    if (!userId) {
      const loginPromptMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hi! To have full conversations and save your progress, please log in or sign up. You can still browse the interface and see how it works!',
        timestamp: new Date()
      };
      setInterviewMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: currentInterviewMessage.trim(),
        timestamp: new Date()
      }, loginPromptMessage]);
      setCurrentInterviewMessage('');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: currentInterviewMessage.trim(),
      timestamp: new Date()
    };

    setInterviewMessages(prev => [...prev, userMessage]);
    setCurrentInterviewMessage('');
    setIsInterviewLoading(true);

    try {
      const response = await fetch('/api/chat/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: interviewConversationId,
          userId
        })
      });

      if (!response.ok) {
        if (response.status === 402) {
          // Usage limit exceeded
          const errorData = await response.json();
          setUsageError(errorData.message);
          setUsageInfo(errorData.usage);
          setShowUsageLimitModal(true);
          return;
        }
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const assistantId = (Date.now() + 1).toString();
      setInterviewMessages(prev => [...prev, {
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
                setInterviewMessages(prev => prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ));
                
                if (data.conversationId && !interviewConversationId) {
                  setInterviewConversationId(data.conversationId);
                }
              } else if (data.type === 'complete') {
                if (data.conversationId && !interviewConversationId) {
                  setInterviewConversationId(data.conversationId);
                }
                // Refresh usage info after successful message
                fetchUsageInfo();
              } else if (data.type === 'error') {
                setInterviewMessages(prev => prev.map(msg => 
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
      console.error('Error sending interview message:', error);
      setInterviewMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleInterviewKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendInterviewMessage();
    }
  };

  const checkDiscordAuth = async () => {
    // Check if user has Discord linked in their Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user has Discord identity linked
    const discordIdentity = user.identities?.find((identity: any) => identity.provider === 'discord');
    return !!discordIdentity;
  };

  const handleAskTeacher = async () => {
    try {
      setIsCreatingTicket(true);
      setTicketResult(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTicketResult({
          success: false,
          message: 'Please log in to create a teacher help request.'
        });
        setIsCreatingTicket(false);
        return;
      }

      // Check if there are enough messages for context
      if (messages.length === 0) {
        setTicketResult({
          success: false,
          message: 'Please have a conversation with Bo first before requesting teacher help.'
        });
        setIsCreatingTicket(false);
        return;
      }

      // Check if Discord username is available (from profile or manual entry)
      const hasDiscordUsername = userProfile?.discord_username || manualDiscordUsername;

      if (!hasDiscordUsername) {
        // No Discord username - show modal to collect it
        setIsDiscordInfoModalOpen(true);
        setIsCreatingTicket(false);
        return;
      }

      // Use Discord info from profile or manual entry
      const discordUsername = userProfile?.discord_username || manualDiscordUsername;
      const discordId = userProfile?.discord_id || manualDiscordId || undefined;

      // Extract last 5 messages for context
      const recentMessages = messages.slice(-5);
      const conversationContext = recentMessages.map(msg =>
        `**${msg.role.toUpperCase()}**: ${msg.content}`
      ).join('\n\n');

      // Generate unique ticket ID
      const ticketId = `TEACH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create ticket via API
      const response = await fetch('/api/discord-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: conversationContext,
          ticketId: ticketId,
          userEmail: user.email,
          userId: user.id,
          discordId: discordId,
          discordUsername: discordUsername
        })
      });

      const result = await response.json();

      if (result.success) {
        setTicketResult({
          success: true,
          message: `Teacher help request created successfully! Ticket ID: ${result.ticketId}`,
          ticketId: result.ticketId
        });
      } else {
        setTicketResult({
          success: false,
          message: result.error || 'Failed to create teacher help request. Please try again.'
        });
      }

    } catch (error) {
      console.error('Error creating teacher ticket:', error);
      setTicketResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleDiscordInfoSubmit = async () => {
    if (!manualDiscordUsername.trim()) {
      alert('Please enter your Discord username.');
      return;
    }

    // Close Discord info modal and retry ticket creation
    setIsDiscordInfoModalOpen(false);
    handleAskTeacher();
  };

  const handleCloseDiscordInfoModal = () => {
    setIsDiscordInfoModalOpen(false);
    setManualDiscordUsername('');
    setManualDiscordId('');
  };

  // Initialize editing form when profile data is available
  useEffect(() => {
    if (userProfile && !isEditingProfile) {
      setEditedProfile({
        full_name: userProfile.full_name || '',
        username: userProfile.username || '',
        school: userProfile.school || '',
        rank_in_school: userProfile.rank_in_school || '',
        target_degree: userProfile.target_degree || '',
        gcse_grades: userProfile.gcse_grades || [],
        a_level_grades: userProfile.a_level_grades || []
      });
    }
  }, [userProfile, isEditingProfile]);

  // Save profile changes using the cached context method
  const saveProfile = async () => {
    if (!userId) return;
    
    try {
      await saveProfileAndUpdateCache(
        {
          full_name: editedProfile.full_name,
          username: editedProfile.username,
          school: editedProfile.school,
          rank_in_school: editedProfile.rank_in_school,
          target_degree: editedProfile.target_degree
        },
        {
          gcse: editedProfile.gcse_grades,
          aLevel: editedProfile.a_level_grades
        }
      );
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Add/remove GCSE subjects
  const addGcseSubject = () => {
    setEditedProfile(prev => ({
      ...prev,
      gcse_grades: [...prev.gcse_grades, { subject: '', grade: '' }]
    }));
  };

  const removeGcseSubject = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      gcse_grades: prev.gcse_grades.filter((_, i) => i !== index)
    }));
  };

  const updateGcseSubject = (index: number, field: 'subject' | 'grade', value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      gcse_grades: prev.gcse_grades.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add/remove A-level subjects
  const addALevelSubject = () => {
    setEditedProfile(prev => ({
      ...prev,
      a_level_grades: [...prev.a_level_grades, { subject: '', grade: '' }]
    }));
  };

  const removeALevelSubject = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      a_level_grades: prev.a_level_grades.filter((_, i) => i !== index)
    }));
  };

  const updateALevelSubject = (index: number, field: 'subject' | 'grade', value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      a_level_grades: prev.a_level_grades.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
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
      const { data, error } = await (supabase as any)
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

  const deleteMaterial = async (materialId: string, fileName: string) => {
    try {
      const confirmed = confirm(`Are you sure you want to delete "${fileName}"?`);
      if (!confirmed) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Delete from database
      const { error } = await supabase
        .from('user_uploads')
        .delete()
        .eq('id', materialId);

      if (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material');
        return;
      }

      // Refresh the materials list
      await loadUploadedFiles();
      alert('Material deleted successfully');
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    }
  };

  const editMaterial = (material: any) => {
    // Pre-fill the form with existing material data
    setMaterialForm({
      category: material.category || '',
      title: material.title || '',
      description: material.description || '',
      tags: '',
      file: null,
      main_arguments: material.main_arguments || '',
      conclusions: material.conclusions || '',
      sources: material.sources || '',
      methodology: material.methodology || '',
      completion_date: material.completion_date || ''
    });
    
    // Store the material ID for updating
    setEditingMaterialId(material.id);
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to save materials');
        return;
      }

      // If editing, update existing material
      if (editingMaterialId) {
        const { error } = await (supabase as any)
          .from('user_uploads')
          .update({
            category: materialForm.category,
            title: materialForm.title,
            description: materialForm.description,
            main_arguments: materialForm.main_arguments,
            conclusions: materialForm.conclusions,
            sources: materialForm.sources,
            methodology: materialForm.methodology,
            completion_date: materialForm.completion_date
          })
          .eq('id', editingMaterialId);

        if (error) {
          console.error('Error updating material:', error);
          alert('Failed to update material');
          return;
        }

        alert('Material updated successfully');
        setEditingMaterialId(null);
        setShowMaterialModal(false);
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
        return;
      }

      // Check if at least some content is provided
      if (!materialForm.title && !materialForm.description && !materialForm.main_arguments && 
          !materialForm.conclusions && !materialForm.sources && !materialForm.methodology && !materialForm.file) {
        alert('Please provide at least some content (title, description, or other fields)');
        return;
      }

      if (materialForm.file) {
        // If file is provided, use the upload API
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
      } else {
        // If no file, save directly to database
        const { error } = await (supabase as any)
          .from('user_uploads')
          .insert({
            user_id: session.user.id,
            category: materialForm.category || null,
            title: materialForm.title || 'Untitled Material',
            description: materialForm.description || '',
            main_arguments: materialForm.main_arguments || '',
            conclusions: materialForm.conclusions || '',
            sources: materialForm.sources || '',
            methodology: materialForm.methodology || '',
            completion_date: materialForm.completion_date || '',
            file_name: 'No file attached',
            file_type: 'text/plain',
            file_path: null
          });

        if (error) {
          console.error('Error saving material:', error);
          alert('Failed to save material');
          return;
        }
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

  return (
    <div className="study-book-new">
      <Navbar />

      {/* Show loading spinner while checking auth */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Hide main content during loading */}
      {!loading && (
        <>

      {/* Back Button */}
      <Link 
        href="/" 
        style={{
          position: 'fixed',
          top: '80px',
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
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
          <button 
            className={`nav-item ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            Interview Prep
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
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
                            <button 
                              onClick={() => editMaterial(file)}
                              style={{ fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteMaterial(file.id, file.file_name)}
                              style={{ fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
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

              {/* Teacher Ticket Feedback */}
              {ticketResult && (
                <div style={{
                  margin: '16px 40px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: ticketResult.success ? '#D1FAE5' : '#FEE2E2',
                  border: `1px solid ${ticketResult.success ? '#10B981' : '#EF4444'}`,
                  color: ticketResult.success ? '#065F46' : '#B91C1C',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{ticketResult.success ? '✅ Success!' : '❌ Error'}</strong>
                    <br />
                    {ticketResult.message}
                  </div>
                  <button
                    onClick={() => setTicketResult(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: 'inherit',
                      marginLeft: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

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
                      onClick={handleAskTeacher}
                      disabled={isCreatingTicket}
                      className="ask-teacher-btn"
                      style={{
                        opacity: isCreatingTicket ? 0.6 : 1,
                        cursor: isCreatingTicket ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCreatingTicket ? 'Creating Ticket...' : 'Ask a teacher'}
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

        {activeTab === 'interview' && (
          <div className="chat-page">
            <div className="chat-container">
              <div className="messages-area">
                {interviewMessages.length === 0 ? (
                  <div className="welcome-message">
                    <h2>Interview Prep with Gabe</h2>
                    <p>I'm Gabe, your Oxford/Cambridge interview coach. I'll test your analytical thinking using your personal statement as the foundation.</p>
                  </div>
                ) : (
                  interviewMessages.map(message => (
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

              {/* Teacher Ticket Feedback */}
              {ticketResult && (
                <div style={{
                  margin: '16px 40px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: ticketResult.success ? '#D1FAE5' : '#FEE2E2',
                  border: `1px solid ${ticketResult.success ? '#10B981' : '#EF4444'}`,
                  color: ticketResult.success ? '#065F46' : '#B91C1C',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{ticketResult.success ? '✅ Success!' : '❌ Error'}</strong>
                    <br />
                    {ticketResult.message}
                  </div>
                  <button
                    onClick={() => setTicketResult(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: 'inherit',
                      marginLeft: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="chat-input-fixed">
                <div className="input-container">
                  <textarea
                    value={currentInterviewMessage}
                    onChange={(e) => setCurrentInterviewMessage(e.target.value)}
                    onKeyPress={handleInterviewKeyPress}
                    placeholder="Practice with Gabe..."
                    disabled={isInterviewLoading}
                    rows={3}
                  />
                  <div className="button-group">
                    <button 
                      onClick={handleAskTeacher}
                      disabled={isCreatingTicket}
                      className="ask-teacher-btn"
                      style={{
                        opacity: isCreatingTicket ? 0.6 : 1,
                        cursor: isCreatingTicket ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCreatingTicket ? 'Creating Ticket...' : 'Ask a teacher'}
                    </button>
                    <button 
                      onClick={sendInterviewMessage}
                      disabled={isInterviewLoading || !currentInterviewMessage.trim()}
                      className="send-btn"
                    >
                      {isInterviewLoading ? 'Sending...' : 'Send'}
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
              <h3 style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>
                {editingMaterialId ? 'Edit Study Material' : 'Add Study Material'}
              </h3>
              <button onClick={() => {
                setShowMaterialModal(false);
                setEditingMaterialId(null);
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
              }}>×</button>
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
              
              {!editingMaterialId && (
                <div className="form-group">
                  <label style={{ fontFamily: "'Figtree', sans-serif", letterSpacing: '0.04em' }}>File (Optional)</label>
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
                      {materialForm.file ? materialForm.file.name : 'Add a file (optional) or leave blank'}
                    </div>
                  </div>
                </div>
              )}
              
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

        {activeTab === 'profile' && (
          <div className="profile-page" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            overflow: 'auto',
            paddingTop: '20px'
          }}>
            <div className="profile-container" style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '20px 40px 80px 40px',
              fontFamily: "'Figtree', sans-serif"
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
              }}>
                <h2 style={{ 
                  fontFamily: "'Madimi One', cursive", 
                  fontSize: '28px', 
                  letterSpacing: '0.04em', 
                  margin: '0',
                  color: '#000000'
                }}>
                  My Profile
                </h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: '#000000',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: "'Madimi One', cursive",
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.02em'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={saveProfile}
                      disabled={profileLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#000000',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '13px',
                        cursor: profileLoading ? 'not-allowed' : 'pointer',
                        fontFamily: "'Madimi One', cursive",
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.02em',
                        opacity: profileLoading ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!profileLoading) {
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!profileLoading) {
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {profileLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        // Reset to current profile data or empty fields
                        setEditedProfile({
                          full_name: userProfile?.full_name || '',
                          username: userProfile?.username || '',
                          school: userProfile?.school || '',
                          rank_in_school: userProfile?.rank_in_school || '',
                          target_degree: userProfile?.target_degree || '',
                          gcse_grades: Array.isArray(userProfile?.gcse_grades) ? userProfile.gcse_grades : [],
                          a_level_grades: Array.isArray(userProfile?.a_level_grades) ? userProfile.a_level_grades : []
                        });
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#000000',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: "'Madimi One', cursive",
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.02em'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {profileError && (
                <div style={{
                  marginBottom: '24px',
                  padding: '12px 16px',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  color: '#B91C1C',
                  fontSize: '14px'
                }}>
                  {profileError}
                </div>
              )}

              {profileLoading && !userProfile ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#6B7280'
                }}>
                  Loading profile...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Personal Information Section */}
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <h3 style={{
                      fontFamily: "'Madimi One', cursive",
                      fontSize: '20px',
                      marginBottom: '20px',
                      color: '#000000'
                    }}>
                      Personal Information
                    </h3>
                    
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '20px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          Full Name
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editedProfile.full_name || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, full_name: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: "'Figtree', sans-serif"
                            }}
                          />
                        ) : (
                          <div style={{
                            padding: '10px 12px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '20px'
                          }}>
                            {userProfile?.full_name || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          Username
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editedProfile.username || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: "'Figtree', sans-serif"
                            }}
                          />
                        ) : (
                          <div style={{
                            padding: '10px 12px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '20px'
                          }}>
                            {userProfile?.username || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          School
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editedProfile.school || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, school: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: "'Figtree', sans-serif"
                            }}
                          />
                        ) : (
                          <div style={{
                            padding: '10px 12px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '20px'
                          }}>
                            {userProfile?.school || 'Not provided'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          Rank in School
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editedProfile.rank_in_school || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, rank_in_school: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: "'Figtree', sans-serif"
                            }}
                          />
                        ) : (
                          <div style={{
                            padding: '10px 12px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '20px'
                          }}>
                            {userProfile?.rank_in_school || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Target Degree Section */}
                  <div style={{
                    backgroundColor: '#D3F6F7',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #00CED1'
                  }}>
                    <h3 style={{
                      fontFamily: "'Madimi One', cursive",
                      fontSize: '20px',
                      marginBottom: '20px',
                      color: '#000000'
                    }}>
                      Target Degree
                    </h3>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '6px',
                        color: '#374151'
                      }}>
                        Degree I want to apply for
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          placeholder="e.g., Computer Science, Medicine, Law, etc."
                          value={editedProfile.target_degree || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, target_degree: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: "'Figtree', sans-serif"
                          }}
                        />
                      ) : (
                        <div style={{
                          padding: '10px 12px',
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '20px'
                        }}>
                          {userProfile?.target_degree || 'Not specified'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GCSE Grades Section */}
                  <div style={{
                    backgroundColor: '#D3F6F7',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #00CED1'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        margin: '0',
                        color: '#000000'
                      }}>
                        GCSE Grades
                      </h3>
                      {isEditingProfile && (
                        <button
                          onClick={addGcseSubject}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#D3F6F7',
                            color: '#000000',
                            border: '1px solid #00CED1',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: "'Figtree', sans-serif"
                          }}
                        >
                          + Add Subject
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(isEditingProfile ? editedProfile.gcse_grades : userProfile?.gcse_grades)?.map((grade: any, index: number) => (
                        <div key={index} style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB'
                        }}>
                          {isEditingProfile ? (
                            <>
                              <input
                                type="text"
                                placeholder="Subject"
                                value={grade.subject || ''}
                                onChange={(e) => updateGcseSubject(index, 'subject', e.target.value)}
                                style={{
                                  flex: '1',
                                  padding: '8px 10px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontFamily: "'Figtree', sans-serif"
                                }}
                              />
                              <select
                                value={grade.grade || ''}
                                onChange={(e) => updateGcseSubject(index, 'grade', e.target.value)}
                                style={{
                                  padding: '8px 10px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontFamily: "'Figtree', sans-serif",
                                  minWidth: '80px'
                                }}
                              >
                                <option value="">Grade</option>
                                <option value="9">9</option>
                                <option value="8">8</option>
                                <option value="7">7</option>
                                <option value="6">6</option>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                                <option value="U">U</option>
                              </select>
                              <button
                                onClick={() => removeGcseSubject(index)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: 'white',
                                  color: '#000000',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  fontFamily: "'Madimi One', cursive",
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease',
                                  letterSpacing: '0.02em'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <span style={{ flex: '1', fontSize: '14px', fontWeight: '500' }}>
                                {grade.subject}
                              </span>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#F3F4F6',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '600',
                                minWidth: '40px',
                                textAlign: 'center'
                              }}>
                                {grade.grade}
                              </span>
                            </>
                          )}
                        </div>
                      )) || (
                        <div style={{
                          padding: '20px',
                          textAlign: 'center',
                          color: '#6B7280',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB'
                        }}>
                          No GCSE grades added yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* A-Level Grades Section */}
                  <div style={{
                    backgroundColor: '#D3F6F7',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #00CED1'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        margin: '0',
                        color: '#000000'
                      }}>
                        A-Level Grades
                      </h3>
                      {isEditingProfile && (
                        <button
                          onClick={addALevelSubject}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#D3F6F7',
                            color: '#000000',
                            border: '1px solid #00CED1',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: "'Figtree', sans-serif"
                          }}
                        >
                          + Add Subject
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(isEditingProfile ? editedProfile.a_level_grades : userProfile?.a_level_grades)?.map((grade: any, index: number) => (
                        <div key={index} style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #D1D5DB'
                        }}>
                          {isEditingProfile ? (
                            <>
                              <input
                                type="text"
                                placeholder="Subject"
                                value={grade.subject || ''}
                                onChange={(e) => updateALevelSubject(index, 'subject', e.target.value)}
                                style={{
                                  flex: '1',
                                  padding: '8px 10px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontFamily: "'Figtree', sans-serif"
                                }}
                              />
                              <select
                                value={grade.grade || ''}
                                onChange={(e) => updateALevelSubject(index, 'grade', e.target.value)}
                                style={{
                                  padding: '8px 10px',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontFamily: "'Figtree', sans-serif",
                                  minWidth: '80px'
                                }}
                              >
                                <option value="">Grade</option>
                                <option value="A*">A*</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="U">U</option>
                              </select>
                              <button
                                onClick={() => removeALevelSubject(index)}
                                style={{
                                  padding: '8px',
                                  backgroundColor: 'white',
                                  color: '#000000',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  fontFamily: "'Madimi One', cursive",
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease',
                                  letterSpacing: '0.02em'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <span style={{ flex: '1', fontSize: '14px', fontWeight: '500' }}>
                                {grade.subject}
                              </span>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#F3F4F6',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '600',
                                minWidth: '40px',
                                textAlign: 'center'
                              }}>
                                {grade.grade}
                              </span>
                            </>
                          )}
                        </div>
                      )) || (
                        <div style={{
                          padding: '20px',
                          textAlign: 'center',
                          color: '#6B7280',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB'
                        }}>
                          No A-Level grades added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

      {/* Draft Versions Modal */}
      {showDraftVersionsModal && (
        <div 
          className="modal-backdrop" 
          onClick={() => setShowDraftVersionsModal(false)}
        >
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '80%', maxWidth: '800px', maxHeight: '90vh' }}
          >
            <div className="modal-header">
              <h3 style={{ 
                fontFamily: "'Madimi One', cursive", 
                fontSize: '20px', 
                margin: '0',
                color: '#000000'
              }}>
                Draft Versions
              </h3>
              <button 
                onClick={() => setShowDraftVersionsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666666'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content" style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {allUserDrafts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ 
                    fontFamily: "'Figtree', sans-serif", 
                    fontSize: '16px', 
                    color: '#666666',
                    marginBottom: '24px'
                  }}>
                    No drafts yet. Create your first draft!
                  </p>
                  <button
                    onClick={() => {
                      setCurrentPopupDraft(null);
                      setPopupDraftContent('');
                      setShowDraftVersionsModal(false);
                      setShowDraftPopout(true);
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#E7E6FF',
                      color: '#4338CA',
                      border: '1px solid #4338CA',
                      borderRadius: '8px',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    + Create New Draft
                  </button>
                </div>
              ) : (
                <>
                  {/* Header with New Draft Button */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px'
                  }}>
                    <div style={{ 
                      fontFamily: "'Figtree', sans-serif", 
                      fontSize: '16px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {allUserDrafts.length} draft{allUserDrafts.length !== 1 ? 's' : ''} total
                    </div>
                    
                    <button
                      onClick={() => {
                        setCurrentPopupDraft(null);
                        setPopupDraftContent('');
                        setShowDraftVersionsModal(false);
                        setShowDraftPopout(true);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#E7E6FF',
                        color: '#4338CA',
                        border: '1px solid #4338CA',
                        borderRadius: '6px',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      + New Draft
                    </button>
                  </div>

                  {/* All Drafts Grid */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '16px',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    padding: '4px' // For scrollbar
                  }}>
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
                        <div key={draft.id} style={{ 
                          border: '1px solid #E5E7EB', 
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          overflow: 'hidden',
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          {/* Draft Header */}
                          <div style={{ 
                            padding: '16px',
                            borderBottom: '1px solid #E5E7EB',
                            backgroundColor: '#F8F9FA'
                          }}>
                            <h4 style={{ 
                              fontFamily: "'Madimi One', cursive",
                              fontSize: '16px',
                              margin: '0 0 8px 0',
                              color: '#000000',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {draft.title || `Draft ${index + 1}`}
                            </h4>
                            <div style={{ 
                              display: 'flex', 
                              gap: '16px',
                              fontFamily: "'Figtree', sans-serif",
                              fontSize: '11px',
                              color: '#666666',
                              flexWrap: 'wrap'
                            }}>
                              <span>V{draft.version_number}</span>
                              <span>{formatDate(draft.last_edited || draft.updated_at)}</span>
                              <span>{draft.word_count || draft.content.split(' ').length} words</span>
                            </div>
                          </div>

                          {/* Draft Preview */}
                          <div style={{ padding: '16px' }}>
                            <div style={{
                              fontFamily: "'Figtree', sans-serif",
                              fontSize: '13px',
                              lineHeight: '1.5',
                              color: '#6B7280',
                              height: '80px',
                              overflow: 'hidden',
                              marginBottom: '12px'
                            }}>
                              {draft.content.substring(0, 150)}
                              {draft.content.length > 150 && '...'}
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{
                                width: '100%',
                                height: '4px',
                                backgroundColor: '#E5E7EB',
                                borderRadius: '2px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${Math.min(100, (draft.content.length / 4000) * 100)}%`,
                                  height: '100%',
                                  backgroundColor: draft.content.length > 4000 ? '#DC2626' : '#10B981',
                                  transition: 'width 0.3s ease'
                                }}></div>
                              </div>
                              <div style={{
                                fontFamily: "'Figtree', sans-serif",
                                fontSize: '10px',
                                color: '#9CA3AF',
                                marginTop: '4px',
                                textAlign: 'right'
                              }}>
                                {draft.content.length} / 4,000 characters
                              </div>
                            </div>

                            {/* Draft Actions */}
                            <div style={{ 
                              display: 'flex',
                              gap: '8px',
                              justifyContent: 'flex-end'
                            }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editDraft(draft);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#374151',
                                  border: '1px solid #D1D5DB',
                                  borderRadius: '4px',
                                  fontFamily: "'Figtree', sans-serif",
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: '500'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this draft?')) {
                                    deleteDraft(draft.id);
                                  }
                                }}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  border: '1px solid #FCA5A5',
                                  borderRadius: '4px',
                                  fontFamily: "'Figtree', sans-serif",
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: '500'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* End of grid display - now I need to remove the old single draft display */}
                  {false && allUserDrafts[currentVersionIndex] && (
                    <div style={{ 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF'
                    }}>
                      {/* Draft Header */}
                      <div style={{ 
                        padding: '20px',
                        borderBottom: '1px solid #E5E7EB',
                        backgroundColor: '#F8F9FA'
                      }}>
                        <h4 style={{ 
                          fontFamily: "'Madimi One', cursive",
                          fontSize: '18px',
                          margin: '0 0 8px 0',
                          color: '#000000'
                        }}>
                          {allUserDrafts[currentVersionIndex].title || `Draft ${currentVersionIndex + 1}`}
                        </h4>
                        <div style={{ 
                          display: 'flex', 
                          gap: '24px',
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '12px',
                          color: '#666666'
                        }}>
                          <span>Version {allUserDrafts[currentVersionIndex].version_number}</span>
                          <span>
                            Last edited: {new Date(allUserDrafts[currentVersionIndex].last_edited || allUserDrafts[currentVersionIndex].updated_at).toLocaleDateString()}
                          </span>
                          <span>
                            {allUserDrafts[currentVersionIndex].word_count || allUserDrafts[currentVersionIndex].content.split(' ').length} words
                          </span>
                          <span>
                            {allUserDrafts[currentVersionIndex].content.length} / 4,000 characters
                          </span>
                        </div>
                      </div>

                      {/* Draft Content */}
                      <div style={{ padding: '20px' }}>
                        <div style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          lineHeight: '1.6',
                          color: '#374151',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          padding: '16px',
                          backgroundColor: '#FAFAFA',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB'
                        }}>
                          {allUserDrafts[currentVersionIndex].content}
                        </div>
                      </div>

                      {/* Draft Actions */}
                      <div style={{ 
                        padding: '20px',
                        borderTop: '1px solid #E5E7EB',
                        backgroundColor: '#F8F9FA',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          onClick={() => editDraft(allUserDrafts[currentVersionIndex])}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#FFFFFF',
                            color: '#374151',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit Draft
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this draft?')) {
                              deleteDraft(allUserDrafts[currentVersionIndex].id);
                              setShowDraftVersionsModal(false);
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            borderRadius: '6px',
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete Draft
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Usage Limit Notification */}
      {showUsageLimitModal && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#FFFFFF',
          border: '1px solid #F87171',
          borderLeft: '4px solid #EF4444',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          animation: 'slideInFromRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ 
              backgroundColor: '#FEE2E2', 
              borderRadius: '50%', 
              padding: '6px',
              minWidth: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                margin: '0 0 4px 0',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '15px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                Monthly limit reached
              </h4>
              <p style={{ 
                margin: '0 0 12px 0',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: '1.4'
              }}>
                You've reached your AskBo usage limit for this month.
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link 
                  href="/payment"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4338CA',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  onClick={() => setShowUsageLimitModal(false)}
                >
                  Upgrade
                </Link>
                <button
                  onClick={() => setShowUsageLimitModal(false)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '5px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowUsageLimitModal(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '0',
                marginLeft: '8px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Discord Info Modal */}
      {isDiscordInfoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            border: '2px solid black',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              fontFamily: "'Madimi One', cursive",
              fontSize: '20px',
              marginBottom: '16px',
              color: 'black'
            }}>
              Discord Information Required
            </h3>

            <p style={{
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#333'
            }}>
              To create a teacher help request, we need your Discord username so our teachers can contact you. Please enter your Discord information below.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Discord Username: *
              </label>
              <input
                type="text"
                value={manualDiscordUsername}
                onChange={(e) => setManualDiscordUsername(e.target.value)}
                placeholder="e.g., username#1234 or username"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                Your Discord username (e.g., "johndoe" or "johndoe#1234")
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'black'
              }}>
                Discord ID (Optional):
              </label>
              <input
                type="text"
                value={manualDiscordId}
                onChange={(e) => setManualDiscordId(e.target.value)}
                placeholder="e.g., 123456789012345678"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '4px'
              }}>
                Your Discord user ID (18-digit number). Right-click your name in Discord and select "Copy User ID" with Developer Mode enabled.
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseDiscordInfoModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: '#333',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: "'Madimi One', cursive"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDiscordInfoSubmit}
                disabled={!manualDiscordUsername.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: !manualDiscordUsername.trim() ? '#9CA3AF' : '#5865F2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: !manualDiscordUsername.trim() ? 'not-allowed' : 'pointer',
                  opacity: !manualDiscordUsername.trim() ? 0.6 : 1,
                  fontFamily: "'Madimi One', cursive"
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}