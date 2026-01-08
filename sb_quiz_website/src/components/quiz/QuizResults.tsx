'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw, Share2, BookOpen, ArrowRight } from 'lucide-react';
import type { Quiz } from '@/data/quizData';

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  totalTime: number;
  userAnswers: (number | null)[];
  onRetry: () => void;
}

export default function QuizResults({ quiz, score, totalTime, userAnswers, onRetry }: QuizResultsProps) {
  const [showReview, setShowReview] = useState(false);
  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine result message and emoji
  let resultEmoji = '🎉';
  let resultMessage = 'Great effort!';
  let resultColor = 'text-orange-600';

  if (percentage >= 80) {
    resultEmoji = '🏆';
    resultMessage = 'Excellent! You really know your Bhāgavatam!';
    resultColor = 'text-yellow-600';
  } else if (percentage >= 60) {
    resultEmoji = '👏';
    resultMessage = 'Good job! Keep studying!';
    resultColor = 'text-green-600';
  } else if (percentage >= 40) {
    resultEmoji = '💪';
    resultMessage = 'Keep practicing! You\'re learning!';
    resultColor = 'text-blue-600';
  } else {
    resultEmoji = '📚';
    resultMessage = 'Time to revisit this chapter!';
    resultColor = 'text-purple-600';
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleShare = async () => {
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on the ${quiz.title} quiz! 🙏\n\nTry it yourself: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Śrīmad Bhāgavatam Quiz Result',
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    }
  };

  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card-sacred p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Review Your Answers</h2>
            <button
              onClick={() => setShowReview(false)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Back to Results
            </button>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct;
              const isTimeout = userAnswer === null;

              return (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isCorrect 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-800">{question.question}</p>
                  </div>

                  <div className="ml-11 space-y-2">
                    {isTimeout ? (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock size={18} />
                        <span>Time&apos;s up - No answer</span>
                      </div>
                    ) : isCorrect ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={18} />
                        <span>Your answer: {question.options[userAnswer]}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle size={18} />
                          <span>Your answer: {question.options[userAnswer!]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={18} />
                          <span>Correct: {question.options[question.correct]}</span>
                        </div>
                      </>
                    )}

                    {question.verseReference && (
                      <p className="text-sm text-orange-500 italic mt-2">
                        Reference: {question.verseReference}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Result Card */}
      <div className="card-sacred p-8 text-center mb-6 slide-up">
        {/* Emoji */}
        <div className="text-6xl mb-4">{resultEmoji}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className={`text-lg ${resultColor} font-medium mb-6`}>{resultMessage}</p>

        {/* Score Circle */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 4.4} 440`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{score}</span>
            <span className="text-gray-500">/ {totalQuestions}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
              <Trophy size={18} />
              <span className="text-sm">Score</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{percentage}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
              <Clock size={18} />
              <span className="text-sm">Time</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatTime(totalTime)}</p>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-orange-600">Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}</span>
            <br />
            {quiz.title}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors"
          >
            <BookOpen size={20} />
            Review Answers
          </button>
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 btn-saffron"
          >
            <Share2 size={20} />
            Share Result
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/leaderboard/${quiz.id}`}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Trophy size={20} className="text-yellow-500" />
          View Leaderboard
        </Link>
        <Link
          href="/quizzes"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          More Quizzes
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
