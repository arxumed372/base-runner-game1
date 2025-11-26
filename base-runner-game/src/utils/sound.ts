const SOUND_ENABLED_KEY = 'baserunner_sound_enabled';

let backgroundMusic: HTMLAudioElement | null = null;
let soundEnabled: boolean = true;

export function initSound(src: string): void {
  if (typeof window === 'undefined') return;
  
  // Load saved preference
  const saved = localStorage.getItem(SOUND_ENABLED_KEY);
  soundEnabled = saved !== 'false';
  
  backgroundMusic = new Audio(src);
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.5;
  
  if (soundEnabled) {
    playBackgroundMusic();
  }
}

export function playBackgroundMusic(): void {
  if (backgroundMusic && soundEnabled) {
    backgroundMusic.play().catch((error) => {
      console.log('Audio play failed (user interaction required):', error);
    });
  }
}

export function stopBackgroundMusic(): void {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  localStorage.setItem(SOUND_ENABLED_KEY, String(soundEnabled));
  
  if (soundEnabled) {
    playBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
  
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function playCoinSound(): void {
  // Simple beep sound using Web Audio API
  if (!soundEnabled) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.log('Coin sound failed:', error);
  }
}

