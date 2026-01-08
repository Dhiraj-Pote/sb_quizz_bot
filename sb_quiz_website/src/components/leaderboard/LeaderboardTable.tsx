'use client';

import { Trophy, Clock, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt?: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
  showQuizInfo?: boolean;
}

export default function LeaderboardTable({ entries, title, showQuizInfo = false }: LeaderboardTableProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="medal-gold" size={28} />;
      case 2:
        return <Medal className="medal-silver" size={28} />;
      case 3:
        return <Medal className="medal-bronze" size={28} />;
      default:
        return (
          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  if (entries.length === 0) {
    return (
      <div className="card-sacred p-8 text-center">
        <Trophy className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Results Yet</h3>
        <p className="text-gray-400">Be the first to complete this quiz!</p>
      </div>
    );
  }

  return (
    <div className="card-sacred overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            {title}
          </h3>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`leaderboard-row border-l-4 ${getRankBg(entry.rank)}`}
          >
            {/* Rank */}
            <div className="w-12 flex justify-center">
              {getMedalIcon(entry.rank)}
            </div>

            {/* Name */}
            <div className="flex-1 ml-4">
              <p className="font-medium text-gray-800">{entry.name}</p>
              {entry.completedAt && (
                <p className="text-xs text-gray-400">
                  {new Date(entry.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Score */}
            <div className="text-right mr-6">
              <p className="font-bold text-orange-600">
                {entry.score}/{entry.totalQuestions}
              </p>
              <p className="text-xs text-gray-400">
                {Math.round((entry.score / entry.totalQuestions) * 100)}%
              </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-gray-500 min-w-[80px] justify-end">
              <Clock size={16} />
              <span className="text-sm font-medium">{formatTime(entry.timeSpent)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
