'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Trophy, BookOpen, Clock, TrendingUp, LogIn, Mail } from 'lucide-react';
import { getAvailableQuizzes } from '@/data/quizData';

// Mock user data - will be replaced with Supabase auth
const mockUser = null; // Set to null to show login prompt

const mockUserStats = {
  name: 'Devotee',
  email: 'devotee@example.com',
  quizzesCompleted: 4,
  totalScore: 18,
  totalQuestions: 25,
  averageTime: 45,
  bestStreak: 5,
};

const mockCompletedQuizzes = [
  { quizId: 'canto_3_chapter_17', score: 4, totalQuestions: 5, timeSpent: 180, completedAt: '2025-12-28' },
  { quizId: 'canto_3_chapter_18', score: 4, totalQuestions: 4, timeSpent: 150, completedAt: '2025-12-27' },
  { quizId: 'canto_3_chapter_19', score: 6, totalQuestions: 8, timeSpent: 320, completedAt: '2025-12-26' },
  { quizId: 'canto_3_chapter_20', score: 4, totalQuestions: 8, timeSpent: 280, completedAt: '2025-12-25' },
];

export default function ProfilePage() {
  const [isLoggedIn] = useState(!!mockUser);
  const quizzes = getAvailableQuizzes();

  // Login prompt for non-authenticated users
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="card-sacred p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <User className="text-orange-400" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Devotee!</h1>
            <p className="text-gray-500 mb-8">
              Sign in to track your progress, save your scores, and appear on the leaderboard.
            </p>

            {/* Login Options */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Mail className="text-gray-600" size={20} />
                Continue with Email
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-400 mb-4">Or continue as guest</p>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <BookOpen size={18} />
                Browse Quizzes
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-4">
            <h3 className="text-center text-gray-600 font-medium">Why sign in?</h3>
            <div className="grid gap-3">
              <BenefitCard icon={<Trophy size={20} />} text="Appear on public leaderboards" />
              <BenefitCard icon={<TrendingUp size={20} />} text="Track your progress over time" />
              <BenefitCard icon={<BookOpen size={20} />} text="Review your past quiz answers" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in user profile
  const percentage = Math.round((mockUserStats.totalScore / mockUserStats.totalQuestions) * 100);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card-sacred p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
              {mockUserStats.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{mockUserStats.name}</h1>
              <p className="text-gray-500">{mockUserStats.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="text-orange-500" size={24} />}
            value={mockUserStats.quizzesCompleted.toString()}
            label="Quizzes Completed"
          />
          <StatCard
            icon={<Trophy className="text-yellow-500" size={24} />}
            value={`${percentage}%`}
            label="Average Score"
          />
          <StatCard
            icon={<Clock className="text-blue-500" size={24} />}
            value={`${mockUserStats.averageTime}s`}
            label="Avg. Time/Question"
          />
          <StatCard
            icon={<TrendingUp className="text-green-500" size={24} />}
            value={mockUserStats.bestStreak.toString()}
            label="Best Streak"
          />
        </div>

        {/* Completed Quizzes */}
        <div className="card-sacred overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <h2 className="font-bold text-lg text-gray-800">Your Quiz History</h2>
          </div>

          <div className="divide-y divide-gray-50">
            {mockCompletedQuizzes.map((result, index) => {
              const quiz = quizzes.find(q => q.id === result.quizId);
              if (!quiz) return null;

              return (
                <div key={index} className="p-4 hover:bg-orange-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <BookOpen className="text-orange-500" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{quiz.title}</p>
                        <p className="text-sm text-gray-400">
                          Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {result.score}/{result.totalQuestions}
                      </p>
                      <p className="text-xs text-gray-400">{result.completedAt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mockCompletedQuizzes.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">You haven&apos;t completed any quizzes yet</p>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Start your first quiz
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="card-sacred p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function BenefitCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
      <div className="text-orange-500">{icon}</div>
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
}
