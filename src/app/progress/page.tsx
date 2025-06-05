"use client";

import StreakTracker from '@/components/StreakTracker';
import PointsLeague from '@/components/PointsLeague';
import { Button } from '@/components/ui/button';
import { useUserProgress } from '@/contexts/UserProgressContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

export default function ProgressPage() {
  const { resetProgress, userData, isLoading } = useUserProgress();

  if (isLoading) {
    return <div className="text-center py-10"><p>Loading your progress...</p></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      <h1 className="text-4xl font-headline text-center mb-8 text-primary">Your Progress</h1>
      
      <StreakTracker />
      <PointsLeague />

      <div className="pt-8 text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg">
              <Trash2 className="mr-2 h-5 w-5" /> Reset All Progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your
                progress, including points, streaks, and word statistics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetProgress}>
                Yes, reset my progress
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
