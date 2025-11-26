import type { Metadata } from 'next';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://YOUR-DEPLOYED-DOMAIN.vercel.app';

const miniAppEmbed = {
  version: "1",
  imageUrl: `${appUrl}/embed.png`,
  button: {
    title: "Play Base Runner",
    action: {
      type: "launch_frame",
      name: "Base Runner",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#050816"
    }
  }
};

export const metadata: Metadata = {
  title: 'BaseRunner - Endless Runner Game',
  description: 'A Chrome T-Rex style endless runner game for Base mini app',
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
  },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

