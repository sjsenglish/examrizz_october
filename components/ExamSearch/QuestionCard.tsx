import React from 'react';
import { Button } from '../ui/Button';
import './QuestionCard.css';

export const QuestionCard: React.FC = () => {
  return (
    <article className="question-card">
      <header className="question-header">
        <div className="question-info">
          <span className="question-number">Question 1</span>
          <span className="year-badge">2022</span>
        </div>
        <div className="filter-buttons">
          <Button variant="filter" size="sm">FILTER 1</Button>
          <Button variant="filter" size="sm" 
            style={{ backgroundColor: 'var(--color-secondary-light)' }}>
            FILTER 2
          </Button>
          <Button variant="filter" size="sm" 
            style={{ backgroundColor: 'transparent' }}>
            SPEC PT. 4.1
          </Button>
        </div>
      </header>

      <div className="question-content">
        <p className="question-passage">
          For centuries the Netherlands has battled with the dangers of water as most of the country lies 
          below sea level. In 1953, nearly two thousand people were killed by flooding, a disaster on 
          a scale that it changed everything. Since then Dutch governments have consistently made flood 
          prevention infrastructure a spending priority. There is a conviction within this is so important that it 
          overrides political differences. While other countries may be good at rescuing stranded people by 
          helicopter, or sending in armed forces to clear flood wreckage, the Dutch approach is always 
          prevention. Now that so many huge coastal cities are threatened, the world needs to learn lessons 
          from this small country. Since 1953, not one person in the Netherlands has died as a direct result 
          of flooding.
        </p>

        <div className="question-text">
          Which one of the following best expresses the main conclusion of the above argument?
        </div>

        <div className="answer-options">
          {['A', 'B', 'C', 'D', 'E'].map((letter) => (
            <div key={letter} className="option">
              <span className="option-letter">{letter}</span>
              <span className="option-text">
                For centuries the Netherlands has battled with the dangers of water.
              </span>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <Button variant="secondary" size="md" className="show-answer-btn">
            Show Answer
          </Button>
          <Button variant="primary" size="md">
            Video Solution
          </Button>
        </div>
      </div>
    </article>
  );
};