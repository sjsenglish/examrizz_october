'use client';

import React, { useState, useEffect } from 'react';
import { searchClient } from '../../lib/algolia';
import { FilterConfig, FilterOption } from '../../lib/subjectConfig';
import './QuestionFilters.css';

interface QuestionFiltersProps {
  filters: FilterConfig[];
  indexName: string;
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  filters,
  indexName,
  onFiltersChange
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, FilterOption[]>>({});
  const [isLoadingOptions, setIsLoadingOptions] = useState<Record<string, boolean>>({});

  // Fetch dynamic filter options from Algolia
  useEffect(() => {
    const fetchDynamicOptions = async () => {
      for (const filter of filters) {
        if (filter.fetchFromIndex) {
          setIsLoadingOptions(prev => ({ ...prev, [filter.id]: true }));
          
          try {
            // Get facet values from Algolia using search method
            const response = await searchClient.search([{
              indexName,
              params: {
                query: '',
                facets: [filter.field],
                maxValuesPerFacet: 100,
                hitsPerPage: 0
              }
            }]);

            const facetValues = ('facets' in response.results[0] && response.results[0].facets) ? response.results[0].facets[filter.field] : undefined;
            const options: FilterOption[] = [];
            
            if (facetValues) {
              // Convert facet values object to array of options
              for (const [value, count] of Object.entries(facetValues)) {
                if ((count as any) > 0) {
                  options.push({
                    value: value,
                    label: value
                  });
                }
              }
              
              // Sort options
              options.sort((a, b) => {
                // Sort years in descending order, others alphabetically
                if (filter.field === 'yearNumber') {
                  return parseInt(b.value) - parseInt(a.value);
                }
                return a.label.localeCompare(b.label);
              });
            }

            setDynamicOptions(prev => ({ ...prev, [filter.id]: options }));
          } catch (error) {
            console.error(`Error fetching options for ${filter.id}:`, error);
            setDynamicOptions(prev => ({ ...prev, [filter.id]: [] }));
          } finally {
            setIsLoadingOptions(prev => ({ ...prev, [filter.id]: false }));
          }
        }
      }
    };

    if (indexName && filters.length > 0) {
      fetchDynamicOptions();
    }
  }, [filters, indexName]);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const handleOptionToggle = (filterId: string, value: string) => {
    setSelectedValues(prev => {
      const currentValues = prev[filterId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterId]: newValues };
    });
  };

  const handleClearFilters = () => {
    setSelectedValues({});
    setActiveFilter(null);
  };

  // Notify parent component when selectedValues changes
  useEffect(() => {
    onFiltersChange(selectedValues);
  }, [selectedValues, onFiltersChange]);

  const getFilterOptions = (filter: FilterConfig): FilterOption[] => {
    if (filter.options) {
      return filter.options;
    }
    if (filter.fetchFromIndex) {
      return dynamicOptions[filter.id] || [];
    }
    return [];
  };

  const isFilterActive = (filterId: string): boolean => {
    return (selectedValues[filterId] || []).length > 0;
  };

  return (
    <div className="question-filters-container">
      <h3 className="filters-title">Question Filters</h3>
      
      {/* Main filter buttons */}
      <div className="filter-buttons-grid">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-button ${isFilterActive(filter.id) ? 'filter-active' : ''} ${activeFilter === filter.id ? 'filter-expanded' : ''}`}
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Expandable sub-filters container */}
      {activeFilter && (
        <div className="sub-filters-container">
          {(() => {
            const filter = filters.find(f => f.id === activeFilter);
            if (!filter) return null;
            
            const options = getFilterOptions(filter);
            const isLoading = isLoadingOptions[filter.id];

            return (
              <div className="sub-filters-content">
                {isLoading ? (
                  <div className="loading-options">Loading options...</div>
                ) : options.length > 0 ? (
                  <div className="options-grid">
                    {options.map((option) => (
                      <label key={option.value} className="option-label">
                        <input
                          type="checkbox"
                          checked={(selectedValues[filter.id] || []).includes(option.value)}
                          onChange={() => handleOptionToggle(filter.id, option.value)}
                          className="option-checkbox"
                        />
                        <span className="option-text">{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="no-options">No options available</div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Clear filters button */}
      <div className="clear-filters-container">
        <button 
          className="clear-filters-button" 
          onClick={handleClearFilters}
          disabled={Object.keys(selectedValues).length === 0}
        >
          clear filters
        </button>
      </div>
    </div>
  );
};