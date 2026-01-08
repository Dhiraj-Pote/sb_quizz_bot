'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { getAvailableQuizzes, CANTOS } from '@/data/quizData';
import QuizCard from '@/components/quiz/QuizCard';

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCanto, setSelectedCanto] = useState<number | null>(null);

  const allQuizzes = getAvailableQuizzes();

  const filteredQuizzes = useMemo(() => {
    return allQuizzes.filter(quiz => {
      const matchesSearch = searchQuery === '' || 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCanto = selectedCanto === null || quiz.cantoNumber === selectedCanto;

      return matchesSearch && matchesCanto;
    });
  }, [allQuizzes, searchQuery, selectedCanto]);

  // Group quizzes by canto
  const quizzesByCanto = useMemo(() => {
    const grouped: Record<number, typeof filteredQuizzes> = {};
    filteredQuizzes.forEach(quiz => {
      if (!grouped[quiz.cantoNumber]) {
        grouped[quiz.cantoNumber] = [];
      }
      grouped[quiz.cantoNumber].push(quiz);
    });
    return grouped;
  }, [filteredQuizzes]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Quizzes</h1>
          <p className="text-gray-500">
            Browse and take quizzes from all 12 Cantos of Śrīmad Bhāgavatam
          </p>
        </div>

        {/* Filters */}
        <div className="card-sacred p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>

            {/* Canto Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCanto ?? ''}
                onChange={(e) => setSelectedCanto(e.target.value ? Number(e.target.value) : null)}
                className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none bg-white min-w-[180px]"
              >
                <option value="">All Cantos</option>
                {CANTOS.map(canto => (
                  <option key={canto.number} value={canto.number}>
                    Canto {canto.number}: {canto.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <BookOpen size={18} />
          <span>
            {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} found
          </span>
        </div>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <div className="card-sacred p-12 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Quizzes Found</h3>
            <p className="text-gray-400">
              {searchQuery || selectedCanto 
                ? 'Try adjusting your filters'
                : 'Quizzes are being prepared. Check back soon!'}
            </p>
          </div>
        ) : selectedCanto ? (
          // Show flat list when canto is selected
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          // Show grouped by canto
          <div className="space-y-10">
            {Object.entries(quizzesByCanto)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([cantoNum, quizzes]) => {
                const canto = CANTOS.find(c => c.number === Number(cantoNum));
                return (
                  <div key={cantoNum}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                        {cantoNum}
                      </span>
                      <div>
                        <h2 className="font-bold text-xl text-gray-800">
                          Canto {cantoNum}: {canto?.title}
                        </h2>
                        {canto?.sanskritTitle && (
                          <p className="text-sm text-orange-500 italic">{canto.sanskritTitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quizzes.map(quiz => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
