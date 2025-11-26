'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { BaseRunnerGame } from '../base-runner-game/src/components/BaseRunnerGame';

export default function Home() {
  // Initialize Farcaster MiniApp SDK - signals to Base that the mini-app is ready
  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (error) {
      console.error('Failed to initialize Farcaster MiniApp SDK:', error);
    }
  }, []);

  return <BaseRunnerGame />;
}

