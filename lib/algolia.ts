import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { getSubjectConfig } from './subjectConfig';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!;

export const searchClient = algoliasearch(appId, searchKey);

// Legacy export for backward compatibility
export const INDEX_NAME = 'copy_tsa_questions';

// Get index name for a specific subject
export function getIndexForSubject(subjectName: string): string | null {
  const config = getSubjectConfig(subjectName);
  return config?.available ? config.indexName : null;
}

// Search questions for a specific subject with filters
export async function searchSubjectQuestions(
  subjectName: string,
  filters: string = '',
  options: { hitsPerPage?: number; query?: string } = {}
) {
  const indexName = getIndexForSubject(subjectName);
  
  if (!indexName) {
    // Return empty results for unavailable subjects
    return {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: options.hitsPerPage || 0
    };
  }

  try {
    const results = await searchClient.search([{
      indexName,
      params: {
        query: options.query || '',
        filters: filters || undefined,
        hitsPerPage: options.hitsPerPage ?? 20,
      }
    }]);

    return results.results[0];
  } catch (error) {
    console.error(`Error searching ${subjectName} questions:`, error);
    return {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: options.hitsPerPage || 0
    };
  }
}

// Fetch specific questions by their object IDs
export async function getQuestionsByIds(
  subjectName: string,
  questionIds: string[]
): Promise<any[]> {
  const indexName = getIndexForSubject(subjectName);
  
  if (!indexName || questionIds.length === 0) {
    return [];
  }

  try {
    // Use search with objectID filters since lite client doesn't support getObjects
    const objectIdFilters = questionIds.map(id => `objectID:"${id}"`).join(' OR ');
    
    const results = await searchClient.search([{
      indexName,
      params: {
        query: '',
        filters: objectIdFilters,
        hitsPerPage: questionIds.length,
      }
    }]);

    const hits = ('hits' in results.results[0]) ? results.results[0].hits : [];
    
    // Return questions in the same order as requested IDs
    const questionsMap = new Map(hits.map((q: any) => [q.objectID, q]));
    return questionIds.map(id => questionsMap.get(id)).filter(Boolean);
  } catch (error) {
    console.error(`Error fetching questions by IDs:`, error);
    return [];
  }
}