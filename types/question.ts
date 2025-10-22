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
  options?: Array<{ id: string; text: string } | string>;
  correct_answer?: string;
  videoSolutionLink?: string;
  imageFile?: string;
}

export interface QuestionCardProps {
  hit?: Question;
}