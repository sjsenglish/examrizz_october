import React from 'react';
import { useRefinementList, useClearRefinements } from 'react-instantsearch';
import { Button } from '../ui/Button';
import './FilterBox.css';

const getFilterTitle = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'tsa':
      return 'TSA Thinking Skills Assessment';
    case 'interview':
      return 'Interview Questions';
    case 'english lit':
      return 'A Level English Literature';
    case 'biology':
      return 'A Level Biology';
    case 'chemistry':
      return 'A Level Chemistry';
    case 'maths':
      return 'A Level Mathematics';
    default:
      return 'Exam Questions';
  }
};

interface FilterBoxProps {
  onHideFilters: () => void;
  currentSubject?: string;
}

export const FilterBox: React.FC<FilterBoxProps> = ({ onHideFilters, currentSubject = 'TSA' }) => {
  const questionTypeRefinement = useRefinementList({
    attribute: 'question_type',
  });
  
  const subTypesRefinement = useRefinementList({
    attribute: 'sub_types',
  });
  
  const { refine: clearAllFilters } = useClearRefinements();
  return (
    <div className="filter-box-container">
      <div className="filter-box">
        {/* Header */}
        <div className="filter-box-header">
          <h3>{getFilterTitle(currentSubject)}</h3>
        </div>

        {/* Filter Content Grid */}
        <div className="filter-grid">
          {/* Column 1 - Question Types */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>Question Type</span>
            </div>
            
            {questionTypeRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input 
                  type="checkbox" 
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => questionTypeRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
          </div>

          {/* Column 2 - Sub Types */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>Sub Type</span>
            </div>
            
            {subTypesRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input 
                  type="checkbox" 
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => subTypesRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
          </div>

          {/* Column 3 - Placeholder for Year */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>Year</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="filter-controls">
          <Button variant="ghost" size="sm" onClick={() => clearAllFilters()}>clear filters</Button>
          <Button variant="ghost" size="sm" onClick={onHideFilters}>hide filters</Button>
        </div>
      </div>
    </div>
  );
};