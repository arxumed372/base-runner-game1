# BaseRunner Game - Setup Instructions

## Quick Start

1. **Install Node.js** (LTS version, v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Copy assets to public folder:**
   ```bash
   # On Windows (PowerShell):
   New-Item -ItemType Directory -Force -Path "public\base-runner-game\assets"
   Copy-Item "*.png" -Destination "public\base-runner-game\assets\"
   Copy-Item "*.PNG" -Destination "public\base-runner-game\assets\"
   Copy-Item "Sound.mp3" -Destination "public\base-runner-game\assets\"
   
   # On Mac/Linux:
   mkdir -p public/base-runner-game/assets
   cp *.png public/base-runner-game/assets/
   cp *.PNG public/base-runner-game/assets/
   cp Sound.mp3 public/base-runner-game/assets/
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Navigate to `http://localhost:3000`

## Project Structure

```
Base Runner/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main page (renders game)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── base-runner-game/             # Game code
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── utils/                # Utility functions
│   │   ├── types.ts              # TypeScript types
│   │   ├── config.ts             # Game configuration
│   │   └── assets.ts             # Asset path mappings
│   └── README.md                 # Game documentation
├── public/                       # Static files (Next.js)
│   └── base-runner-game/
│       └── assets/              # Game assets (images, sounds)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
└── .gitignore                   # Git ignore rules
```

## Important Notes

### Assets Location
- Assets must be in `/public/base-runner-game/assets/` for Next.js to serve them
- Asset paths are defined in `base-runner-game/src/assets.ts`
- All asset imports use the `/base-runner-game/assets/` path prefix

### Game Features
- **Title Screen**: Animated with parallax effect
- **Intro Screen**: Typewriter text effect
- **Game Screen**: Endless runner with 3 background phases
- **Game Over**: Score submission and leaderboard
- **Leaderboard**: Top 500 scores (localStorage)

### Controls
- **SPACE** or **UP Arrow**: Jump
- **ESC**: Pause/Resume
- **Touch/Click**: Jump (mobile)

### Scoring
- Base score increases over time
- Blue coins: +10 points
- Purple coins: +20 points
- Hearts: Restore 1 life (max 2)

## Troubleshooting

### Assets Not Loading
1. Check that files are in `public/base-runner-game/assets/`
2. Verify filenames match those in `base-runner-game/src/assets.ts`
3. Check browser console for 404 errors

### Sound Not Playing
- Browser may require user interaction before playing audio
- Check browser autoplay policies
- Verify `Sound.mp3` exists in assets folder

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (v18+ required)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Next Steps

1. **Test the game locally** using `npm run dev`
2. **Customize the intro text** in `base-runner-game/src/components/IntroScreen.tsx`
3. **Adjust game difficulty** in `base-runner-game/src/config.ts`
4. **Set up Base mini app** following Base documentation
5. **Deploy to Vercel** for production

## Base Mini App Setup

To configure this as a Base mini app:

1. Create `minikit.config.ts` in the root directory
2. Configure manifest settings
3. Set up account association using Base Build tools
4. Deploy to a public domain (Vercel recommended)

See: https://docs.base.org/mini-apps/quickstart/create-new-miniapp

## Development

- Game loop uses `requestAnimationFrame` for 60fps
- State management: React hooks + refs for game loop
- Canvas rendering for game graphics
- LocalStorage for leaderboard and sound preferences

## Future Improvements

See `base-runner-game/IMPROVEMENTS.md` for suggested enhancements including:
- Onchain leaderboard storage
- Power-ups and special abilities
- Enhanced visual effects
- NFT rewards integration
- And more!

