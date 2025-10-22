'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { getCurrentUser, ensureTeacherProfile } from '../../../lib/supabase.ts';
import { getPackAssignmentHistory } from '../../../lib/teacherAssignments';

interface AssignmentHistoryPageProps {
  params: Promise<{ packId: string }>;
}

export default function AssignmentHistoryPage({ params }: AssignmentHistoryPageProps) {
  const resolvedParams = use(params);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [packName, setPackName] = useState('');

  useEffect(() => {
    async function loadAssignmentHistory() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          console.error('No authenticated user');
          setLoading(false);
          return;
        }

        // Ensure user has teacher profile
        const userProfile = await ensureTeacherProfile(currentUser.id, currentUser.email || '');
        if (!userProfile) {
          console.error('Failed to create or get teacher profile');
          setLoading(false);
          return;
        }

        const history = await getPackAssignmentHistory(resolvedParams.packId, currentUser.id);
        setAssignments(history);
        
        if (history.length > 0) {
          setPackName(history[0].pack.name);
        }
      } catch (error) {
        console.error('Error loading assignment history:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAssignmentHistory();
  }, [resolvedParams.packId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (assignment: any) => {
    if (assignment.status === 'completed') return '#A7EFCF';
    if (assignment.due_date && new Date(assignment.due_date) < new Date()) return '#FF4D6A';
    return '#E5FF00';
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: "'Madimi One', sans-serif",
          fontSize: '18px',
          color: '#000000'
        }}>
          Loading assignment history...
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#F8F8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '24px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
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
      </nav>

      {/* Content */}
      <div style={{ paddingTop: '60px' }}>
        {/* Header */}
        <div style={{
          padding: '40px 60px 30px',
          borderBottom: '1px solid #E5E5E5'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <Link href="/teacher" style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: '#0066CC',
              textDecoration: 'none'
            }}>
              ← Back to Teacher Dashboard
            </Link>
          </div>
          
          <h1 style={{
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: '0 0 8px 0'
          }}>
            Assignment History
          </h1>
          
          <h2 style={{
            fontFamily: "'Figtree', sans-serif",
            fontSize: '20px',
            fontWeight: '600',
            color: '#666666',
            margin: '0'
          }}>
            {packName || 'Question Pack'}
          </h2>
        </div>

        {/* Assignment List */}
        <div style={{ padding: '40px 60px' }}>
          {assignments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666666',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '18px'
            }}>
              No assignments found for this question pack.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px',
              maxWidth: '1200px'
            }}>
              {assignments.map((assignment) => (
                <div key={assignment.id} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '8px',
                  padding: '24px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '24px',
                    alignItems: 'start'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <h3 style={{
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#000000',
                          margin: '0'
                        }}>
                          {assignment.student_name ? 
                            `Assigned to ${assignment.student_name}` : 
                            assignment.class_name ? 
                            `Assigned to ${assignment.class_name}` : 
                            'Individual Assignment'
                          }
                        </h3>
                        
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(assignment)
                        }} />
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        color: '#666666'
                      }}>
                        <div>
                          <strong>Assigned:</strong> {formatDate(assignment.assigned_at)}
                        </div>
                        
                        {assignment.due_date && (
                          <div>
                            <strong>Due:</strong> {formatDate(assignment.due_date)}
                          </div>
                        )}
                        
                        <div>
                          <strong>Status:</strong> {assignment.status}
                        </div>
                        
                        <div>
                          <strong>Attempts:</strong> {assignment.attempts.length}
                        </div>
                        
                        {assignment.attempts.length > 0 && (
                          <div>
                            <strong>Avg Score:</strong> {
                              Math.round(
                                assignment.attempts
                                  .filter((a: any) => a.score !== null)
                                  .reduce((sum: number, a: any) => sum + (a.score || 0), 0) / 
                                assignment.attempts.filter((a: any) => a.score !== null).length
                              ) || 0
                            }%
                          </div>
                        )}
                      </div>

                      {assignment.instructions && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: '#F8F9FA',
                          borderRadius: '4px',
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '14px',
                          color: '#333333'
                        }}>
                          <strong>Instructions:</strong> {assignment.instructions}
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <button style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 16px',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                      
                      {assignment.status === 'active' && (
                        <button style={{
                          backgroundColor: '#FF9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          fontFamily: "'Figtree', sans-serif",
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          Send Reminder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}