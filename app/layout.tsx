import type { Metadata } from 'next';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://base-runner-game1-3ads.vercel.app';

const miniappMeta = {
  version: "1",
  url: appUrl,
  name: "Base Runner",
  imageUrl: `${appUrl}/embed.png`,
  buttons: [
    {
      label: "Play Base Runner",
      action: {
        type: "launch_miniapp",
        url: appUrl,
      },
    },
  ],
};

export const metadata: Metadata = {
  title: 'Base Runner',
  description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
  openGraph: {
    title: 'Base Runner',
    description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
    url: appUrl,
    images: [
      {
        url: '/embed.png',
        width: 1200,
        height: 630,
        alt: 'Base Runner – pixel cyberpunk runner game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Runner',
    description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
    images: ['/embed.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniappMeta),
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

