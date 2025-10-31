export interface AnswerOption {
  letter: string;
  text: string;
}

export interface Question {
  question_number?: number;
  year?: number;
  question_type?: string;
  sub_types?: string | string[];
  question_content?: string;
  question?: string;
  question_text?: string;
  options?: Array<{ id: string; text: string } | string>;
  correct_answer?: string;
  videoSolutionLink?: string;
  imageFile?: string;
  imageUrl?: string;
  
  // Maths/A Level specific properties
  paper_info?: {
    year?: number;
    paper_reference?: string;
    [key: string]: any;
  };
  spec_topic?: string;
  question_topic?: string;
  filters?: string[];
  marks?: number;
  video_solution_url_1?: string;
  qualification_level?: string;
  markscheme_pdf?: string;
  pdf_url?: string;
  markscheme_url?: string;
  answer_pdf?: string;
  answers_pdf?: string;

  // English Literature specific properties
  BoardID?: string;
  CourseID?: string;
  CourseName?: string;
  QualificationLevel?: string;
  Subject?: string;
  PaperYear?: number;
  PaperMonth?: string;
  PaperNumber?: number;
  PaperName?: string;
  PaperCode?: string;
  PaperSection?: string;
  QuestionNo?: number;
  QuestionTotalMarks?: number;
  QuestionPrompt?: string;
  Text1?: {
    Type?: string;
    Age?: string;
    Theme?: string;
    Author?: string;
    Title?: string;
    [key: string]: any;
  };
  MS?: string; // Markscheme PDF
  QP?: string; // Question Paper PDF
  ER?: string; // Examiner Report PDF
  MSStartPage?: number;
  QPStartPage?: number;
  ERStartPage?: number;

  // Interview question specific properties
  QuestionID?: string;
  Time?: number; // Duration in minutes
  QuestionPromptText?: string;
  SubjectId1?: string;
  SubjectId2?: string;
  all_subjects?: string[];
  subjects_clean?: string[];
  question_text_clean?: string;
}

export interface QuestionCardProps {
  hit?: Question;
}