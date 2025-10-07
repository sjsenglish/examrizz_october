'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './competition.css';

export default function CompetitionPage() {
  return (
    <div className="page-background">
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1>examrizzsearch</h1>
        </Link>
        <button className="hamburger-button">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Back Button */}
        <Link href="/" className="back-button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        {/* Discord Button */}
        <a href="#" className="discord-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor"/>
          </svg>
          Discord
        </a>

        {/* Main Container */}
        <div className="content-layout">
          {/* Battle Zone Title - Above container */}
          <h1 className="battle-title">BATTLE ZONE</h1>

          {/* Main Content Container */}
          <div className="battle-container">
            {/* Weekly Challenge Button - Inside container top right */}
            <div className="weekly-challenge">
              Weekly Challenge
            </div>

            {/* Lightning Icon and Select Battle Mode */}
            <div className="select-battle-header">
              <div className="lightning-icon">⚡</div>
              <h2 className="select-battle-title">Select Battle Mode</h2>
            </div>

            {/* Battle Mode Cards - Row of 4 */}
            <div className="battle-mode-grid">
              <div className="battle-mode-card">
                <div className="mode-header">
                  <div className="mode-title-badge">SOLO MODE</div>
                  <div className="online-indicator">● 4 online</div>
                </div>
                <div className="mode-stats">
                  <p>247 players competing</p>
                  <p>Top 10 win Discord badge + 200 points</p>
                  <p>Your rank #23</p>
                  <p>3d 14h left</p>
                </div>
                <button className="join-button">Join</button>
              </div>

              <div className="battle-mode-card">
                <div className="mode-header">
                  <div className="mode-title-badge">DUO FRIENDS</div>
                  <div className="online-indicator">● 4 online</div>
                </div>
                <div className="mode-stats">
                  <p>Top - Sarah</p>
                  <p>Your record: 12W - 8L (60%)</p>
                  <p>Best streak - 5</p>
                  <p>daily</p>
                </div>
                <button className="join-button">Pick</button>
              </div>

              <div className="battle-mode-card">
                <div className="mode-header">
                  <div className="mode-title-badge">DUO RANDOM</div>
                  <div className="online-indicator">● 23 players waiting</div>
                </div>
                <div className="mode-stats">
                  <p>Quick match</p>
                  <p>Your record: 7W - 5L (X%)</p>
                  <p>Avg wait 30 sec</p>
                  <p>daily</p>
                </div>
                <button className="join-button">Find match</button>
              </div>

              <div className="battle-mode-card">
                <div className="mode-header">
                  <div className="mode-title-badge">YOUR STATS</div>
                  <div className="stats-details">details →</div>
                </div>
                <div className="mode-stats">
                  <p>This week</p>
                  <p>Rank #23 ↑</p>
                  <p>Total 847 pts</p>
                  <p>Win rate 67%</p>
                  <p>Streak 4</p>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="divider"></div>

            {/* Bottom Section */}
            <div className="bottom-section">
              {/* Leaderboard */}
              <div className="leaderboard-section">
                <h3 className="section-title">Leaderboard</h3>
                <p className="section-subtitle">This week's top 10</p>
                <div className="leaderboard-container">
                  <div className="leaderboard-item">
                    <span className="rank">1.</span>
                    <span className="username">User X</span>
                    <span className="points">345 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">2.</span>
                    <span className="username">User X</span>
                    <span className="points">320 pts</span>
                  </div>
                  <div className="leaderboard-item">
                    <span className="rank">3.</span>
                    <span className="username">User X</span>
                    <span className="points">313 pts</span>
                  </div>
                </div>
              </div>

              {/* Recent Battles */}
              <div className="recent-battles-section">
                <h3 className="section-title">Recent Battles</h3>
                <div className="recent-battles-container">
                  <div className="battle-item">
                    <div className="battle-info">
                      <h4 className="battle-title">You vs. Marcus</h4>
                      <p className="battle-details">Won 7-4 Time 2:35</p>
                    </div>
                    <span className="battle-time">2 days ago</span>
                  </div>
                  <div className="battle-item">
                    <div className="battle-info">
                      <h4 className="battle-title">You vs. Random</h4>
                      <p className="battle-details">Won 7-4 Time 2:35</p>
                    </div>
                    <span className="battle-time">1 week ago</span>
                  </div>
                </div>
                <a href="#" className="view-all-link">view all history →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Arena Icon - Bottom Left */}
        <div className="fixed-arena-icon">
          <Image 
            src="/icons/arena.svg"
            alt="ARENA"
            width={144}
            height={144}
            className="arena-icon"
          />
          <p className="arena-text">ARENA</p>
        </div>
      </div>
    </div>
  );
}