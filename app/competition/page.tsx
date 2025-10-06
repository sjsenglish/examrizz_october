'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CompetitionPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '30px 60px',
        backgroundColor: '#FFFFFF'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '32px',
            fontWeight: '400',
            color: '#000000',
            margin: '0',
            cursor: 'pointer'
          }}>
            examrizzsearch
          </h1>
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ 
        padding: '0 60px 60px',
        display: 'flex',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        
        {/* Left Side - Arena Illustration */}
        <div style={{
          flex: '0 0 300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{
            width: '250px',
            height: '250px',
            backgroundColor: '#F0F0F0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #000000',
            fontSize: '18px',
            fontFamily: "'Figtree', sans-serif",
            color: '#666666'
          }}>
            Arena Illustration
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div style={{ flex: 1 }}>
          
          {/* BATTLE ZONE Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h1 style={{
              fontFamily: "'Madimi One', cursive",
              fontSize: '48px',
              fontWeight: '400',
              color: '#000000',
              margin: '0',
              letterSpacing: '0.05em'
            }}>
              BATTLE ZONE
            </h1>
          </div>

          {/* Select Battle Mode Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '24px',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Select Battle Mode
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Solo Mode */}
              <div style={{
                backgroundColor: '#B3F0F2',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #000000',
                transition: 'transform 0.2s'
              }}>
                <h3 style={{
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Solo Mode
                </h3>
              </div>

              {/* Duo Friends */}
              <div style={{
                backgroundColor: '#D4D0FF',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #000000',
                transition: 'transform 0.2s'
              }}>
                <h3 style={{
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Duo Friends
                </h3>
              </div>

              {/* Duo Random */}
              <div style={{
                backgroundColor: '#FFE4B5',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #000000',
                transition: 'transform 0.2s'
              }}>
                <h3 style={{
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Duo Random
                </h3>
              </div>

              {/* Your Stats */}
              <div style={{
                backgroundColor: '#FFB6C1',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #000000',
                transition: 'transform 0.2s'
              }}>
                <h3 style={{
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Your Stats
                </h3>
              </div>
            </div>
          </div>

          {/* Weekly Challenge */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <button style={{
              backgroundColor: '#90EE90',
              border: '3px solid #000000',
              borderRadius: '15px',
              padding: '15px 40px',
              fontFamily: "'Madimi One', cursive",
              fontSize: '20px',
              fontWeight: '400',
              color: '#000000',
              cursor: 'pointer',
              boxShadow: '0 6px 0 #000000',
              transition: 'transform 0.2s'
            }}>
              Weekly Challenge
            </button>
          </div>

          {/* Bottom Section - Leaderboard and Recent Battles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px'
          }}>
            
            {/* Leaderboard */}
            <div>
              <h3 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '20px',
                fontWeight: '600',
                color: '#000000',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Leaderboard
              </h3>
              
              <div style={{
                backgroundColor: '#F8F8F8',
                border: '2px solid #000000',
                borderRadius: '10px',
                padding: '15px'
              }}>
                {[1,2,3,4,5,6,7,8,9,10].map((rank) => (
                  <div key={rank} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: rank < 10 ? '1px solid #E0E0E0' : 'none'
                  }}>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      {rank}. User{rank}
                    </span>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#666666'
                    }}>
                      {1000 - rank * 50} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Battles */}
            <div>
              <h3 style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '20px',
                fontWeight: '600',
                color: '#000000',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Recent Battles
              </h3>
              
              <div style={{
                backgroundColor: '#F8F8F8',
                border: '2px solid #000000',
                borderRadius: '10px',
                padding: '15px'
              }}>
                {['Solo vs AI', 'Duo with Alex', 'Random Match', 'Solo vs AI', 'Duo with Sam'].map((battle, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: index < 4 ? '1px solid #E0E0E0' : 'none'
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#000000'
                      }}>
                        {battle}
                      </div>
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        {index + 1} day{index !== 0 ? 's' : ''} ago
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: index % 2 === 0 ? '#4CAF50' : '#F44336',
                      backgroundColor: index % 2 === 0 ? '#E8F5E8' : '#FFEBEE',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {index % 2 === 0 ? 'Won' : 'Lost'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}