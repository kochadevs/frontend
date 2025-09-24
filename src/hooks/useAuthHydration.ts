import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuthHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if we're in the browser and store is hydrated
    if (typeof window !== 'undefined') {
      const unsubscribe = useAuthStore.persist.onHydrate(() => {
      });

      const unsubscribeFinish = useAuthStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
      });

      // If already hydrated, set immediately
      if (useAuthStore.persist.hasHydrated()) {
        setIsHydrated(true);
      }

      return () => {
        unsubscribe();
        unsubscribeFinish();
      };
    }
  }, []);

  return isHydrated;
};