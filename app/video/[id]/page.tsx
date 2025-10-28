'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function IndividualVideoPage() {
  const params = useParams();
  const videoId = params?.id;

  const [selectedFilters, setSelectedFilters] = useState({
    filter1: false,
    filter2: false
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const newVolume = 1 - percent; // Invert because we want top = high volume
    
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

    // Use video.duration directly if state duration is 0
    const useDuration = duration > 0 ? duration : video.duration;
    
    if (!useDuration || useDuration <= 0) {
      // Try to get duration by playing briefly
      if (video.readyState >= 2) {
        const originalTime = video.currentTime;
        video.play().then(() => {
          if (video.duration > 0) {
            setDuration(video.duration);
            video.pause();
            video.currentTime = originalTime;
          }
        }).catch(() => {});
      }
      return;
    }

    // Prevent triggering drag on simple click
    e.stopPropagation();
    
    // Get the progress bar element
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    
    // Calculate click position
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate percentage and new time
    const percent = Math.max(0, Math.min(1, clickX / width));
    const newTime = percent * useDuration;
    
    try {
      // Update video time
      video.currentTime = newTime;
      setCurrentTime(newTime);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const progressBar = e.currentTarget;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percent = Math.max(0, Math.min(1, clickX / width));
      const newTime = percent * duration;
      
      video.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Start dragging
    handleMouseMove(e.nativeEvent);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
      video.volume = volume;
    };
    
    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };
    
    const handleCanPlayThrough = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };
    
    const handleError = (e: Event) => {
      setVideoError(true);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    // Add all events including error handling
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);

    // Try to force metadata loading
    if (video.readyState < 1) {
      video.load();
    }

    // Duration checking with timeout
    let attempts = 0;
    const maxAttempts = 40;
    const checkDuration = setInterval(() => {
      attempts++;
      
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        clearInterval(checkDuration);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkDuration);
        if (video.readyState >= 1) {
          const promise = video.play();
          if (promise) {
            promise.then(() => {
              if (video.duration && !isNaN(video.duration) && video.duration > 0) {
                setDuration(video.duration);
              }
              video.pause();
            }).catch(() => {});
          }
        }
      }
    }, 500);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
      clearInterval(checkDuration);
    };
  }, [volume]);

  const videoPlaceholders = Array(4).fill(null);

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
        
        {/* Back Button */}
        <div style={{ 
          padding: '20px 40px 0',
          backgroundColor: '#FFFFFF'
        }}>
          <Link 
            href="/video" 
            style={{
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
              width: 'fit-content',
              border: '1px solid #000000'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
        </div>

        {/* Main Content Flex Container */}
        <div style={{ 
          display: 'flex',
          gap: '40px',
          padding: '20px 40px'
        }}>
          
          {/* Left Side - Video and Controls */}
          <div style={{ flex: '1', maxWidth: 'calc(100% - 340px)' }}>
            
            {/* Video Title */}
            <h2 style={{
              fontFamily: "'Madimi One', sans-serif",
              fontSize: '28px',
              fontWeight: '400',
              color: '#000000',
              marginBottom: '20px',
              marginLeft: '10%'
            }}>
              Video {videoId} - Title of content video
            </h2>

            {/* Video Player */}
            <div style={{
              width: '80%',
              height: '449px',
              border: '2px solid #000000',
              marginBottom: '20px',
              marginLeft: '10%',
              position: 'relative'
            }}>
              <video
                ref={videoRef}
                src="https://plewvideos.s3.eu-north-1.amazonaws.com/Lesson+1Final.mp4"
                preload="auto"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Video Controls Bar */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '0px',
              padding: '15px 20px',
              marginBottom: '30px',
              width: '80%',
              marginLeft: '10%',
              boxShadow: '0 4px 0 0 #00CED1, 4px 4px 0 0 #00CED1, 4px 0 0 0 #00CED1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              
              {/* Left side controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Bookmark */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="#000000" strokeWidth="2"/>
                </svg>
                
                {/* Play/Pause */}
                <button onClick={togglePlayPause} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="4" height="16" fill="#000000"/>
                      <rect x="14" y="4" width="4" height="16" fill="#000000"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="5,3 19,12 5,21" fill="#000000"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Center controls - Progress bar and time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, margin: '0 20px' }}>
                {/* Progress bar */}
                <div 
                  onClick={handleProgressChange}
                  onMouseDown={handleProgressMouseDown}
                  style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #000000',
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: '#000000',
                      pointerEvents: 'none',
                      position: 'absolute',
                      left: 0,
                      top: 0
                    }} 
                  />
                  {/* Scrubber handle */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#000000',
                      border: '2px solid #FFFFFF',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>
                
                {/* Time display */}
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '12px',
                  color: '#000000',
                  minWidth: '80px',
                  textAlign: 'center'
                }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right side controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Volume */}
                <div 
                  style={{ position: 'relative' }}
                  onMouseEnter={handleVolumeHover}
                  onMouseLeave={handleVolumeLeave}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{ cursor: 'pointer' }}
                    onClick={toggleMute}
                  >
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="#000000" strokeWidth="2" fill="none"/>
                    {!isMuted && volume > 0 && (
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#000000" strokeWidth="2" fill="none"/>
                    )}
                    {(isMuted || volume === 0) && (
                      <path d="M23 9l-6 6m0-6l6 6" stroke="#000000" strokeWidth="2"/>
                    )}
                  </svg>
                  
                  {/* Volume Slider */}
                  {showVolumeSlider && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '10px',
                      width: '30px',
                      height: '100px',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000000',
                      borderRadius: '4px',
                      padding: '8px 4px',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                      <div 
                        onClick={handleVolumeChange}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e0e0e0',
                          border: '1px solid #000000',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: `${volume * 100}%`,
                          backgroundColor: '#000000'
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: `${volume * 100}%`,
                          left: '50%',
                          transform: 'translate(-50%, 50%)',
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#000000',
                          border: '2px solid #FFFFFF',
                          borderRadius: '50%',
                          cursor: 'pointer'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Fullscreen */}
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ cursor: 'pointer' }}
                  onClick={toggleFullscreen}
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="#000000" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              marginBottom: '40px',
              flexWrap: 'wrap',
              width: '80%',
              marginLeft: '10%'
            }}>
              <button style={{
                padding: '6px 24px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                mark as complete
              </button>
              
              <button style={{
                padding: '6px 24px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                watch later
              </button>
              
              <button style={{
                padding: '6px 24px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: '4px',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
              }}>
                practice
              </button>
              
              {/* Vertical divider */}
              <div style={{
                width: '1px',
                height: '30px',
                backgroundColor: '#000000',
                margin: '0 10px'
              }}></div>
              
              <Link href={`/video/${Math.max(1, parseInt(videoId as string) - 1)}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '6px 24px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>⏮</span>
                  previous
                </button>
              </Link>
              
              <Link href={`/video/${parseInt(videoId as string) + 1}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '6px 24px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  next video
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>⏭</span>
                </button>
              </Link>
            </div>

            {/* Up Next Section */}
            <div style={{ marginBottom: '10px', marginTop: '10%', marginLeft: '10%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                <h3 style={{ 
                  fontFamily: "'Madimi One', sans-serif",
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  margin: '0'
                }}>
                  Up next
                </h3>
                <Link href="/video" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '6px 24px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)'
                  }}>
                    open video gallery
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Filters and Info */}
          <div style={{ 
            width: '300px',
            paddingTop: '0px'
          }}>
            
            {/* Difficulty */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '30px',
              marginTop: '15px'
            }}>
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '14px',
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                difficulty high [A*]
              </span>
              <div style={{
                display: 'flex',
                gap: '2px'
              }}>
                {[1,2,3,4].map((bar) => (
                  <div 
                    key={bar}
                    style={{
                      width: '4px',
                      height: bar <= 3 ? '16px' : '12px',
                      backgroundColor: '#000000'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#B3F0F2',
                    color: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                    width: '120px'
                  }}
                >
                  FILTER 1
                </button>
                
                <button 
                  style={{
                    padding: '8px 24px',
                    backgroundColor: '#D4D0FF',
                    color: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                    width: '120px'
                  }}
                >
                  FILTER 2
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px 12px',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    SPEC PT. 4.1
                  </span>
                </div>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px 12px',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    fontFamily: "'Madimi One', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    SPEC PT. 4.2
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  letterSpacing: '0.04em'
                }}>
                  Timestamps
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div style={{
                backgroundColor: '#E0F7FA',
                border: '1px solid #000000',
                borderRadius: '4px',
                padding: '12px',
                width: '120px',
                boxSizing: 'border-box'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    0:00 Intro
                  </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    2:34 Key
                  </span>
                </div>
                <div>
                  <span style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '12px',
                    color: '#000000',
                    letterSpacing: '0.04em'
                  }}>
                    8:12 Example
                  </span>
                </div>
              </div>
            </div>

            {/* Ghost Speech Bubble */}
            <div style={{
              position: 'absolute',
              bottom: '96px',
              right: '80px',
              zIndex: 50
            }}>
              <Image 
                src="/icons/speech-bubble-ghost.svg"
                alt="Help"
                width={60}
                height={60}
                style={{ cursor: 'pointer' }}
              />
            </div>

            {/* Help Text */}
            <div style={{
              position: 'absolute',
              bottom: '120px',
              right: '150px',
              backgroundColor: '#E8E3FF',
              border: '1px solid #000000',
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '160px',
              zIndex: 40
            }}>
              <span style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: '12px',
                color: '#000000',
                letterSpacing: '0.04em'
              }}>
                Did you understand the content well?
              </span>
            </div>
          </div>
        </div>

        {/* Full Width Divider Line Above Videos */}
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
          margin: '20px 0'
        }}></div>
        
        {/* Video Navigation Section */}
        <div style={{ padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div style={{ display: 'flex', gap: '15px', flex: '1', justifyContent: 'space-between' }}>
              {videoPlaceholders.map((_, index) => (
                <Link key={index} href={`/video/${index + 1}`} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    backgroundColor: '#d0d0d0',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    height: '160px',
                    width: 'calc(25% - 11.25px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Futura PT', sans-serif",
                    fontSize: '14px',
                    color: '#666666',
                    cursor: 'pointer',
                    minWidth: '200px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    Video {index + 1}
                  </div>
                </Link>
              ))}
            </div>
            
            <button style={{
              padding: '15px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Full Width Divider Line Below Videos */}
        <div style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000',
          margin: '30px 0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}></div>
      </div>
    </div>
  );
}