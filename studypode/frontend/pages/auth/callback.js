import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAuthToken } from '../../lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const { token, role, error } = router.query;

  useEffect(() => {
    if (error) {
      console.error('OAuth error:', error);
      const errorMessage = router.query.message || error;
      router.push(`/login?error=${error}&message=${encodeURIComponent(errorMessage)}`);
      return;
    }

    if (token) {
      try {
        setAuthToken(token);
        console.log('Auth token set successfully');
        
        // Redirect based on role
        setTimeout(() => {
          if (role === 'driver') {
            router.push('/driver');
          } else {
            router.push('/');
          }
        }, 500);
      } catch (err) {
        console.error('Error setting auth token:', err);
        router.push('/login?error=token_error');
      }
    } else if (!error) {
      // No token and no error - might be loading
      setTimeout(() => {
        router.push('/login?error=no_token');
      }, 2000);
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
