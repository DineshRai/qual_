import { auth } from '@/config/firebase';

export const getValidToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (!user) {
    console.error('No user is currently signed in');
    return null;
  }

  try {
    const token = await user.getIdToken(true); 
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Failed to get a valid token:', error);
    return null;
  }
};