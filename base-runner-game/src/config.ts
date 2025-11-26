import { GameConfig } from './types';

// Game configuration constants
export const GAME_CONFIG: GameConfig = {
  gravity: 0.8,
  jumpForce: -29, // Jump force - long hold gives high jump, early release gives short jump (increased by 20%)
  groundY: 0.85, // 85% from top of canvas (ground position)
  playerSpeed: 0,
  initialSpeed: 12, // Faster starting speed
  maxSpeed: 24, // Higher max speed
  speedIncrease: 0.002, // Faster acceleration
  speedPenaltyOnHit: 0.3, // Speed reduction factor when losing a life (30% reduction)
  speedRecoveryDuration: 3.0, // Time in seconds to recover speed after losing a life
  scorePerFrame: 0.1, // Score points per frame (increases with speed)
  coinScoreBlue: 10, // Points for blue coin (Zora token)
  coinScorePurple: 20, // Points for purple coin (Farc token)
  phaseThreshold1: 1000, // Switch to daytime at 1000 points
  phaseThreshold2: 3000, // Switch to night at 3000 points
  // Jump tuning
  minJumpHeightCutVelocity: -7,  // velocity clamp when player releases jump early (short jump, increased by 20%)
  jumpCutEnabled: true,          // feature flag in case we want to quickly disable
  // Gravity tuning: stronger when going up, weaker when falling
  gravityUp: 0.9,     // keep the quick takeoff
  gravityDown: 0.35,  // slower fall
  maxFallSpeed: 14,   // clamp fall speed a bit lower
  // Combo system
  comboTimeout: 3.0,  // seconds before combo resets
  // Effects
  hitFlashDuration: 0.2,  // seconds
  cameraShakeDuration: 0.25,  // seconds
  cameraShakeIntensity: 5,  // pixels
  // Trail
  trailSpawnInterval: 7,  // frames between trail particles
  trailLifetime: 0.25,  // seconds
};

// Player sprite configuration
export const PLAYER_CONFIG = {
  width: 120, // Player sprite width (larger for BassyJayse1.png)
  height: 220, // Player sprite height (keep aspect ratio)
  x: 200, // Fixed horizontal position (player stays here, world moves)
  runBobAmount: 4, // Vertical bobbing amount for run animation (pixels)
  runBobSpeed: 0.12, // Speed of bobbing animation
  groundOffsetY: 6, // Vertical offset to position player on ground
};

// Obstacle spawn configuration
export const OBSTACLE_CONFIG = {
  minGap: 350,          // minimal world distance between obstacles
  maxGap: 650,          // maximal distance
  baseSpawnChance: 0.7, // base probability when gap is satisfied
  speedSpawnFactor: 0.3 // how much spawn chance grows with speed
};

// Coin spawn configuration
export const COIN_CONFIG = {
  spawnRate: 0.002, // Probability of spawning per frame
  minGap: 220,
  maxGap: 380,
  width: 30,
  height: 30,
  floatHeight: 100, // Height above ground for coins
};

// Heart spawn configuration
export const HEART_CONFIG = {
  spawnRate: 0.001, // Rare spawn rate
  minGap: 600,
  maxGap: 1000,
  width: 30,
  height: 30,
  floatHeight: 80,
};

// Power-up spawn configuration
export const POWERUP_CONFIG = {
  spawnRate: 0.0008, // Probability of spawning per frame
  minGap: 800,
  maxGap: 1200,
  width: 40,
  height: 40,
  floatHeight: 150, // Higher than coins/hearts
  magnetDuration: 8.0, // seconds
  shieldChance: 0.5, // 50% shield, 50% magnet
  magnetChance: 0.5,
};

// Magnet configuration
export const MAGNET_CONFIG = {
  radius: 200, // pixels
  pullSpeed: 0.15, // lerp factor (0-1)
};

