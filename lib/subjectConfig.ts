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
        id: 'year',
        label: 'Year',
        field: 'year',
        type: 'checkbox',
        fetchFromIndex: true // Will fetch available years from the index
      },
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
      }
    ]
  },
  {
    id: 'interview',
    name: 'Interview',
    indexName: 'v2_interview_questions',
    available: true,
    filters: [
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true
      }
    ]
  },
  {
    id: 'english-lit',
    name: 'English Lit',
    indexName: 'v2_edexcel_alevel_english_literature',
    available: true,
    filters: [
      {
        id: 'year',
        label: 'Year',
        field: 'year',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    indexName: 'v2_aqa_alevel_biology',
    available: true,
    filters: [
      {
        id: 'year',
        label: 'Year',
        field: 'year',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    indexName: 'v2_aqa_alevel_chemistry',
    available: true,
    filters: [
      {
        id: 'year',
        label: 'Year',
        field: 'year',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true
      }
    ]
  },
  {
    id: 'maths',
    name: 'Maths',
    indexName: 'v2_edexcel_alevel_maths',
    available: true,
    filters: [
      {
        id: 'year',
        label: 'Year',
        field: 'year',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'questionType',
        label: 'Question Type',
        field: 'question_type',
        type: 'checkbox',
        fetchFromIndex: true
      },
      {
        id: 'subTypes',
        label: 'Categories',
        field: 'sub_types',
        type: 'checkbox',
        fetchFromIndex: true
      }
    ]
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