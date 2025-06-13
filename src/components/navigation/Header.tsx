"use client";

import Link from 'next/link';
import { Crown } from 'lucide-react'; // Using Crown for points, could be replaced with an ivy leaf or similar if desired
import { useUserProgress } from '@/contexts/UserProgressContext';
import Image from 'next/image';

export default function Header() {
  const { userData, isLoading } = useUserProgress();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-headline font-bold hover:opacity-80 transition-opacity">
          {/* Placeholder for logo image - replace with actual logo path or component */}
          {/* <Image src="/logo-placeholder.png" alt="Tieng Anh Ivy Logo" width={30} height={30} data-ai-hint="ivy leaf app logo" /> */}
          <span>Tieng Anh Ivy</span>
        </Link>
        <div className="flex items-center space-x-2 text-sm">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>{isLoading ? '...' : userData.points} pts</span>
        </div>
      </div>
    </header>
  );
}
