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
            src="/icons/timeline.svg" 
            alt="Our Story Timeline" 
            width={1150} 
            height={460}
            className="timeline-svg"
          />
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-button">Our Mission</div>
          <p className="mission-text">
            Using our years of experience sending students to top universities to help all students benefit. Make your school life 10x easier and find a community where you can get top quality answers for all your needs.
          </p>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-header">
            <span className="team-label">Who We Are</span>
          </div>
          
          <div className="team-grouped">
            <Image 
              src="/icons/team-grouped.svg" 
              alt="Team Members" 
              width={600} 
              height={300}
              className="team-grouped-svg"
            />
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
              <p className="offering-description">
                The ultimate PS writing 
                <br />
                tool. Helps you write 
                <br />
                from scratch or grades 
                <br />
                your draft for top uni 
                <br />
                level competitiveness.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/practice.svg" alt="Practice" width={80} height={80} />
              </div>
              <p className="offering-description">
                Make custom question
                <br />
                packs for just the topics
                <br />
                you need. 
                <br />
                Find original, spec-
                <br />
                specific questions. 
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/arena.svg" alt="Arena" width={80} height={80} />
              </div>
              <p className="offering-description">
                Find others aiming for 
                <br />
                the same course. 
                <br />
                Compete in challenges.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/common-room-icon.svg" alt="Common Room" width={80} height={80} />
              </div>
              <p className="offering-description">
                Offline third space 
                <br />
                coming soon! For
                <br />
                in-person help. 
              </p>
            </div>

            {/* Row 2 */}
            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/video.svg" alt="Video" width={80} height={80} />
              </div>
              <p className="offering-description">
                Efficient video series
                <br />
                for all subjects.
                <br />
                Watch our “how to” and 
                <br />
                “basics” series to set
                <br />
                you up for all subject
                <br />
                learning.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/learn.svg" alt="Learn" width={80} height={80} />
              </div>
              <p className="offering-description">
                Full guided learning to
                <br />
                teach you every subject  
                <br />
                in under 60 hours. Best 
                <br />
                if you're home-schooled, 
                <br />
                falling behind, or need
                <br />
                to the whole course quickly.
              </p>
            </div>

            <div className="offering-item">
              <div className="offering-icon">
                <Image src="/icons/teacher.svg" alt="Teacher" width={80} height={80} />
              </div>
              <p className="offering-description">
                Contact us to learn more. 
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

        {/* Footer */}
        <footer className="about-footer">
          <div className="company-info">
            <p className="company-name">Stream Learning LTD</p>
            <p className="company-details">Company No: 15453227</p>
            <p className="company-address">71-75 Shelton Street, Covent Garden, London, WC2H 9JQ</p>
            <p className="company-email">team@examrizz.com</p>
          </div>
        </footer>
      </div>
    </div>
  );
}