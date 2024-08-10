'use client';

import { signIn } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  }, [credentials, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border rounded-md"
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border rounded-md"
        placeholder="Password"
      />
      <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        Log In
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}