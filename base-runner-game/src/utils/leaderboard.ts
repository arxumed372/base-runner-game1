import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'baserunner_leaderboard';
const MAX_ENTRIES = 500;

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
}

export function addToLeaderboard(name: string, score: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const entries = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score,
      date: new Date().toISOString(),
    };
    
    entries.push(newEntry);
    
    // Sort by score descending and keep top 500
    entries.sort((a, b) => b.score - a.score);
    const topEntries = entries.slice(0, MAX_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
  }
}

export function clearLeaderboard(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEADERBOARD_KEY);
}

