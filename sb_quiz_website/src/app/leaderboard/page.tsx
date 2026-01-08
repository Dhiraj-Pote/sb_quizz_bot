'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Globe, BookOpen } from 'lucide-react';
import { getAvailableQuizzes, CANTOS } from '@/data/quizData';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

// Mock data - will be replaced with Supabase data
const mockMahaLeaderboard = [
  { rank: 1, name: 'Radha Priya Dasi', score: 45, totalQuestions: 50, timeSpent: 1200 },
  { rank: 2, name: 'Krishna Das', score: 42, totalQuestions: 50, timeSpent: 1350 },
  { rank: 3, name: 'Govinda Prabhu', score: 40, totalQuestions: 50, timeSpent: 1100 },
  { rank: 4, name: 'Madhavi Devi', score: 38, totalQuestions: 50, timeSpent: 1400 },
  { rank: 5, name: 'Vrindavan Das', score: 35, totalQuestions: 50, timeSpent: 1250 },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'maha' | 'chapter'>('maha');
  const quizzes = getAvailableQuizzes();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 mb-4 shadow-lg">
            <Trophy className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-500">See how you rank among other devotees</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('maha')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'maha'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe size={20} />
            Mahā Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('chapter')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'chapter'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={20} />
            By Chapter
          </button>
        </div>

        {/* Content */}
        {activeTab === 'maha' ? (
          <div>
            <div className="card-sacred p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-orange-500" size={24} />
                <div>
                  <h2 className="font-bold text-lg text-gray-800">Overall Rankings</h2>
                  <p className="text-sm text-gray-500">Combined scores across all quizzes</p>
                </div>
              </div>
              <LeaderboardTable entries={mockMahaLeaderboard} />
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>Rankings update in real-time as devotees complete quizzes</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-500 text-center mb-6">
              Select a quiz to view its leaderboard
            </p>

            {/* Quiz List */}
            <div className="grid gap-4">
              {quizzes.map(quiz => (
                <Link
                  key={quiz.id}
                  href={`/leaderboard/${quiz.id}`}
                  className="card-sacred p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <BookOpen className="text-white" size={24} />
                      </div>
                      <div>
                        <span className="text-xs text-orange-500 font-medium">
                          Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
                        </span>
                        <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                          {quiz.title}
                        </h3>
                      </div>
                    </div>
                    <Trophy className="text-gray-300 group-hover:text-yellow-500 transition-colors" size={24} />
                  </div>
                </Link>
              ))}
            </div>

            {quizzes.length === 0 && (
              <div className="card-sacred p-12 text-center">
                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No quizzes available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
