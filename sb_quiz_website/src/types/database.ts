// Database types for Supabase

export interface Canto {
  id: number;
  number: number;
  title: string;
  sanskrit_title: string;
  description: string;
  total_chapters: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  canto_id: number;
  chapter_number: number;
  title: string;
  sanskrit_title: string;
  description: string;
  total_questions: number;
  is_live: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  chapter_id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
  verse_reference?: string;
  order_index: number;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  chapter_id: string;
  score: number;
  total_questions: number;
  time_taken: number; // in seconds
  user_answers: number[];
  completed_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
}

export interface MahaLeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_score: number;
  total_questions: number;
  quizzes_completed: number;
  average_time: number;
}

// Quiz state for active quiz session
export interface QuizState {
  chapterId: string;
  currentQuestion: number;
  score: number;
  startTime: number;
  questionStartTime: number;
  userAnswers: (number | null)[];
  isComplete: boolean;
}
