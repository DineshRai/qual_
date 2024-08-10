'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signup() {``
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const result = await signIn('credentials', {
          ...credentials,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/dashboard');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  }, [credentials, router]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}