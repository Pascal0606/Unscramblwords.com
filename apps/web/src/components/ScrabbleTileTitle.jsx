import React from 'react';
import { cn } from '@/lib/utils.js';

const getLetterPoints = (letter) => {
  const points = {
    A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
    D: 2, G: 2,
    B: 3, C: 3, M: 3, P: 3,
    F: 4, H: 4, V: 4, W: 4, Y: 4,
    K: 5,
    J: 8, X: 8,
    Q: 10, Z: 10
  };
  return points[letter.toUpperCase()] || 1;
};

const rotations = [
  -1.5, 2.0, -0.5, 1.2, -2.0, 0.8, -1.1, 1.9, -0.2, 1.5, 
  -1.8, 0.5, -1.2, 2.0, -0.8, 1.1, -1.9, 0.3
];

const ScrabbleTileTitle = () => {
  const lines = [
    ['MY', 'WORD'],
    ['UNSCRAMBLER']
  ];
  let letterIndex = 0;

  return (
    <div className="flex flex-col items-center justify-center gap-3 md:gap-5 mb-8 w-full">
      {lines.map((line, lineIdx) => (
        <div 
          key={lineIdx} 
          className={cn(
            "flex flex-wrap justify-center",
            lineIdx === 0 ? "gap-8 sm:gap-12 md:gap-16 lg:gap-20" : "gap-4 sm:gap-6 md:gap-8"
          )}
        >
          {line.map((word, wIdx) => (
            <div key={wIdx} className="flex justify-center gap-1.5 sm:gap-2 md:gap-3">
              {word.split('').map((letter, lIdx) => {
                const rotation = rotations[letterIndex % rotations.length];
                const points = getLetterPoints(letter);
                letterIndex++;
                
                return (
                  <div
                    key={`${lineIdx}-${wIdx}-${lIdx}`}
                    className={cn(
                      "relative flex items-center justify-center font-bold select-none",
                      "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
                      "bg-[#f2e2c4] border-2 border-[#cfbe9f] text-[#3d2b1f]",
                      "rounded-lg shadow-[0_4px_6px_-1px_rgba(61,43,31,0.1),0_2px_4px_-2px_rgba(61,43,31,0.1)]",
                      "transition-transform duration-300 hover:scale-110 hover:z-10 hover:shadow-lg"
                    )}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">
                      {letter}
                    </span>
                    <span className="absolute bottom-1 right-1.5 text-[9px] sm:text-[10px] md:text-xs font-semibold leading-none opacity-80">
                      {points}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScrabbleTileTitle;