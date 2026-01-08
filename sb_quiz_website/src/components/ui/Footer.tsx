'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Quote */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 italic text-sm">
              "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode."
            </p>
            <p className="text-orange-600 text-xs mt-1 font-medium">— Bhagavad-gītā 4.9</p>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>for ISKCON devotees</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-orange-100 text-center text-xs text-gray-400">
          <p>Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare</p>
          <p>Hare Rāma Hare Rāma Rāma Rāma Hare Hare</p>
        </div>
      </div>
    </footer>
  );
}
