import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAuthToken } from '../../lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const { token, role, error } = router.query;

  useEffect(() => {
    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      setAuthToken(token);
      
      // Redirect based on role
      if (role === 'driver') {
        router.push('/driver');
      } else {
        router.push('/');
      }
    }
  }, [token, role, error, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}
