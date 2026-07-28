import React from 'react';

// Oversized, scattered tiles for an elegant, blurred background effect
const SCATTERED_TILES = [
  { id: 1, letter: 'W', points: 4, top: -5, left: 5, rot: -15, size: 'w-64 h-64', color: 'bg-[#f2e2c4]' },
  { id: 2, letter: 'O', points: 1, top: 20, left: 85, rot: 25, size: 'w-72 h-72', color: 'bg-[#eadcc2]' },
  { id: 3, letter: 'R', points: 1, top: 50, left: -10, rot: 45, size: 'w-56 h-56', color: 'bg-[#cfbe9f]' },
  { id: 4, letter: 'D', points: 2, top: 10, left: 60, rot: -5, size: 'w-48 h-48', color: 'bg-[#f2e2c4]' },
  { id: 5, letter: 'S', points: 1, top: 75, left: 15, rot: -22, size: 'w-80 h-80', color: 'bg-[#eadcc2]' },
  { id: 6, letter: 'P', points: 3, top: 80, left: 75, rot: 15, size: 'w-64 h-64', color: 'bg-[#cfbe9f]' },
  { id: 7, letter: 'L', points: 1, top: 45, left: 90, rot: -35, size: 'w-56 h-56', color: 'bg-[#f2e2c4]' },
  { id: 8, letter: 'A', points: 1, top: 90, left: 45, rot: 12, size: 'w-72 h-72', color: 'bg-[#eadcc2]' },
];

const ScrabbleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Radial gradient overlay for readability and elegance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,230,211,0.6)_100%)] z-10" />
      
      {SCATTERED_TILES.map((tile) => (
        <div
          key={tile.id}
          className={`absolute flex items-center justify-center font-bold text-[#8b6b47] ${tile.color} ${tile.size} rounded-3xl shadow-2xl blur-[10px] opacity-40`}
          style={{
            top: `${tile.top}%`,
            left: `${tile.left}%`,
            transform: `rotate(${tile.rot}deg)`,
            fontSize: '12rem',
          }}
          aria-hidden="true"
        >
          {tile.letter}
          <span className="absolute bottom-8 right-8 text-5xl font-semibold leading-none opacity-50">
            {tile.points}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScrabbleBackground;