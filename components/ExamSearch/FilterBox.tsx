import React from 'react';
import { Button } from '../ui/Button';
import './FilterBox.css';

export const FilterBox: React.FC = () => {
  return (
    <div className="filter-box-container">
      <div className="filter-box">
        {/* Header */}
        <div className="filter-box-header">
          <h3>TSA Thinking Skills Assessment</h3>
        </div>

        {/* Filter Content Grid */}
        <div className="filter-grid">
          {/* Column 1 */}
          <div className="filter-column">
            <label className="filter-option">
              <input type="checkbox" className="filter-checkbox primary" />
              <span>Question Type</span>
            </label>
            
            <label className="filter-option">
              <input type="checkbox" className="filter-checkbox secondary" />
              <span>Critical Thinking</span>
            </label>
          </div>

          {/* Column 2 */}
          <div className="filter-column">
            <label className="filter-option">
              <input type="checkbox" className="filter-checkbox primary" />
              <span>Sub Type</span>
            </label>
            
            <label className="filter-option">
              <input type="checkbox" className="filter-checkbox secondary" />
              <span>Problem Solving</span>
            </label>
          </div>

          {/* Column 3 */}
          <div className="filter-column">
            <label className="filter-option">
              <input type="checkbox" className="filter-checkbox primary" />
              <span>Year</span>
            </label>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="filter-controls">
          <Button variant="ghost" size="sm">clear filters</Button>
          <Button variant="ghost" size="sm">hide filters</Button>
        </div>
      </div>
    </div>
  );
};