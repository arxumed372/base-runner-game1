# Base Runner – Farcaster Mini App

A pixel cyberpunk runner game built as a Farcaster/Base mini app. Dodge neon obstacles, collect coins and hearts, and survive in a cyberpunk city on Base.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **@farcaster/miniapp-sdk** for Base/Farcaster integration

## Local Development

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** or **pnpm**

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   For local development, you can leave `NEXT_PUBLIC_APP_URL` as the placeholder. After deploying to production, update it with your actual Vercel URL.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## GitHub Setup

If you haven't already set up version control:

1. **Initialize git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Base Runner mini app"
   ```

2. **Create a new repository on GitHub** and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Deploy to Vercel

1. **Import your GitHub repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure environment variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add `NEXT_PUBLIC_APP_URL` with your production URL (e.g., `https://your-app.vercel.app`)
   - Vercel will automatically provide the deployment URL after first deploy

3. **Deploy:**
   - Vercel will automatically deploy on every push to your main branch
   - After the first deployment, update `NEXT_PUBLIC_APP_URL` in Vercel environment variables with the actual production URL

## Farcaster MiniApp Manifest Setup

To make your app discoverable in Farcaster/Warpcast, you need to configure the manifest:

1. **Go to Farcaster Developer Tools:**
   - Open Warpcast
   - Navigate to Developer Tools → Mini Apps → Manifest Tool
   - Or visit the Farcaster developer portal

2. **Generate account association:**
   - Enter your production domain (without `https://`)
   - The tool will generate `header`, `payload`, and `signature` values

3. **Update the manifest:**
   - Open `public/.well-known/farcaster.json`
   - Replace the `TODO_PASTE_*` placeholders with the values from the Manifest Tool:
     ```json
     {
       "accountAssociation": {
         "header": "PASTE_HEADER_HERE",
         "payload": "PASTE_PAYLOAD_HERE",
         "signature": "PASTE_SIGNATURE_HERE"
       },
       ...
     }
     ```

4. **Update URLs in the manifest:**
   - Replace `YOUR-DEPLOYED-DOMAIN.vercel.app` with your actual production domain in:
     - `iconUrl`
     - `homeUrl`
     - `splashImageUrl`

5. **Commit and push:**
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Configure Farcaster manifest"
   git push
   ```

## Required Assets

You need to add the following image files to the `public/` directory:

- **`public/icon.png`** - Mini app icon (recommended: 512x512px, square)
- **`public/splash.png`** - Splash screen image (recommended: 1200x630px or similar)

These images are referenced in:
- `public/.well-known/farcaster.json` (iconUrl, splashImageUrl)
- `app/layout.tsx` (fc:miniapp meta tag)

You can use pixel art assets from your game or create new ones that match the cyberpunk theme.

## What's Already Configured

The following integration points are already wired in the code:

✅ **SDK Initialization** - `sdk.actions.ready()` is called on mount in `app/page.tsx`  
✅ **fc:miniapp Meta Tag** - Configured in `app/layout.tsx` for Base embed support  
✅ **Farcaster Manifest Path** - `public/.well-known/farcaster.json` is set up  
✅ **Environment Variable Support** - Uses `NEXT_PUBLIC_APP_URL` for dynamic URLs

## Manual Steps Remaining

Before your mini app is fully functional, you need to:

1. ✅ **Upload assets:**
   - Add `public/icon.png`
   - Add `public/splash.png`

2. ✅ **Configure environment:**
   - Set `NEXT_PUBLIC_APP_URL` in Vercel environment variables (after first deploy)

3. ✅ **Fill in manifest:**
   - Get `accountAssociation` values from Farcaster Manifest Tool
   - Update `public/.well-known/farcaster.json` with real values
   - Replace `YOUR-DEPLOYED-DOMAIN.vercel.app` with your actual domain

4. ✅ **Deploy:**
   - Push to GitHub (triggers Vercel deployment)
   - Verify the manifest is accessible at `https://your-domain.vercel.app/.well-known/farcaster.json`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Troubleshooting

- **SDK not initializing?** Check browser console for errors. The SDK only works in Farcaster/Warpcast contexts.
- **Manifest not found?** Ensure `public/.well-known/farcaster.json` is committed and deployed.
- **TypeScript errors?** Run `npm run typecheck` to see detailed error messages.

## License

[Add your license here]





