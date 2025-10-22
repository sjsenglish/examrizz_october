'use client';

import React, { useState } from 'react';
import { use } from 'react';
import './class-view.css';

interface Assignment {
  id: string;
  title: string;
  assignedDate: string;
  questions: number;
  marks: number;
  dueDate: string;
  progress: {
    completed: number;
    total: number;
  };
  classAverage: {
    score: number;
    percentage: number;
  };
  completionTime: {
    average: string;
  };
  studentsNeedingSupport: {
    count: number;
    students: Array<{
      name: string;
      issue: string;
      details?: string;
    }>;
  };
  topPerformers?: Array<{
    name: string;
    score: string;
    time: string;
  }>;
}

// Mock data for demonstration
const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'CALCULUS BASICS HOMEWORK',
    assignedDate: '3 days ago',
    questions: 28,
    marks: 50,
    dueDate: 'tomorrow',
    progress: {
      completed: 15,
      total: 28
    },
    classAverage: {
      score: 38,
      percentage: 76
    },
    completionTime: {
      average: 'Avg 42mins'
    },
    studentsNeedingSupport: {
      count: 3,
      students: [
        { name: 'Sarah M', issue: 'Flagged 5 questions' },
        { name: 'Alex K', issue: 'Not started' },
        { name: 'Jamie L', issue: 'Score 24/50' }
      ]
    }
  },
  {
    id: '2',
    title: 'CALCULUS BASICS HOMEWORK',
    assignedDate: '1 week ago',
    questions: 20,
    marks: 40,
    dueDate: 'Friday',
    progress: {
      completed: 28,
      total: 28
    },
    classAverage: {
      score: 38,
      percentage: 76
    },
    completionTime: {
      average: 'Avg 42mins'
    },
    studentsNeedingSupport: {
      count: 0,
      students: []
    },
    topPerformers: [
      { name: 'Sarah M', score: '40/40', time: 'in 28 mins' },
      { name: 'Alex K', score: '39/40', time: 'in 31 mins' },
      { name: 'Jamie L', score: '38/40', time: 'in 29 mins' }
    ]
  }
];

const tabs = [
  { id: 'active', label: 'Active Assignments' },
  { id: 'students', label: 'All Students' },
  { id: 'completed', label: 'Completed' },
  { id: 'stats', label: 'Class Stats' }
];

interface Student {
  id: string;
  name: string;
  active: number;
  completed: number;
  avgScore: number;
  status: 'excellent' | 'good' | 'needs-support' | 'at-risk';
}

const mockStudents: Student[] = [
  { id: '1', name: 'Sarah M.', active: 2, completed: 1, avgScore: 92, status: 'excellent' },
  { id: '2', name: 'Sarah M.', active: 3, completed: 0, avgScore: 68, status: 'good' },
  { id: '3', name: 'Sarah M.', active: 2, completed: 1, avgScore: 45, status: 'at-risk' },
  { id: '4', name: 'Sarah M.', active: 1, completed: 1, avgScore: 85, status: 'excellent' },
  { id: '5', name: 'Sarah M.', active: 2, completed: 0, avgScore: 64, status: 'needs-support' },
  { id: '6', name: 'Sarah M.', active: 3, completed: 1, avgScore: 85, status: 'excellent' },
  { id: '7', name: 'Sarah M.', active: 2, completed: 0, avgScore: 58, status: 'needs-support' },
];

export default function ClassViewPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Mock class data
  const classData = {
    name: 'Year 12 Maths Set 1',
    studentCount: 28,
    activeAssignments: 3
  };

  const renderAllStudents = () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'excellent':
          return '#A7EFCF'; // Green
        case 'good':
          return '#A7EFCF'; // Green for good too
        case 'needs-support':
          return '#E5FF00'; // Yellow
        case 'at-risk':
          return '#FF4D6A'; // Red
        default:
          return '#E5E5E5';
      }
    };

    const filteredStudents = mockStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedStudents = [...filteredStudents].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.avgScore - a.avgScore;
        case 'active':
          return b.active - a.active;
        default:
          return 0;
      }
    });

    return (
      <div className="students-container">
          <div className="students-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && filteredStudents.length > 0 && (
              <div className="search-dropdown">
                {filteredStudents.slice(0, 5).map((student) => (
                  <div 
                    key={student.id} 
                    className="search-dropdown-item"
                    onClick={() => setSearchQuery(student.name)}
                  >
                    <span className="checkmark">✓</span>
                    {student.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="score">Score</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="table-header-wrapper">
          <div className="table-header">
            <div className="header-cell">Student Name</div>
            <div className="header-cell">Active</div>
            <div className="header-cell">Completed</div>
            <div className="header-cell">Avg Score</div>
            <div className="header-cell">Status</div>
          </div>
        </div>
        
        <div className="students-table-wrapper">
          <div className="table-data-wrapper">
            <table className="students-table">
              <tbody>
                {sortedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.active}</td>
                    <td>{student.completed}</td>
                    <td>{student.avgScore}%</td>
                    <td>
                      <div 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(student.status) }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveAssignments = () => (
    <div className="assignments-container">
      {mockAssignments.map((assignment) => (
        <div key={assignment.id} className="assignment-card">
          <div className="assignment-inner-card">
          <div className="assignment-header-section">
            <div className="assignment-header">
              <h3 className="assignment-title" style={{
                fontFamily: "'Madimi One', sans-serif"
              }}>{assignment.title}</h3>
              <span className="assignment-due">Due {assignment.dueDate}</span>
            </div>
            
            <div className="assignment-meta">
              <span>Assigned {assignment.assignedDate}</span>
              <span>•</span>
              <span>{assignment.questions} questions</span>
              <span>•</span>
              <span>{assignment.marks} marks</span>
            </div>
          </div>

          <div className="assignment-details">
            <div className="detail-column">
              <div className="detail-box progress-box">
                <div className="detail-header">
                  <span className="detail-label-bold">Progress:</span>
                  <span className="detail-value-normal">
                    {assignment.progress.completed}/{assignment.progress.total} completed ({Math.round((assignment.progress.completed / assignment.progress.total) * 100)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(assignment.progress.completed / assignment.progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="detail-box">
                <div className="detail-row">
                  <span className="detail-label-bold">Class Average:</span>
                  <span className="detail-value-normal">{assignment.classAverage.score}/{assignment.marks} ({assignment.classAverage.percentage}%)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-bold">Completion Time:</span>
                  <span className="detail-value-normal">{assignment.completionTime.average}</span>
                </div>
              </div>
            </div>

            <div className="detail-column">
              <div className="detail-box">
                {assignment.studentsNeedingSupport.count > 0 ? (
                  <>
                    <div className="detail-header">
                      <span className="detail-label-bold">Students needing support ({assignment.studentsNeedingSupport.count}):</span>
                    </div>
                    <ul className="support-list">
                      {assignment.studentsNeedingSupport.students.map((student, index) => (
                        <li key={index}>
                          <span className="student-name-normal">{student.name}</span>
                          <span>-</span>
                          <span className="student-issue">{student.issue}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="detail-header">
                      <span className="detail-label-bold">Top performers ({assignment.topPerformers?.length || 0}):</span>
                    </div>
                    {assignment.topPerformers && (
                      <ul className="support-list">
                        {assignment.topPerformers.map((student, index) => (
                          <li key={index}>
                            <span className="student-name-normal">{student.name}</span>
                            <span>-</span>
                            <span className="student-issue">{student.score} {student.time}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="assignment-actions">
            <button className="action-link">View Full Results →</button>
            <button className="action-link">Send Reminder →</button>
            <button className="action-link">Extend Deadline →</button>
          </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClassStats = () => {
    return (
      <div className="class-stats-container">
        {/* Overall Class Performance */}
        <div className="stats-section performance-section">
          <div className="stats-section-header">
            <h3 className="stats-section-title">OVERALL CLASS PERFORMANCE</h3>
          </div>
          <div className="performance-stats">
            <div className="stat-box">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">78%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Completion Rate</div>
              <div className="stat-value">73%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Average Time</div>
              <div className="stat-value">2h 15m/week</div>
            </div>
          </div>
        </div>

        {/* Topics Needing Attention */}
        <div className="stats-section">
          <div className="stats-section-header-simple">
            <h3 className="stats-section-title-simple">TOPICS NEEDING ATTENTION</h3>
          </div>
          <div className="topics-list">
            <div className="topic-item">
              <span className="bullet">•</span>
              <span className="topic-text">Integration (avg 62% - 12 students struggling)</span>
            </div>
            <div className="topic-item">
              <span className="bullet">•</span>
              <span className="topic-text">Differentiation (avg 68% - 8 students struggling)</span>
            </div>
          </div>
        </div>

        {/* Strongest Topics */}
        <div className="stats-section">
          <div className="stats-section-header-simple">
            <h3 className="stats-section-title-simple">STRONGEST TOPICS</h3>
          </div>
          <div className="topics-list">
            <div className="topic-item">
              <span className="bullet">•</span>
              <span className="topic-text">Basic Algebra (avg 91%)</span>
            </div>
            <div className="topic-item">
              <span className="bullet">•</span>
              <span className="topic-text">Graph Sketching (avg 87%)</span>
            </div>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="stats-section">
          <div className="stats-section-header-simple">
            <h3 className="stats-section-title-simple">STUDENT DISTRIBUTION</h3>
          </div>
          <div className="distribution-content">
            <div className="distribution-stats">
              <div className="distribution-item high-performers">
                <span className="distribution-label">High Performers (80%+)</span>
                <span className="distribution-count">12 students (43%)</span>
              </div>
              <div className="distribution-item on-track">
                <span className="distribution-label">On Track (60-79%)</span>
                <span className="distribution-count">11 students (39%)</span>
              </div>
              <div className="distribution-item needs-support">
                <span className="distribution-label">Needs support (&lt;60%)</span>
                <span className="distribution-count">5 students (18%)</span>
              </div>
            </div>
            <div className="pie-chart">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#E5E5E5"
                  strokeWidth="25"
                />
                {/* High Performers - 43% */}
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#A7EFCF"
                  strokeWidth="25"
                  strokeDasharray="175 408"
                  strokeDashoffset="0"
                  transform="rotate(-90 80 80)"
                />
                {/* On Track - 39% */}
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#B3F0F2"
                  strokeWidth="25"
                  strokeDasharray="159 408"
                  strokeDashoffset="-175"
                  transform="rotate(-90 80 80)"
                />
                {/* Needs Support - 18% */}
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  fill="none"
                  stroke="#FFB3BA"
                  strokeWidth="25"
                  strokeDasharray="73 408"
                  strokeDashoffset="-334"
                  transform="rotate(-90 80 80)"
                />
                {/* Labels */}
                <text x="110" y="50" className="chart-label" fontSize="12" fill="#000">HP</text>
                <text x="105" y="62" className="chart-label" fontSize="10" fill="#666">(80%+)</text>
                <text x="115" y="95" className="chart-label" fontSize="12" fill="#000">OT</text>
                <text x="110" y="107" className="chart-label" fontSize="10" fill="#666">(60-79%)</text>
                <text x="45" y="125" className="chart-label" fontSize="12" fill="#000">Support</text>
                <text x="50" y="137" className="chart-label" fontSize="10" fill="#666">(&lt;60%)</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="stats-section">
          <div className="stats-section-header-simple">
            <h3 className="stats-section-title-simple">ENGAGEMENT</h3>
          </div>
          <div className="engagement-content">
            <div className="engagement-item">
              <span className="engagement-label">Active this week</span>
              <div className="engagement-value">
                <span className="engagement-dot"></span>
                <span className="engagement-text">24 students (86%)</span>
              </div>
            </div>
            <div className="engagement-item">
              <span className="engagement-label">Avg questions per student</span>
              <span className="engagement-number">30</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return renderActiveAssignments();
      case 'students':
        return renderAllStudents();
      case 'completed':
        return <div className="tab-content">Completed assignments content coming soon...</div>;
      case 'stats':
        return renderClassStats();
      default:
        return null;
    }
  };

  return (
    <div className="class-view-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          examrizzsearch
        </a>
        <button className="navbar-menu">
          <div className="navbar-menu-line"></div>
          <div className="navbar-menu-line"></div>
          <div className="navbar-menu-line"></div>
        </button>
      </nav>
      {/* Header */}
      <div className="class-header-wrapper">
      <div className="class-header">
        <div className="class-info">
          <h1 className="class-title" style={{
            fontFamily: "'Madimi One', sans-serif"
          }}>{classData.name}</h1>
          <div className="class-meta">
            <span>{classData.studentCount} students</span>
            <span>•</span>
            <span>{classData.activeAssignments} active assignments</span>
          </div>
        </div>
        <button className="analytics-button" style={{
          fontFamily: "'Madimi One', sans-serif"
        }}>REQUEST DETAILED ANALYTICS</button>
      </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation-wrapper">
      <div className="tab-navigation">
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

      {/* Tab Content */}
      <div className="tab-content-container">
        {renderTabContent()}
      </div>
    </div>
  );
}