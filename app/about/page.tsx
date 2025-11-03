'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './about.css';

export default function AboutPage() {
  return (
    <div className="page-background">
      <Navbar />

      {/* Back Button */}
      <Link 
        href="/" 
        style={{
          position: 'absolute',
          top: '90px',
          left: '45px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: "'Madimi One', cursive",
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Main Content */}
      <div className="about-container">
        {/* Header with Title and Clouds */}
        <header className="about-header">
          <Image 
            src="/icons/examrizzsearch-title-w-clouds.svg" 
            alt="Examrizzsearch About Us" 
            width={800} 
            height={300}
            className="title-with-clouds"
          />
        </header>

        {/* Timeline Section */}
        <section className="timeline-section">
          <Image 
            src="/icons/our-story-timeline.svg" 
            alt="Our Story Timeline" 
            width={1000} 
            height={400}
            className="timeline-svg"
          />
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-button">Our Mission</div>
          <p className="mission-text">
            Making school life 10x easier. If you've got any questions, we're here.
            <br />
            Join the examrizz community.
          </p>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-header">
            <span className="team-label">Who We Are</span>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="team-avatar">
                <Image src="/icons/ghost-karaoke.svg" alt="SJ" width={60} height={60} />
              </div>
              <h3 className="team-name">SJ</h3>
              <p className="team-role">story teller</p>
            </div>
            
            <div className="team-member">
              <div className="team-avatar">
                <Image src="/icons/cowboy-guitar.svg" alt="Joe" width={60} height={60} />
              </div>
              <h3 className="team-name">Joe</h3>
              <p className="team-role">ideas fairy</p>
            </div>
            
            <div className="team-member">
              <div className="team-avatar">
                <Image src="/icons/biking.svg" alt="Gabe" width={60} height={60} />
              </div>
              <h3 className="team-name">Gabe</h3>
              <p className="team-role">quiet one</p>
            </div>
            
            <div className="team-member">
              <div className="team-avatar">
                <Image src="/icons/rollerskating.svg" alt="Bo" width={60} height={60} />
              </div>
              <h3 className="team-name">Bo</h3>
              <p className="team-role">busy being a cat</p>
            </div>
            
            <div className="team-member">
              <div className="team-avatar">
                <Image src="/icons/flame-streak.svg" alt="Aurela" width={60} height={60} />
              </div>
              <h3 className="team-name">Aurela</h3>
              <p className="team-role">busy being busy</p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="offerings-section">
          <div className="offerings-header">
            <span className="offerings-label">What We Offer</span>
          </div>
          
          <div className="offerings-grid">
            {/* Row 1 */}
            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/island-ask-bo.svg" alt="Ask Bo" width={80} height={80} />
              </div>
              <h3 className="offering-title">ASK BO</h3>
              <p className="offering-description">
                Ask us anything! 
                <br />
                Exam questions, guidance, 
                <br />
                your stuck on deadlines
                <br />
                and stuff like that. we 
                <br />
                are humans.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/practice.svg" alt="Practice" width={80} height={80} />
              </div>
              <h3 className="offering-title">PRACTICE</h3>
              <p className="offering-description">
                Mixed question practice.
                <br />
                Full practice papers. TSA, 
                <br />
                A-levels, anything you 
                <br />
                want. Downloadable. 
                <br />
                questions.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/arena.svg" alt="Arena" width={80} height={80} />
              </div>
              <h3 className="offering-title">ARENA</h3>
              <p className="offering-description">
                Find others online for 
                <br />
                competitions! Join study 
                <br />
                groups. Find study mates 
                <br />
                and buddies. Social 
                <br />
                studying.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/common-room-icon.svg" alt="Common Room" width={80} height={80} />
              </div>
              <h3 className="offering-title">COMMON ROOM</h3>
              <p className="offering-description">
                Chat with others. 
                <br />
                Collaborate online safely 
                <br />
                and anonymously.
              </p>
            </div>

            {/* Row 2 */}
            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/video.svg" alt="Video" width={80} height={80} />
              </div>
              <h3 className="offering-title">VIDEO</h3>
              <p className="offering-description">
                Different video series 
                <br />
                for different learning 
                <br />
                styles. From 30 second 
                <br />
                'tips' to hour-long 
                <br />
                lectures. Completely 
                <br />
                flexible learning.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/learn.svg" alt="Learn" width={80} height={80} />
              </div>
              <h3 className="offering-title">LEARN</h3>
              <p className="offering-description">
                Full guided learning by 
                <br />
                exam board. From 
                <br />
                specification to full exam. With 
                <br />
                past papers & videos. Read 
                <br />
                anything anywhere in 
                <br />
                sequence.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/teacher.svg" alt="Teacher" width={80} height={80} />
              </div>
              <h3 className="offering-title">TEACHER</h3>
              <p className="offering-description">
                Online space covering 
                <br />
                classroom management, 
                <br />
                lesson plans, timetables, 
                <br />
                resources.
              </p>
            </div>

          </div>
        </section>

        {/* Social & Contact Section */}
        <section className="social-section">
          <h3 className="social-title">Our Socials & Contact</h3>
          <div className="social-icons">
            <a href="#" className="social-link">
              <Image src="/icons/insta-icon.svg" alt="Instagram" width={50} height={50} />
            </a>
            <a href="#" className="social-link">
              <Image src="/icons/youtube-icon.svg" alt="YouTube" width={50} height={50} />
            </a>
            <a href="#" className="social-link">
              <Image src="/icons/discord-icon.svg" alt="Discord" width={50} height={50} />
            </a>
            <a href="#" className="social-link">
              <Image src="/icons/email-icon.svg" alt="Email" width={50} height={50} />
            </a>
            <a href="#" className="social-link">
              <Image src="/icons/tiktok-icon.svg" alt="TikTok" width={50} height={50} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}