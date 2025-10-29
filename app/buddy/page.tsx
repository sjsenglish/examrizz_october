'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import './buddy.css';

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

interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  first_message: string;
  message_count: number;
}

export default function BuddyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Session management state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessionsSidebar, setShowSessionsSidebar] = useState(false);
  
  // Discord state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Auth protection - check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setUserId(user.id);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // Load sessions and current session on mount
  useEffect(() => {
    if (!userId) return;
    loadSessions();
    loadCurrentSession();
  }, [userId]);


  const loadSessions = async () => {
    if (!userId) return;
    
    try {
      const { data: sessionsData } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at,
          messages!inner(content)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (sessionsData) {
        const formattedSessions: ChatSession[] = sessionsData.map(session => ({
          id: session.id,
          created_at: session.created_at,
          updated_at: session.updated_at,
          first_message: session.messages[0]?.content?.substring(0, 60) + '...' || 'New conversation',
          message_count: session.messages.length
        }));
        setSessions(formattedSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadCurrentSession = async () => {
    if (!userId) return;
    
    try {
      // Get the most recent conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (conversation) {
        await loadSession(conversation.id);
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId);
      
      const { data: messageHistory } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', sessionId)
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
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const createNewSession = async () => {
    if (!userId) return;
    
    try {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          protocol_state: null,
          context: null
        })
        .select('id')
        .single();

      if (newConversation) {
        setCurrentSessionId(newConversation.id);
        setMessages([]);
        await loadSessions(); // Refresh sessions list
        setShowSessionsSidebar(false);
      }
    } catch (error) {
      console.error('Error creating new session:', error);
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
          conversationId: currentSessionId,
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
                
                if (data.conversationId && !currentSessionId) {
                  setCurrentSessionId(data.conversationId);
                }
              } else if (data.type === 'complete') {
                if (data.conversationId && !currentSessionId) {
                  setCurrentSessionId(data.conversationId);
                }
                // Refresh sessions after message is complete
                await loadSessions();
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

  const handleCreateTicket = async () => {
    if (!userId || !currentSessionId) {
      setTicketMessage({ type: 'error', text: 'No active session found' });
      return;
    }

    setIsCreatingTicket(true);
    setTicketMessage(null);

    try {
      // Check if user has Discord ID
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('discord_id, discord_username')
        .eq('id', userId)
        .single();

      if (!profile?.discord_id) {
        // Trigger Discord OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'discord',
          options: {
            redirectTo: `${window.location.origin}/buddy?ticket=true`
          }
        });
        
        if (error) {
          throw error;
        }
        return;
      }

      // Create ticket with existing Discord connection
      const response = await fetch('/api/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sessionId: currentSessionId
        })
      });

      const result = await response.json();

      if (response.ok) {
        setTicketMessage({ type: 'success', text: 'Support ticket created successfully!' });
      } else {
        throw new Error(result.error || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      setTicketMessage({ type: 'error', text: 'Failed to create support ticket. Please try again.' });
    } finally {
      setIsCreatingTicket(false);
    }
  };

  // Handle Discord OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ticket') === 'true') {
      // Remove the ticket parameter and attempt to create ticket
      window.history.replaceState({}, document.title, '/buddy');
      setTimeout(() => handleCreateTicket(), 1000);
    }
  }, []);

  // Clear ticket message after 5 seconds
  useEffect(() => {
    if (ticketMessage) {
      const timer = setTimeout(() => setTicketMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [ticketMessage]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="buddy-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="buddy-page">
      {/* Navbar */}
      <nav className="buddy-navbar">
        <Link href="/" className="buddy-logo">
          <h1>examrizzsearch</h1>
        </Link>
        <div className="navbar-actions">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="hamburger-button"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <Link href="/terms-and-conditions" onClick={() => setShowDropdown(false)}>
                Terms & Conditions
              </Link>
              <Link href="/payment" onClick={() => setShowDropdown(false)}>
                Payment
              </Link>
              <Link href="/help" onClick={() => setShowDropdown(false)}>
                Help
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Back Button */}
      <Link href="/learn" className="back-button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Learn Hub
      </Link>

      {/* Main Chat Interface */}
      <div className="buddy-container">
        {/* Sessions Sidebar */}
        <div className={`sessions-sidebar ${showSessionsSidebar ? 'open' : ''}`}>
          <div className="sessions-header">
            <h3>Chat History</h3>
            <button 
              className="close-sidebar"
              onClick={() => setShowSessionsSidebar(false)}
            >
              ×
            </button>
          </div>
          
          <button 
            className="new-session-btn"
            onClick={createNewSession}
          >
            + New Conversation
          </button>
          
          <div className="sessions-list">
            {sessions.map(session => (
              <div 
                key={session.id}
                className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                onClick={() => {
                  loadSession(session.id);
                  setShowSessionsSidebar(false);
                }}
              >
                <div className="session-preview">{session.first_message}</div>
                <div className="session-meta">
                  <span className="session-date">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </span>
                  <span className="message-count">{session.message_count} messages</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {/* Chat Header */}
          <div className="chat-header">
            <button 
              className="sessions-toggle"
              onClick={() => setShowSessionsSidebar(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h1>Buddy Chat</h1>
            <div className="chat-actions">
              <button 
                className="ticket-btn"
                onClick={handleCreateTicket}
                disabled={isCreatingTicket}
              >
                {isCreatingTicket ? 'Creating...' : 'Create Support Ticket'}
              </button>
            </div>
          </div>

          {/* Ticket Message */}
          {ticketMessage && (
            <div className={`ticket-message ${ticketMessage.type}`}>
              {ticketMessage.text}
            </div>
          )}

          {/* Messages */}
          <div className="messages-container">
            <div className="messages-wrapper">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <h2>Welcome to Buddy Chat</h2>
                  <p>I'm Bo, your personal statement advisor. I'm here to help you write an excellent personal statement for university applications.</p>
                  <p>Ask me anything about your personal statement, and I'll guide you through the process step by step.</p>
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
                placeholder="Ask Buddy anything about your personal statement..."
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
      </div>
    </div>
  );
}