// Game state types
export type GameScreen = 'title' | 'intro' | 'game' | 'gameOver' | 'leaderboard' | 'shop';

export type GameState = 'running' | 'paused' | 'gameOver' | 'starting';

export type BackgroundPhase = 'sunset' | 'daytime' | 'night';

// Power-up types
export type PowerUpType = 'shield' | 'magnet';

// Game entities
export type ObstacleKind =
  | 'barrier'
  | 'trySign'
  | 'alienSign'
  | 'terminal'
  | 'warningSign';

export interface Obstacle {
  x: number;     // world position
  y: number;
  width: number;
  height: number;
  kind: ObstacleKind;
}

export interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'blue' | 'purple';
  collected: boolean;
}

export interface Heart {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  groundY: number;
  isJumpHeld: boolean;
}

// Visual effects
export interface PickupEffect {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'heart';
  age: number; // in seconds
  lifetime: number; // in seconds
}

export interface RunTrail {
  x: number;
  y: number;
  age: number; // in seconds
  lifetime: number; // in seconds
  color?: string; // for cosmetics
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  age: number;
  lifetime: number;
}

// Power-ups
export interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
  collected: boolean;
}

// Run statistics
export interface RunStats {
  score: number;
  coinsCollected: number;
  distance: number;
  maxCombo: number;
  time: number;
}

// Achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

// Game configuration
export interface GameConfig {
  gravity: number;
  jumpForce: number;
  groundY: number;
  playerSpeed: number;
  initialSpeed: number;
  maxSpeed: number;
  speedIncrease: number;
  speedPenaltyOnHit: number; // Speed reduction factor when losing a life
  speedRecoveryDuration: number; // Time in seconds to recover speed after losing a life
  scorePerFrame: number;
  coinScoreBlue: number;
  coinScorePurple: number;
  phaseThreshold1: number; // Score threshold for daytime phase
  phaseThreshold2: number; // Score threshold for night phase
  minJumpHeightCutVelocity: number; // velocity clamp when player releases jump early
  jumpCutEnabled: boolean; // feature flag for jump cut
  gravityUp: number; // gravity applied while going up (velocityY < 0)
  gravityDown: number; // gravity applied while falling (velocityY >= 0)
  maxFallSpeed: number; // maximum falling speed
  // Combo system
  comboTimeout: number; // seconds before combo resets
  // Effects
  hitFlashDuration: number; // seconds
  cameraShakeDuration: number; // seconds
  cameraShakeIntensity: number; // pixels
  // Trail
  trailSpawnInterval: number; // frames between trail particles
  trailLifetime: number; // seconds
}

