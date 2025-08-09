'use client'

import { useEffect, useState } from 'react';

/**
 * Custom hook to safely handle hydration and prevent SSR mismatches
 * caused by browser extensions or client-only code
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after the component mounts
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook to safely check if we're running on the client side
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}