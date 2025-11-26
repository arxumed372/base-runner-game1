'use client';

import React from 'react';
import { getLeaderboard, clearLeaderboard } from '../utils/leaderboard';
import { LeaderboardEntry } from '../types';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const entries = getLeaderboard();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        overflow: 'auto',
      }}
    >
      {/* Overlay */}
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

      {/* Leaderboard Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(40, 40, 40, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          border: '4px solid #fff',
          boxShadow: '0 0 30px rgba(0,0,0,0.8)',
          maxWidth: '900px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          margin: '20px',
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '48px',
            fontFamily: 'monospace',
            margin: '0 0 30px 0',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          Leaderboard
        </h1>

        {entries.length === 0 ? (
          <div
            style={{
              color: '#888',
              fontSize: '20px',
              fontFamily: 'monospace',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            No scores yet. Be the first!
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 180px',
                gap: '15px',
                padding: '15px',
                borderBottom: '2px solid #666',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <div>Rank</div>
              <div>Name</div>
              <div style={{ textAlign: 'right' }}>Score</div>
              <div>Date</div>
            </div>
            <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
              {entries.map((entry: LeaderboardEntry, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 180px',
                    gap: '15px',
                    padding: '15px',
                    borderBottom: '1px solid #444',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>#{index + 1}</div>
                  <div>{entry.name}</div>
                  <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {Math.floor(entry.score).toString().padStart(6, '0')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>{formatDate(entry.date)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(0,150,255,0.7)',
              border: '2px solid #fff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'monospace',
              borderRadius: '8px',
            }}
          >
            Back
          </button>
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear the leaderboard?')) {
                  clearLeaderboard();
                  window.location.reload();
                }
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255,0,0,0.7)',
                border: '2px solid #fff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: 'monospace',
                borderRadius: '8px',
              }}
            >
              Clear Leaderboard
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            color: '#aaa',
            fontSize: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          Top {entries.length} of 500 scores (stored locally)
          <br />
          TODO: Replace with onchain storage using Base
        </div>
      </div>
    </div>
  );
};

