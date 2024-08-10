'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User } from 'firebase/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {user && (
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}