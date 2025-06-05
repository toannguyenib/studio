"use client";

import { useUserProgress } from '@/contexts/UserProgressContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Award } from 'lucide-react';

export default function StreakTracker() {
  const { userData } = useUserProgress();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Current Daily Streak</CardTitle>
          <Flame className="h-6 w-6 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{userData.currentDailyStreak} days</div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Longest Daily Streak</CardTitle>
          <Award className="h-6 w-6 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{userData.longestDailyStreak} days</div>
          <p className="text-xs text-muted-foreground">Your personal best!</p>
        </CardContent>
      </Card>
    </div>
  );
}
