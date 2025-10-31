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
}

export interface QuestionCardProps {
  hit?: Question;
}