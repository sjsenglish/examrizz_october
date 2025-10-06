'use client';

import Link from 'next/link';
import { ArenaIcon } from '@/components/icons/ArenaIcon';
import './competition.css';

export default function CompetitionPage() {
  return (
    <div style={{ backgroundColor: '#F8F8F5', overflowY: 'auto', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '30px 60px',
        backgroundColor: '#F8F8F5'
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
        padding: '60px',
        position: 'relative',
        paddingBottom: '120px'
      }}>

        {/* Back Button and Title */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#333333',
            fontSize: '16px',
            marginBottom: '20px',
            fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid #000000',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              cursor: 'pointer'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
          
          <h1 style={{
            fontFamily: "'Madimi One', cursive",
            fontSize: '48px',
            fontWeight: '400',
            color: '#000000',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            BATTLE ZONE
          </h1>
        </div>

        {/* Main Layout Container */}
        <div style={{
          display: 'flex',
          gap: '60px',
          alignItems: 'flex-start',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>

          {/* Left Side - Arena Icon */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '100px'
          }}>
            <ArenaIcon size={200} />
            <span style={{
              fontFamily: "'Madimi One', cursive",
              fontSize: '24px',
              fontWeight: '400',
              color: '#000000',
              marginTop: '20px'
            }}>
              ARENA
            </span>
          </div>

          {/* Right Side - Main Content */}
          <div style={{ flex: 1 }}>
            
            {/* Battle Mode Selection */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '3px solid #000000',
              padding: '40px',
              marginBottom: '40px',
              boxShadow: '6px 0 0 0 #00CED1, 0 6px 0 0 #00CED1, 6px 6px 0 0 #00CED1, 8px 8px 16px rgba(0, 206, 209, 0.2)',
              position: 'relative'
            }}>
                
                {/* Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '30px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '15px' }}>
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#FFD700" stroke="#000000" strokeWidth="1"/>
                  </svg>
                  <h2 style={{
                    fontFamily: "'Madimi One', cursive",
                    fontSize: '28px',
                    fontWeight: '400',
                    color: '#000000',
                    margin: '0'
                  }}>
                    Select Battle Mode
                  </h2>
                  <div style={{
                    marginLeft: 'auto',
                    backgroundColor: '#B3F0F2',
                    padding: '8px 16px',
                    border: '2px solid #000000',
                    fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Weekly Challenge
                  </div>
                </div>

                {/* Battle Mode Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px'
                }}>
                  
                  {/* Solo Mode Card */}
                  <div style={{
                    position: 'relative',
                    height: '320px'
                  }}>
                    <svg width="100%" height="320" viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      <polygon points="3,13 257,13 257,307 3,307" fill="#B3F0F2"/>
                      <polygon points="3,13 15,3 269,3 257,13" fill="#B3F0F2"/>
                      <polygon points="257,13 269,3 269,295 257,307" fill="#B3F0F2"/>
                      
                      <path d="M 3,307 L 3,13 L 15,3 L 269,3 L 269,295 L 257,307 Z" fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="257" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="257" y2="307" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="269" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        fontWeight: '400',
                        color: '#000000',
                        margin: '0 0 15px 0',
                        textAlign: 'center'
                      }}>
                        SOLO MODE
                      </h3>
                      
                      <div style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#333333'
                      }}>
                        247 players competing
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Top 10 win Discord badge + 200 points
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '15px'
                      }}>
                        Your rank #23
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '12px',
                        color: '#999999',
                        marginTop: 'auto',
                        marginBottom: '15px'
                      }}>
                        3d 14h left
                      </div>
                      
                      <button style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000000',
                        padding: '8px 16px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto'
                      }}>
                        Join
                      </button>
                    </div>
                  </div>

                  {/* Duo Friends Card */}
                  <div style={{
                    position: 'relative',
                    height: '320px'
                  }}>
                    <svg width="100%" height="320" viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      <polygon points="3,13 257,13 257,307 3,307" fill="#B3F0F2"/>
                      <polygon points="3,13 15,3 269,3 257,13" fill="#B3F0F2"/>
                      <polygon points="257,13 269,3 269,295 257,307" fill="#B3F0F2"/>
                      
                      <path d="M 3,307 L 3,13 L 15,3 L 269,3 L 269,295 L 257,307 Z" fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="257" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="257" y2="307" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="269" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        fontWeight: '400',
                        color: '#000000',
                        margin: '0 0 15px 0',
                        textAlign: 'center'
                      }}>
                        DUO FRIENDS
                      </h3>
                      
                      <div style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#00A8A8'
                      }}>
                        ● 4 online
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Top - Sarah
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Your record 12W - 8L (60%)
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '15px'
                      }}>
                        Best streak - 5
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '12px',
                        color: '#999999',
                        marginTop: 'auto',
                        marginBottom: '15px'
                      }}>
                        daily
                      </div>
                      
                      <button style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000000',
                        padding: '8px 16px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto'
                      }}>
                        Pick
                      </button>
                    </div>
                  </div>

                  {/* Duo Random Card */}
                  <div style={{
                    position: 'relative',
                    height: '320px'
                  }}>
                    <svg width="100%" height="320" viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      <polygon points="3,13 257,13 257,307 3,307" fill="#B3F0F2"/>
                      <polygon points="3,13 15,3 269,3 257,13" fill="#B3F0F2"/>
                      <polygon points="257,13 269,3 269,295 257,307" fill="#B3F0F2"/>
                      
                      <path d="M 3,307 L 3,13 L 15,3 L 269,3 L 269,295 L 257,307 Z" fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="257" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="257" y2="307" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="269" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        fontWeight: '400',
                        color: '#000000',
                        margin: '0 0 15px 0',
                        textAlign: 'center'
                      }}>
                        DUO RANDOM
                      </h3>
                      
                      <div style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#00A8A8'
                      }}>
                        ● 23 players waiting
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Quick match
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Your record 7W - 5L (X%)
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '15px'
                      }}>
                        Avg wait 30 sec
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '12px',
                        color: '#999999',
                        marginTop: 'auto',
                        marginBottom: '15px'
                      }}>
                        daily
                      </div>
                      
                      <button style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000000',
                        padding: '8px 16px',
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto'
                      }}>
                        Find match
                      </button>
                    </div>
                  </div>

                  {/* Your Stats Card */}
                  <div style={{
                    position: 'relative',
                    height: '320px'
                  }}>
                    <svg width="100%" height="320" viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      <polygon points="3,13 257,13 257,307 3,307" fill="#B3F0F2"/>
                      <polygon points="3,13 15,3 269,3 257,13" fill="#B3F0F2"/>
                      <polygon points="257,13 269,3 269,295 257,307" fill="#B3F0F2"/>
                      
                      <path d="M 3,307 L 3,13 L 15,3 L 269,3 L 269,295 L 257,307 Z" fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="257" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="257" y2="307" stroke="#000000" strokeWidth="2"/>
                      <line x1="257" y1="13" x2="269" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '20px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h3 style={{
                        fontFamily: "'Madimi One', cursive",
                        fontSize: '20px',
                        fontWeight: '400',
                        color: '#000000',
                        margin: '0 0 15px 0',
                        textAlign: 'center'
                      }}>
                        YOUR STATS
                      </h3>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        This week
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Rank #23 ↑
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Total 847 pts
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '10px'
                      }}>
                        Win rate 67%
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '13px',
                        color: '#666666',
                        marginBottom: '15px'
                      }}>
                        Streak 4
                      </div>
                      
                      <div style={{
                        fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                        fontSize: '12px',
                        color: '#0066CC',
                        marginTop: 'auto',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}>
                        details →
                      </div>
                    </div>
                  </div>

                </div>
              </div>
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
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '24px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0 0 20px 0'
                }}>
                  Leaderboard
                </h3>
                
                <div style={{
                  fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                  fontSize: '14px',
                  color: '#666666',
                  marginBottom: '20px'
                }}>
                  This week's top 10
                </div>

                <div style={{
                  position: 'relative'
                }}>
                  <svg width="100%" height="180" viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                    <polygon points="3,13 477,13 477,167 3,167" fill="#B3F0F2"/>
                    <polygon points="3,13 15,3 489,3 477,13" fill="#B3F0F2"/>
                    <polygon points="477,13 489,3 489,155 477,167" fill="#B3F0F2"/>
                    
                    <path d="M 3,167 L 3,13 L 15,3 L 489,3 L 489,155 L 477,167 Z" fill="none" stroke="#000000" strokeWidth="2"/>
                    <line x1="3" y1="13" x2="477" y2="13" stroke="#000000" strokeWidth="2"/>
                    <line x1="477" y1="13" x2="477" y2="167" stroke="#000000" strokeWidth="2"/>
                    <line x1="477" y1="13" x2="489" y2="3" stroke="#000000" strokeWidth="2"/>
                  </svg>
                  
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '20px'
                  }}>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #CCCCCC',
                      fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                      fontSize: '14px'
                    }}>
                      <span><strong>1.</strong> User X</span>
                      <span><strong>345 pts</strong></span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #CCCCCC',
                      fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                      fontSize: '14px'
                    }}>
                      <span><strong>2.</strong> User X</span>
                      <span><strong>320 pts</strong></span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                      fontSize: '14px'
                    }}>
                      <span><strong>3.</strong> User X</span>
                      <span><strong>313 pts</strong></span>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Recent Battles */}
              <div>
                <h3 style={{
                  fontFamily: "'Madimi One', cursive",
                  fontSize: '24px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0 0 20px 0'
                }}>
                  Recent Battles
                </h3>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000000',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: '5px'
                  }}>
                    You vs. Marcus
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    <span>Won 7-4 Time 2:35</span>
                    <span>2 days ago</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000000',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: '5px'
                  }}>
                    You vs. Random
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    <span>Won 7-4 Time 2:35</span>
                    <span>1 week ago</span>
                  </div>
                </div>

                <div style={{
                  fontFamily: "'Figtree', sans-serif",
            letterSpacing: '0.04em',
                  fontSize: '14px',
                  color: '#0066CC',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}>
                  view all history →
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}