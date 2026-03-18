import { useCallback } from 'react';

type SoundType = 'coin_collect' | 'customer_angry' | 'restock' | 'unlock';

const SOUND_PATHS: Record<SoundType, string> = {
  coin_collect: 'sounds/coin_collect.mp3',
  customer_angry: 'sounds/customer_angry.mp3',
  restock: 'sounds/restock.mp3',
  unlock: 'sounds/unlock.mp3',
};

export function useSoundEffect() {
  const playSound = useCallback((type: SoundType) => {
    // TODO: integrate expo-av once audio assets are added (sounds/ directory)
    console.log(`[Sound] Playing: ${SOUND_PATHS[type]}`);
  }, []);

  return { playSound };
}
