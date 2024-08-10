'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}