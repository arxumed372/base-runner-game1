import type { Metadata } from 'next';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://YOUR-DEPLOYED-DOMAIN.vercel.app';

export const metadata: Metadata = {
  title: 'BaseRunner - Endless Runner Game',
  description: 'A Chrome T-Rex style endless runner game for Base mini app',
  other: {
    'fc:miniapp': JSON.stringify({
      url: appUrl,
      name: 'Base Runner',
      icon: `${appUrl}/icon.png`,
    }),
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

