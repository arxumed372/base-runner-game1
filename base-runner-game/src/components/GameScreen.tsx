'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Player, Obstacle, ObstacleKind, Coin, Heart, BackgroundPhase, PickupEffect, RunTrail, FloatingText, PowerUp, PowerUpType, RunStats } from '../types';
import { GAME_CONFIG, OBSTACLE_CONFIG, COIN_CONFIG, HEART_CONFIG, PLAYER_CONFIG, POWERUP_CONFIG, MAGNET_CONFIG } from '../config';
import {
  BG_SUNSET,
  BG_DAYTIME,
  BG_NIGHT,
  PLAYER_SPRITE,
  OBSTACLE_1,
  OBSTACLE_2,
  OBSTACLE_3,
  OBSTACLE_4,
  OBSTACLE_5,
  OBSTACLE_SIZES,
  COIN_BLUE,
  COIN_PURPLE,
  HEART_PICKUP,
  COIN_RENDER_SIZE,
  HEART_RENDER_SIZE,
} from '../assets';
import { playCoinSound } from '../utils/sound';

interface GameScreenProps {
  onGameOver: (score: number, stats: RunStats) => void;
  onPause?: () => void;
  onScoreChange?: (score: number) => void;
  onLivesChange?: (lives: number) => void;
  onMultiplierChange?: (multiplier: number) => void;
  onExitToMenu?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onPause, onScoreChange, onLivesChange, onMultiplierChange, onExitToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const bobTimeRef = useRef<number>(0); // Animation timer for bobbing pickups
  
  // Bobbing animation constants
  const BOB_SPEED = 1.8; // cycles per second
  const BOB_AMPLITUDE = 4; // pixels
  
  // Safe distance for coin spawning (avoid obstacles)
  const SAFE_COIN_OBSTACLE_DISTANCE = 180; // pixels in world coordinates
  
  // Use refs for game state that needs immediate access in game loop
  const gameStateRef = useRef({
    player: { 
      x: PLAYER_CONFIG.x, 
      y: 0, 
      width: PLAYER_CONFIG.width, 
      height: PLAYER_CONFIG.height, 
      velocityY: 0, 
      isJumping: false, 
      groundY: 0,
      isJumpHeld: false,
      runBobOffset: 0, // For run animation bobbing
    },
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    hearts: [] as Heart[],
    powerUps: [] as PowerUp[],
    score: 0,
    lives: 2,
    gameSpeed: GAME_CONFIG.initialSpeed,
    maxReachedSpeed: GAME_CONFIG.initialSpeed, // Maximum speed reached (never decreases)
    speedRecoveryTimer: 0, // Timer for speed recovery after losing a life (seconds)
    backgroundPhase: 'sunset' as BackgroundPhase,
    worldOffsetX: 0, // World scroll offset (increases over time)
    groundOffsetX: 0, // Ground pattern scroll offset
    lastObstacleX: 0, // Track last obstacle spawn position
    lastCoinX: 0, // Track last coin spawn position
    lastHeartX: 0, // Track last heart spawn position
    lastPowerUpX: 0, // Track last power-up spawn position
    isInvincible: false, // Player invincibility state
    invincibleTimer: 0, // Time remaining for invincibility (seconds)
    gameTime: 0, // Game time in seconds (for background phase changes)
    // Combo system
    comboCount: 0,
    maxCombo: 0,
    comboTimer: 0,
    scoreMultiplier: 1.0,
    // Power-ups
    shieldActive: false,
    magnetActive: false,
    magnetTimer: 0,
    // Effects
    hitFlashTime: 0,
    cameraShakeTime: 0,
    cameraShakeOffsetX: 0,
    cameraShakeOffsetY: 0,
    // Run stats
    runCoinsCollected: 0,
    runStartTime: 0,
  });

  const [player, setPlayer] = useState<Player>({
    x: PLAYER_CONFIG.x,
    y: 0,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    velocityY: 0,
    isJumping: false,
    groundY: 0,
    isJumpHeld: false,
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [pickupEffects, setPickupEffects] = useState<PickupEffect[]>([]);
  const [runTrail, setRunTrail] = useState<RunTrail[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.initialSpeed);
  const [backgroundPhase, setBackgroundPhase] = useState<BackgroundPhase>('sunset');
  const [isPaused, setIsPaused] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const trailFrameCounter = useRef<number>(0);
  
  // Preload images for better performance
  const imagesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  
  useEffect(() => {
    // Preload all images
    const preloadImage = (src: string, key: string) => {
      const img = new Image();
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
      };
      // Store image immediately, but check naturalWidth before drawing
      imagesRef.current[key] = img;
      img.src = src;
    };
    
    preloadImage(BG_SUNSET, 'sunset');
    preloadImage(BG_DAYTIME, 'daytime');
    preloadImage(BG_NIGHT, 'night');
    preloadImage(PLAYER_SPRITE, 'player');
    preloadImage(OBSTACLE_1, 'obstacle_barrier');
    preloadImage(OBSTACLE_2, 'obstacle_trySign');
    preloadImage(OBSTACLE_3, 'obstacle_alienSign');
    preloadImage(OBSTACLE_4, 'obstacle_terminal');
    preloadImage(OBSTACLE_5, 'obstacle_warningSign');
    preloadImage(COIN_BLUE, 'coinBlue');
    preloadImage(COIN_PURPLE, 'coinPurple');
    preloadImage(HEART_PICKUP, 'heart');
  }, []);

  // Sync state to refs
  useEffect(() => {
    gameStateRef.current.player = {
      ...gameStateRef.current.player,
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
      velocityY: player.velocityY,
      isJumping: player.isJumping,
      groundY: player.groundY,
    };
    gameStateRef.current.obstacles = obstacles;
    gameStateRef.current.coins = coins;
    gameStateRef.current.hearts = hearts;
    gameStateRef.current.score = score;
    gameStateRef.current.lives = lives;
    gameStateRef.current.gameSpeed = gameSpeed;
    gameStateRef.current.backgroundPhase = backgroundPhase;
  }, [player, obstacles, coins, hearts, score, lives, gameSpeed, backgroundPhase]);

  // Initialize canvas and ground position
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const groundY = canvas.height * GAME_CONFIG.groundY + PLAYER_CONFIG.groundOffsetY;
      const newPlayer = { 
        ...player, 
        x: PLAYER_CONFIG.x,
        y: groundY - PLAYER_CONFIG.height, 
        groundY,
        width: PLAYER_CONFIG.width,
        height: PLAYER_CONFIG.height,
      };
      setPlayer(newPlayer);
      gameStateRef.current.player = {
        ...newPlayer,
        runBobOffset: 0,
      };
      gameStateRef.current.player.groundY = groundY;
    }
  }, []);

  // Handle jump start
  const handleJumpStart = useCallback(() => {
    const currentPlayer = gameStateRef.current.player;
    if (!currentPlayer.isJumping && currentPlayer.y >= currentPlayer.groundY - currentPlayer.height) {
      const newPlayer = {
        ...currentPlayer,
        velocityY: GAME_CONFIG.jumpForce,
        isJumping: true,
        isJumpHeld: true,
      };
      setPlayer(newPlayer);
      gameStateRef.current.player = { ...newPlayer, runBobOffset: currentPlayer.runBobOffset };
    }
  }, []);

  // Handle jump release with jump cut logic
  const handleJumpRelease = useCallback(() => {
    const currentPlayer = gameStateRef.current.player;
    const newPlayer = {
      ...currentPlayer,
      isJumpHeld: false,
    };
    
    // Apply jump cut if enabled and player is still going up
    if (GAME_CONFIG.jumpCutEnabled && newPlayer.velocityY < GAME_CONFIG.minJumpHeightCutVelocity) {
      newPlayer.velocityY = GAME_CONFIG.minJumpHeightCutVelocity;
    }
    
    setPlayer(newPlayer);
    gameStateRef.current.player = { ...newPlayer, runBobOffset: currentPlayer.runBobOffset };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isPaused) {
          handleJumpStart();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        if (onPause) onPause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleJumpRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleJumpStart, handleJumpRelease, isPaused, onPause]);

  // Touch controls for mobile
  useEffect(() => {
    const handleTouchStart = () => {
      if (!isPaused) {
        handleJumpStart();
      }
    };

    const handleTouchEnd = () => {
      handleJumpRelease();
    };

    const handleTouchCancel = () => {
      handleJumpRelease();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchCancel);
      canvas.addEventListener('mousedown', handleTouchStart);
      canvas.addEventListener('mouseup', handleTouchEnd);
      canvas.addEventListener('click', handleTouchStart);
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchCancel);
        canvas.removeEventListener('mousedown', handleTouchStart);
        canvas.removeEventListener('mouseup', handleTouchEnd);
        canvas.removeEventListener('click', handleTouchStart);
      };
    }
  }, [handleJumpStart, handleJumpRelease, isPaused]);

  // Countdown timer
  useEffect(() => {
    if (!isStarting) return;
    
    let currentCount = 3;
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else if (currentCount === 0) {
        setCountdown(0);
        // Show GO! for 1 second
        setTimeout(() => {
          setIsStarting(false);
        }, 1000);
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isStarting]);

  // Initialize run start time when game actually starts
  useEffect(() => {
    if (!isStarting && countdown === 0 && gameStateRef.current.runStartTime === 0) {
      gameStateRef.current.runStartTime = Date.now();
    }
  }, [isStarting, countdown]);

  // Game loop
  useEffect(() => {
    if (isPaused || lives <= 0 || isStarting) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lives <= 0) {
        // Calculate final stats
        const stats: RunStats = {
          score,
          coinsCollected: gameStateRef.current.runCoinsCollected,
          distance: gameStateRef.current.worldOffsetX,
          maxCombo: gameStateRef.current.maxCombo,
          time: (Date.now() - gameStateRef.current.runStartTime) / 1000,
        };
        onGameOver(score, stats);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = canvas.height * GAME_CONFIG.groundY;
    let lastSpawnTime = Date.now();
    let lastCoinSpawnTime = Date.now();
    let lastHeartSpawnTime = Date.now();

    const gameLoop = (currentTime: number) => {
      const state = gameStateRef.current;
      
      // Calculate delta time for smooth animation
      const deltaTime = lastFrameTimeRef.current ? (currentTime - lastFrameTimeRef.current) / 16.67 : 1; // Normalize to 60fps
      // Calculate delta time in seconds for bobbing animation
      const deltaTimeSeconds = lastFrameTimeRef.current ? (currentTime - lastFrameTimeRef.current) / 1000 : 0.016;
      lastFrameTimeRef.current = currentTime;
      
      // Update bobbing animation timer (in seconds, for smooth sine wave)
      bobTimeRef.current += deltaTimeSeconds;
      
      // Update game time for background phase changes
      state.gameTime += deltaTimeSeconds;
      
      // Update invincibility timer
      if (state.isInvincible) {
        state.invincibleTimer -= deltaTimeSeconds;
        if (state.invincibleTimer <= 0) {
          state.isInvincible = false;
          state.invincibleTimer = 0;
        }
      }

      // Update combo timer
      if (state.comboCount > 0) {
        state.comboTimer += deltaTimeSeconds;
        if (state.comboTimer >= GAME_CONFIG.comboTimeout) {
          state.comboCount = 0;
          state.comboTimer = 0;
          state.scoreMultiplier = 1.0;
          if (onMultiplierChange) onMultiplierChange(1.0);
        }
      }

      // Update power-up timers
      if (state.magnetActive) {
        state.magnetTimer -= deltaTimeSeconds;
        if (state.magnetTimer <= 0) {
          state.magnetActive = false;
          state.magnetTimer = 0;
        }
      }

      // Update effect timers
      if (state.hitFlashTime > 0) {
        state.hitFlashTime -= deltaTimeSeconds;
        if (state.hitFlashTime < 0) state.hitFlashTime = 0;
      }

      if (state.cameraShakeTime > 0) {
        state.cameraShakeTime -= deltaTimeSeconds;
        // Calculate shake offset
        const shakeProgress = state.cameraShakeTime / GAME_CONFIG.cameraShakeDuration;
        const intensity = GAME_CONFIG.cameraShakeIntensity * shakeProgress;
        state.cameraShakeOffsetX = (Math.random() - 0.5) * intensity * 2;
        state.cameraShakeOffsetY = (Math.random() - 0.5) * intensity * 2;
        if (state.cameraShakeTime <= 0) {
          state.cameraShakeTime = 0;
          state.cameraShakeOffsetX = 0;
          state.cameraShakeOffsetY = 0;
        }
      }

      // Update pickup effects
      setPickupEffects((prev) => {
        return prev
          .map((effect) => ({
            ...effect,
            age: effect.age + deltaTimeSeconds,
          }))
          .filter((effect) => effect.age < effect.lifetime);
      });

      // Update run trail
      setRunTrail((prev) => {
        return prev
          .map((trail) => ({
            ...trail,
            age: trail.age + deltaTimeSeconds,
          }))
          .filter((trail) => trail.age < trail.lifetime);
      });

      // Update floating texts
      setFloatingTexts((prev) => {
        return prev
          .map((text) => ({
            ...text,
            age: text.age + deltaTimeSeconds,
            y: text.y - 30 * deltaTimeSeconds, // Float upward
          }))
          .filter((text) => text.age < text.lifetime);
      });
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update background phase based on time (every 2 minutes = 120 seconds)
      const PHASE_DURATION = 120; // 2 minutes in seconds
      let newPhase: BackgroundPhase = state.backgroundPhase;
      const phaseIndex = Math.floor(state.gameTime / PHASE_DURATION) % 3;
      
      if (phaseIndex === 0) {
        newPhase = 'sunset';
      } else if (phaseIndex === 1) {
        newPhase = 'daytime';
      } else {
        newPhase = 'night';
      }
      
      if (newPhase !== state.backgroundPhase) {
        setBackgroundPhase(newPhase);
        state.backgroundPhase = newPhase;
      }

      // Update game speed - always increasing based on score
      const baseSpeed = Math.min(
        GAME_CONFIG.initialSpeed + state.score * GAME_CONFIG.speedIncrease,
        GAME_CONFIG.maxSpeed
      );
      
      // Update max reached speed (never decreases)
      if (baseSpeed > state.maxReachedSpeed) {
        state.maxReachedSpeed = baseSpeed;
      }
      
      // Handle speed recovery after losing a life
      if (state.speedRecoveryTimer > 0) {
        state.speedRecoveryTimer -= deltaTimeSeconds;
        if (state.speedRecoveryTimer <= 0) {
          state.speedRecoveryTimer = 0;
        }
      }
      
      // Calculate current speed with penalty/recovery
      let currentSpeed = state.maxReachedSpeed;
      if (state.speedRecoveryTimer > 0) {
        // Gradually recover from penalty
        const recoveryProgress = 1 - (state.speedRecoveryTimer / GAME_CONFIG.speedRecoveryDuration);
        const penaltySpeed = state.maxReachedSpeed * (1 - GAME_CONFIG.speedPenaltyOnHit);
        currentSpeed = penaltySpeed + (state.maxReachedSpeed - penaltySpeed) * recoveryProgress;
      }
      
      // Ensure speed never goes below base speed (always accelerating)
      currentSpeed = Math.max(currentSpeed, baseSpeed);
      
      // Update speed
      if (Math.abs(currentSpeed - state.gameSpeed) > 0.01) {
        setGameSpeed(currentSpeed);
        state.gameSpeed = currentSpeed;
      }

      // Update world scroll offset (this is the key to making the world move)
      state.worldOffsetX += state.gameSpeed * deltaTime;
      state.groundOffsetX += state.gameSpeed * deltaTime;
      
      // Reset ground offset when it exceeds pattern width (for seamless scrolling)
      const groundPatternWidth = 200; // Width of repeating ground pattern
      if (state.groundOffsetX >= groundPatternWidth) {
        state.groundOffsetX -= groundPatternWidth;
      }

      // Draw background with parallax scrolling
      const bgKey = newPhase;
      const bgImg = imagesRef.current[bgKey];
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        // Parallax: background scrolls slower than foreground (0.3x speed)
        const bgOffsetX = (state.worldOffsetX * 0.3) % canvas.width;
        ctx.drawImage(bgImg, -bgOffsetX, 0, canvas.width, canvas.height);
        // Draw second copy for seamless scrolling
        if (bgOffsetX > 0) {
          ctx.drawImage(bgImg, canvas.width - bgOffsetX, 0, canvas.width, canvas.height);
        }
      } else {
        // Fallback: fill with color if image not loaded yet
        ctx.fillStyle = newPhase === 'night' ? '#1a1a2e' : newPhase === 'daytime' ? '#87ceeb' : '#ff6b35';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update player physics with asymmetric gravity
      let newPlayer = { ...state.player };
      newPlayer.y += newPlayer.velocityY;
      
      // Use different gravity for going up vs falling down
      const isGoingUp = newPlayer.velocityY < 0;
      const currentGravity = isGoingUp
        ? GAME_CONFIG.gravityUp
        : GAME_CONFIG.gravityDown;
      
      newPlayer.velocityY += currentGravity;
      
      // Clamp max fall speed so the player doesn't drop too fast
      if (newPlayer.velocityY > GAME_CONFIG.maxFallSpeed) {
        newPlayer.velocityY = GAME_CONFIG.maxFallSpeed;
      }

      if (newPlayer.y >= newPlayer.groundY - newPlayer.height) {
        newPlayer.y = newPlayer.groundY - newPlayer.height;
        newPlayer.velocityY = 0;
        newPlayer.isJumping = false;
        newPlayer.isJumpHeld = false;
      }

      // Update run animation (bobbing effect when on ground)
      if (!newPlayer.isJumping) {
        newPlayer.runBobOffset = Math.sin(state.worldOffsetX * PLAYER_CONFIG.runBobSpeed) * PLAYER_CONFIG.runBobAmount;
      } else {
        newPlayer.runBobOffset = 0; // No bobbing while jumping
      }

      // Player X position is fixed (world moves, not player)
      newPlayer.x = PLAYER_CONFIG.x;

      setPlayer(newPlayer);
      state.player = newPlayer;

      // Spawn obstacles (distance-based with speed factor)
      const distanceSinceLastObstacle = state.worldOffsetX - state.lastObstacleX;
      
      const speedFactor = (state.gameSpeed - GAME_CONFIG.initialSpeed) /
                          (GAME_CONFIG.maxSpeed - GAME_CONFIG.initialSpeed || 1);
      
      const gap =
        OBSTACLE_CONFIG.minGap +
        (OBSTACLE_CONFIG.maxGap - OBSTACLE_CONFIG.minGap) * (1 - speedFactor);
      
      if (distanceSinceLastObstacle < gap) {
        // skip obstacle spawn this frame
      } else {
        // we MAY spawn, based on random chance
        const spawnChance = Math.min(
          1,
          OBSTACLE_CONFIG.baseSpawnChance +
            OBSTACLE_CONFIG.speedSpawnFactor * speedFactor
        );
        
        if (Math.random() < spawnChance) {
          // choose and create a new obstacle
          let kind: ObstacleKind;
          const r = Math.random();
          if (r < 0.40) kind = 'barrier';
          else if (r < 0.65) kind = 'terminal';
          else if (r < 0.80) kind = 'warningSign';
          else if (r < 0.90) kind = 'alienSign';
          else kind = 'trySign';
          
          const size = OBSTACLE_SIZES[kind];
          const obstacleHeight = size.height;
          const obstacleWidth = size.width;
          
          const newObstacle: Obstacle = {
            kind,
            width: obstacleWidth,
            height: obstacleHeight,
            x: canvas.width + state.worldOffsetX, // spawn just off-screen to the right
            y: groundY - obstacleHeight,
          };
          
          state.obstacles.push(newObstacle);
          setObstacles([...state.obstacles]);
          state.lastObstacleX = state.worldOffsetX;
        }
      }

      // Spawn coins
      const coinSpawnDistance = COIN_CONFIG.minGap + (COIN_CONFIG.maxGap - COIN_CONFIG.minGap) * Math.random();
      if (state.worldOffsetX - state.lastCoinX >= coinSpawnDistance) {
        if (Math.random() < COIN_CONFIG.spawnRate) {
          const spawnX = canvas.width + state.worldOffsetX;
          
          // Check if coin would be too close to any obstacle
          const tooCloseToObstacle = state.obstacles.some((obs) => {
            return Math.abs(obs.x - spawnX) < SAFE_COIN_OBSTACLE_DISTANCE;
          });
          
          if (!tooCloseToObstacle) {
            const type = Math.random() < 0.5 ? 'blue' : 'purple';
            // Vary coin height for collection challenge
            const heightVariation = (Math.random() - 0.5) * 50; // ±25 pixels variation
            const newCoin: Coin = {
              x: spawnX,
              y: groundY - COIN_CONFIG.floatHeight + heightVariation,
              width: COIN_CONFIG.width,
              height: COIN_CONFIG.height,
              type,
              collected: false,
            };
            state.coins.push(newCoin);
            setCoins([...state.coins]);
            state.lastCoinX = state.worldOffsetX;
          }
        }
      }

      // Spawn hearts (rare) - only when player is not at full health
      const MAX_LIVES = 2;
      const heartSpawnDistance = HEART_CONFIG.minGap + (HEART_CONFIG.maxGap - HEART_CONFIG.minGap) * Math.random();
      if (state.worldOffsetX - state.lastHeartX >= heartSpawnDistance) {
        if (Math.random() < HEART_CONFIG.spawnRate && state.lives < MAX_LIVES) {
          const newHeart: Heart = {
            x: canvas.width + state.worldOffsetX,
            y: groundY - HEART_CONFIG.floatHeight,
            width: HEART_CONFIG.width,
            height: HEART_CONFIG.height,
            collected: false,
          };
          state.hearts.push(newHeart);
          setHearts([...state.hearts]);
          state.lastHeartX = state.worldOffsetX;
        }
      }

      // Spawn power-ups
      const powerUpSpawnDistance = POWERUP_CONFIG.minGap + (POWERUP_CONFIG.maxGap - POWERUP_CONFIG.minGap) * Math.random();
      if (state.worldOffsetX - state.lastPowerUpX >= powerUpSpawnDistance) {
        if (Math.random() < POWERUP_CONFIG.spawnRate) {
          const type: PowerUpType = Math.random() < POWERUP_CONFIG.shieldChance ? 'shield' : 'magnet';
          const newPowerUp: PowerUp = {
            x: canvas.width + state.worldOffsetX,
            y: groundY - POWERUP_CONFIG.floatHeight,
            width: POWERUP_CONFIG.width,
            height: POWERUP_CONFIG.height,
            type,
            collected: false,
          };
          state.powerUps.push(newPowerUp);
          setPowerUps([...state.powerUps]);
          state.lastPowerUpX = state.worldOffsetX;
        }
      }

      // Update obstacles (they move left as world scrolls)
      const playerRect = {
        x: newPlayer.x,
        y: newPlayer.y + newPlayer.runBobOffset, // Include bobbing offset in collision
        width: newPlayer.width,
        height: newPlayer.height,
      };

      state.obstacles = state.obstacles
        .filter((obs) => {
          // Calculate screen position (world position - world offset)
          const screenX = obs.x - state.worldOffsetX;
          
          // Check collision (only if not invincible)
          if (
            !state.isInvincible &&
            playerRect.x < screenX + obs.width &&
            playerRect.x + playerRect.width > screenX &&
            playerRect.y < obs.y + obs.height &&
            playerRect.y + playerRect.height > obs.y
          ) {
            // Collision detected
            // Check if shield is active
            if (state.shieldActive) {
              // Shield absorbs the hit
              state.shieldActive = false;
              // Still show effects but don't lose life
              state.hitFlashTime = GAME_CONFIG.hitFlashDuration * 0.5; // Weaker flash
              state.cameraShakeTime = GAME_CONFIG.cameraShakeDuration * 0.5; // Weaker shake
              state.cameraShakeTime = GAME_CONFIG.cameraShakeDuration * 0.5;
            } else {
              // Normal hit
              setLives((prevLives) => {
                const newLives = Math.max(0, prevLives - 1);
                state.lives = newLives;
                if (onLivesChange) onLivesChange(newLives);
                
                // Reset combo on hit
                state.comboCount = 0;
                state.comboTimer = 0;
                state.scoreMultiplier = 1.0;
                if (onMultiplierChange) onMultiplierChange(1.0);
                
                // Activate invincibility if player still has lives
                if (newLives > 0) {
                  state.isInvincible = true;
                  state.invincibleTimer = 1.0; // 1 second of invincibility
                  
                  // Apply temporary speed penalty when losing a life
                  state.speedRecoveryTimer = GAME_CONFIG.speedRecoveryDuration;
                  
                  // Hit effects
                  state.hitFlashTime = GAME_CONFIG.hitFlashDuration;
                  state.cameraShakeTime = GAME_CONFIG.cameraShakeDuration;
                }
                
                return newLives;
              });
            }
            return false; // Remove obstacle
          }
          // Keep if still on screen (hasn't scrolled past left edge)
          return screenX + obs.width > -50; // Small buffer for smooth removal
        });
      setObstacles([...state.obstacles]);

      // Update coins
      state.coins = state.coins
        .filter((coin) => {
          if (coin.collected) return false;
          
          const screenX = coin.x - state.worldOffsetX;
          
          // Check collection (or magnet pull)
          const distanceToPlayer = Math.sqrt(
            Math.pow(screenX + coin.width / 2 - (playerRect.x + playerRect.width / 2), 2) +
            Math.pow(coin.y + coin.height / 2 - (playerRect.y + playerRect.height / 2), 2)
          );

          // Magnet effect: pull coins toward player
          if (state.magnetActive && distanceToPlayer < MAGNET_CONFIG.radius) {
            const pullAmount = MAGNET_CONFIG.pullSpeed;
            coin.x += (playerRect.x + playerRect.width / 2 - (screenX + coin.width / 2)) * pullAmount;
            coin.y += (playerRect.y + playerRect.height / 2 - (coin.y + coin.height / 2)) * pullAmount;
          }

          // Check collection
          if (
            playerRect.x < screenX + coin.width &&
            playerRect.x + playerRect.width > screenX &&
            playerRect.y < coin.y + coin.height &&
            playerRect.y + playerRect.height > coin.y
          ) {
            // Collect coin
            playCoinSound();
            
            // Create pickup effect
            const effectId = `pickup_${Date.now()}_${Math.random()}`;
            setPickupEffects((prev) => [
              ...prev,
              {
                id: effectId,
                x: screenX + coin.width / 2,
                y: coin.y + coin.height / 2,
                type: 'coin',
                age: 0,
                lifetime: 0.25,
              },
            ]);

            // Update combo
            state.comboCount++;
            state.comboTimer = 0;
            if (state.comboCount > state.maxCombo) {
              state.maxCombo = state.comboCount;
            }

            // Calculate score multiplier
            let newMultiplier = 1.0;
            if (state.comboCount < 5) {
              newMultiplier = 1.0;
            } else if (state.comboCount < 10) {
              newMultiplier = 1.5;
            } else if (state.comboCount < 15) {
              newMultiplier = 2.0;
            } else {
              newMultiplier = 3.0;
            }

            // Show floating text if multiplier increased
            if (newMultiplier > state.scoreMultiplier) {
              const textId = `combo_${Date.now()}`;
              setFloatingTexts((prev) => [
                ...prev,
                {
                  id: textId,
                  x: playerRect.x + playerRect.width / 2,
                  y: playerRect.y,
                  text: `Combo x${newMultiplier.toFixed(1)}!`,
                  age: 0,
                  lifetime: 1.0,
                },
              ]);
            }

            state.scoreMultiplier = newMultiplier;
            if (onMultiplierChange) onMultiplierChange(newMultiplier);
            const coinPoints = coin.type === 'blue' ? GAME_CONFIG.coinScoreBlue : GAME_CONFIG.coinScorePurple;
            const finalPoints = Math.floor(coinPoints * state.scoreMultiplier);
            
            setScore((prev) => {
              const newScore = prev + finalPoints;
              state.score = newScore;
              if (onScoreChange) onScoreChange(newScore);
              return newScore;
            });
            
            state.runCoinsCollected++;
            return false; // Remove coin
          }
          // Keep if still on screen
          return screenX + coin.width > -50;
        });
      setCoins([...state.coins]);

      // Update hearts
      state.hearts = state.hearts
        .filter((heart) => {
          if (heart.collected) return false;
          
          const screenX = heart.x - state.worldOffsetX;
          
          // Check collection
          if (
            playerRect.x < screenX + heart.width &&
            playerRect.x + playerRect.width > screenX &&
            playerRect.y < heart.y + heart.height &&
            playerRect.y + playerRect.height > heart.y
          ) {
            // Collect heart (only if player has 1 life, restores to 2)
            if (state.lives === 1) {
              setLives((prevLives) => {
                const newLives = 2;
                state.lives = newLives;
                if (onLivesChange) onLivesChange(newLives);
                return newLives;
              });
            }

            // Create pickup effect
            const effectId = `pickup_${Date.now()}_${Math.random()}`;
            setPickupEffects((prev) => [
              ...prev,
              {
                id: effectId,
                x: screenX + heart.width / 2,
                y: heart.y + heart.height / 2,
                type: 'heart',
                age: 0,
                lifetime: 0.25,
              },
            ]);

            return false; // Remove heart
          }
          // Keep if still on screen
          return screenX + heart.width > -50;
        });
      setHearts([...state.hearts]);

      // Update power-ups
      state.powerUps = state.powerUps
        .filter((powerUp) => {
          if (powerUp.collected) return false;
          
          const screenX = powerUp.x - state.worldOffsetX;
          
          // Check collection
          if (
            playerRect.x < screenX + powerUp.width &&
            playerRect.x + playerRect.width > screenX &&
            playerRect.y < powerUp.y + powerUp.height &&
            playerRect.y + playerRect.height > powerUp.y
          ) {
            // Collect power-up
            if (powerUp.type === 'shield') {
              state.shieldActive = true;
            } else if (powerUp.type === 'magnet') {
              state.magnetActive = true;
              state.magnetTimer = POWERUP_CONFIG.magnetDuration;
            }
            return false; // Remove power-up
          }
          // Keep if still on screen
          return screenX + powerUp.width > -50;
        });
      setPowerUps([...state.powerUps]);

      // Create run trail particles
      if (!newPlayer.isJumping && newPlayer.y >= newPlayer.groundY - newPlayer.height - 5) {
        trailFrameCounter.current++;
        if (trailFrameCounter.current >= GAME_CONFIG.trailSpawnInterval) {
          trailFrameCounter.current = 0;
          const trailId = `trail_${Date.now()}_${Math.random()}`;
          // Get trail color from shop (will be applied in render)
          setRunTrail((prev) => [
            ...prev,
            {
              x: newPlayer.x + newPlayer.width / 2,
              y: newPlayer.y + newPlayer.height - 10,
              age: 0,
              lifetime: GAME_CONFIG.trailLifetime,
            },
          ]);
        }
      } else {
        trailFrameCounter.current = 0;
      }

      // Update score (based on time/distance) with multiplier
      setScore((prev) => {
        const baseScore = GAME_CONFIG.scorePerFrame * (state.gameSpeed / GAME_CONFIG.initialSpeed) * deltaTime;
        const finalScore = baseScore * state.scoreMultiplier;
        const newScore = prev + finalScore;
        state.score = newScore;
        if (onScoreChange) onScoreChange(newScore);
        return newScore;
      });

      // Draw ground pattern (scrolling ground strip)
      ctx.fillStyle = '#8B4513'; // Brown ground color
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      // Draw ground pattern (simple repeating pattern)
      ctx.fillStyle = '#654321'; // Darker brown for pattern
      const patternWidth = 200;
      const patternStart = -state.groundOffsetX;
      for (let x = patternStart; x < canvas.width + patternWidth; x += patternWidth) {
        // Simple dashed line pattern
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(x + i * 40, groundY, 20, 5);
        }
      }

      // Draw obstacles with sprites
      state.obstacles.forEach((obs) => {
        const screenX = obs.x - state.worldOffsetX + state.cameraShakeOffsetX;
        if (screenX + obs.width < -50 || screenX > canvas.width + 50) {
          return; // skip totally off-screen
        }

        let key: string;
        switch (obs.kind) {
          case 'barrier':
            key = 'obstacle_barrier';
            break;
          case 'trySign':
            key = 'obstacle_trySign';
            break;
          case 'alienSign':
            key = 'obstacle_alienSign';
            break;
          case 'terminal':
            key = 'obstacle_terminal';
            break;
          case 'warningSign':
            key = 'obstacle_warningSign';
            break;
        }

        const img = imagesRef.current[key];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, screenX, obs.y + state.cameraShakeOffsetY, obs.width, obs.height);
          ctx.imageSmoothingEnabled = true;
        } else {
          // fallback if image not loaded yet
          ctx.fillStyle = '#ff6b6b';
          ctx.fillRect(screenX, obs.y + state.cameraShakeOffsetY, obs.width, obs.height);
        }
      });

      // Draw coins (static images with bobbing animation)
      // Calculate bobbing offset once per frame for smooth animation
      const bobOffset = Math.sin(bobTimeRef.current * 2 * Math.PI * BOB_SPEED) * BOB_AMPLITUDE;
      state.coins.forEach((coin) => {
        if (!coin.collected) {
          const screenX = coin.x - state.worldOffsetX + state.cameraShakeOffsetX;
          const coinImage = imagesRef.current[coin.type === 'blue' ? 'coinBlue' : 'coinPurple'];
          
          if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
            const drawX = screenX - COIN_RENDER_SIZE / 2;
            const drawY = coin.y - COIN_RENDER_SIZE / 2 + bobOffset + state.cameraShakeOffsetY;
            
            ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
            ctx.drawImage(
              coinImage,
              drawX,
              drawY,
              COIN_RENDER_SIZE,
              COIN_RENDER_SIZE
            );
            ctx.imageSmoothingEnabled = true;
          }
        }
      });

      // Draw hearts (static images with bobbing animation)
      // Use the same bobOffset calculated for coins
      state.hearts.forEach((heart) => {
        if (!heart.collected) {
          const screenX = heart.x - state.worldOffsetX + state.cameraShakeOffsetX;
          const heartImage = imagesRef.current['heart'];
          
          if (heartImage && heartImage.complete && heartImage.naturalWidth > 0) {
            const drawX = screenX - HEART_RENDER_SIZE / 2;
            const drawY = heart.y - HEART_RENDER_SIZE / 2 + bobOffset + state.cameraShakeOffsetY;
            
            ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
            ctx.drawImage(
              heartImage,
              drawX,
              drawY,
              HEART_RENDER_SIZE,
              HEART_RENDER_SIZE
            );
            ctx.imageSmoothingEnabled = true;
          }
        }
      });

      // Draw power-ups
      if (state.powerUps) {
        state.powerUps.forEach((powerUp) => {
          if (!powerUp.collected) {
            const screenX = powerUp.x - state.worldOffsetX + state.cameraShakeOffsetX;
            const screenY = powerUp.y + state.cameraShakeOffsetY;
            
            ctx.save();
            if (powerUp.type === 'shield') {
              ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
            } else {
              ctx.fillStyle = 'rgba(150, 0, 255, 0.8)';
            }
            ctx.beginPath();
            ctx.arc(screenX + powerUp.width / 2, screenY + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      // Draw run trail (before player)
      // Get selected trail color from shop
      let trailColor = '#ffffff'; // default
      if (typeof window !== 'undefined') {
        try {
          const profile = localStorage.getItem('baserunner_player_profile');
          if (profile) {
            const parsed = JSON.parse(profile);
            const selectedTrail = parsed.selectedTrailStyle || 'trail_default';
            // Map trail IDs to colors
            const trailColors: { [key: string]: string } = {
              trail_default: '#ffffff',
              trail_blue: '#00aaff',
              trail_pink: '#ff69b4',
              trail_gold: '#ffd700',
            };
            trailColor = trailColors[selectedTrail] || '#ffffff';
          }
        } catch (e) {
          // Use default
        }
      }

      runTrail.forEach((trail) => {
        const progress = trail.age / trail.lifetime;
        const alpha = 1 - progress;
        const scale = 0.8 + progress * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = trail.color || trailColor;
        ctx.beginPath();
        ctx.arc(trail.x + state.cameraShakeOffsetX, trail.y + state.cameraShakeOffsetY, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw pickup effects
      pickupEffects.forEach((effect) => {
        const progress = effect.age / effect.lifetime;
        const alpha = 1 - progress;
        const scale = 0.8 + progress * 0.5;
        const radius = 20 * scale;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        if (effect.type === 'coin') {
          ctx.fillStyle = '#ffd700';
        } else {
          ctx.fillStyle = '#ff6b6b';
        }
        ctx.beginPath();
        ctx.arc(effect.x + state.cameraShakeOffsetX, effect.y + state.cameraShakeOffsetY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw floating texts
      floatingTexts.forEach((text) => {
        const progress = text.age / text.lifetime;
        const alpha = 1 - progress;
        const yOffset = progress * 50;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(text.text, text.x + state.cameraShakeOffsetX, text.y - yOffset + state.cameraShakeOffsetY);
        ctx.fillText(text.text, text.x + state.cameraShakeOffsetX, text.y - yOffset + state.cameraShakeOffsetY);
        ctx.restore();
      });

      // Draw player (single-frame sprite, no sprite sheet)
      const playerImg = imagesRef.current['player'];
      const playerY = newPlayer.y + newPlayer.runBobOffset;
      const playerScreenX = newPlayer.x + state.cameraShakeOffsetX;
      const playerScreenY = playerY + state.cameraShakeOffsetY;
      
      // Draw shield aura if active
      if (state.shieldActive) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          playerScreenX + newPlayer.width / 2,
          playerScreenY + newPlayer.height / 2,
          Math.max(newPlayer.width, newPlayer.height) / 2 + 10,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }
      
      // Blinking effect when invincible
      const isBlinking = state.isInvincible && Math.floor(state.invincibleTimer * 15) % 2 === 0;
      
      if (playerImg && playerImg.complete && playerImg.naturalWidth > 0) {
        if (!isBlinking) {
          ctx.imageSmoothingEnabled = false; // pixel-perfect
          
          // Simple drawImage without sprite sheet cropping
          ctx.drawImage(
            playerImg,
            playerScreenX,
            playerScreenY,
            newPlayer.width,
            newPlayer.height
          );
          
          ctx.imageSmoothingEnabled = true;
        }
      } else {
        // Fallback: simple rectangle if texture failed to load
        ctx.fillStyle = '#fff';
        ctx.fillRect(playerScreenX, playerScreenY, newPlayer.width, newPlayer.height);
      }

      // Draw hit flash overlay
      if (state.hitFlashTime > 0) {
        const flashAlpha = (state.hitFlashTime / GAME_CONFIG.hitFlashDuration) * 0.3;
        ctx.fillStyle = `rgba(255, 0, 0, ${flashAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, lives, score, isStarting, countdown, onGameOver, onScoreChange, onLivesChange, onMultiplierChange]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />
      {isStarting && countdown > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 200,
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontFamily: 'monospace',
              color: '#fff',
              textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              fontWeight: 'bold',
            }}
          >
            {countdown}
          </div>
        </div>
      )}
      {isStarting && countdown === 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 200,
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontFamily: 'monospace',
              color: '#0f0',
              textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              fontWeight: 'bold',
            }}
          >
            GO!
          </div>
        </div>
      )}
      {isPaused && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: '40px',
            borderRadius: '12px',
            border: '4px solid #fff',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '32px',
            zIndex: 200,
            textAlign: 'center',
            minWidth: '400px',
          }}
        >
          <div style={{ marginBottom: '30px', fontWeight: 'bold' }}>PAUSED</div>
          
          <div style={{ fontSize: '16px', marginBottom: '30px', color: '#ccc' }}>
            <div style={{ marginBottom: '10px' }}>Controls:</div>
            <div>Space / ↑ / Tap - Jump</div>
            <div>ESC - Pause/Resume</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              onClick={() => setIsPaused(false)}
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
              Resume
            </button>
            {onExitToMenu && (
              <button
                onClick={onExitToMenu}
                style={{
                  padding: '15px 30px',
                  backgroundColor: 'rgba(255,0,0,0.7)',
                  border: '2px solid #fff',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  borderRadius: '8px',
                }}
              >
                Exit to Menu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
