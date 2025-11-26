import { Achievement } from './types';
import { RunStats } from './types';

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_death',
    title: 'First Steps',
    description: 'Complete your first run',
  },
  {
    id: 'score_500',
    title: 'Getting Started',
    description: 'Reach a score of 500',
  },
  {
    id: 'coins_50',
    title: 'Coin Collector',
    description: 'Collect 50 coins in a single run',
  },
  {
    id: 'distance_1000',
    title: 'Long Runner',
    description: 'Run a distance of 1000 units',
  },
  {
    id: 'combo_x3',
    title: 'Combo Master',
    description: 'Reach a x3 score multiplier',
  },
  {
    id: 'score_2000',
    title: 'High Scorer',
    description: 'Reach a score of 2000',
  },
  {
    id: 'coins_100',
    title: 'Rich Runner',
    description: 'Collect 100 coins in a single run',
  },
];

// Check achievements based on run stats
export function checkAchievements(stats: RunStats): string[] {
  const unlocked: string[] = [];
  const saved = getUnlockedAchievements();

  // First death - always unlock if not already
  if (!saved.includes('first_death')) {
    unlocked.push('first_death');
  }

  // Score achievements
  if (stats.score >= 500 && !saved.includes('score_500')) {
    unlocked.push('score_500');
  }
  if (stats.score >= 2000 && !saved.includes('score_2000')) {
    unlocked.push('score_2000');
  }

  // Coin achievements
  if (stats.coinsCollected >= 50 && !saved.includes('coins_50')) {
    unlocked.push('coins_50');
  }
  if (stats.coinsCollected >= 100 && !saved.includes('coins_100')) {
    unlocked.push('coins_100');
  }

  // Distance achievement
  if (stats.distance >= 1000 && !saved.includes('distance_1000')) {
    unlocked.push('distance_1000');
  }

  // Combo achievement
  if (stats.maxCombo >= 15 && !saved.includes('combo_x3')) {
    unlocked.push('combo_x3');
  }

  // Save newly unlocked achievements
  if (unlocked.length > 0) {
    saveUnlockedAchievements([...saved, ...unlocked]);
  }

  return unlocked;
}

// Get unlocked achievements from localStorage
export function getUnlockedAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('baserunner_unlocked_achievements');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save unlocked achievements to localStorage
export function saveUnlockedAchievements(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('baserunner_unlocked_achievements', JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
}

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

