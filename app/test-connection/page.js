'use client';

import React, { useState } from 'react';
import { signUp, signIn, signOut, getCurrentUser, getUserProfile } from '../../lib/supabaseAuth';
import { 
  createQuestionPack, 
  getUserQuestionPacks, 
  getQuestionPack, 
  updateQuestionPack, 
  deleteQuestionPack 
} from '../../services/supabaseQuestionPackService';

export default function TestConnectionPage() {
  const [output, setOutput] = useState('');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [currentUser, setCurrentUser] = useState(null);

  const logOutput = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
    setOutput(prev => prev + logMessage + '\n\n');
  };

  const clearOutput = () => setOutput('');

  // Authentication Tests
  const testSignUp = async () => {
    logOutput('Testing signUp...');
    const result = await signUp(email, password, 'student');
    logOutput('SignUp Result:', result);
  };

  const testSignIn = async () => {
    logOutput('Testing signIn...');
    const result = await signIn(email, password);
    logOutput('SignIn Result:', result);
    if (result.success) {
      setCurrentUser(result.user);
    }
  };

  const testSignOut = async () => {
    logOutput('Testing signOut...');
    const result = await signOut();
    logOutput('SignOut Result:', result);
    if (result.success) {
      setCurrentUser(null);
    }
  };

  const testGetCurrentUser = async () => {
    logOutput('Testing getCurrentUser...');
    const result = await getCurrentUser();
    logOutput('Current User Result:', result);
    if (result.success) {
      setCurrentUser(result.user);
    }
  };

  const testGetUserProfile = async () => {
    if (!currentUser) {
      logOutput('No current user to test profile with');
      return;
    }
    logOutput('Testing getUserProfile...');
    const result = await getUserProfile(currentUser.id);
    logOutput('User Profile Result:', result);
  };

  // Question Pack Tests
  const testCreateQuestionPack = async () => {
    if (!currentUser) {
      logOutput('No current user to create pack with');
      return;
    }

    logOutput('Testing createQuestionPack...');
    const packData = {
      packName: 'Test TSA Pack',
      subject: 'tsa',
      question_ids: ['q1', 'q2', 'q3'],
      totalQuestions: 3,
      is_public: false,
      tags: ['practice', 'test'],
      styling: {
        fontSize: 12,
        includeAnswers: true,
        separateAnswerSheet: false,
        showDate: true
      }
    };

    const result = await createQuestionPack(currentUser.id, packData);
    logOutput('Create Question Pack Result:', result);
  };

  const testGetUserQuestionPacks = async () => {
    if (!currentUser) {
      logOutput('No current user to get packs for');
      return;
    }

    logOutput('Testing getUserQuestionPacks...');
    const result = await getUserQuestionPacks(currentUser.id);
    logOutput('Get User Question Packs Result:', result);
  };

  const testGetQuestionPack = async () => {
    logOutput('Testing getQuestionPack...');
    // You'll need to replace this with an actual pack ID
    const result = await getQuestionPack('test-pack-id');
    logOutput('Get Question Pack Result:', result);
  };

  const testUpdateQuestionPack = async () => {
    logOutput('Testing updateQuestionPack...');
    const updates = {
      pack_name: 'Updated Test Pack',
      is_public: true
    };
    // You'll need to replace this with an actual pack ID
    const result = await updateQuestionPack('test-pack-id', updates);
    logOutput('Update Question Pack Result:', result);
  };

  const testDeleteQuestionPack = async () => {
    logOutput('Testing deleteQuestionPack...');
    // You'll need to replace this with an actual pack ID
    const result = await deleteQuestionPack('test-pack-id');
    logOutput('Delete Question Pack Result:', result);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User: {currentUser ? currentUser.email : 'None'}</h3>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Credentials:</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Authentication Tests:</h3>
        <button onClick={testSignUp} style={{ margin: '5px', padding: '10px' }}>
          Test Sign Up
        </button>
        <button onClick={testSignIn} style={{ margin: '5px', padding: '10px' }}>
          Test Sign In
        </button>
        <button onClick={testSignOut} style={{ margin: '5px', padding: '10px' }}>
          Test Sign Out
        </button>
        <button onClick={testGetCurrentUser} style={{ margin: '5px', padding: '10px' }}>
          Test Get Current User
        </button>
        <button onClick={testGetUserProfile} style={{ margin: '5px', padding: '10px' }}>
          Test Get User Profile
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Question Pack Tests:</h3>
        <button onClick={testCreateQuestionPack} style={{ margin: '5px', padding: '10px' }}>
          Test Create Question Pack
        </button>
        <button onClick={testGetUserQuestionPacks} style={{ margin: '5px', padding: '10px' }}>
          Test Get User Question Packs
        </button>
        <button onClick={testGetQuestionPack} style={{ margin: '5px', padding: '10px' }}>
          Test Get Question Pack
        </button>
        <button onClick={testUpdateQuestionPack} style={{ margin: '5px', padding: '10px' }}>
          Test Update Question Pack
        </button>
        <button onClick={testDeleteQuestionPack} style={{ margin: '5px', padding: '10px' }}>
          Test Delete Question Pack
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={clearOutput} style={{ padding: '10px', backgroundColor: '#ff6b6b', color: 'white' }}>
          Clear Output
        </button>
      </div>

      <div>
        <h3>Output:</h3>
        <textarea 
          value={output}
          readOnly
          style={{ 
            width: '100%', 
            height: '400px', 
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '10px',
            border: '1px solid #ccc'
          }}
        />
      </div>
    </div>
  );
}