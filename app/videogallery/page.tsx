'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/Button';
import './videogallery.css';

export default function VideoGalleryPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    questionType: false,
    subType: false,
    year: false,
    criticalThinking: false,
    problemSolving: false
  });

  // Mock data for videos - first 3 completed, last 3 incomplete
  const videos = Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Video Description Topic or something`,
    completed: index < 3
  }));

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFFFFF',
      fontFamily: "'Futura PT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
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
            fontFamily: "'Madimi One', cursive",
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

      {/* Content with navbar padding */}
      <div style={{ paddingTop: '60px' }}>

      {/* Main Video Section - Full Width */}
      <div style={{ 
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: '600px',
        backgroundColor: '#d0d0d0',
        marginBottom: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Futura PT', sans-serif",
        fontSize: '24px',
        color: '#666666',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Info Box in Bottom Left Corner */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '40px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #000000',
          padding: '21px',
          width: '245px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '17px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '18px',
              textAlign: 'left'
            }}>
              Chemistry AQA<br />A Level
            </h2>
            <button style={{
              padding: '8px 21px',
              backgroundColor: '#00CED1',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '6px',
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '13px',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
            }}>
              Start video series
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Karaoke Ghost Icon */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '310px',
          zIndex: 10
        }}>
          <Image
            src="/svg/ghost-karaoke.svg"
            alt="Singing Ghost"
            width={120}
            height={150}
          />
        </div>
        
        {/* Back Button on top of video */}
        <Link 
          href="/video" 
          style={{
            position: 'absolute',
            top: '30px',
            left: '45px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#333333',
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
      </div>

      {/* A Level Chemistry AQA Section */}
      <div style={{ 
        padding: '0 40px',
        marginBottom: '5px',
        marginTop: '-60px',
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
      }}>
        {/* Filter Box - ExamSearch Style */}
        <div style={{ 
          width: '75%',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #000000',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 0 0 #00CED1, 4px 4px 0 0 #00CED1, 4px 0 0 0 #00CED1, 8px 8px 16px rgba(0, 206, 209, 0.2)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#B3F0F2',
              margin: '-32px -32px 24px -32px',
              padding: '15px 32px',
              borderBottom: '1px solid #000000',
              borderRadius: '13px 13px 0 0'
            }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '18px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                A Level Chemistry AQA
              </h3>
            </div>

            {/* Filter Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              alignItems: 'start'
            }}>
              {/* Column 1 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#89F3FF'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000'
                  }}>
                    Question Type
                  </span>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#D4D0FF'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000'
                  }}>
                    Critical Thinking
                  </span>
                </label>
              </div>

              {/* Column 2 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#89F3FF'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000'
                  }}>
                    Sub Type
                  </span>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#D4D0FF'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000'
                  }}>
                    Problem Solving
                  </span>
                </label>
              </div>

              {/* Column 3 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#89F3FF'
                    }}
                  />
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000000'
                  }}>
                    Year
                  </span>
                </label>
              </div>
            </div>

            {/* Control Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              position: 'absolute',
              bottom: '32px',
              right: '32px'
            }}>
              <Button variant="ghost" size="sm">clear filters</Button>
              <Button variant="ghost" size="sm">hide filters</Button>
            </div>
          </div>
        </div>

        {/* Watch Later and Saved Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          flex: '1',
          marginTop: '-80px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {/* Watch Later Button */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 24px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '4px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '12px',
              fontWeight: '400',
              cursor: 'pointer',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              justifyContent: 'center',
              flex: '1'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div style={{ textAlign: 'center', fontSize: '11px' }}>
                watch<br />later
              </div>
            </button>

            {/* Saved Button */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 24px',
              backgroundColor: '#E0F7FA',
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '4px',
              fontFamily: "'Figtree', sans-serif",
              fontSize: '12px',
              fontWeight: '400',
              cursor: 'pointer',
              boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              justifyContent: 'center',
              flex: '1'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Saved
            </button>
          </div>

          {/* Progress Bar Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '25px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '0',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: '45%',
                height: '100%',
                backgroundColor: '#00CED1'
              }}></div>
            </div>
            
            {/* Progress Text */}
            <div style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '12px',
              color: '#000000',
              letterSpacing: '0.04em'
            }}>
              45 % of video series completed
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        padding: '0 40px',
        marginTop: '120px'
      }}>
        
        {/* Topic Section */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          {/* Topic Section */}
          <div style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                Topic 1
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
              
              {/* Progress Bar */}
              <div style={{
                width: '50%',
                height: '17px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '50px',
                overflow: 'hidden',
                position: 'relative',
                marginLeft: 'auto'
              }}>
                <div style={{
                  width: '50%',
                  height: '100%',
                  backgroundColor: '#00CED1',
                  borderRight: '1px solid #000000',
                  borderRadius: '50px 0 0 50px'
                }}></div>
              </div>
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              marginBottom: '40px'
            }}>
              {videos.map((video, index) => (
                <div key={video.id} style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '20px',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    {video.completed && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#00CED1',
                        border: '1px solid #000000',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    
                    {!video.completed && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #000000',
                        borderRadius: '4px'
                      }}></div>
                    )}
                    
                    <div style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '24px',
                      color: '#666666',
                      textAlign: 'center'
                    }}>
                      Video Player
                    </div>
                  </div>
                  
                  <div style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em',
                    textAlign: 'left'
                  }}>
                    {video.title}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>

          {/* Topic 2 Section */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '24px',
                fontWeight: '400',
                color: '#000000',
                margin: '0'
              }}>
                Topic 2
              </h2>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '12px',
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                start topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="9,6 9,18 17,12" fill="#000000"/>
                </svg>
              </button>
              
              {/* Progress Bar */}
              <div style={{
                width: '50%',
                height: '17px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #000000',
                borderRadius: '50px',
                overflow: 'hidden',
                position: 'relative',
                marginLeft: 'auto'
              }}>
                <div style={{
                  width: '25%',
                  height: '100%',
                  backgroundColor: '#00CED1',
                  borderRight: '1px solid #000000',
                  borderRadius: '50px 0 0 50px'
                }}></div>
              </div>
            </div>

            {/* Divider Line */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginBottom: '30px'
            }}></div>

            {/* Video Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              marginBottom: '40px'
            }}>
              {videos.map((video, index) => (
                <div key={`topic2-${video.id}`} style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '20px',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    {/* All videos incomplete for Topic 2 */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      borderRadius: '4px'
                    }}></div>
                    
                    <div style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '24px',
                      color: '#666666',
                      textAlign: 'center'
                    }}>
                      Video Player
                    </div>
                  </div>
                  
                  <div style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em',
                    textAlign: 'left'
                  }}>
                    {video.title}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Divider line below videos */}
            <div style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              height: '1px',
              backgroundColor: '#000000',
              marginTop: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}></div>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}