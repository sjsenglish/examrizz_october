'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase-client';
import './ProgressDashboard.css';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Chapter titles mapping (same as maths-demo page)
const chapterTitles: { [key: number]: string } = {
  1: 'Proof',
  2: 'Algebra and Functions',
  3: 'Coordinate Geometry',
  4: 'Binomial Expansion',
  5: 'Trigonometry',
  6: 'Exponentials and Logarithms',
  7: 'Differentiation',
  8: 'Integration',
  10: 'Vectors'
};

// Spec points by chapter for progress calculation
const specPointsByChapter: { [key: number]: string[] } = {
  1: ['1.1'],
  2: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.9'],
  3: ['3.1', '3.2'],
  4: ['4.1'],
  5: ['5.1', '5.3', '5.5', '5.7'],
  6: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7'],
  7: ['7.1', '7.2', '7.3'],
  8: ['8.1', '8.2', '8.3'],
  10: ['10.1-10.5']
};

interface ProgressStats {
  lessonsCompleted: number;
  totalLessons: number;
  hoursWatched: number;
  totalHours: number;
  questionsCorrect: number;
  totalQuestions: number;
  chapterProgress: { [key: number]: number };
  recentActivity: Array<{
    type: 'lesson' | 'question';
    title: string;
    time: string;
  }>;
}

export default function ProgressDashboard({ isOpen, onClose }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats>({
    lessonsCompleted: 0,
    totalLessons: 89,
    hoursWatched: 0,
    totalHours: 92.83,
    questionsCorrect: 0,
    totalQuestions: 0,
    chapterProgress: {},
    recentActivity: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchProgressData();
    }
  }, [isOpen]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all lessons to get total count and lesson durations
      const { data: allLessons, error: lessonsError } = await supabase
        .from('learn_lessons')
        .select(`
          id,
          duration_minutes,
          learn_spec_points!inner(code)
        `);

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        setLoading(false);
        return;
      }

      const totalLessons = allLessons?.length || 89;

      // Fetch user progress (video watched)
      const { data: progressData, error: progressError } = await supabase
        .from('learn_user_progress')
        .select('lesson_id, video_watched, created_at')
        .eq('user_id', user.id)
        .eq('video_watched', true)
        .order('created_at', { ascending: false });

      if (progressError) {
        console.error('Error fetching progress:', progressError);
      }

      const lessonsCompleted = progressData?.length || 0;

      // Calculate hours watched based on lesson durations
      let hoursWatched = 0;
      if (progressData && allLessons) {
        const completedLessonIds = new Set(progressData.map(p => p.lesson_id));
        hoursWatched = allLessons
          .filter(lesson => completedLessonIds.has(lesson.id))
          .reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0) / 60;
      }

      // Fetch all question parts to get total count
      const { data: allQuestionParts, error: partsError } = await supabase
        .from('learn_question_parts')
        .select('id');

      if (partsError) {
        console.error('Error fetching question parts:', partsError);
      }

      const totalQuestions = allQuestionParts?.length || 0;

      // Fetch correct answers count
      const { data: correctAnswers, error: answersError } = await supabase
        .from('learn_user_answers')
        .select('question_part_id')
        .eq('user_id', user.id)
        .eq('is_correct', true);

      if (answersError) {
        console.error('Error fetching answers:', answersError);
      }

      // Count unique correct question parts
      const uniqueCorrect = new Set(correctAnswers?.map(a => a.question_part_id) || []);
      const questionsCorrect = uniqueCorrect.size;

      // Calculate chapter progress
      const chapterProgress: { [key: number]: number } = {};

      for (const [chapterNum, specCodes] of Object.entries(specPointsByChapter)) {
        const chapterNumber = parseInt(chapterNum);

        // Get all lessons for this chapter's spec points
        const chapterLessons = allLessons?.filter(lesson =>
          specCodes.includes(lesson.learn_spec_points?.code || '')
        ) || [];

        const totalChapterLessons = chapterLessons.length;

        if (totalChapterLessons === 0) {
          chapterProgress[chapterNumber] = 0;
          continue;
        }

        // Count completed lessons for this chapter
        const completedChapterLessons = chapterLessons.filter(lesson =>
          progressData?.some(p => p.lesson_id === lesson.id)
        ).length;

        chapterProgress[chapterNumber] = Math.round((completedChapterLessons / totalChapterLessons) * 100);
      }

      // Get recent activity (last 5 completed lessons)
      const recentActivity: Array<{
        type: 'lesson' | 'question';
        title: string;
        time: string;
      }> = [];

      if (progressData && progressData.length > 0) {
        const recentLessons = progressData.slice(0, 5);

        for (const progress of recentLessons) {
          const lesson = allLessons?.find(l => l.id === progress.lesson_id);
          if (lesson) {
            const specCode = lesson.learn_spec_points?.code || '';
            const timeAgo = getTimeAgo(new Date(progress.created_at));
            recentActivity.push({
              type: 'lesson',
              title: `Completed ${specCode} lesson`,
              time: timeAgo
            });
          }
        }
      }

      setStats({
        lessonsCompleted,
        totalLessons,
        hoursWatched: Math.round(hoursWatched * 10) / 10,
        totalHours: 92.83,
        questionsCorrect,
        totalQuestions,
        chapterProgress,
        recentActivity
      });
    } catch (error) {
      console.error('Error in fetchProgressData:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  const overallProgress = stats.totalLessons > 0
    ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)
    : 0;

  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.questionsCorrect / stats.totalQuestions) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="dashboard-overlay" onClick={onClose} />

      {/* Dashboard Modal */}
      <div className="dashboard-modal">
        {/* Close button */}
        <button className="dashboard-close" onClick={onClose}>
          ×
        </button>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Your Progress Dashboard</h2>
          <p className="dashboard-subtitle">Track your learning journey across all chapters</p>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              fontSize: '16px',
              color: '#666'
            }}>
              Loading your progress...
            </div>
          ) : (
            <>
              {/* Top Stats Row - 3 cards */}
              <div className="top-stats-row">
                {/* Lessons Completed */}
                <div className="top-stat-card">
                  <div className="top-stat-header">
                    <div className="top-stat-icon">
                      <Image
                        src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%202376.svg?alt=media&token=96940cfc-fd51-4c0c-a40b-eca32f113b46"
                        alt="Lessons"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="top-stat-label">Lessons Completed</div>
                  </div>
                  <div className="top-stat-value">{stats.lessonsCompleted} / {stats.totalLessons}</div>
                  <div className="top-stat-percent">{overallProgress}%</div>
                </div>

                {/* Hours Watched */}
                <div className="top-stat-card">
                  <div className="top-stat-header">
                    <div className="top-stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="top-stat-label">Hours Watched</div>
                  </div>
                  <div className="top-stat-value">{stats.hoursWatched} / {stats.totalHours}</div>
                  <div className="top-stat-percent">
                    {Math.round((stats.hoursWatched / stats.totalHours) * 100)}%
                  </div>
                </div>

                {/* Questions Correct */}
                <div className="top-stat-card">
                  <div className="top-stat-header">
                    <div className="top-stat-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11L12 14L22 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="top-stat-label">Questions Correct</div>
                  </div>
                  <div className="top-stat-value">{stats.questionsCorrect} / {stats.totalQuestions}</div>
                  <div className="top-stat-percent">{accuracy}%</div>
                </div>
              </div>

              {/* Bottom Section - 2 columns */}
              <div className="bottom-section">
                {/* Left Column - Overall Progress + Recent Activity */}
                <div className="bottom-left-column">
                  {/* Overall Progress Card */}
                  <div className="overall-progress-card">
                    <h3 className="card-title">Overall Course Progress</h3>
                    <div className="overall-progress-content">
                      <div className="overall-progress-circle">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          {/* Background circle */}
                          <circle
                            cx="70"
                            cy="70"
                            r="60"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="12"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="70"
                            cy="70"
                            r="60"
                            fill="none"
                            stroke="#B3F0F2"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(overallProgress / 100) * 377} 377`}
                            transform="rotate(-90 70 70)"
                          />
                          {/* Center text */}
                          <text
                            x="70"
                            y="70"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="32"
                            fontWeight="700"
                            fill="#000000"
                            fontFamily="Figtree, sans-serif"
                          >
                            {overallProgress}%
                          </text>
                        </svg>
                      </div>
                      <div className="overall-progress-stats">
                        <div className="overall-stat-item">
                          <span className="overall-stat-label">Lessons:</span>
                          <span className="overall-stat-value">{stats.lessonsCompleted}/{stats.totalLessons}</span>
                        </div>
                        <div className="overall-stat-item">
                          <span className="overall-stat-label">Hours:</span>
                          <span className="overall-stat-value">{stats.hoursWatched}/{stats.totalHours}</span>
                        </div>
                        <div className="overall-stat-item">
                          <span className="overall-stat-label">Accuracy:</span>
                          <span className="overall-stat-value">{accuracy}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Card */}
                  <div className="recent-activity-card">
                    <h3 className="card-title">Recent Activity</h3>
                    {stats.recentActivity.length === 0 ? (
                      <div className="no-activity">
                        <p>No recent activity yet. Start learning to see your progress here!</p>
                      </div>
                    ) : (
                      <div className="activity-list-compact">
                        {stats.recentActivity.map((activity, index) => (
                          <div key={index} className="activity-item-compact">
                            <div className="activity-dot-compact" />
                            <div className="activity-details-compact">
                              <div className="activity-title-compact">{activity.title}</div>
                              <div className="activity-time-compact">{activity.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Chapter Progress */}
                <div className="bottom-right-column">
                  <div className="chapter-progress-card">
                    <h3 className="card-title">Progress by Chapter</h3>
                    <div className="chapter-list-new">
                      {Object.entries(chapterTitles).map(([chapterNum, title]) => {
                        const chapter = parseInt(chapterNum);
                        const progress = stats.chapterProgress[chapter] || 0;
                        const isOddChapter = chapter % 2 === 1;
                        const color = isOddChapter ? '#7C3AED' : '#3B82F6';

                        return (
                          <div key={chapter} className="chapter-item-new">
                            <div className="chapter-header-new">
                              <span className="chapter-name-new">
                                Ch {chapter}: {title}
                              </span>
                              <span className="chapter-percent-new">{progress}%</span>
                            </div>
                            <div className="chapter-bar-new">
                              <div
                                className="chapter-fill-new"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: color
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
