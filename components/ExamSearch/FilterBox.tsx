import React from 'react';
import { useRefinementList, useClearRefinements } from 'react-instantsearch';
import { Button } from '../ui/Button';
import './FilterBox.css';

const getFilterTitle = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'tsa':
      return 'TSA Thinking Skills Assessment';
    case 'bmat':
      return 'BMAT BioMedical Admissions Test';
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

export const FilterBox: React.FC<FilterBoxProps> = ({ onHideFilters, currentSubject }) => {
  // Guard against undefined currentSubject
  if (!currentSubject) {
    return null;
  }

  // Dynamic attribute selection based on subject
  const getAttributes = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    
    if (['maths', 'english lit', 'biology', 'chemistry'].includes(subjectLower)) {
      // A Level subjects use different attribute structure
      return {
        questionType: 'spec_topic',
        subType: 'question_topic', 
        filters: 'filters',
        questionTypeLabel: 'Specification Topic',
        subTypeLabel: 'Question Topic',
        filtersLabel: 'Filters'
      };
    } else {
      // TSA, BMAT, Interview use original structure
      return {
        questionType: 'question_type',
        subType: 'sub_types',
        filters: 'sub_types', // Fallback to sub_types
        questionTypeLabel: 'Question Type',
        subTypeLabel: 'Sub Type',
        filtersLabel: 'Year'
      };
    }
  };
  
  const attributes = getAttributes(currentSubject);
  
  const questionTypeRefinement = useRefinementList({
    attribute: attributes.questionType,
  });
  
  const subTypesRefinement = useRefinementList({
    attribute: attributes.subType,
  });
  
  const filtersRefinement = useRefinementList({
    attribute: attributes.filters,
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
              <span>{attributes.questionTypeLabel}</span>
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
              <span>{attributes.subTypeLabel}</span>
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

          {/* Column 3 - Filters */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>{attributes.filtersLabel}</span>
            </div>
            
            {filtersRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input 
                  type="checkbox" 
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => filtersRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
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