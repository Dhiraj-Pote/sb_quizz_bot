'use client';

import Link from 'next/link';
import { BookOpen, Trophy, Home, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-xl">🙏</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-800">SB Quiz</h1>
              <p className="text-xs text-orange-600 -mt-1">Śrīmad Bhāgavatam</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" icon={<Home size={18} />} label="Home" />
            <NavLink href="/quizzes" icon={<BookOpen size={18} />} label="Quizzes" />
            <NavLink href="/leaderboard" icon={<Trophy size={18} />} label="Leaderboard" />
            <NavLink href="/profile" icon={<User size={18} />} label="Profile" />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-full bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-orange-100 fade-in">
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/" icon={<Home size={20} />} label="Home" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/quizzes" icon={<BookOpen size={20} />} label="Quizzes" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/profile" icon={<User size={20} />} label="Profile" onClick={() => setIsMenuOpen(false)} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
