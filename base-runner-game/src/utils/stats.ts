import { RunStats } from '../types';

const STATS_KEY = 'baserunner_stats';

export interface PlayerStats {
  bestScore: number;
  bestDistance: number;
  bestMaxCombo: number;
  totalCoinsCollected: number;
  totalRunsPlayed: number;
}

// Get player stats from localStorage
export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return {
      bestScore: 0,
      bestDistance: 0,
      bestMaxCombo: 0,
      totalCoinsCollected: 0,
      totalRunsPlayed: 0,
    };
  }

  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }

  return {
    bestScore: 0,
    bestDistance: 0,
    bestMaxCombo: 0,
    totalCoinsCollected: 0,
    totalRunsPlayed: 0,
  };
}

// Update stats with new run results
export function updateStats(runStats: RunStats): PlayerStats {
  const current = getPlayerStats();
  const updated: PlayerStats = {
    bestScore: Math.max(current.bestScore, runStats.score),
    bestDistance: Math.max(current.bestDistance, runStats.distance),
    bestMaxCombo: Math.max(current.bestMaxCombo, runStats.maxCombo),
    totalCoinsCollected: current.totalCoinsCollected + runStats.coinsCollected,
    totalRunsPlayed: current.totalRunsPlayed + 1,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  return updated;
}

// Check if current run set any new records
export function getNewRecords(runStats: RunStats): {
  newBestScore: boolean;
  newBestDistance: boolean;
  newBestCombo: boolean;
} {
  const current = getPlayerStats();
  return {
    newBestScore: runStats.score > current.bestScore,
    newBestDistance: runStats.distance > current.bestDistance,
    newBestCombo: runStats.maxCombo > current.bestMaxCombo,
  };
}

