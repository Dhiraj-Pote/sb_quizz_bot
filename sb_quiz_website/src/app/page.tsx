'use client';

import Link from 'next/link';
import { BookOpen, Trophy, Users, ArrowRight, Sparkles } from 'lucide-react';
import { getAvailableQuizzes, CANTOS } from '@/data/quizData';
import QuizCard from '@/components/quiz/QuizCard';

export default function HomePage() {
  const availableQuizzes = getAvailableQuizzes();
  const featuredQuizzes = availableQuizzes.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-orange-600 mb-6 shadow-sm">
              <Sparkles size={16} />
              <span>For ISKCON Devotees</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Śrīmad Bhāgavatam
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Quiz Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Test your knowledge of the beautiful pastimes and teachings from the 
              <span className="text-orange-600 font-medium"> ripened fruit of Vedic literature</span>. 
              Chapter-wise quizzes with timed questions and leaderboards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quizzes"
                className="btn-saffron flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <BookOpen size={22} />
                Start a Quiz
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-lg"
              >
                <Trophy size={22} />
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={<BookOpen />} value="12" label="Cantos" />
            <StatCard icon={<BookOpen />} value={availableQuizzes.length.toString()} label="Quizzes Available" />
            <StatCard icon={<Users />} value="100+" label="Questions" />
            <StatCard icon={<Trophy />} value="∞" label="Blessings" />
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Quizzes</h2>
              <p className="text-gray-500 mt-1">Start with these popular chapters</p>
            </div>
            <Link
              href="/quizzes"
              className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredQuizzes.map(quiz => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              View All Quizzes
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Cantos Overview */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              12 Cantos of Śrīmad Bhāgavatam
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore quizzes organized by Canto. Each Canto contains multiple chapters 
              with unique questions about the transcendental pastimes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CANTOS.map(canto => {
              const cantoQuizzes = availableQuizzes.filter(q => q.cantoNumber === canto.number);
              return (
                <Link
                  key={canto.number}
                  href={`/quizzes?canto=${canto.number}`}
                  className="card-sacred p-4 hover:shadow-lg transition-all hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                      {canto.number}
                    </span>
                    <div>
                      <p className="text-xs text-orange-500 italic">{canto.sanskritTitle}</p>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                    {canto.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {cantoQuizzes.length > 0 
                      ? `${cantoQuizzes.length} quiz${cantoQuizzes.length > 1 ? 'zes' : ''} available`
                      : 'Coming soon'
                    }
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">How It Works</h2>
            <p className="text-gray-500">Simple steps to test your knowledge</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Choose a Quiz"
              description="Browse quizzes by Canto and Chapter. Each quiz has 5-10 questions from that chapter."
            />
            <StepCard
              number={2}
              title="Answer Questions"
              description="You have 60 seconds per question. Choose wisely and answer before time runs out!"
            />
            <StepCard
              number={3}
              title="See Your Results"
              description="View your score, review answers, and see where you rank on the leaderboard."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join devotees from around the world in studying the Śrīmad Bhāgavatam
          </p>
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
          >
            <BookOpen size={24} />
            Browse All Quizzes
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
