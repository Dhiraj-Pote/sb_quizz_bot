'use client';

import Link from 'next/link';
import { BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import type { Quiz } from '@/data/quizData';

interface QuizCardProps {
  quiz: Quiz;
  isCompleted?: boolean;
  userScore?: number;
}

export default function QuizCard({ quiz, isCompleted, userScore }: QuizCardProps) {
  const totalQuestions = quiz.questions.length;

  return (
    <Link href={`/quiz/${quiz.id}`}>
      <div className="card-sacred p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
              </span>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
              <CheckCircle size={14} />
              <span>Done</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
          {quiz.title}
        </h3>

        {/* Sanskrit Title */}
        {quiz.sanskritTitle && (
          <p className="text-sm text-orange-500 italic mb-3">{quiz.sanskritTitle}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{totalQuestions} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>~{totalQuestions} min</span>
          </div>
        </div>

        {/* Score if completed */}
        {isCompleted && userScore !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Your Score</span>
              <span className="font-bold text-orange-600">{userScore}/{totalQuestions}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(userScore / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
            {isCompleted ? 'Review Quiz' : 'Start Quiz'}
          </span>
          <ArrowRight 
            size={20} 
            className="text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" 
          />
        </div>
      </div>
    </Link>
  );
}
