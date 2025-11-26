'use client';

import React, { useEffect, useState } from 'react';
import { TITLE_BG } from '../assets';

interface TitleScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
  onShop?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLeaderboard, onShop }) => {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    // Gentle parallax animation
    const parallaxInterval = setInterval(() => {
      setParallaxOffset((prev) => (prev + 0.2) % 100);
    }, 50);

    // Pulsing animation for logo elements
    const pulseInterval = setInterval(() => {
      setPulseScale((prev) => {
        if (prev >= 1.1) return 0.95;
        return prev + 0.01;
      });
    }, 100);

    return () => {
      clearInterval(parallaxInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStart]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={onStart}
    >
      {/* Background with parallax */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${TITLE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateX(${Math.sin(parallaxOffset * 0.01) * 10}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Overlay gradient for text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            fontFamily: 'monospace',
            color: '#fff',
            textShadow: '4px 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,150,255,0.5)',
            margin: 0,
            transform: `scale(${pulseScale})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          BaseRunner
        </h1>
      </div>

      {/* Start message */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: '#fff',
          fontSize: '24px',
          fontFamily: 'monospace',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          animation: 'blink 1.5s infinite',
        }}
      >
        Press SPACE or CLICK to start
      </div>

      {/* Buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 10,
        }}
      >
        {onShop && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShop();
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(255,200,0,0.7)',
              border: '2px solid #fff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'monospace',
              borderRadius: '8px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            Shop
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLeaderboard();
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: 'rgba(0,150,255,0.7)',
            border: '2px solid #fff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'monospace',
            borderRadius: '8px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          Leaderboard
        </button>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

