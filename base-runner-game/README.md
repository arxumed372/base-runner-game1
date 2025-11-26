# BaseRunner Game

A Chrome T-Rex style endless runner game built for Base mini app using Next.js, React, and TypeScript.

## Project Structure

```
base-runner-game/
├── src/
│   ├── components/          # React game components
│   │   ├── BaseRunnerGame.tsx    # Main game router
│   │   ├── TitleScreen.tsx        # Title screen with animations
│   │   ├── IntroScreen.tsx       # Intro screen with typewriter effect
│   │   ├── GameScreen.tsx        # Main game loop and canvas rendering
│   │   ├── GameScreenWithHUD.tsx # Game screen with HUD overlay
│   │   ├── GameOverScreen.tsx    # Game over screen with score submission
│   │   ├── LeaderboardScreen.tsx # Leaderboard display
│   │   └── HUD.tsx               # Heads-up display (score, lives, sound)
│   ├── utils/                # Utility functions
│   │   ├── leaderboard.ts    # LocalStorage leaderboard management
│   │   └── sound.ts          # Sound system with localStorage persistence
│   ├── types.ts              # TypeScript type definitions
│   ├── config.ts             # Game configuration constants
│   └── assets.ts             # Asset file path mappings
└── assets/                   # Game assets (images, sounds)
    ├── 20251117_2359_BaseRunner Game Title Screen_remix_01ka9sq27aechvm20k8yghfsmj.png  # Title background
    ├── 20251117_2226_Pixel Dialogue Interface_remix_01ka9mcmy6fg5a6mepgqd2kjtw.png      # Dialogue background
    ├── 20251117_2234_Cyberpunk Sunset Cityscape_remix_01ka9mt2anf1h89b6shmb2r86n.png    # Sunset background
    ├── 20251117_2246_Expansive Cyberpunk Cityscape_remix_01ka9ngcbsex3rxg2jwsq8egaq (1).png # Daytime background
    ├── 20251117_2251_Cyberpunk Desert Nightscape_remix_01ka9nta8qet08t6f4mhm1a7sx.png    # Night background
    ├── Runner.PNG                                                                       # Player character
    ├── God1.png                                                                          # Lives icon (1 heart)
    ├── God2.png                                                                          # Lives icon (2 hearts)
    ├── Zora Token.png                                                                    # Blue coin
    ├── Farc Token.png                                                                    # Purple coin
    ├── 20251118_0055_Пиксельное сердечко_simple_compose_01ka9wztk4fyks4hfegemrnenr.png  # Heart pickup
    └── Sound.mp3                                                                         # Background music
```

## Assets

All game assets are stored in `/public/base-runner-game/assets/` for Next.js static file serving. The asset paths are mapped in `src/assets.ts` with comments explaining each asset's purpose.

### Asset Mapping:
- **Title Background**: Three-panel cityscape with BaseRunner logo
- **Dialogue Background**: Pixel art dialogue card for intro screen
- **Background Images**: Three scrolling backgrounds (sunset, daytime, night) that change based on score
- **Player Sprite**: Runner character with cigar
- **Life Icons**: Base God heads showing 1 or 2 hearts
- **Coins**: Blue (Zora token) and Purple (Farc token) collectibles
- **Heart Pickup**: Health restoration item
- **Sound**: Background music loop

## Prerequisites

To run and test this game locally, you need:

1. **Node.js** (LTS version recommended, v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **pnpm**
   - Verify: `npm --version` or `pnpm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

2. **Ensure assets are in place:**
   - All image and sound files should be in `/public/base-runner-game/assets/`
   - If assets are missing, copy them from the root directory or `base-runner-game/assets/`

## Running the Development Server

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   pnpm dev
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The game should load automatically

3. **Hot Reload:**
   - The development server supports hot module replacement
   - Changes to code will automatically refresh in the browser

## Building for Production

1. **Build the production bundle:**
   ```bash
   npm run build
   ```
   or
   ```bash
   pnpm build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```
   or
   ```bash
   pnpm start
   ```

3. **For deployment to Vercel:**
   - The project is configured for Vercel deployment
   - Push to your GitHub repository
   - Connect to Vercel and deploy automatically

## Base Mini App Configuration

This game is designed to work as a Base mini app. To configure it:

1. **Create `minikit.config.ts`** in the root directory (if not already present)
2. **Configure the manifest** following Base mini app documentation
3. **Set up account association** using the Base Build tools
4. **Deploy to a public domain** (Vercel recommended)

For detailed Base mini app setup instructions, see:
https://docs.base.org/mini-apps/quickstart/create-new-miniapp

## Game Features

### Screens
- **Title Screen**: Animated background with parallax effect
- **Intro Screen**: Typewriter effect dialogue
- **Game Screen**: Endless runner with scrolling backgrounds
- **Game Over Screen**: Score submission and leaderboard access
- **Leaderboard Screen**: Top 500 scores stored locally

### Gameplay
- **Controls**: 
  - SPACE or UP arrow to jump
  - ESC to pause/resume
  - Touch/click on mobile to jump
- **Obstacles**: Small and large obstacles requiring jumps
- **Collectibles**: 
  - Blue coins (+10 points)
  - Purple coins (+20 points)
  - Hearts (restore 1 life, max 2 lives)
- **Scoring**: 
  - Base score increases over time based on distance
  - Bonus points from collecting coins
  - Score formula: `score += scorePerFrame * (gameSpeed / initialSpeed)`

### Background Phases
- **Sunset** (0-1000 points): Initial phase
- **Daytime** (1000-3000 points): Mid-game phase
- **Night** (3000+ points): Final phase

### Sound System
- Background music loops during gameplay
- Sound on/off toggle with localStorage persistence
- Coin collection sound effects

### Leaderboard
- Stores top 500 scores locally in browser
- Player name entry on game over
- Sortable by score (descending)
- TODO: Replace with onchain storage using Base

## Development Notes

### Game Loop
The game uses `requestAnimationFrame` for smooth 60fps rendering. Game state is managed using React state and refs for immediate access in the game loop.

### Performance
- Canvas rendering for game graphics
- Efficient collision detection using bounding boxes
- State updates batched to minimize re-renders

### Future Improvements
See the code comments for TODOs and suggestions for:
- Onchain leaderboard storage
- Power-ups and special abilities
- Particle effects
- Enhanced animations
- Difficulty levels
- Achievements system
- Onchain rewards integration

## Troubleshooting

### Assets not loading
- Ensure all files are in `/public/base-runner-game/assets/`
- Check browser console for 404 errors
- Verify asset paths in `src/assets.ts`

### Sound not playing
- Check browser autoplay policies (user interaction required)
- Verify `Sound.mp3` is in the assets folder
- Check browser console for audio errors

### Game not starting
- Check browser console for errors
- Verify all dependencies are installed (`npm install`)
- Ensure Node.js version is compatible (v18+)

## License

This project is part of the Base mini app ecosystem.

