import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { isAuthenticated } from '../lib/auth';
import { users } from '../lib/api';

const MapComponent = dynamic(() => import('../components/Map'), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    users.getMe()
      .then(res => {
        setUserRole(res.data.role);
        if (res.data.role === 'driver') {
          router.push('/driver');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  if (userRole === 'driver') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Uber Clone</h1>
        <button
          onClick={() => {
            require('../lib/auth').removeAuthToken();
            router.push('/login');
          }}
          className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </nav>
      <MapComponent />
    </div>
  );
}
