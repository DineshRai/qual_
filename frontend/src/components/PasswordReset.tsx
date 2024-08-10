import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      console.error('Error sending password reset email:', error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Sending...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default PasswordReset;
