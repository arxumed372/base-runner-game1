import type { Metadata } from 'next';
import './globals.css';

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://base-runner-game1-3ads.vercel.app';

const miniAppEmbed = {
  version: '1',
  imageUrl: `${appUrl}/embed.png`,
  button: {
    title: 'Play Base Runner',
    action: {
      type: 'launch_frame',
      name: 'Base Runner',
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#000000',
    },
  },
};

export const metadata: Metadata = {
  title: 'Base Runner',
  description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
  openGraph: {
    title: 'Base Runner',
    description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
    images: [`${appUrl}/embed.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Runner',
    description: 'A pixel cyberpunk runner game built as a Farcaster mini app.',
    images: ['/embed.png'],
  },
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

