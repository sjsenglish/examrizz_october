'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HowToVideoPage({ params }: { params: { videoId: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { videoId } = params;

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newVolume = 1 - percent;

    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const handleVolumeHover = () => {
    setShowVolumeSlider(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * (duration || video.duration || 0);

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Custom Navbar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 1000
      }}>
        <Link href="/" style={{
          fontFamily: "'Madimi One', sans-serif",
          fontSize: '24px',
          fontWeight: '400',
          color: '#000000',
          textDecoration: 'none'
        }}>
          ex
        </Link>

        <Link
          href="/videogallery/howto"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #000000',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#333333',
            fontFamily: "'Madimi One', sans-serif",
            fontSize: '13px',
            transition: 'all 0.3s ease'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Gallery
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          padding: '0 40px',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          {/* Left Column - Video Player */}
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{
              backgroundColor: '#000000',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '20px'
            }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;
                  setCurrentTime(video.currentTime);
                  if (video.duration && !duration) {
                    setDuration(video.duration);
                  }
                }}
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                }}
                onEnded={() => setIsPlaying(false)}
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '10px'
              }}>
                {/* Progress Bar */}
                <div
                  onClick={handleProgressChange}
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    height: '100%',
                    backgroundColor: '#00CED1',
                    borderRadius: '3px',
                    transition: 'width 0.1s linear'
                  }} />
                </div>

                {/* Control Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      padding: '5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <polygon points="6,4 6,20 18,12" fill="currentColor"/>
                      </svg>
                    )}
                  </button>

                  {/* Time Display */}
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: "'Figtree', sans-serif"
                  }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* Volume Control */}
                  <div
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                  >
                    <button
                      onClick={toggleMute}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {isMuted || volume === 0 ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2"/>
                          <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2"/>
                          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>

                    {showVolumeSlider && (
                      <div
                        onClick={handleVolumeChange}
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '40px',
                          height: '100px',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '4px',
                          padding: '10px',
                          marginBottom: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: '2px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${volume * 100}%`,
                            backgroundColor: '#00CED1',
                            borderRadius: '2px'
                          }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      padding: '5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <h1 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '28px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '10px'
            }}>
              How To Video {videoId}
            </h1>

            <p style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: '14px',
              color: '#666666',
              lineHeight: '1.6'
            }}>
              Learn essential skills and techniques in this comprehensive how-to video.
            </p>
          </div>

          {/* Right Column - Info */}
          <div style={{ width: '320px', flexShrink: 0 }}>
            {/* Difficulty */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '10px'
              }}>
                Difficulty
              </h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    style={{
                      width: '30px',
                      height: '8px',
                      backgroundColor: level <= 2 ? '#00CED1' : '#E5E7EB',
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                fontFamily: "'Madimi One', sans-serif",
                fontSize: '16px',
                fontWeight: '400',
                color: '#000000',
                marginBottom: '10px'
              }}>
                Tags
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: "'Figtree', sans-serif",
                  color: '#000000'
                }}>
                  HOW TO
                </span>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: "'Figtree', sans-serif",
                  color: '#000000'
                }}>
                  STUDY SKILLS
                </span>
              </div>
            </div>

            {/* Ghost Helper */}
            <div style={{
              position: 'relative',
              marginTop: '40px'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Image
                  src="/svg/ghost-glasses.svg"
                  alt="Study Ghost"
                  width={100}
                  height={120}
                />
              </div>

              <div style={{
                position: 'relative',
                backgroundColor: '#E8E3FF',
                border: '1px solid #000000',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '10px'
              }}>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '12px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  Take notes while watching to maximize your learning!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
