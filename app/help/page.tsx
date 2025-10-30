'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import './help.css';

export default function HelpPage() {

  return (
    <div className="page-background" style={{ paddingTop: '60px' }}>
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
      <div className="main-content">
        <div className="help-container">
          <h1 className="help-title">Help & Support</h1>
          <p className="help-subtitle">Find answers to your questions or get in touch with our support team</p>

          <div className="help-content">
            {/* Quick Help Section */}
            <section className="help-section">
              <h2>Quick Help</h2>
              <div className="quick-help-grid">
                <div className="help-card">
                  <div className="help-icon">📚</div>
                  <h3>Getting Started</h3>
                  <p>Learn how to use ExamRizz and make the most of your study sessions</p>
                  <button className="help-button">Learn More</button>
                </div>
                <div className="help-card">
                  <div className="help-icon">🎥</div>
                  <h3>Video Solutions</h3>
                  <p>Watch step-by-step video explanations for practice questions</p>
                  <button className="help-button">Watch Now</button>
                </div>
                <div className="help-card">
                  <div className="help-icon">📊</div>
                  <h3>Progress Tracking</h3>
                  <p>Monitor your performance and identify areas for improvement</p>
                  <button className="help-button">View Progress</button>
                </div>
                <div className="help-card">
                  <div className="help-icon">💳</div>
                  <h3>Billing & Payments</h3>
                  <p>Manage your subscription and payment information</p>
                  <button className="help-button">Manage Account</button>
                </div>
              </div>
            </section>

            {/* FAQs Section */}
            <section className="help-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                <div className="faq-item">
                  <h4>How do I cancel my subscription?</h4>
                  <p>You can cancel your subscription at any time from your account settings. Go to Account → Subscription → Cancel Subscription.</p>
                </div>
                <div className="faq-item">
                  <h4>Can I download practice questions for offline use?</h4>
                  <p>Yes, annual subscribers can download practice questions and study materials for offline access through the mobile app.</p>
                </div>
                <div className="faq-item">
                  <h4>How often is new content added?</h4>
                  <p>We add new practice questions and video solutions weekly. Annual subscribers get early access to new content.</p>
                </div>
                <div className="faq-item">
                  <h4>Do you offer refunds?</h4>
                  <p>Yes, we offer full refunds within 14 days of purchase if you're not satisfied with our service.</p>
                </div>
                <div className="faq-item">
                  <h4>Is there a mobile app available?</h4>
                  <p>Yes, our mobile app is available for iOS and Android devices. Download it from the App Store or Google Play.</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="help-section">
              <h2>Contact Support</h2>
              <div className="contact-options">
                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h3>Email Support</h3>
                  <p>Get help from our support team</p>
                  <p className="contact-info">support@examrizz.com</p>
                  <p className="response-time">Response within 24 hours</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">💬</div>
                  <h3>Live Chat</h3>
                  <p>Chat with us in real-time</p>
                  <button className="contact-button">Start Chat</button>
                  <p className="response-time">Available 9am-6pm GMT</p>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📞</div>
                  <h3>Phone Support</h3>
                  <p>Speak directly with our team</p>
                  <p className="contact-info">+44 20 1234 5678</p>
                  <p className="response-time">Mon-Fri 9am-6pm GMT</p>
                </div>
              </div>
            </section>

            {/* Resources Section */}
            <section className="help-section">
              <h2>Additional Resources</h2>
              <div className="resources-list">
                <div className="resource-item">
                  <h4>📖 Study Guides</h4>
                  <p>Comprehensive guides for A-level subjects and university admissions tests</p>
                </div>
                <div className="resource-item">
                  <h4>🎓 Exam Tips</h4>
                  <p>Expert advice and strategies for exam success</p>
                </div>
                <div className="resource-item">
                  <h4>📱 Mobile App Guide</h4>
                  <p>Learn how to use our mobile app effectively</p>
                </div>
                <div className="resource-item">
                  <h4>🔐 Account Security</h4>
                  <p>Keep your account safe and secure</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}