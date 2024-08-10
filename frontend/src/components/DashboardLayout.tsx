'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from '@/components/Logout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { User, FileText, BarChart, UserCircle, Home, FolderPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects/new', label: 'New Project', icon: FolderPlus },
    { href: '/dashboard/upload', label: 'Upload Files', icon: FileText },
    { href: '/dashboard/analysis', label: 'Analysis', icon: BarChart },
    { href: '/profile', label: 'Profile', icon: UserCircle },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Or redirect to login
  }

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.href === pathname);
    return currentItem ? currentItem.label : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Qualitative Analysis Tool</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              <Logout />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="w-64">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </aside>

          <main className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>{getPageTitle()}</CardTitle>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;