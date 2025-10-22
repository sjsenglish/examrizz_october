// Subject configuration for Algolia indexes and filters
// This file centralizes all subject-related configuration for easy maintenance and expansion

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  field: string;
  type: 'checkbox' | 'radio' | 'select';
  options?: FilterOption[]; // Static options
  fetchFromIndex?: boolean; // Whether to fetch options dynamically from Algolia
}

export interface SubjectConfig {
  id: string;
  name: string;
  indexName: string;
  available: boolean;
  filters?: FilterConfig[];
}

export const SUBJECT_CONFIGS: SubjectConfig[] = [
  {
    id: 'tsa',
    name: 'TSA',
    indexName: 'copy_tsa_questions',
    available: true,
    filters: [
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        options: [
          { value: 'Critical Thinking', label: 'Critical Thinking' },
          { value: 'Problem Solving', label: 'Problem Solving' }
        ]
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true // Will fetch available sub_types from the index
      },
      {
        id: 'yearNumber',
        label: 'Year',
        field: 'yearNumber',
        type: 'checkbox',
        fetchFromIndex: true // Will fetch available years from the index
      }
    ]
  },
  {
    id: 'bmat',
    name: 'BMAT',
    indexName: 'bmat_questions', // Update this when BMAT index is created
    available: false, // Set to true when index is ready
    filters: {
      // Add BMAT-specific filters here when needed
    }
  },
  {
    id: 'maths',
    name: 'Maths',
    indexName: 'maths_questions', // Update this when Maths index is created
    available: false, // Set to true when index is ready
    filters: {
      // Add Maths-specific filters here when needed
    }
  }
];

// Helper function to get subject configuration
export function getSubjectConfig(subjectName: string): SubjectConfig | undefined {
  return SUBJECT_CONFIGS.find(
    config => config.name.toLowerCase() === subjectName.toLowerCase()
  );
}

// Helper function to get available subjects
export function getAvailableSubjects(): string[] {
  return SUBJECT_CONFIGS
    .filter(config => config.available)
    .map(config => config.name);
}

// Helper function to get all subjects (including unavailable ones)
export function getAllSubjects(): string[] {
  return SUBJECT_CONFIGS.map(config => config.name);
}