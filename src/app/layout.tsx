import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/layout/AppShell';
import { UserProgressProvider } from '@/contexts/UserProgressContext';

export const metadata: Metadata = {
  title: 'Tieng Anh Ivy', // Updated App Name
  description: 'Master IELTS vocabulary with Tieng Anh Ivy!', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <UserProgressProvider>
          <AppShell>
            {children}
          </AppShell>
        </UserProgressProvider>
        <Toaster />
      </body>
    </html>
  );
}
