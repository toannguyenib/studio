"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, PencilLine, BarChart3, Sparkles, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/quiz', label: 'Quiz', icon: PencilLine },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/review', label: 'Review', icon: Sparkles },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-top md:hidden z-50">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-1/5 text-muted-foreground hover:text-primary transition-colors",
                isActive && "text-primary"
              )}
              aria-label={item.label}
            >
              <item.icon className={cn("w-6 h-6 mb-1", isActive ? "text-primary" : "text-gray-500")} />
              <span className={cn("text-xs font-medium", isActive ? "font-bold" : "")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
