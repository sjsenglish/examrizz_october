import React, { useMemo } from 'react';
import { useRefinementList, useClearRefinements, useInstantSearch } from 'react-instantsearch';
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

// Custom hook for interview subject filter
const useInterviewSubjectFilter = () => {
  const { results } = useInstantSearch();
  const [selectedSubjects, setSelectedSubjects] = React.useState<Set<string>>(new Set());

  const subjects = ['psychology', 'maths', 'engineering', 'economics', 'general', 'law', 'PPE', 'philosophy', 'management'];
  
  const subjectItems = useMemo(() => {
    if (!results?.hits) return [];
    
    const subjectCounts: Record<string, number> = {};
    
    // Initialize counts
    subjects.forEach(subject => {
      subjectCounts[subject] = 0;
    });
    
    // Count occurrences in both primary and secondary subjects
    results.hits.forEach((hit: any) => {
      const primarySubject = hit.SubjectId1?.toLowerCase();
      const secondarySubject = hit.SubjectId2?.toLowerCase();
      
      subjects.forEach(subject => {
        if (primarySubject === subject.toLowerCase() || secondarySubject === subject.toLowerCase()) {
          subjectCounts[subject]++;
        }
      });
    });
    
    return subjects.map(subject => ({
      value: subject,
      label: subject.charAt(0).toUpperCase() + subject.slice(1),
      count: subjectCounts[subject],
      isRefined: selectedSubjects.has(subject)
    })).filter(item => item.count > 0);
  }, [results, selectedSubjects]);

  const refine = (subject: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(subject)) {
      newSelected.delete(subject);
    } else {
      newSelected.add(subject);
    }
    setSelectedSubjects(newSelected);
    
    // Apply filter to Algolia
    const { helper } = results!._state;
    helper.clearRefinements();
    
    if (newSelected.size > 0) {
      const filters = Array.from(newSelected).map(subj => 
        `(SubjectId1:"${subj}" OR SubjectId2:"${subj}")`
      ).join(' OR ');
      helper.setQueryParameter('filters', filters);
    }
    
    helper.search();
  };

  const clear = () => {
    setSelectedSubjects(new Set());
    const { helper } = results!._state;
    helper.clearRefinements();
    helper.search();
  };

  return { items: subjectItems, refine, clear };
};

export const FilterBox: React.FC<FilterBoxProps> = ({ onHideFilters, currentSubject }) => {
  // Guard against undefined currentSubject
  if (!currentSubject) {
    return null;
  }

  // Dynamic attribute selection based on subject
  const getAttributes = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower === 'interview') {
      // Interview questions use specific structure - Subject filter only
      return {
        questionType: 'combined_subjects',
        subType: null,
        filters: null,
        questionTypeLabel: 'Subject',
        subTypeLabel: null,
        filtersLabel: null
      };
    } else if (subjectLower === 'english lit') {
      // English Literature uses specific structure
      return {
        questionType: 'PaperName',
        subType: 'PaperSection',
        filters: 'Text1.Author',
        questionTypeLabel: 'Paper Type',
        subTypeLabel: 'Section',
        filtersLabel: 'Author'
      };
    } else if (['maths', 'biology', 'chemistry'].includes(subjectLower)) {
      // Other A Level subjects use different attribute structure
      return {
        questionType: 'spec_topic',
        subType: 'question_topic', 
        filters: 'filters',
        questionTypeLabel: 'Specification Topic',
        subTypeLabel: 'Question Topic',
        filtersLabel: 'Filters'
      };
    } else {
      // TSA, BMAT use original structure
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
  const isInterview = currentSubject.toLowerCase() === 'interview';
  
  // Use custom hook for interview subjects
  const interviewSubjectFilter = useInterviewSubjectFilter();
  
  // Regular refinement lists for non-interview subjects
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
        {isInterview ? (
          // Interview-specific single column Subject filter
          <div className="filter-grid">
            <div className="filter-column">
              <div className="filter-category-title">
                <span>Subject</span>
              </div>
              
              {interviewSubjectFilter.items.map((item) => (
                <label key={item.value} className="filter-option">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox secondary"
                    checked={item.isRefined}
                    onChange={() => interviewSubjectFilter.refine(item.value)}
                  />
                  <span>{item.label} ({item.count})</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          // Standard three-column layout for other subjects
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
        )}

        {/* Control Buttons */}
        <div className="filter-controls">
          <Button variant="ghost" size="sm" onClick={() => isInterview ? interviewSubjectFilter.clear() : clearAllFilters()}>clear filters</Button>
          <Button variant="ghost" size="sm" onClick={onHideFilters}>hide filters</Button>
        </div>
      </div>
    </div>
  );
};