'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DIALOGUE_BG, AUTHOR_AVATAR } from '../assets';

interface IntroScreenProps {
  onContinue: () => void;
}

const INTRO_TEXT = `It doesn't matter what country you're from
It doesn't matter what your financial status is
It doesn't matter who you are
It doesn't matter if you're a technical builder
It doesn't matter if you're a content creator
It doesn't matter if you're an artist, writer, or musician
You don't have to be a crypto expert
You don't have to know what "onchain" means
You don't have to ask for permission
You don't have to pick a "tribe"
You don't have to stay in a walled garden
All that matters is that you're here to build.
All that matters is that you're here to create.
All that matters is that you're here to bring the world onchain.

@base is for everyone.`;

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showContinue, setShowContinue] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTyping = currentIndex < INTRO_TEXT.length;

  // Skip typewriter animation
  const skipTypewriter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(INTRO_TEXT);
    setCurrentIndex(INTRO_TEXT.length);
    setShowContinue(true);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < INTRO_TEXT.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedText(INTRO_TEXT.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Typewriter speed

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      setShowContinue(true);
    }
  }, [currentIndex]);

  // Handle click
  const handleClick = () => {
    if (isTyping) {
      skipTypewriter();
    } else if (showContinue) {
      onContinue();
    }
  };

  // Handle keyboard (SPACE)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (isTyping) {
          skipTypewriter();
        } else if (showContinue) {
          onContinue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTyping, showContinue, onContinue, skipTypewriter]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${DIALOGUE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8,
        }}
      />

      {/* Dialogue box */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '900px',
          width: '90%',
          padding: '40px',
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          border: '4px solid #888',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,0,0.8)',
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-start',
        }}
      >
        {/* Author Avatar */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={AUTHOR_AVATAR}
            alt="Author Avatar"
            style={{
              width: '150px',
              height: '150px',
              imageRendering: 'pixelated',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Typewriter text */}
          <div
            style={{
              color: '#fff',
              fontSize: '18px',
              fontFamily: 'monospace',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              minHeight: '400px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {displayedText}
            {isTyping && (
              <span style={{ animation: 'blink 0.8s infinite' }}>|</span>
            )}
          </div>

          {/* Continue hint */}
          {showContinue && (
            <div
              style={{
                marginTop: '30px',
                textAlign: 'center',
                color: '#fff',
                fontSize: '16px',
                fontFamily: 'monospace',
                opacity: 0.7,
                animation: 'blink 1.5s infinite',
                cursor: 'pointer',
              }}
            >
              Press SPACE or CLICK to continue
            </div>
          )}

          {/* Skip hint (shown while typing) */}
          {isTyping && (
            <div
              style={{
                marginTop: '20px',
                textAlign: 'center',
                color: '#aaa',
                fontSize: '14px',
                fontFamily: 'monospace',
                opacity: 0.6,
              }}
            >
              Click or press SPACE to skip
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
