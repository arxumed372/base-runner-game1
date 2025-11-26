// Background images
export const BG_SUNSET = '/base-runner-game/assets/20251117_2234_Cyberpunk Sunset Cityscape_remix_01ka9mt2anf1h89b6shmb2r86n.png';
export const BG_DAYTIME = '/base-runner-game/assets/20251117_2246_Expansive Cyberpunk Cityscape_remix_01ka9ngcbsex3rxg2jwsq8egaq (1).png';
export const BG_NIGHT = '/base-runner-game/assets/20251117_2251_Cyberpunk Desert Nightscape_remix_01ka9nta8qet08t6f4mhm1a7sx.png';

// Title / dialogue backgrounds (reuse existing sunset background)
export const TITLE_BG = BG_SUNSET;
export const DIALOGUE_BG = BG_SUNSET;

// Player sprite – single-frame PNG (runner mid-step)
export const PLAYER_SPRITE = '/base-runner-game/assets/BassyJayse1.png';

// Individual obstacle sprites
export const OBSTACLE_1 = '/base-runner-game/assets/Obstacles1.png';
export const OBSTACLE_2 = '/base-runner-game/assets/Obstacles2.png';
export const OBSTACLE_3 = '/base-runner-game/assets/Obstacles3.png';
export const OBSTACLE_4 = '/base-runner-game/assets/Obstacles4.png';
export const OBSTACLE_5 = '/base-runner-game/assets/Obstacles5.png';

// Obstacle sprite sizes (tuned so bottom sits on ground line)
export const OBSTACLE_SIZES = {
  barrier:      { width: 66,  height: 44 },   // Obstacles1 – low barrier
  trySign:      { width: 44,  height: 131 },  // Obstacles2
  alienSign:    { width: 53,  height: 131 },  // Obstacles3
  terminal:     { width: 57,  height: 96 },  // Obstacles4
  warningSign:  { width: 70,  height: 131 },  // Obstacles5
} as const;

// Статичные картинки монет и сердца
export const COIN_BLUE = '/base-runner-game/assets/CoinBlue.png.png';
export const COIN_PURPLE = '/base-runner-game/assets/CoinPurple.png.png';
export const HEART_PICKUP = '/base-runner-game/assets/HeartPickup.png.png';

// Один набор размеров для отрисовки
export const COIN_RENDER_SIZE = 108;   // можешь сделать 64, если хочется меньше
export const HEART_RENDER_SIZE = 108;

// Author avatar (CrypticPoet with crown)
export const AUTHOR_AVATAR = '/base-runner-game/assets/Poet1.PNG';

// Lives icons (HUD)
export const LIVES_ICON_ONE = '/base-runner-game/assets/God1.png';
export const LIVES_ICON_TWO = '/base-runner-game/assets/God2.png';

// Sound file - Background music
export const SOUND_BG = '/base-runner-game/assets/Sound.mp3';

