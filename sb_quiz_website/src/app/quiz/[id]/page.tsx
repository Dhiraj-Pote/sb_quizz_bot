'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Trophy, Play } from 'lucide-react';
import { getQuiz } from '@/data/quizData';
import QuizPlayer from '@/components/quiz/QuizPlayer';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const [hasStarted, setHasStarted] = useState(false);
  
  const quiz = getQuiz(id);

  if (!quiz) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="card-sacred p-12">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h1>
            <p className="text-gray-500 mb-6">
              The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 btn-saffron"
            >
              <ArrowLeft size={20} />
              Browse All Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const estimatedTime = totalQuestions; // 1 minute per question

  // Quiz intro screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Quizzes
          </Link>

          {/* Quiz Info Card */}
          <div className="card-sacred p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-block text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-4">
                Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {quiz.title}
              </h1>
              {quiz.sanskritTitle && (
                <p className="text-lg text-orange-500 italic">{quiz.sanskritTitle}</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8">
              {quiz.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <BookOpen className="mx-auto text-orange-500 mb-2" size={28} />
                <p className="text-2xl font-bold text-gray-800">{totalQuestions}</p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Clock className="mx-auto text-orange-500 mb-2" size={28} />
                <p className="text-2xl font-bold text-gray-800">60s</p>
                <p className="text-sm text-gray-500">Per Question</p>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-3">Quiz Rules</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  You have 60 seconds to answer each question
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  If time runs out, the question is marked as unanswered
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  You&apos;ll see the correct answer after each question
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Your score and time will be recorded on the leaderboard
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setHasStarted(true)}
              className="w-full btn-saffron flex items-center justify-center gap-3 text-lg py-4"
            >
              <Play size={24} />
              Start Quiz
            </button>

            {/* Leaderboard Link */}
            <div className="mt-6 text-center">
              <Link
                href={`/leaderboard/${quiz.id}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
              >
                <Trophy size={18} />
                View Leaderboard for this Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz player
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <QuizPlayer 
          quiz={quiz} 
          onComplete={(score, time, answers) => {
            // TODO: Save to Supabase
            console.log('Quiz completed:', { score, time, answers });
          }}
        />
      </div>
    </div>
  );
}
