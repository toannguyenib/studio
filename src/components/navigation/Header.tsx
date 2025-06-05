"use client";

import Link from 'next/link';
import { Crown } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';

export default function Header() {
  const { userData, isLoading } = useUserProgress();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold hover:opacity-80 transition-opacity">
          Vocab Victor
        </Link>
        <div className="flex items-center space-x-2 text-sm">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>{isLoading ? '...' : userData.points} pts</span>
        </div>
      </div>
    </header>
  );
}
