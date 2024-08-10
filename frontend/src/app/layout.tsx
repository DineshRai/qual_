'use client';

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/config/firebase';  // Add this line at the top

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-100">
        <SessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}