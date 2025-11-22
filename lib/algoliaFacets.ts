import { searchClient } from './algolia';
import { getSubjectConfig } from './subjectConfig';

// Interface for facet values
export interface FacetValue {
  value: string;
  count: number;
}

// Interface for facet results
export interface FacetResults {
  [facetName: string]: FacetValue[];
}

// Get total number of questions for a subject
export async function getTotalQuestionCount(subjectName: string): Promise<number> {
  const config = getSubjectConfig(subjectName);
  if (!config?.available) return 0;

  try {
    const results = await searchClient.search([{
      indexName: config.indexName,
      params: {
        query: '',
        hitsPerPage: 0, // We only need the count
      }
    }]);

    const result = results.results[0] as any;
    return result.nbHits || 0;
  } catch (error) {
    console.error(`Error getting total count for ${subjectName}:`, error);
    return 0;
  }
}

// Get facet values for a subject with optional filters
export async function getSubjectFacets(
  subjectName: string,
  facetNames: string[],
  activeFilters: string = ''
): Promise<FacetResults> {
  const config = getSubjectConfig(subjectName);
  if (!config?.available) return {};

  try {
    const results = await searchClient.search([{
      indexName: config.indexName,
      params: {
        query: '',
        facets: facetNames,
        filters: activeFilters || undefined,
        hitsPerPage: 0,
        maxValuesPerFacet: 100
      }
    }]);

    const result = results.results[0] as any;
    const facets = result.facets || {};
    const facetResults: FacetResults = {};

    // Convert facets to our format
    for (const facetName of facetNames) {
      if (facets[facetName]) {
        facetResults[facetName] = Object.entries(facets[facetName])
          .map(([value, count]) => ({
            value,
            count: count as number
          }))
          .sort((a, b) => {
            // Sort years numerically if the facet looks like a year
            if (facetName.toLowerCase().includes('year')) {
              const aNum = parseInt(a.value);
              const bNum = parseInt(b.value);
              if (!isNaN(aNum) && !isNaN(bNum)) {
                return bNum - aNum; // Descending order for years
              }
            }
            // Otherwise sort alphabetically
            return a.value.localeCompare(b.value);
          });
      }
    }

    return facetResults;
  } catch (error) {
    console.error(`Error fetching facets for ${subjectName}:`, error);
    return {};
  }
}

// Get filtered question count based on selected filters
export async function getFilteredQuestionCount(
  subjectName: string,
  filters: Record<string, string[]>
): Promise<number> {
  const config = getSubjectConfig(subjectName);
  if (!config?.available) return 0;

  try {
    // Build filter string from selected filters
    const filterStrings: string[] = [];
    
    for (const [field, values] of Object.entries(filters)) {
      if (values && values.length > 0) {
        // Handle array fields differently
        if (field === 'sub_types') {
          // For array fields, we need to use OR logic
          const subTypeFilters = values.map((v: any) => `sub_types:"${v}"`).join(' OR ');
          if (subTypeFilters) {
            filterStrings.push(`(${subTypeFilters})`);
          }
        } else {
          // For non-array fields, use OR logic
          const fieldFilters = values.map((v: any) => `${field}:"${v}"`).join(' OR ');
          if (fieldFilters) {
            filterStrings.push(`(${fieldFilters})`);
          }
        }
      }
    }

    const filterString = filterStrings.join(' AND ');

    const results = await searchClient.search([{
      indexName: config.indexName,
      params: {
        query: '',
        filters: filterString || undefined,
        hitsPerPage: 0
      }
    }]);

    const result = results.results[0] as any;
    return result.nbHits || 0;
  } catch (error) {
    console.error(`Error getting filtered count for ${subjectName}:`, error);
    return 0;
  }
}