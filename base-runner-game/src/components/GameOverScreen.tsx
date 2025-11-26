'use client';

import React, { useState, useEffect } from 'react';
import { addToLeaderboard } from '../utils/leaderboard';
import { RunStats } from '../types';
import { updateStats, getPlayerStats, getNewRecords } from '../utils/stats';
import { checkAchievements, getAchievement, ACHIEVEMENTS } from '../achievements';

const PROFILE_KEY = 'baserunner_player_profile';

function updatePlayerCoins(coinsEarned: number): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    const profile = saved
      ? JSON.parse(saved)
      : {
          coinsTotal: 0,
          coinsBalance: 0,
          ownedCosmetics: ['trail_default'],
          selectedTrailStyle: 'trail_default',
        };

    profile.coinsTotal = (profile.coinsTotal || 0) + coinsEarned;
    profile.coinsBalance = (profile.coinsBalance || 0) + coinsEarned;

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to update coins:', error);
  }
}

interface GameOverScreenProps {
  score: number;
  stats?: RunStats;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  stats,
  onPlayAgain,
  onLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [playerStats, setPlayerStats] = useState(getPlayerStats());
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [newRecords, setNewRecords] = useState(getNewRecords(stats || { score: 0, coinsCollected: 0, distance: 0, maxCombo: 0, time: 0 }));

  useEffect(() => {
    if (stats) {
      // Update stats
      const updated = updateStats(stats);
      setPlayerStats(updated);
      
      // Update player coins
      updatePlayerCoins(stats.coinsCollected);
      
      // Check achievements
      const unlocked = checkAchievements(stats);
      setNewAchievements(unlocked);
      
      // Check records
      setNewRecords(getNewRecords(stats));
    }
  }, [stats]);

  useEffect(() => {
    // Auto-focus name input
    const input = document.getElementById('player-name-input');
    if (input) {
      (input as HTMLInputElement).focus();
    }
  }, []);

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() || !nameSubmitted) {
      addToLeaderboard(playerName.trim() || 'Anonymous', score);
      setNameSubmitted(true);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
        }}
      />

      {/* Game Over Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          border: '4px solid #fff',
          boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '48px',
            fontFamily: 'monospace',
            margin: '0 0 20px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          Game Over
        </h1>

        <div
          style={{
            color: '#fff',
            fontSize: '32px',
            fontFamily: 'monospace',
            marginBottom: '20px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          Final Score: {Math.floor(score).toString().padStart(6, '0')}
        </div>

        {/* Run Stats */}
        {stats && (
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px', fontFamily: 'monospace' }}>
              Run Stats
            </h3>
            <div style={{ color: '#ccc', fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.6' }}>
              <div>Coins: {stats.coinsCollected}</div>
              <div>Distance: {Math.floor(stats.distance)}</div>
              <div>Max Combo: {stats.maxCombo}</div>
              <div>Time: {Math.floor(stats.time)}s</div>
            </div>
          </div>
        )}

        {/* Best Stats */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px', fontFamily: 'monospace' }}>
            Best Stats
          </h3>
          <div style={{ color: '#ccc', fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.6' }}>
            <div>
              Best Score: {Math.floor(playerStats.bestScore).toString().padStart(6, '0')}
              {newRecords.newBestScore && <span style={{ color: '#0f0', marginLeft: '10px' }}>New!</span>}
            </div>
            <div>
              Best Distance: {Math.floor(playerStats.bestDistance)}
              {newRecords.newBestDistance && <span style={{ color: '#0f0', marginLeft: '10px' }}>New!</span>}
            </div>
            <div>
              Best Combo: {playerStats.bestMaxCombo}
              {newRecords.newBestCombo && <span style={{ color: '#0f0', marginLeft: '10px' }}>New!</span>}
            </div>
          </div>
        </div>

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <h3 style={{ color: '#ffd700', fontSize: '20px', marginBottom: '10px', fontFamily: 'monospace' }}>
              New Achievements!
            </h3>
            {newAchievements.map((id) => {
              const achievement = getAchievement(id);
              return achievement ? (
                <div key={id} style={{ color: '#ffd700', fontSize: '14px', fontFamily: 'monospace', marginBottom: '5px' }}>
                  {achievement.title}: {achievement.description}
                </div>
              ) : null;
            })}
          </div>
        )}

        {!nameSubmitted ? (
          <form onSubmit={handleSubmitName} style={{ marginBottom: '30px' }}>
            <input
              id="player-name-input"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              style={{
                padding: '12px',
                fontSize: '16px',
                fontFamily: 'monospace',
                width: '100%',
                marginBottom: '15px',
                borderRadius: '4px',
                border: '2px solid #888',
                backgroundColor: '#222',
                color: '#fff',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(0,150,255,0.7)',
                border: '2px solid #fff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: 'monospace',
                borderRadius: '8px',
                width: '100%',
              }}
            >
              Submit Score
            </button>
          </form>
        ) : (
          <div
            style={{
              color: '#0f0',
              fontSize: '16px',
              fontFamily: 'monospace',
              marginBottom: '30px',
            }}
          >
            Score saved!
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={onPlayAgain}
            style={{
              padding: '15px 30px',
              backgroundColor: 'rgba(0,255,0,0.7)',
              border: '2px solid #fff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              fontFamily: 'monospace',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            Play Again
          </button>
          <button
            onClick={onLeaderboard}
            style={{
              padding: '15px 30px',
              backgroundColor: 'rgba(0,150,255,0.7)',
              border: '2px solid #fff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              fontFamily: 'monospace',
              borderRadius: '8px',
            }}
          >
            Open Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

