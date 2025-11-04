'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './competition.css';

interface EvalTool {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: 'available' | 'coming-soon' | 'beta';
  features: string[];
  color: string;
}

const evaluationTools: EvalTool[] = [
  {
    id: 'essay-grader',
    title: 'Essay Grader',
    icon: '📝',
    description: 'AI-powered essay evaluation with detailed feedback',
    status: 'beta',
    features: ['Grammar & Structure', 'Argument Analysis', 'Grading Rubric', 'Improvement Tips'],
    color: '#7C3AED'
  },
  {
    id: 'answer-checker',
    title: 'Answer Checker',
    icon: '✓',
    description: 'Verify your exam answers instantly',
    status: 'available',
    features: ['Instant Feedback', 'Step-by-step Solutions', 'Mark Scheme Alignment', 'Common Mistakes'],
    color: '#00CED1'
  },
  {
    id: 'mock-interview',
    title: 'Mock Interview',
    icon: '🎤',
    description: 'Practice interviews with AI interviewer',
    status: 'coming-soon',
    features: ['Subject-specific Questions', 'Real-time Feedback', 'Confidence Builder', 'Video Recording'],
    color: '#DC2626'
  },
  {
    id: 'study-planner',
    title: 'Study Planner',
    icon: '📅',
    description: 'Personalized study plans based on your goals',
    status: 'available',
    features: ['Custom Schedules', 'Goal Tracking', 'Progress Analytics', 'Adaptive Learning'],
    color: '#059669'
  },
  {
    id: 'weakness-analyzer',
    title: 'Weakness Analyzer',
    icon: '🎯',
    description: 'Identify and target your weak areas',
    status: 'beta',
    features: ['Topic Analysis', 'Performance Tracking', 'Targeted Practice', 'Improvement Metrics'],
    color: '#F59E0B'
  },
  {
    id: 'concept-explainer',
    title: 'Concept Explainer',
    icon: '💡',
    description: 'Break down complex topics into simple terms',
    status: 'available',
    features: ['Visual Explanations', 'Examples & Analogies', 'Multi-level Depth', 'Interactive Q&A'],
    color: '#8B5CF6'
  },
  {
    id: 'exam-predictor',
    title: 'Exam Predictor',
    icon: '🔮',
    description: 'AI predicts likely exam topics and questions',
    status: 'coming-soon',
    features: ['Pattern Recognition', 'Topic Probability', 'Question Trends', 'Smart Preparation'],
    color: '#EC4899'
  },
  {
    id: 'peer-comparison',
    title: 'Peer Comparison',
    icon: '📊',
    description: 'Compare your performance anonymously',
    status: 'coming-soon',
    features: ['Anonymous Benchmarking', 'Percentile Ranking', 'Subject Comparison', 'Growth Tracking'],
    color: '#3B82F6'
  }
];

export default function ArenaPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'beta' | 'coming-soon'>('all');

  const filteredTools = evaluationTools.filter(tool =>
    filter === 'all' ? true : tool.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <span className="status-badge available">Available</span>;
      case 'beta':
        return <span className="status-badge beta">Beta</span>;
      case 'coming-soon':
        return <span className="status-badge coming-soon">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="arena-page-background">
      <Navbar />

      <div className="arena-main-content">
        {/* Back Button */}
        <Link href="/" className="arena-back-button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Header Section */}
        <div className="arena-header">
          <div className="arena-title-section">
            <div className="arena-icon-large">
              <Image
                src="/icons/arena.svg"
                alt="ARENA"
                width={120}
                height={120}
                className="arena-icon-img"
              />
            </div>
            <div className="arena-title-text">
              <h1 className="arena-main-title">AI BUDDY ARENA</h1>
              <p className="arena-subtitle">Choose your evaluation tool and level up your learning</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="arena-filter-section">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tools
            </button>
            <button
              className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Available
            </button>
            <button
              className={`filter-btn ${filter === 'beta' ? 'active' : ''}`}
              onClick={() => setFilter('beta')}
            >
              Beta
            </button>
            <button
              className={`filter-btn ${filter === 'coming-soon' ? 'active' : ''}`}
              onClick={() => setFilter('coming-soon')}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="tools-grid">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className={`tool-card ${selectedTool === tool.id ? 'selected' : ''} ${tool.status !== 'available' ? 'disabled' : ''}`}
              onClick={() => tool.status === 'available' && setSelectedTool(tool.id)}
              style={{ borderColor: tool.color }}
            >
              <div className="tool-card-header">
                <div className="tool-icon" style={{ backgroundColor: `${tool.color}15` }}>
                  <span style={{ fontSize: '48px' }}>{tool.icon}</span>
                </div>
                {getStatusBadge(tool.status)}
              </div>

              <h3 className="tool-title" style={{ color: tool.color }}>{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>

              <div className="tool-features">
                {tool.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke={tool.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {tool.status === 'available' && (
                <button
                  className="tool-action-btn"
                  style={{
                    backgroundColor: tool.color,
                    borderColor: tool.color
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle tool launch
                    alert(`Launching ${tool.title}... (To be implemented)`);
                  }}
                >
                  Launch Tool
                </button>
              )}

              {tool.status === 'beta' && (
                <button
                  className="tool-action-btn beta-btn"
                  style={{
                    backgroundColor: `${tool.color}20`,
                    borderColor: tool.color,
                    color: tool.color
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`${tool.title} is in beta. Join waitlist?`);
                  }}
                >
                  Join Beta
                </button>
              )}

              {tool.status === 'coming-soon' && (
                <button
                  className="tool-action-btn disabled-btn"
                  disabled
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="arena-info-section">
          <div className="info-card">
            <h3>🚀 How It Works</h3>
            <ol>
              <li>Choose an evaluation tool that matches your needs</li>
              <li>Upload your work or start a new session</li>
              <li>Get instant AI-powered feedback and insights</li>
              <li>Track your progress and improve over time</li>
            </ol>
          </div>

          <div className="info-card">
            <h3>⭐ Pro Tips</h3>
            <ul>
              <li>Use multiple tools together for comprehensive evaluation</li>
              <li>Review feedback regularly to identify patterns</li>
              <li>Set specific goals before each evaluation session</li>
              <li>Track your improvements across different topics</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>📈 Your Progress</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Evaluations</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Hours Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0%</div>
                <div className="stat-label">Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
