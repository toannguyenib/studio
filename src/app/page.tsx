"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Star, Zap, BookOpenText, Brain } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { vocabulary, MAX_LEVEL } from '@/lib/vocabulary';

export default function HomePage() {
  const { userData, isLoading } = useUserProgress();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading your progress...</p></div>;
  }

  const wordsKnownCount = Object.values(userData.wordStats).filter(stat => stat.correctAnswers > 0).length;
  const totalWords = vocabulary.length;
  const progressPercentage = totalWords > 0 ? Math.round((wordsKnownCount / totalWords) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Welcome to Vocab Victor!</CardTitle>
          <CardDescription className="text-lg">Ready to conquer SAT vocabulary?</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Flame} title="Current Streak" value={`${userData.currentDailyStreak} days`} color="text-orange-500" />
          <StatCard icon={Star} title="Total Points" value={`${userData.points} pts`} color="text-yellow-500" />
          <StatCard icon={GraduationCap} title="Unlocked Levels" value={`${userData.unlockedLevels.length} / ${MAX_LEVEL}`} color="text-green-500" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          href="/learn"
          icon={BookOpenText}
          title="Learn Words"
          description="Explore new vocabulary by difficulty levels."
          buttonText="Start Learning"
        />
        <ActionCard
          href="/quiz"
          icon={Zap}
          title="Take a Quiz"
          description="Test your knowledge and earn points."
          buttonText="Start Quiz"
        />
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Review</CardTitle>
          <CardDescription>Let our AI suggest words for you to review based on your performance.</CardDescription>
        </CardHeader>
        <CardContent>
           <Link href="/review" passHref>
              <Button className="w-full" size="lg">
                <Brain className="mr-2 h-5 w-5" />
                Go to AI Review
              </Button>
            </Link>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-2">Words Mastered: {wordsKnownCount} / {totalWords}</p>
          <div className="w-full bg-secondary rounded-full h-6">
            <div
              className="bg-primary h-6 rounded-full text-xs font-medium text-primary-foreground text-center p-1 leading-none"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color?: string;
}

function StatCard({ icon: Icon, title, value, color = "text-primary" }: StatCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6 flex items-center space-x-4">
        <Icon className={`w-10 h-10 ${color}`} />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActionCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
}

function ActionCard({ href, icon: Icon, title, description, buttonText }: ActionCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Icon className="w-8 h-8 text-primary" />
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <Link href={href} passHref>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{buttonText}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
