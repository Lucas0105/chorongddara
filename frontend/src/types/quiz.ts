export interface Quiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizProblemProps {
  quizData: Quiz;
  index: number;
}

export interface QuizStar {
  culturalPropertyId: number;
  starType: string;
}
