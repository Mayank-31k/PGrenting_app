'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('./HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading PG Renter...</p>
      </div>
    </div>
  )
});

export default function ClientOnlyPage() {
  const [mounted, setMounted] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Add a small delay to ensure DOM is fully ready and extensions have finished modifying
    const timer = setTimeout(() => {
      setIsHydrating(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything on the server or during initial hydration
  if (typeof window === 'undefined' || !mounted || isHydrating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PG Renter...</p>
        </div>
      </div>
    );
  }

  return <HomePage />;
}