'use client';

import React, { useState } from 'react';
import { GameScreen } from './GameScreen';
import { HUD } from './HUD';
import { toggleSound } from '../utils/sound';

interface GameScreenWithHUDProps {
  onGameOver: (score: number, stats: any) => void;
  onSoundToggle: () => void;
  onExitToMenu?: () => void;
}

export const GameScreenWithHUD: React.FC<GameScreenWithHUDProps> = ({
  onGameOver,
  onSoundToggle,
  onExitToMenu,
}) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [scoreMultiplier, setScoreMultiplier] = useState(1.0);

  return (
    <>
      <GameScreen
        onGameOver={onGameOver}
        onScoreChange={setScore}
        onLivesChange={setLives}
        onMultiplierChange={setScoreMultiplier}
        onExitToMenu={onExitToMenu}
      />
      <HUD
        score={score}
        lives={lives}
        scoreMultiplier={scoreMultiplier}
        onSoundToggle={() => {
          toggleSound();
          onSoundToggle();
        }}
      />
    </>
  );
};

