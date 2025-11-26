'use client';

import React, { useState, useEffect } from 'react';

interface Cosmetic {
  id: string;
  name: string;
  price: number;
  type: 'trail';
  color?: string;
}

const COSMETICS: Cosmetic[] = [
  { id: 'trail_default', name: 'Default Trail', price: 0, type: 'trail', color: '#ffffff' },
  { id: 'trail_blue', name: 'Blue Trail', price: 50, type: 'trail', color: '#00aaff' },
  { id: 'trail_pink', name: 'Pink Trail', price: 50, type: 'trail', color: '#ff69b4' },
  { id: 'trail_gold', name: 'Gold Trail', price: 100, type: 'trail', color: '#ffd700' },
];

interface PlayerProfile {
  coinsTotal: number;
  coinsBalance: number;
  ownedCosmetics: string[];
  selectedTrailStyle: string | null;
}

const PROFILE_KEY = 'baserunner_player_profile';

function getPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return {
      coinsTotal: 0,
      coinsBalance: 0,
      ownedCosmetics: ['trail_default'],
      selectedTrailStyle: 'trail_default',
    };
  }

  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }

  return {
    coinsTotal: 0,
    coinsBalance: 0,
    ownedCosmetics: ['trail_default'],
    selectedTrailStyle: 'trail_default',
  };
}

function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

interface ShopScreenProps {
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<PlayerProfile>(getPlayerProfile());

  const handleBuy = (cosmetic: Cosmetic) => {
    if (profile.coinsBalance >= cosmetic.price && !profile.ownedCosmetics.includes(cosmetic.id)) {
      const updated = {
        ...profile,
        coinsBalance: profile.coinsBalance - cosmetic.price,
        ownedCosmetics: [...profile.ownedCosmetics, cosmetic.id],
      };
      setProfile(updated);
      savePlayerProfile(updated);
    }
  };

  const handleSelect = (cosmeticId: string) => {
    if (profile.ownedCosmetics.includes(cosmeticId)) {
      const updated = {
        ...profile,
        selectedTrailStyle: cosmeticId,
      };
      setProfile(updated);
      savePlayerProfile(updated);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          border: '4px solid #fff',
          boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '36px',
            fontFamily: 'monospace',
            margin: '0 0 20px 0',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          Shop
        </h1>

        <div
          style={{
            color: '#ffd700',
            fontSize: '20px',
            fontFamily: 'monospace',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          Coins: {profile.coinsBalance}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {COSMETICS.map((cosmetic) => {
            const isOwned = profile.ownedCosmetics.includes(cosmetic.id);
            const isSelected = profile.selectedTrailStyle === cosmetic.id;

            return (
              <div
                key={cosmetic.id}
                style={{
                  backgroundColor: 'rgba(60, 60, 60, 0.8)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #0f0' : '2px solid #888',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '18px', fontFamily: 'monospace', marginBottom: '5px' }}>
                      {cosmetic.name}
                    </div>
                    {cosmetic.color && (
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: cosmetic.color,
                          borderRadius: '50%',
                          border: '2px solid #fff',
                        }}
                      />
                    )}
                  </div>
                  <div>
                    {isOwned ? (
                      <button
                        onClick={() => handleSelect(cosmetic.id)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: isSelected ? 'rgba(0,255,0,0.7)' : 'rgba(0,150,255,0.7)',
                          border: '2px solid #fff',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          borderRadius: '8px',
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(cosmetic)}
                        disabled={profile.coinsBalance < cosmetic.price}
                        style={{
                          padding: '10px 20px',
                          backgroundColor:
                            profile.coinsBalance >= cosmetic.price
                              ? 'rgba(255,200,0,0.7)'
                              : 'rgba(100,100,100,0.7)',
                          border: '2px solid #fff',
                          color: '#fff',
                          cursor: profile.coinsBalance >= cosmetic.price ? 'pointer' : 'not-allowed',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          borderRadius: '8px',
                        }}
                      >
                        Buy for {cosmetic.price} coins
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '15px 30px',
            backgroundColor: 'rgba(0,150,255,0.7)',
            border: '2px solid #fff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '18px',
            fontFamily: 'monospace',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

