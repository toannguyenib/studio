
"use client";

import type { League } from '@/types';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ShieldCheck, BrainCircuit, Atom } from 'lucide-react'; // Example icons

// Helper to get GraduationCap icon. It's not directly in Lucide so we create a placeholder
const GraduationCap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 002-2v-5"/>
  </svg>
);

const leagues: League[] = [
  { name: 'Word Novice', minPoints: 0, icon: ShieldCheck },
  { name: 'Lexicon Explorer', minPoints: 100, icon: Star },
  { name: 'Vocabulary Voyager', minPoints: 500, icon: BrainCircuit },
  { name: 'SAT Scholar', minPoints: 1000, icon: GraduationCap }, // GraduationCap used from lucide-react
  { name: 'Linguistic Master', minPoints: 2000, icon: Atom },
];


const getCurrentLeague = (points: number): League => {
  let currentLeague = leagues[0];
  for (const league of leagues) {
    if (points >= league.minPoints) {
      currentLeague = league;
    } else {
      break;
    }
  }
  return currentLeague;
};

export default function PointsLeague() {
  const { userData } = useUserProgress();
  const currentLeague = getCurrentLeague(userData.points);
  const nextLeague = leagues.find(l => l.minPoints > currentLeague.minPoints);

  const progressToNextLeague = nextLeague
    ? Math.max(0, Math.min(100, ((userData.points - currentLeague.minPoints) / (nextLeague.minPoints - currentLeague.minPoints)) * 100))
    : 100;

  const IconComponent = currentLeague.icon || Star;


  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Your Standing</CardTitle>
         <IconComponent className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-bold text-primary">{userData.points} Points</div>
        <p className="text-xl text-muted-foreground">
          Current Title: <span className="font-semibold text-accent">{currentLeague.name}</span>
        </p>
        {nextLeague && (
          <div>
            <p className="text-sm text-muted-foreground">
              Next Title: {nextLeague.name} (at {nextLeague.minPoints} points)
            </p>
            <div className="w-full bg-secondary rounded-full h-2.5 mt-1">
              <div
                className="bg-accent h-2.5 rounded-full"
                style={{ width: `${progressToNextLeague}%` }}
              ></div>
            </div>
             <p className="text-xs text-muted-foreground text-right">
              {userData.points} / {nextLeague.minPoints}
            </p>
          </div>
        )}
        {!nextLeague && (
           <p className="text-lg text-green-500 font-semibold">You've reached the highest rank!</p>
        )}
      </CardContent>
    </Card>
  );
}
