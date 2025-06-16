
"use client";

import Link from 'next/link';
import { Crown, LogOut, UserCircle, Settings, LogInIcon, UserPlus } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';

export default function Header() {
  const { currentUser, isLoggedIn, logout, userData, isLoading: isUserProgressLoading } = useUserProgress();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to home after logout
    router.refresh(); // To ensure header updates and context reloads for anonymous user
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    return <UserCircle className="w-5 h-5" />;
  };


  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-headline font-bold hover:opacity-80 transition-opacity">
          {/* <Image src="/logo-placeholder.png" alt="Tieng Anh Ivy Logo" width={30} height={30} data-ai-hint="ivy leaf app logo" /> */}
          <span>Tieng Anh Ivy</span>
        </Link>
        <div className="flex items-center space-x-4">
          {!isUserProgressLoading && (
            <div className="flex items-center space-x-2 text-sm">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>{userData.points} pts</span>
            </div>
          )}
          {isUserProgressLoading ? (
            <div className="w-20 h-8 bg-primary/50 animate-pulse rounded-md"></div>
          ) : isLoggedIn && currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    {/* Placeholder for user avatar image if available in future */}
                    {/* <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.first_name} /> */}
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      {getInitials(currentUser.first_name, currentUser.last_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{currentUser.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                <Link href="/auth/login">
                  <LogInIcon className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="secondary" size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/auth/signup">
                 <UserPlus className="mr-1 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
