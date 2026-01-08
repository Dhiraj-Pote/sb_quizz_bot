'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, BookOpen, Share2 } from 'lucide-react';
import { getQuiz } from '@/data/quizData';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

interface LeaderboardPageProps {
  params: Promise<{ id: string }>;
}

// Mock data - will be replaced with Supabase real-time data
const mockLeaderboard = [
  { rank: 1, name: 'Radha Priya Dasi', score: 5, totalQuestions: 5, timeSpent: 180, completedAt: '2025-12-28T10:30:00Z' },
  { rank: 2, name: 'Krishna Das', score: 5, totalQuestions: 5, timeSpent: 210, completedAt: '2025-12-28T09:15:00Z' },
  { rank: 3, name: 'Govinda Prabhu', score: 4, totalQuestions: 5, timeSpent: 150, completedAt: '2025-12-27T14:20:00Z' },
  { rank: 4, name: 'Madhavi Devi', score: 4, totalQuestions: 5, timeSpent: 200, completedAt: '2025-12-27T11:45:00Z' },
  { rank: 5, name: 'Vrindavan Das', score: 3, totalQuestions: 5, timeSpent: 175, completedAt: '2025-12-26T16:30:00Z' },
  { rank: 6, name: 'Tulasi Devi', score: 3, totalQuestions: 5, timeSpent: 190, completedAt: '2025-12-26T13:00:00Z' },
  { rank: 7, name: 'Nitai Prabhu', score: 3, totalQuestions: 5, timeSpent: 220, completedAt: '2025-12-25T18:15:00Z' },
  { rank: 8, name: 'Gauranga Das', score: 2, totalQuestions: 5, timeSpent: 160, completedAt: '2025-12-25T10:00:00Z' },
];

export default function ChapterLeaderboardPage({ params }: LeaderboardPageProps) {
  const { id } = use(params);
  const quiz = getQuiz(id);

  if (!quiz) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="card-sacred p-12">
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h1>
            <p className="text-gray-500 mb-6">
              The leaderboard you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 btn-saffron"
            >
              <ArrowLeft size={20} />
              Back to Leaderboards
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareText = `Check out the leaderboard for "${quiz.title}" quiz!\n\n${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${quiz.title} - Leaderboard`,
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          All Leaderboards
        </Link>

        {/* Quiz Info */}
        <div className="card-sacred p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <span className="text-sm text-orange-500 font-medium">
                  Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
                </span>
                <h1 className="text-xl font-bold text-gray-800 mt-1">{quiz.title}</h1>
                {quiz.sanskritTitle && (
                  <p className="text-sm text-gray-500 italic">{quiz.sanskritTitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors"
              title="Share leaderboard"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <LeaderboardTable 
          entries={mockLeaderboard} 
          title={`Top ${mockLeaderboard.length} Devotees`}
        />

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/quiz/${quiz.id}`}
            className="btn-saffron flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            Take This Quiz
          </Link>
          <Link
            href="/quizzes"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse More Quizzes
          </Link>
        </div>

        {/* Real-time indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Leaderboard updates in real-time
          </div>
        </div>
      </div>
    </div>
  );
}
