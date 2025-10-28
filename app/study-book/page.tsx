'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import './study-book.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'notes', label: 'Notes' },
  { id: 'ask-bo', label: 'Ask Bo' }
];

export default function StudyBookPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userSubject, setUserSubject] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{id: number, name: string, size: number, type: string}[]>([]);
  const [boEditMode, setBoEditMode] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [questionPages, setQuestionPages] = useState<{[key: string]: Array<{id: number, content: string, title: string}>}>({
    question1: [{ id: 1, content: '', title: 'Page 1' }],
    question2: [{ id: 1, content: '', title: 'Page 1' }],
    question3: [{ id: 1, content: '', title: 'Page 1' }]
  });
  const [activePages, setActivePages] = useState<{[key: string]: number}>({
    question1: 1,
    question2: 1,
    question3: 1
  });

  // Chat state
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user profile ID instead of auth user ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();
        
        if (profile) {
          setUserId(profile.id);
          loadConversationHistory(profile.id);
        }
      }
    };
    getCurrentUser();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = async (currentUserId: string) => {
    try {
      // Get the most recent conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (conversation) {
        setConversationId(conversation.id);

        // Load messages for this conversation
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

  const sendMessage = async () => {
    if (!currentMessage.trim() || !userId || isLoading) return;

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

      // Add initial assistant message
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

  const renderProfileTab = () => {
    return (
      <div className="accordion-content">
        <div className="main-container">
          {/* Left Content Area */}
          <div className="content-area-left">
            <h2 className="profile-title">User's examrizz profile</h2>
            <div className="content-grid">
              {/* Subject Input Window */}
              <div className="content-window medium">
                <div className="window-title-bar">
                  <span className="window-title">Your Course</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <input 
                    type="text" 
                    placeholder="e.g., Economics, Computer Science" 
                    className="subject-input"
                    value={userSubject}
                    onChange={(e) => setUserSubject(e.target.value)}
                  />
                </div>
              </div>

              {/* Window 1 - Large */}
              <div className="content-window large">
                <div className="window-title-bar">
                  <span className="window-title">Meet SJ</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="ghost-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 375 375">
                      <circle cx="187.5" cy="187.5" r="175.93" fill="#d5d0ff" stroke="#221468" strokeWidth="6"/>
                      <path fill="#ffffff" d="M123.79 150.45c-4.4-2.54-15.33-7.57-15.33-7.57s.16-.87.3-1.68l.35-1.93s4.98 1.45 9.75 3.98c1.88 1.01 3.77 2.07 5.24 2.97 4.69 2.87 8.7 6.73 12.01 11.11.43.56 1.69 2.41 1.69 2.41s-1.25-.91-1.52-1.14c-3.84-3.22-8.18-5.66-12.48-8.15zm-6.16-.98c-2.56-1.23-5.11-2.5-7.7-3.68-1.98-.9-4.02-1.69-6.03-2.52-.63-.26-1.45-.56-1.45-.56l-4.08 1.71s1.59.71 2.02.87c2.56.97 4.75 1.86 7.32 2.82 6.89 2.6 13.69 5.42 20.09 9.11 2.9 1.67 5.85 3.28 8.58 5.23.67.49 2.13.32 2.13.32s-5.61-4.52-8.71-6.38c-4-2.4-7.96-4.89-12.17-6.92z"/>
                      <path fill="#d4d0ff" d="M202.75 221.45c-.01.14-.07 2.24-.1 2.24-.01 0-4.07.95-5.7 1.34-.79.2-1.78.4-2.57.6-3.49.89-7.02 1.6-10.56 2.29-3.39.67-6.75 1.46-10.13 2.15-4.22.87-8.45 1.73-12.69 2.51-2.3.43-4.61.7-6.92 1.04-.8.12-3.26.34-3.26.34s-.1-.26-.15-1.15c-.02-.3-.03-1-.05-1.3-.21-3.5-.36-6.36-.77-9.84-.26-2.17-.46-4.34-.7-6.51-.26-2.27-.55-4.54-.82-6.8-.14-1.26-.32-2.52-.39-3.79-.13-2.38-.44-4.75-.72-7.12-.35-2.87-.75-5.74-1.13-8.61-.47-3.52-.96-7.04-1.39-10.57-.2-1.61-.3-3.23-.46-4.85-.14-1.51-.29-2.69-.37-4.34-.13-2.29-.11-2.5-.11-2.5s7.76-2.38 10.68-3.25c4.96-1.48 9.87-3.14 14.79-4.75 6.32-2.06 12.67-4.06 18.98-6.14 2.85-.94 5.65-2 8.47-3 .38-.14 1.69-.6 1.69-.6s.18 5.69.25 8.21c.03 1.01.01 2.03.06 3.04.22 4.42.4 8.85.66 13.27.05 1.01.06 2.03.13 3.04.17 2.67.29 5.34.51 8.01.15 1.84.28 3.69.48 5.53.32 2.98.6 5.97.96 8.94.28 2.24.53 4.49.86 6.72.42 2.88.82 5.76 1.33 8.63.27 1.52.51 3.05.82 4.56.59 2.87 1.15 5.74 1.8 8.6.32 1.4.62 2.8.98 4.19.68 2.63 1.33 5.26 2.08 7.88.39 1.36.76 2.72 1.19 4.07.83 2.6 1.63 5.21 2.53 7.79.46 1.32.9 2.64 1.4 3.95 1.01 2.65 2 5.3 3.09 7.92.55 1.31 1.09 2.63 1.68 3.93 1.21 2.67 2.39 5.35 3.69 8 .65 1.32 1.29 2.64 1.98 3.95 1.42 2.7 2.81 5.41 4.32 8.08.75 1.33 1.49 2.66 2.28 3.97 1.64 2.72 3.25 5.45 4.98 8.13.86 1.33 1.71 2.67 2.61 3.98 1.88 2.73 3.73 5.47 5.7 8.16.98 1.34 1.95 2.68 2.97 4 2.13 2.75 4.23 5.51 6.45 8.22 1.1 1.35 2.19 2.7 3.33 4.03 2.38 2.78 4.74 5.57 7.21 8.3 1.23 1.36 2.45 2.72 3.72 4.06 2.65 2.8 5.28 5.61 8.01 8.36 1.36 1.37 2.71 2.74 4.11 4.09 2.92 2.82 5.82 5.65 8.82 8.41 1.49 1.37 2.97 2.75 4.5 4.1 3.2 2.83 6.38 5.68 9.66 8.45 1.63 1.38 3.25 2.76 4.92 4.11 3.49 2.84 6.96 5.7 10.53 8.48 1.78 1.38 3.55 2.77 5.37 4.12 3.8 2.82 7.58 5.66 11.45 8.41 1.93 1.37 3.85 2.75 5.82 4.09 4.12 2.8 8.22 5.62 12.41 8.33 2.09 1.35 4.17 2.71 6.29 4.03 4.44 2.77 8.86 5.56 13.37 8.24 2.25 1.34 4.49 2.68 6.77 3.99 4.78 2.73 9.54 5.48 14.38 8.12 2.41 1.32 4.81 2.64 7.25 3.93 5.12 2.7 10.22 5.41 15.4 8.01 2.58 1.3 5.15 2.6 7.76 3.87 5.47 2.66 10.92 5.34 16.44 7.91 2.76 1.28 5.51 2.57 8.29 3.82 5.83 2.62 11.64 5.26 17.51 7.79 2.93 1.26 5.86 2.53 8.82 3.76 6.2 2.57 12.38 5.17 18.63 7.65 3.12 1.24 6.23 2.48 9.37 3.69 6.58 2.53 13.14 5.08 19.76 7.52 3.31 1.22 6.61 2.44 9.94 3.63 6.96 2.49 13.91 4.99 20.91 7.38 3.5 1.19 7 2.39 10.52 3.56 7.35 2.44 14.69 4.9 22.08 7.23 3.69 1.16 7.38 2.33 11.09 3.47 7.75 2.39 15.49 4.8 23.27 7.08 3.89 1.14 7.77 2.28 11.68 3.39 8.16 2.32 16.31 4.67 24.5 6.89 4.09 1.11 8.18 2.23 12.29 3.31 8.59 2.26 17.17 4.54 25.79 6.7 4.31 1.08 8.61 2.17 12.94 3.22 9.04 2.2 18.07 4.42 27.14 6.5 4.53 1.04 9.06 2.09 13.61 3.1 9.51 2.12 19.01 4.26 28.55 6.26 4.77.1 9.54 1.94 14.33 2.88 9.99 1.96 19.96 3.94 29.98 5.79 5.01.93 10.01 1.86 15.04 2.75 10.49 1.86 20.97 3.74 31.49 5.47 5.26.87 10.52 1.73 15.8 2.56 11.02 1.73 22.03 3.47 33.08 5.06 5.52.8 11.04 1.59 16.58 2.35 11.58 1.58 23.15 3.18 34.76 4.62 5.8.72 11.6 1.44 17.42 2.12 12.17 1.42 24.33 2.85 36.53 4.12 6.1.64 12.19 1.27 18.31 1.87 12.78 1.25 25.55 2.51 38.36 3.61 6.4.55 12.8 1.1 19.22 1.61 13.41 1.07 26.81 2.15 40.25 3.07 6.72.46 13.44.92 20.17 1.34 14.07.88 28.13 1.77 42.23 2.51 7.05.37 14.1.74 21.16 1.07 14.76.69 29.51 1.39 44.29 1.93 7.39.27 14.78.54 22.18.78 15.47.5 30.93 1.01 46.42 1.36 7.75.18 15.49.35 23.25.49 16.2.3 32.39.61 48.61.76 8.11.08 16.22.15 24.34.19 16.95.08 33.9.17 50.86.11 8.48-.03 16.96-.07 25.45-.13 17.72-.12 35.43-.25 53.16-.52 8.86-.14 17.73-.28 26.6-.45 18.5-.35 36.99-.71 55.51-1.21 9.26-.25 18.52-.51 27.79-.8 19.31-.6 38.61-1.21 57.94-1.96 9.66-.38 19.33-.76 29-.1 20.15-.89 40.29-1.79 60.46-2.83 10.09-.52 20.18-1.04 30.28-1.6 21.01-1.17 42.01-2.35 63.04-3.68 10.52-.66 21.03-1.33 31.56-2.03 21.9-1.46 43.79-2.93 65.71-4.54 10.96-.8 21.92-1.61 32.89-2.45 22.82-1.75 45.63-3.51 68.47-5.41 11.42-.95 22.84-1.9 34.27-2.89 23.76-2.04 47.51-4.09 71.29-6.28 11.89-1.09 23.78-2.19 35.68-3.32 24.74-2.33 49.47-4.67 74.23-7.15 12.38-1.24 24.76-2.48 37.15-3.76 25.76-2.63 51.51-5.27 77.29-8.05 12.89-1.39 25.78-2.78 38.68-4.21 26.81-2.93 53.61-5.87 80.44-8.95 13.41-1.54 26.82-3.08 40.24-4.66 27.9-3.24 55.79-6.49 83.71-9.88 13.96-1.69 27.92-3.39 41.89-5.12 29.01-3.55 58.01-7.11 87.04-10.81 14.52-1.85 29.03-3.71 43.56-5.6 30.17-3.87 60.33-7.75 90.52-11.77 15.1-2.01 30.19-4.02 45.3-6.07 31.38-4.19 62.75-8.39 94.15-12.73 15.7-2.17 31.39-4.35 47.1-6.56 32.64-4.52 65.27-9.05 97.94-13.72 16.33-2.33 32.66-4.67 49-7.04 33.95-4.85 67.89-9.71 101.87-14.71 16.99-2.5 33.98-5 51-7.54 35.3-5.19 70.59-10.39 105.91-15.73 17.66-2.67 35.32-5.34 53-8.05 36.68-5.54 73.35-11.09 110.06-16.78 18.36-2.84 36.71-5.69 55.09-8.58 38.1-6.01 76.2-12.02 114.34-18.18 19.07-3.08 38.14-6.16 57.22-9.29 39.57-6.49 79.13-12.98 118.74-19.63 19.8-3.32 39.6-6.64 59.42-10.01 41.08-7.02 82.15-14.04 123.27-21.21 20.56-3.58 41.12-7.17 61.7-10.8 42.65-7.58 85.29-15.16 127.98-22.89 21.34-3.86 42.68-7.73 64.04-11.64 44.27-8.17 88.53-16.35 132.84-24.68 22.15-4.16 44.31-8.33 66.48-12.54 45.94-8.79 91.87-17.58 137.85-26.52 22.99-4.47 45.98-8.94 69-13.46 47.66-9.45 95.31-18.9 143.01-28.5 23.85-4.8 47.7-9.6 71.57-14.45 49.43-10.14 98.85-20.28 148.32-30.57 24.74-5.14 49.47-10.29 74.23-15.49 51.25-10.86 102.49-21.72 153.77-32.73 25.64-5.5 51.28-11.01 76.94-16.56 53.11-11.62 106.21-23.24 159.36-35.01 26.57-5.88 53.14-11.77 79.73-17.7 55.01-12.42 110.01-24.84 165.06-37.41 27.53-6.28 55.05-12.57 82.6-18.9 57.96-13.24 115.92-26.48 173.92-39.87 29.0-6.7 58-13.4 87.02-20.15 60.96-14.08 121.92-28.16 182.92-42.39 30.5-7.12 61-14.24 91.52-21.4 63.99-14.93 127.98-29.86 192.01-44.94 32.01-7.54 64.02-15.08 96.05-22.67 67.05-15.8 134.1-31.6 201.19-47.55 33.54-7.98 67.08-15.96 100.64-24.0"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Window 2 - Medium */}
              <div className="content-window medium">
                <div className="window-title-bar">
                  <span className="window-title">Study Stats</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Content</div>
                </div>
              </div>

              {/* Window 3 - Small */}
              <div className="content-window small">
                <div className="window-title-bar">
                  <span className="window-title">Achievements</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Badges</div>
                </div>
              </div>

              {/* Window 4 - Medium */}
              <div className="content-window medium">
                <div className="window-title-bar">
                  <span className="window-title">Progress</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Progress</div>
                </div>
              </div>

              {/* Window 5 - Small */}
              <div className="content-window small">
                <div className="window-title-bar">
                  <span className="window-title">Ranking</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Rank</div>
                </div>
              </div>

              {/* Window 6 - Medium */}
              <div className="content-window medium">
                <div className="window-title-bar">
                  <span className="window-title">Activities</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Activities</div>
                </div>
              </div>

              {/* Window 7 - Large Horizontal */}
              <div className="content-window large-horizontal">
                <div className="window-title-bar">
                  <span className="window-title">Likes & Interests</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Interests</div>
                </div>
              </div>

              {/* Window 8 - Small */}
              <div className="content-window small">
                <div className="window-title-bar">
                  <span className="window-title">Quick Stats</span>
                  <div className="window-controls">
                    <button className="window-control minimize">−</button>
                    <button className="window-control maximize">□</button>
                    <button className="window-control close">×</button>
                  </div>
                </div>
                <div className="window-body">
                  <div className="placeholder-content">Stats</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Chat Area */}
          <div className="chat-area">
            <div className="chat-container">
              <div className="chat-header">
                <span className="chat-title">Buddy Chat</span>
                <button className="close-chat" onClick={toggleChat}>×</button>
              </div>
              <div className="chat-messages">
                <div className="message buddy-message">
                  <div className="message-time">15:01</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
                <div className="message buddy-message">
                  <div className="message-time">15:07</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#00CED1" stroke="#00CED1" strokeWidth="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button className="chat-toggle-icon" onClick={toggleChat}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#221468" stroke="#221468" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResearchTab = () => {
    return (
      <div className="accordion-content">
        <div className="main-container">
          <div className="research-container">
            {/* Books Section */}
            <div className="research-section">
              <div className="section-header">
                <h3 className="section-title">BOOKS</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
            <div className="research-grid">
              <div className="research-item">
                <img src="/icons/books.svg" alt="Book" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Thinking Fast & Slow</h4>
                  <p className="item-status">Finished</p>
                  <p className="item-action">Add insights →</p>
                </div>
              </div>
              <div className="research-item">
                <img src="/icons/books.svg" alt="Book" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Thinking Fast & Slow</h4>
                  <p className="item-status">Reading</p>
                  <p className="item-action">Add insights →</p>
                  <p className="item-link">View insights →</p>
                </div>
              </div>
              <div className="research-item">
                <img src="/icons/books.svg" alt="Book" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Thinking Fast & Slow</h4>
                  <p className="item-status">Not started</p>
                  <p className="item-action">Edit →</p>
                </div>
              </div>
              <div className="research-item">
                <img src="/icons/books.svg" alt="Book" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Thinking Fast & Slow</h4>
                  <p className="item-status">Not started</p>
                  <p className="item-action">Edit →</p>
                </div>
              </div>
            </div>
            <button className="see-all-btn">SEE ALL</button>
          </div>

          {/* Academic Papers Section */}
          <div className="research-section">
            <div className="section-header">
              <h3 className="section-title">ACADEMIC PAPERS</h3>
              <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
            </div>
            <div className="research-list">
              <div className="research-item-list">
                <img src="/icons/academic-paper.svg" alt="Paper" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                  <p className="item-details">Cancer Research Journal, 2025</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Finished</p>
                  <p className="item-action">Add insights →</p>
                </div>
              </div>
              <div className="research-item-list">
                <img src="/icons/academic-paper.svg" alt="Paper" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                  <p className="item-details">Cancer Research Journal, 2025</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Reading</p>
                  <p className="item-action">Add insights →</p>
                  <p className="item-link">View insights →</p>
                </div>
              </div>
            </div>
            <button className="see-all-btn">SEE ALL</button>
          </div>

          {/* Lectures Section */}
          <div className="research-section">
            <div className="section-header">
              <h3 className="section-title">LECTURES</h3>
              <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
            </div>
            <div className="research-list">
              <div className="research-item-list">
                <img src="/icons/lectures.svg" alt="Lecture" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                  <p className="item-details">Cancer Research Journal, 2025</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Not Started</p>
                  <p className="item-action">Add insights →</p>
                </div>
              </div>
              <div className="research-item-list">
                <img src="/icons/lectures.svg" alt="Lecture" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                  <p className="item-details">Cancer Research Journal, 2025</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Reading</p>
                  <p className="item-action">Add insights →</p>
                  <p className="item-link">View insights →</p>
                </div>
              </div>
            </div>
            <button className="see-all-btn">SEE ALL</button>
          </div>

          {/* Textbooks Section */}
          <div className="research-section">
            <div className="section-header">
              <h3 className="section-title">TEXTBOOKS</h3>
              <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
            </div>
            <div className="research-list">
              <div className="research-item-list">
                <img src="/icons/textbooks.svg" alt="Textbook" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Quantum Mechanics Basics</h4>
                  <p className="item-details">Pearson, 2018</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Reading</p>
                  <p className="item-action">Add insights →</p>
                </div>
              </div>
              <div className="research-item-list">
                <img src="/icons/textbooks.svg" alt="Textbook" className="item-icon" />
                <div className="item-content">
                  <h4 className="item-title">Quantum Mechanics Basics</h4>
                  <p className="item-details">Pearson, 2018</p>
                  <p className="item-details">M. Kruger, K. Choi, et. al</p>
                  <p className="item-status">Not started</p>
                  <p className="item-action">Edit →</p>
                </div>
              </div>
            </div>
            <button className="see-all-btn">SEE ALL</button>
          </div>
          </div>

          {/* Right Chat Area */}
          <div className="chat-area">
            <div className="chat-container">
              <div className="chat-header">
                <span className="chat-title">Buddy Chat</span>
                <button className="close-chat" onClick={toggleChat}>×</button>
              </div>
              <div className="chat-messages">
                <div className="message buddy-message">
                  <div className="message-time">15:01</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
                <div className="message buddy-message">
                  <div className="message-time">15:07</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#00CED1" stroke="#00CED1" strokeWidth="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button className="chat-toggle-icon" onClick={toggleChat}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#221468" stroke="#221468" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectsTab = () => {
    return (
      <div className="accordion-content">
        <div className="main-container">
          <div className="projects-container">
            {/* Essays Section */}
            <div className="projects-section">
              <div className="section-header">
                <h3 className="section-title">ESSAYS</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="essays-description">
                Super-curricular essays for your personal statement and interviews
              </div>
              <div className="essays-actions">
                <button className="action-btn primary">+ New Essay</button>
                <button className="action-btn secondary">Import from Google Docs</button>
              </div>
              
              <div className="essays-list">
                <div className="essay-item">
                  <div className="essay-icon">
                    <img src="/icons/essays.svg" alt="Essay" className="item-icon" />
                  </div>
                  <div className="essay-content">
                    <div className="essay-header">
                      <h4 className="essay-title">How does behavioural economics challenge traditional theory?</h4>
                      <span className="essay-edited">Last edited: 2 hours ago</span>
                    </div>
                    <div className="essay-details">
                      <span className="essay-subject">Economics, 847 words</span>
                      <span className="essay-status">Draft</span>
                    </div>
                    <div className="essay-actions">
                      <div className="essay-actions-left">
                        <button className="essay-action-btn continue">Continue Writing</button>
                        <button className="essay-action-btn view">View</button>
                        <button className="essay-action-btn delete">Delete</button>
                      </div>
                      <div className="essay-actions-right">
                        <button className="essay-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="essay-item">
                  <div className="essay-icon">
                    <img src="/icons/essays.svg" alt="Essay" className="item-icon" />
                  </div>
                  <div className="essay-content">
                    <div className="essay-header">
                      <h4 className="essay-title">The ethics of AI in healthcare</h4>
                      <span className="essay-completed">Completed: Oct 9 2025</span>
                    </div>
                    <div className="essay-details">
                      <span className="essay-subject">Philosophy, 1241 words</span>
                      <span className="essay-status final">Final</span>
                    </div>
                    <div className="essay-actions">
                      <div className="essay-actions-left">
                        <button className="essay-action-btn view">View</button>
                        <button className="essay-action-btn export">Export PDF</button>
                      </div>
                      <div className="essay-actions-right">
                        <button className="essay-action-btn add-ps blue">In PS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-footer">
                <span className="section-count">2 of 5 essays</span>
              </div>
            </div>

            {/* EPQ Section */}
            <div className="projects-section">
              <div className="section-header">
                <h3 className="section-title">EPQ (Extended Project Qualification)</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="epq-description">
                Your independent research project
              </div>
              
              <div className="epq-project">
                <div className="epq-icon">
                  <img src="/icons/essays.svg" alt="EPQ" className="item-icon" />
                </div>
                <div className="epq-content">
                  <div className="epq-header">
                    <h4 className="epq-title">Project Title: Price Elasticity in the Fast Food Market</h4>
                    <span className="epq-progress">40%</span>
                  </div>
                  <div className="epq-progress-bar">
                    <div className="progress-fill" style={{width: '40%'}}></div>
                  </div>
                  <div className="epq-status">
                    <span className="status-label">Status: Research Phase</span>
                  </div>
                  
                  <div className="epq-sections">
                    <h5 className="sections-title">Sections:</h5>
                    <div className="sections-list">
                      <div className="section-item completed">
                        <div className="checkbox completed">✓</div>
                        <span>Introduction</span>
                      </div>
                      <div className="section-item completed">
                        <div className="checkbox completed">✓</div>
                        <span>Literature</span>
                      </div>
                      <div className="section-item in-progress">
                        <div className="checkbox in-progress">◐</div>
                        <span>Methodology (in progress)</span>
                      </div>
                      <div className="section-item">
                        <div className="checkbox"></div>
                        <span>Data Collection</span>
                      </div>
                      <div className="section-item">
                        <div className="checkbox"></div>
                        <span>Analysis</span>
                      </div>
                      <div className="section-item">
                        <div className="checkbox"></div>
                        <span>Conclusion</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="epq-meta">
                    <div className="epq-stats">
                      <span>Target: 5,000 words</span>
                      <span>Current: 1,847</span>
                    </div>
                    <div className="epq-deadline">
                      <span>Due: 15 March 2026</span>
                      <span>120 days left</span>
                    </div>
                  </div>
                  
                  <div className="epq-actions">
                    <div className="epq-actions-left">
                      <button className="epq-action-btn continue">Continue Working</button>
                      <button className="epq-action-btn timeline">View Timeline</button>
                    </div>
                    <div className="epq-actions-right">
                      <button className="epq-action-btn add-ps">Add to PS</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="epq-new">
                <button className="action-btn primary">+ Start New EPQ</button>
              </div>
            </div>

            {/* MOOCs Section */}
            <div className="projects-section">
              <div className="section-header">
                <h3 className="section-title">MOOCS (Online Courses)</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="moocs-description">
                Super-curricular essays for your personal statement and interviews.
              </div>
              <div className="moocs-actions">
                <button className="action-btn primary">+ Add MOOC</button>
                <button className="action-btn secondary">Import from Google Docs</button>
              </div>
              
              <div className="moocs-list">
                <div className="mooc-item">
                  <div className="mooc-icon">
                    <img src="/icons/moocs.svg" alt="MOOC" className="item-icon" />
                  </div>
                  <div className="mooc-content">
                    <div className="mooc-header">
                      <h4 className="mooc-title">Introduction to Behavioural Economics</h4>
                      <div className="mooc-subjects">Economics, Psychology</div>
                    </div>
                    <div className="mooc-provider">Yale University, Coursera</div>
                    <div className="mooc-progress-section">
                      <span className="mooc-status">Status: 78% Complete</span>
                      <div className="mooc-progress-bar">
                        <div className="progress-fill" style={{width: '78%'}}></div>
                      </div>
                      <span className="mooc-week">Week 6/8</span>
                    </div>
                    <div className="mooc-dates">
                      <span>Started: 1 Sept 2025</span>
                      <span>Expected Finish: 25 Oct 2025</span>
                    </div>
                    <div className="mooc-actions">
                      <div className="mooc-actions-left">
                        <button className="mooc-action-btn insights">Add Insight</button>
                        <button className="mooc-action-btn view">View Insights</button>
                      </div>
                      <div className="mooc-actions-right">
                        <button className="mooc-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mooc-item">
                  <div className="mooc-icon">
                    <img src="/icons/moocs.svg" alt="MOOC" className="item-icon" />
                  </div>
                  <div className="mooc-content">
                    <div className="mooc-header">
                      <h4 className="mooc-title">Introduction to Behavioural Economics</h4>
                      <div className="mooc-subjects">Economics</div>
                    </div>
                    <div className="mooc-provider">Yale University, Coursera</div>
                    <div className="mooc-progress-section">
                      <span className="mooc-status">Status: 78% Complete</span>
                      <div className="mooc-progress-bar">
                        <div className="progress-fill" style={{width: '78%'}}></div>
                      </div>
                    </div>
                    <div className="mooc-dates">
                      <span>Started: 1 Sept 2025</span>
                      <span>Expected Finish: 25 Oct 2025</span>
                    </div>
                    <div className="mooc-actions">
                      <div className="mooc-actions-left">
                        <button className="mooc-action-btn insights">Add Insight</button>
                        <button className="mooc-action-btn view">View Insights</button>
                      </div>
                      <div className="mooc-actions-right">
                        <button className="mooc-action-btn add-ps blue">In PS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-footer">
                <span className="section-count">2 of 3 MOOCS</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            <div className="chat-container">
              <div className="chat-header">
                <span className="chat-title">Buddy Chat</span>
                <button className="close-chat" onClick={toggleChat}>×</button>
              </div>
              <div className="chat-messages">
                <div className="message buddy-message">
                  <div className="message-time">15:01</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
                <div className="message buddy-message">
                  <div className="message-time">15:07</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#00CED1" stroke="#00CED1" strokeWidth="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button className="chat-toggle-icon" onClick={toggleChat}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#221468" stroke="#221468" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderExtrasTab = () => {
    return (
      <div className="accordion-content">
        <div className="main-container">
          <div className="extras-container">
            {/* Internships & Work Experience Section */}
            <div className="extras-section">
              <div className="section-header">
                <h3 className="section-title">INTERNSHIPS & WORK EXPERIENCE</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="extras-actions">
                <button className="action-btn primary">+ Add Experience</button>
              </div>
              
              <div className="internships-list">
                <div className="internship-item">
                  <div className="internship-icon">
                    <img src="/icons/internships.svg" alt="Internship" className="item-icon" />
                  </div>
                  <div className="internship-content">
                    <div className="internship-header">
                      <h4 className="internship-title">Economics Research Intern</h4>
                      <span className="internship-updated">Last updated: 1 week ago</span>
                    </div>
                    <div className="internship-company">Bank of England</div>
                    <div className="internship-details">
                      <span className="internship-subject">Economics, 847 words</span>
                    </div>
                    <div className="internship-dates">
                      <span>July - Aug 2025, 6 weeks</span>
                    </div>
                    <div className="internship-actions">
                      <div className="internship-actions-left">
                        <button className="internship-action-btn edit">Edit</button>
                        <button className="internship-action-btn view">View Details</button>
                      </div>
                      <div className="internship-actions-right">
                        <button className="internship-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-footer">
                <span className="section-count">1 of 3 experiences</span>
              </div>
            </div>

            {/* Societies & Clubs Section */}
            <div className="extras-section">
              <div className="section-header">
                <h3 className="section-title">SOCIETIES & CLUBS</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="extras-actions">
                <button className="action-btn primary">+ Add Society</button>
              </div>
              
              <div className="societies-list">
                <div className="society-item">
                  <div className="society-icon">
                    <img src="/icons/societies.svg" alt="Society" className="item-icon" />
                  </div>
                  <div className="society-content">
                    <div className="society-header">
                      <h4 className="society-title">Economics Society</h4>
                      <span className="society-updated">Last updated: 2 days ago</span>
                    </div>
                    <div className="society-school">Sixth Form</div>
                    <div className="society-role">
                      <span>President: Sept 2024 - Present</span>
                    </div>
                    <div className="society-description">
                      <span>Leadership</span>
                    </div>
                    <div className="society-actions">
                      <div className="society-actions-left">
                        <button className="society-action-btn edit">Edit</button>
                        <button className="society-action-btn view">View Details</button>
                      </div>
                      <div className="society-actions-right">
                        <button className="society-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-footer">
                <span className="section-count">1 of 3 societies</span>
              </div>
            </div>

            {/* Academic Challenges & Competitions Section */}
            <div className="extras-section">
              <div className="section-header">
                <h3 className="section-title">ACADEMIC CHALLENGES & COMPETITIONS</h3>
                <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
              </div>
              <div className="extras-actions">
                <button className="action-btn primary">+ Add Challenge</button>
                <button className="action-btn secondary">Browse Upcoming →</button>
              </div>
              
              <div className="challenges-list">
                <div className="challenge-item">
                  <div className="challenge-icon">
                    <img src="/icons/academic-challenges.svg" alt="Challenge" className="item-icon" />
                  </div>
                  <div className="challenge-content">
                    <div className="challenge-header">
                      <h4 className="challenge-title">UK Economics Challenge</h4>
                      <span className="challenge-completed">Completed: March 2025</span>
                    </div>
                    <div className="challenge-type">National Competition</div>
                    <div className="challenge-achievement">
                      <span>Gold Award, Top 10%</span>
                    </div>
                    <div className="challenge-subject">
                      <span>Economics</span>
                    </div>
                    <div className="challenge-actions">
                      <div className="challenge-actions-left">
                        <button className="challenge-action-btn edit">Edit</button>
                        <button className="challenge-action-btn view">View Details</button>
                      </div>
                      <div className="challenge-actions-right">
                        <button className="challenge-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-footer">
                <span className="section-count">1 of 5 challenges</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            <div className="chat-container">
              <div className="chat-header">
                <span className="chat-title">Buddy Chat</span>
                <button className="close-chat" onClick={toggleChat}>×</button>
              </div>
              <div className="chat-messages">
                <div className="message buddy-message">
                  <div className="message-time">15:01</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
                <div className="message buddy-message">
                  <div className="message-time">15:07</div>
                  <div className="message-content">
                    Let's go to search island!
                    Search past paper questions of A Levels and admissions exams.
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button className="send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#00CED1" stroke="#00CED1" strokeWidth="2">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <button className="chat-toggle-icon" onClick={toggleChat}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#221468" stroke="#221468" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNotesTab = () => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (fileId: number) => {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    return (
      <div className="accordion-content">
        <div className="main-container">
          <div className="notes-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {/* Upload Section */}
            <div className="upload-section">
              <div className="section-header">
                <h3 className="section-title">📎 Upload Materials</h3>
              </div>
              <div className="upload-area">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt,.doc" 
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#221468" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-types">PDF, DOCX, TXT (Max 10MB)</span>
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    <h4>Uploaded Files:</h4>
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="uploaded-file-item">
                        <span className="file-name">📄 {file.name}</span>
                        <button 
                          className="remove-file-btn"
                          onClick={() => removeFile(file.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Research Section */}
            <div className="research-container">
              <h2 className="section-main-title">Research</h2>
              {/* Books Section */}
              <div className="research-section">
                <div className="section-header">
                  <h3 className="section-title">BOOKS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="research-grid">
                  <div className="research-item">
                    <img src="/icons/books.svg" alt="Book" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Thinking Fast & Slow</h4>
                      <p className="item-status">Finished</p>
                      <p className="item-action">Add insights →</p>
                    </div>
                  </div>
                  <div className="research-item">
                    <img src="/icons/books.svg" alt="Book" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Thinking Fast & Slow</h4>
                      <p className="item-status">Reading</p>
                      <p className="item-action">Add insights →</p>
                      <p className="item-link">View insights →</p>
                    </div>
                  </div>
                  <div className="research-item">
                    <img src="/icons/books.svg" alt="Book" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Thinking Fast & Slow</h4>
                      <p className="item-status">Not started</p>
                      <p className="item-action">Edit →</p>
                    </div>
                  </div>
                  <div className="research-item">
                    <img src="/icons/books.svg" alt="Book" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Thinking Fast & Slow</h4>
                      <p className="item-status">Not started</p>
                      <p className="item-action">Edit →</p>
                    </div>
                  </div>
                </div>
                <button className="see-all-btn">SEE ALL</button>
              </div>

              {/* Academic Papers Section */}
              <div className="research-section">
                <div className="section-header">
                  <h3 className="section-title">ACADEMIC PAPERS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="research-list">
                  <div className="research-item-list">
                    <img src="/icons/academic-paper.svg" alt="Paper" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                      <p className="item-details">Cancer Research Journal, 2025</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Finished</p>
                      <p className="item-action">Add insights →</p>
                    </div>
                  </div>
                  <div className="research-item-list">
                    <img src="/icons/academic-paper.svg" alt="Paper" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                      <p className="item-details">Cancer Research Journal, 2025</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Reading</p>
                      <p className="item-action">Add insights →</p>
                      <p className="item-link">View insights →</p>
                    </div>
                  </div>
                </div>
                <button className="see-all-btn">SEE ALL</button>
              </div>

              {/* Lectures Section */}
              <div className="research-section">
                <div className="section-header">
                  <h3 className="section-title">LECTURES</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="research-list">
                  <div className="research-item-list">
                    <img src="/icons/lectures.svg" alt="Lecture" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                      <p className="item-details">Cancer Research Journal, 2025</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Not Started</p>
                      <p className="item-action">Add insights →</p>
                    </div>
                  </div>
                  <div className="research-item-list">
                    <img src="/icons/lectures.svg" alt="Lecture" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Evaluating the Effect of Psychedelics on Depression in Cancer Patients</h4>
                      <p className="item-details">Cancer Research Journal, 2025</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Reading</p>
                      <p className="item-action">Add insights →</p>
                      <p className="item-link">View insights →</p>
                    </div>
                  </div>
                </div>
                <button className="see-all-btn">SEE ALL</button>
              </div>

              {/* Textbooks Section */}
              <div className="research-section">
                <div className="section-header">
                  <h3 className="section-title">TEXTBOOKS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="research-list">
                  <div className="research-item-list">
                    <img src="/icons/textbooks.svg" alt="Textbook" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Quantum Mechanics Basics</h4>
                      <p className="item-details">Pearson, 2018</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Reading</p>
                      <p className="item-action">Add insights →</p>
                    </div>
                  </div>
                  <div className="research-item-list">
                    <img src="/icons/textbooks.svg" alt="Textbook" className="item-icon" />
                    <div className="item-content">
                      <h4 className="item-title">Quantum Mechanics Basics</h4>
                      <p className="item-details">Pearson, 2018</p>
                      <p className="item-details">M. Kruger, K. Choi, et. al</p>
                      <p className="item-status">Not started</p>
                      <p className="item-action">Edit →</p>
                    </div>
                  </div>
                </div>
                <button className="see-all-btn">SEE ALL</button>
              </div>
            </div>

            {/* Projects Section */}
            <div className="projects-container">
              <h2 className="section-main-title">Projects</h2>
              {/* Essays Section */}
              <div className="projects-section">
                <div className="section-header">
                  <h3 className="section-title">ESSAYS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="essays-description">
                  Super-curricular essays for your personal statement and interviews
                </div>
                <div className="essays-actions">
                  <button className="action-btn primary">+ New Essay</button>
                  <button className="action-btn secondary">Import from Google Docs</button>
                </div>
                
                <div className="essays-list">
                  <div className="essay-item">
                    <div className="essay-icon">
                      <img src="/icons/essays.svg" alt="Essay" className="item-icon" />
                    </div>
                    <div className="essay-content">
                      <div className="essay-header">
                        <h4 className="essay-title">How does behavioural economics challenge traditional theory?</h4>
                        <span className="essay-edited">Last edited: 2 hours ago</span>
                      </div>
                      <div className="essay-details">
                        <span className="essay-subject">Economics, 847 words</span>
                        <span className="essay-status">Draft</span>
                      </div>
                      <div className="essay-actions">
                        <div className="essay-actions-left">
                          <button className="essay-action-btn continue">Continue Writing</button>
                          <button className="essay-action-btn view">View</button>
                          <button className="essay-action-btn delete">Delete</button>
                        </div>
                        <div className="essay-actions-right">
                          <button className="essay-action-btn add-ps">Add to PS</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="essay-item">
                    <div className="essay-icon">
                      <img src="/icons/essays.svg" alt="Essay" className="item-icon" />
                    </div>
                    <div className="essay-content">
                      <div className="essay-header">
                        <h4 className="essay-title">The ethics of AI in healthcare</h4>
                        <span className="essay-completed">Completed: Oct 9 2025</span>
                      </div>
                      <div className="essay-details">
                        <span className="essay-subject">Philosophy, 1241 words</span>
                        <span className="essay-status final">Final</span>
                      </div>
                      <div className="essay-actions">
                        <div className="essay-actions-left">
                          <button className="essay-action-btn view">View</button>
                          <button className="essay-action-btn export">Export PDF</button>
                        </div>
                        <div className="essay-actions-right">
                          <button className="essay-action-btn add-ps blue">In PS</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section-footer">
                  <span className="section-count">2 of 5 essays</span>
                </div>
              </div>

              {/* EPQ Section */}
              <div className="projects-section">
                <div className="section-header">
                  <h3 className="section-title">EPQ (Extended Project Qualification)</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="epq-description">
                  Your independent research project
                </div>
                
                <div className="epq-project">
                  <div className="epq-icon">
                    <img src="/icons/essays.svg" alt="EPQ" className="item-icon" />
                  </div>
                  <div className="epq-content">
                    <div className="epq-header">
                      <h4 className="epq-title">Project Title: Price Elasticity in the Fast Food Market</h4>
                      <span className="epq-progress">40%</span>
                    </div>
                    <div className="epq-progress-bar">
                      <div className="progress-fill" style={{width: '40%'}}></div>
                    </div>
                    <div className="epq-status">
                      <span className="status-label">Status: Research Phase</span>
                    </div>
                    
                    <div className="epq-sections">
                      <h5 className="sections-title">Sections:</h5>
                      <div className="sections-list">
                        <div className="section-item completed">
                          <div className="checkbox completed">✓</div>
                          <span>Introduction</span>
                        </div>
                        <div className="section-item completed">
                          <div className="checkbox completed">✓</div>
                          <span>Literature</span>
                        </div>
                        <div className="section-item in-progress">
                          <div className="checkbox in-progress">◐</div>
                          <span>Methodology (in progress)</span>
                        </div>
                        <div className="section-item">
                          <div className="checkbox"></div>
                          <span>Data Collection</span>
                        </div>
                        <div className="section-item">
                          <div className="checkbox"></div>
                          <span>Analysis</span>
                        </div>
                        <div className="section-item">
                          <div className="checkbox"></div>
                          <span>Conclusion</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="epq-meta">
                      <div className="epq-stats">
                        <span>Target: 5,000 words</span>
                        <span>Current: 1,847</span>
                      </div>
                      <div className="epq-deadline">
                        <span>Due: 15 March 2026</span>
                        <span>120 days left</span>
                      </div>
                    </div>
                    
                    <div className="epq-actions">
                      <div className="epq-actions-left">
                        <button className="epq-action-btn continue">Continue Working</button>
                        <button className="epq-action-btn timeline">View Timeline</button>
                      </div>
                      <div className="epq-actions-right">
                        <button className="epq-action-btn add-ps">Add to PS</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="epq-new">
                  <button className="action-btn primary">+ Start New EPQ</button>
                </div>
              </div>

              {/* MOOCs Section */}
              <div className="projects-section">
                <div className="section-header">
                  <h3 className="section-title">MOOCS (Online Courses)</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="moocs-description">
                  Super-curricular essays for your personal statement and interviews.
                </div>
                <div className="moocs-actions">
                  <button className="action-btn primary">+ Add MOOC</button>
                  <button className="action-btn secondary">Import from Google Docs</button>
                </div>
                
                <div className="moocs-list">
                  <div className="mooc-item">
                    <div className="mooc-icon">
                      <img src="/icons/moocs.svg" alt="MOOC" className="item-icon" />
                    </div>
                    <div className="mooc-content">
                      <div className="mooc-header">
                        <h4 className="mooc-title">Introduction to Behavioural Economics</h4>
                        <div className="mooc-subjects">Economics, Psychology</div>
                      </div>
                      <div className="mooc-provider">Yale University, Coursera</div>
                      <div className="mooc-progress-section">
                        <span className="mooc-status">Status: 78% Complete</span>
                        <div className="mooc-progress-bar">
                          <div className="progress-fill" style={{width: '78%'}}></div>
                        </div>
                        <span className="mooc-week">Week 6/8</span>
                      </div>
                      <div className="mooc-dates">
                        <span>Started: 1 Sept 2025</span>
                        <span>Expected Finish: 25 Oct 2025</span>
                      </div>
                      <div className="mooc-actions">
                        <div className="mooc-actions-left">
                          <button className="mooc-action-btn insights">Add Insight</button>
                          <button className="mooc-action-btn view">View Insights</button>
                        </div>
                        <div className="mooc-actions-right">
                          <button className="mooc-action-btn add-ps">Add to PS</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mooc-item">
                    <div className="mooc-icon">
                      <img src="/icons/moocs.svg" alt="MOOC" className="item-icon" />
                    </div>
                    <div className="mooc-content">
                      <div className="mooc-header">
                        <h4 className="mooc-title">Introduction to Behavioural Economics</h4>
                        <div className="mooc-subjects">Economics</div>
                      </div>
                      <div className="mooc-provider">Yale University, Coursera</div>
                      <div className="mooc-progress-section">
                        <span className="mooc-status">Status: 78% Complete</span>
                        <div className="mooc-progress-bar">
                          <div className="progress-fill" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      <div className="mooc-dates">
                        <span>Started: 1 Sept 2025</span>
                        <span>Expected Finish: 25 Oct 2025</span>
                      </div>
                      <div className="mooc-actions">
                        <div className="mooc-actions-left">
                          <button className="mooc-action-btn insights">Add Insight</button>
                          <button className="mooc-action-btn view">View Insights</button>
                        </div>
                        <div className="mooc-actions-right">
                          <button className="mooc-action-btn add-ps blue">In PS</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section-footer">
                  <span className="section-count">2 of 3 MOOCS</span>
                </div>
              </div>
            </div>

            {/* Extras Section */}
            <div className="extras-container">
              <h2 className="section-main-title">Extra Activities</h2>
              {/* Internships & Work Experience Section */}
              <div className="extras-section">
                <div className="section-header">
                  <h3 className="section-title">INTERNSHIPS & WORK EXPERIENCE</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="extras-actions">
                  <button className="action-btn primary">+ Add Experience</button>
                </div>
                
                <div className="internships-list">
                  <div className="internship-item">
                    <div className="internship-icon">
                      <img src="/icons/internships.svg" alt="Internship" className="item-icon" />
                    </div>
                    <div className="internship-content">
                      <div className="internship-header">
                        <h4 className="internship-title">Economics Research Intern</h4>
                        <span className="internship-updated">Last updated: 1 week ago</span>
                      </div>
                      <div className="internship-company">Bank of England</div>
                      <div className="internship-details">
                        <span className="internship-subject">Economics, 847 words</span>
                      </div>
                      <div className="internship-dates">
                        <span>July - Aug 2025, 6 weeks</span>
                      </div>
                      <div className="internship-actions">
                        <div className="internship-actions-left">
                          <button className="internship-action-btn edit">Edit</button>
                          <button className="internship-action-btn view">View Details</button>
                        </div>
                        <div className="internship-actions-right">
                          <button className="internship-action-btn add-ps">Add to PS</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section-footer">
                  <span className="section-count">1 of 3 experiences</span>
                </div>
              </div>

              {/* Societies & Clubs Section */}
              <div className="extras-section">
                <div className="section-header">
                  <h3 className="section-title">SOCIETIES & CLUBS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="extras-actions">
                  <button className="action-btn primary">+ Add Society</button>
                </div>
                
                <div className="societies-list">
                  <div className="society-item">
                    <div className="society-icon">
                      <img src="/icons/societies.svg" alt="Society" className="item-icon" />
                    </div>
                    <div className="society-content">
                      <div className="society-header">
                        <h4 className="society-title">Economics Society</h4>
                        <span className="society-updated">Last updated: 2 days ago</span>
                      </div>
                      <div className="society-school">Sixth Form</div>
                      <div className="society-role">
                        <span>President: Sept 2024 - Present</span>
                      </div>
                      <div className="society-description">
                        <span>Leadership</span>
                      </div>
                      <div className="society-actions">
                        <div className="society-actions-left">
                          <button className="society-action-btn edit">Edit</button>
                          <button className="society-action-btn view">View Details</button>
                        </div>
                        <div className="society-actions-right">
                          <button className="society-action-btn add-ps">Add to PS</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section-footer">
                  <span className="section-count">1 of 3 societies</span>
                </div>
              </div>

              {/* Academic Challenges & Competitions Section */}
              <div className="extras-section">
                <div className="section-header">
                  <h3 className="section-title">ACADEMIC CHALLENGES & COMPETITIONS</h3>
                  <img src="/icons/edit-icon.svg" alt="Edit" className="edit-icon" />
                </div>
                <div className="extras-actions">
                  <button className="action-btn primary">+ Add Challenge</button>
                  <button className="action-btn secondary">Browse Upcoming →</button>
                </div>
                
                <div className="challenges-list">
                  <div className="challenge-item">
                    <div className="challenge-icon">
                      <img src="/icons/academic-challenges.svg" alt="Challenge" className="item-icon" />
                    </div>
                    <div className="challenge-content">
                      <div className="challenge-header">
                        <h4 className="challenge-title">UK Economics Challenge</h4>
                        <span className="challenge-completed">Completed: March 2025</span>
                      </div>
                      <div className="challenge-type">National Competition</div>
                      <div className="challenge-achievement">
                        <span>Gold Award, Top 10%</span>
                      </div>
                      <div className="challenge-subject">
                        <span>Economics</span>
                      </div>
                      <div className="challenge-actions">
                        <div className="challenge-actions-left">
                          <button className="challenge-action-btn edit">Edit</button>
                          <button className="challenge-action-btn view">View Details</button>
                        </div>
                        <div className="challenge-actions-right">
                          <button className="challenge-action-btn add-ps">Add to PS</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section-footer">
                  <span className="section-count">1 of 5 challenges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAskBoTab = () => {
    const addNewPage = (question: string) => {
      const newPageId = Math.max(...questionPages[question].map(p => p.id)) + 1;
      setQuestionPages(prev => ({
        ...prev,
        [question]: [...prev[question], { id: newPageId, content: '', title: `Page ${newPageId}` }]
      }));
      setActivePages(prev => ({ ...prev, [question]: newPageId }));
    };

    const updatePageContent = (question: string, pageId: number, content: string) => {
      setQuestionPages(prev => ({
        ...prev,
        [question]: prev[question].map(p => 
          p.id === pageId ? { ...p, content } : p
        )
      }));
    };

    const savePage = (question: string, pageId: number) => {
      const page = questionPages[question].find(p => p.id === pageId);
      console.log(`Saving ${question}, Page ${pageId}:`, page);
      // Database save will be implemented later
    };

    const renderQuestionBox = (questionNum: number, title: string) => {
      const question = `question${questionNum}`;
      const currentPage = questionPages[question].find(p => p.id === activePages[question]);

      return (
        <div className="question-box">
          <div className="question-header">
            <h3 className="question-title">{title}</h3>
            <div className="page-navigation">
              <div className="page-tabs">
                {questionPages[question].map(page => (
                  <button
                    key={page.id}
                    className={`page-tab ${activePages[question] === page.id ? 'active' : ''}`}
                    onClick={() => setActivePages(prev => ({ ...prev, [question]: page.id }))}
                  >
                    {page.title}
                  </button>
                ))}
                <button className="add-page-btn" onClick={() => addNewPage(question)}>
                  + New Page
                </button>
              </div>
            </div>
          </div>
          <div className="question-content">
            <textarea
              className="question-textarea"
              value={currentPage?.content || ''}
              onChange={(e) => boEditMode ? updatePageContent(question, activePages[question], e.target.value) : null}
              placeholder={boEditMode ? `Start writing your response for ${title} here...` : `Waiting for Bo to guide you...`}
              readOnly={!boEditMode}
            />
            <div className="question-actions">
              <button 
                className="save-btn"
                onClick={() => savePage(question, activePages[question])}
              >
                Save Page {activePages[question]}
              </button>
              <div className="word-count">
                {currentPage?.content ? currentPage.content.split(/\s+/).filter(word => word.length > 0).length : 0} words
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="accordion-content">
        <div className="main-container">
          <div className="ask-bo-container">
            {/* Chat Interface */}
            <div className="ask-bo-chat">
              <div className="chat-container full-chat">
                <div className="chat-header">
                  <span className="chat-title">Ask Bo - Your AI Assistant</span>
                  {viewingFile && (
                    <span className="context-indicator">
                      📄 Viewing: {viewingFile}
                    </span>
                  )}
                </div>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="message buddy-message">
                      <div className="message-time">Now</div>
                      <div className="message-content">
                        Hi! I'm Bo, your AI assistant. I can help you with your personal statement questions, provide feedback, and offer guidance. How can I help you today?
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`message ${message.role === 'assistant' ? 'buddy-message' : 'user-message'}`}>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="message-content">
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="message buddy-message">
                      <div className="message-time">Now</div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                  <div className="chat-input">
                    <input 
                      type="text" 
                      placeholder="Ask Bo anything about your personal statement..." 
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <button 
                      className="send-button"
                      onClick={sendMessage}
                      disabled={isLoading || !currentMessage.trim()}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#00CED1" stroke="#00CED1" strokeWidth="2">
                        <path d="M22 2L11 13"/>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </button>
                  </div>
                  <button className="discord-help-btn">
                    Can't help? Ask a Teacher →
                  </button>
                </div>
              </div>
            </div>

            {/* Question Writing Boxes */}
            <div className="questions-section">
              <div className="questions-header">
                <h2 className="section-title">Personal Statement Questions</h2>
                <button 
                  className="edit-mode-toggle"
                  onClick={() => setBoEditMode(!boEditMode)}
                >
                  {boEditMode ? '🔓 Edit Mode Enabled' : '🔒 Bo Controls Writing'}
                </button>
              </div>
              <div className="questions-container">
                {renderQuestionBox(1, "Question 1")}
                {renderQuestionBox(2, "Question 2")}
                {renderQuestionBox(3, "Question 3")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notes':
        return renderNotesTab();
      case 'ask-bo':
        return renderAskBoTab();
      default:
        return null;
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="study-book-wrapper">
      {/* Navbar */}
      <nav className="study-book-navbar">
        <div className="nav-left">
          <a href="/" className="navbar-logo">examrizzsearch</a>
        </div>
        <div className="nav-center">
        </div>
        <div className="nav-right">
          <button className="navbar-menu">
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
            <div className="navbar-menu-line"></div>
          </button>
        </div>
      </nav>

      {/* Back Button */}
      <div className="back-button-container">
        <Link href="/learn" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
          Learn Hub
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="accordion-container">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}