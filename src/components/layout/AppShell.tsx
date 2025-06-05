"use client";

import React from 'react';
import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* Added pb-24 for bottom nav spacing */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
