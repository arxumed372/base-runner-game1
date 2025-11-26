'use client';

import React, { useState, useEffect } from 'react';
import { LIVES_ICON_ONE, LIVES_ICON_TWO } from '../assets';
import { isSoundEnabled, toggleSound } from '../utils/sound';

interface HUDProps {
  score: number;
  lives: number;
  scoreMultiplier?: number;
  onSoundToggle: () => void;
}

export const HUD: React.FC<HUDProps> = ({ score, lives, scoreMultiplier = 1.0, onSoundToggle }) => {
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  
  // Sync with external sound state changes
  useEffect(() => {
    setSoundEnabled(isSoundEnabled());
  }, []);
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px',
      pointerEvents: 'none',
    }}>
      {/* Lives (top-left) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'auto',
      }}>
        {(() => {
          const iconSrc = lives >= 2 ? LIVES_ICON_TWO : lives === 1 ? LIVES_ICON_ONE : null;
          return iconSrc ? (
            <img
              src={iconSrc}
              alt={`${lives} lives`}
              style={{
                width: '64px',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          ) : null;
        })()}
        <span style={{
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '18px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}>
          {lives} lives
        </span>
      </div>
      
      {/* Score and Sound Toggle (top-right) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        pointerEvents: 'auto',
      }}>
        <div style={{
          color: '#fff',
          fontSize: '24px',
          fontFamily: 'monospace',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontWeight: 'bold',
        }}>
          Score: {Math.floor(score).toString().padStart(6, '0')}
          {scoreMultiplier > 1.0 && (
            <span style={{ marginLeft: '10px', color: '#ffff00' }}>
              (x{scoreMultiplier.toFixed(1)})
            </span>
          )}
        </div>
        <button
          onClick={() => {
            const newState = toggleSound();
            setSoundEnabled(newState);
            onSoundToggle();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: soundEnabled ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)',
            border: '2px solid #fff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'monospace',
            borderRadius: '4px',
          }}
        >
          Sound: {soundEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

