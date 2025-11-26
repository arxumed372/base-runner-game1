'use client';

import React, { useState, useEffect } from 'react';
import { GameScreen } from './GameScreen';
import { TitleScreen } from './TitleScreen';
import { IntroScreen } from './IntroScreen';
import { GameOverScreen } from './GameOverScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { ShopScreen } from './ShopScreen';
import { HUD } from './HUD';
import { GameScreenWithHUD } from './GameScreenWithHUD';
import { GameScreen as GameScreenType } from '../types';
import { initSound, playBackgroundMusic, stopBackgroundMusic } from '../utils/sound';
import { SOUND_BG } from '../assets';

export const BaseRunnerGame: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('title');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStats, setGameStats] = useState<any>(null);

  // Initialize sound
  useEffect(() => {
    initSound(SOUND_BG);
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  // Handle screen transitions
  const handleStart = () => {
    setCurrentScreen('intro');
  };

  const handleContinue = () => {
    setCurrentScreen('game');
    playBackgroundMusic();
  };

  const handleGameOver = (finalScore: number, stats: any) => {
    setScore(finalScore);
    setGameStats(stats);
    stopBackgroundMusic();
    setCurrentScreen('gameOver');
  };

  const handlePlayAgain = () => {
    setScore(0);
    setLives(2);
    setCurrentScreen('title');
  };

  const handleLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleBack = () => {
    setCurrentScreen('title');
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {currentScreen === 'title' && (
        <TitleScreen
          onStart={handleStart}
          onLeaderboard={handleLeaderboard}
          onShop={() => setCurrentScreen('shop')}
        />
      )}
      {currentScreen === 'intro' && <IntroScreen onContinue={handleContinue} />}
      {currentScreen === 'game' && (
        <GameScreenWithHUD
          onGameOver={handleGameOver}
          onSoundToggle={handleSoundToggle}
          onExitToMenu={() => setCurrentScreen('title')}
        />
      )}
      {currentScreen === 'gameOver' && (
        <GameOverScreen
          score={score}
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onLeaderboard={handleLeaderboard}
        />
      )}
      {currentScreen === 'leaderboard' && <LeaderboardScreen onBack={handleBack} />}
      {currentScreen === 'shop' && <ShopScreen onBack={handleBack} />}
    </div>
  );
};

