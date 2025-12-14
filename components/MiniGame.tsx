import React, { useState, useEffect } from 'react';

// Common Types & Constants
const COLORS = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-red-500', 'bg-purple-500'];
const SYMBOLS = ['🌟', '🌙', '🔥', '💧', '🍀', '💎', '🎵', '⚡'];

interface GameProps {
  onWin: (points: number) => void;
  onBack: () => void;
}

// --- Game 1: Crystal Clarity (Match 3) ---
const CrystalClarity: React.FC<GameProps> = ({ onWin, onBack }) => {
  const GRID_WIDTH = 6;
  const GRID_HEIGHT = 6;
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    const newGrid = [];
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
      newGrid.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    setGrid(newGrid);
  };

  const checkForMatches = (currentGrid: string[]) => {
    const matches = new Set<number>();
    // Horizontal
    for (let r = 0; r < GRID_HEIGHT; r++) {
      for (let c = 0; c < GRID_WIDTH - 2; c++) {
        const idx = r * GRID_WIDTH + c;
        const color = currentGrid[idx];
        if (!color) continue;
        if (currentGrid[idx + 1] === color && currentGrid[idx + 2] === color) {
          matches.add(idx); matches.add(idx + 1); matches.add(idx + 2);
        }
      }
    }
    // Vertical
    for (let c = 0; c < GRID_WIDTH; c++) {
      for (let r = 0; r < GRID_HEIGHT - 2; r++) {
        const idx = r * GRID_WIDTH + c;
        const color = currentGrid[idx];
        if (!color) continue;
        if (currentGrid[idx + GRID_WIDTH] === color && currentGrid[idx + GRID_WIDTH * 2] === color) {
          matches.add(idx); matches.add(idx + GRID_WIDTH); matches.add(idx + GRID_WIDTH * 2);
        }
      }
    }
    return matches;
  };

  const fillGrid = (currentGrid: string[]) => {
    const newGrid = [...currentGrid];
    for (let c = 0; c < GRID_WIDTH; c++) {
      let emptySlots = 0;
      for (let r = GRID_HEIGHT - 1; r >= 0; r--) {
        const idx = r * GRID_WIDTH + c;
        if (newGrid[idx] === '') {
          emptySlots++;
        } else if (emptySlots > 0) {
          newGrid[idx + emptySlots * GRID_WIDTH] = newGrid[idx];
          newGrid[idx] = '';
        }
      }
      for (let r = 0; r < emptySlots; r++) {
        const idx = r * GRID_WIDTH + c;
        newGrid[idx] = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    }
    return newGrid;
  };

  const processBoard = async (currentGrid: string[], depth = 0): Promise<void> => {
    if (depth > 5) return;
    const matches = checkForMatches(currentGrid);
    if (matches.size > 0) {
      setIsProcessing(true);
      const points = matches.size * 10;
      setScore(s => s + points);
      onWin(points);
      const gridAfterRemove = [...currentGrid];
      matches.forEach(idx => gridAfterRemove[idx] = '');
      setGrid(gridAfterRemove);
      await new Promise(r => setTimeout(r, 300));
      const filledGrid = fillGrid(gridAfterRemove);
      setGrid(filledGrid);
      await new Promise(r => setTimeout(r, 300));
      await processBoard(filledGrid, depth + 1);
    } else {
      setIsProcessing(false);
    }
  };

  const handleTileClick = async (index: number) => {
    if (isProcessing) return;
    if (selected === null) {
      setSelected(index);
    } else {
      const r1 = Math.floor(selected / GRID_WIDTH);
      const c1 = selected % GRID_WIDTH;
      const r2 = Math.floor(index / GRID_WIDTH);
      const c2 = index % GRID_WIDTH;
      const isAdjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

      if (isAdjacent) {
        const newGrid = [...grid];
        const temp = newGrid[selected];
        newGrid[selected] = newGrid[index];
        newGrid[index] = temp;
        setGrid(newGrid);
        setSelected(null);
        const matches = checkForMatches(newGrid);
        if (matches.size > 0) {
          await processBoard(newGrid);
        } else {
          setTimeout(() => {
            const revertedGrid = [...newGrid];
            revertedGrid[index] = newGrid[selected];
            revertedGrid[selected] = newGrid[index];
            setGrid(revertedGrid);
          }, 300);
        }
      } else {
        setSelected(index);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 items-center">
        <button onClick={onBack} className="text-slate-300 hover:text-white text-sm uppercase tracking-widest">← Back</button>
        <span className="text-xl font-serif text-white">Score: {score}</span>
      </div>
      <div className="bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-800">
        <div className="grid grid-cols-6 gap-2">
          {grid.map((color, idx) => (
            <button
              key={idx}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${color} shadow-lg transition-all transform 
                ${selected === idx ? 'ring-4 ring-white scale-110 z-10' : 'hover:brightness-110'}
                ${color === '' ? 'invisible' : ''}`}
              onClick={() => handleTileClick(idx)}
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-slate-400 text-sm">Swap crystals to align 3 or more.</p>
    </div>
  );
};

// --- Game 2: Serenity Rescue (Block Clicker) ---
const SerenityRescue: React.FC<GameProps> = ({ onWin, onBack }) => {
  const WIDTH = 8;
  const HEIGHT = 8;
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const newGrid = Array(WIDTH * HEIGHT).fill(0).map(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
    setGrid(newGrid);
  }, []);

  const getConnectedGroup = (idx: number, color: string, visited = new Set<number>()): number[] => {
    if (idx < 0 || idx >= grid.length || visited.has(idx) || grid[idx] !== color) return [];
    
    visited.add(idx);
    const group = [idx];
    const x = idx % WIDTH;
    
    // Check neighbors (Left, Right, Up, Down)
    if (x > 0) group.push(...getConnectedGroup(idx - 1, color, visited));
    if (x < WIDTH - 1) group.push(...getConnectedGroup(idx + 1, color, visited));
    if (idx >= WIDTH) group.push(...getConnectedGroup(idx - WIDTH, color, visited));
    if (idx < WIDTH * (HEIGHT - 1)) group.push(...getConnectedGroup(idx + WIDTH, color, visited));
    
    return group;
  };

  const handleBlockClick = (idx: number) => {
    const color = grid[idx];
    if (color === 'transparent') return;

    const group = getConnectedGroup(idx, color);
    if (group.length < 2) return;

    // 1. Remove blocks
    let newGrid = [...grid];
    group.forEach(i => newGrid[i] = 'transparent');
    
    // Update Score
    const points = group.length * 5;
    setScore(s => s + points);
    onWin(points);

    // 2. Gravity (Drop down)
    for (let x = 0; x < WIDTH; x++) {
      let writeY = HEIGHT - 1;
      for (let y = HEIGHT - 1; y >= 0; y--) {
        const i = y * WIDTH + x;
        if (newGrid[i] !== 'transparent') {
          const writeI = writeY * WIDTH + x;
          newGrid[writeI] = newGrid[i];
          if (writeY !== y) newGrid[i] = 'transparent';
          writeY--;
        }
      }
    }

    // 3. Slide Columns Left
    let writeCol = 0;
    for (let x = 0; x < WIDTH; x++) {
      // Check if column is empty
      let isEmpty = true;
      for (let y = 0; y < HEIGHT; y++) {
        if (newGrid[y * WIDTH + x] !== 'transparent') {
          isEmpty = false;
          break;
        }
      }

      if (!isEmpty) {
        if (writeCol !== x) {
          for (let y = 0; y < HEIGHT; y++) {
            newGrid[y * WIDTH + writeCol] = newGrid[y * WIDTH + x];
            newGrid[y * WIDTH + x] = 'transparent';
          }
        }
        writeCol++;
      }
    }

    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 items-center">
        <button onClick={onBack} className="text-slate-300 hover:text-white text-sm uppercase tracking-widest">← Back</button>
        <span className="text-xl font-serif text-white">Score: {score}</span>
      </div>
      <div className="bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-800">
        <div className="grid grid-cols-8 gap-1">
          {grid.map((color, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-sm ${color === 'transparent' ? 'invisible' : color} hover:brightness-110 transition-colors`}
              onClick={() => handleBlockClick(idx)}
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-slate-400 text-sm">Click groups of 2+ matching blocks to clear them.</p>
    </div>
  );
};

// --- Game 3: Memory Mist (Concentration) ---
const MemoryMist: React.FC<GameProps> = ({ onWin, onBack }) => {
  const [cards, setCards] = useState<{id: number, symbol: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    // 8 pairs = 16 cards
    const symbols = [...SYMBOLS, ...SYMBOLS]; 
    // Shuffle
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    setCards(symbols.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false })));
  }, []);

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length >= 2 || cards[idx].flipped || cards[idx].matched) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [idx1, idx2] = newFlipped;
      if (newCards[idx1].symbol === newCards[idx2].symbol) {
        // Match
        setTimeout(() => {
          newCards[idx1].matched = true;
          newCards[idx2].matched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setMatches(m => m + 1);
          onWin(20);
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          newCards[idx1].flipped = false;
          newCards[idx2].flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-full mb-4 items-center">
        <button onClick={onBack} className="text-slate-300 hover:text-white text-sm uppercase tracking-widest">← Back</button>
        <span className="text-xl font-serif text-white">Matches: {matches}/8</span>
      </div>
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            className={`w-16 h-20 md:w-20 md:h-24 rounded-lg text-3xl flex items-center justify-center transition-all duration-500 transform perspective-1000 ${
              card.flipped || card.matched ? 'bg-indigo-600 rotate-y-180' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {(card.flipped || card.matched) ? card.symbol : '✦'}
          </button>
        ))}
      </div>
      <p className="mt-8 text-slate-400 text-sm">Find matching pairs to clear the mist.</p>
    </div>
  );
};

// --- Main Arcade Hub ---

interface MiniGameProps {
  onWin: (points: number) => void;
  onClose: () => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ onWin, onClose }) => {
  const [activeGame, setActiveGame] = useState<'match3' | 'rescue' | 'memory' | null>(null);

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-4xl bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col p-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-8 tracking-widest uppercase">
          {activeGame ? 'Arcade Mode' : 'The Arcade'}
        </h2>

        <div className="flex-grow flex items-center justify-center">
          {!activeGame ? (
            <div className="grid md:grid-cols-3 gap-6 w-full">
              {/* Game Card 1 */}
              <button 
                onClick={() => setActiveGame('match3')}
                className="group relative h-80 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-400 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-slate-800 flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center text-5xl">
                  💎
                </div>
                <div className="p-6 flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-serif text-white group-hover:text-blue-300 transition-colors">Crystal Clarity</h3>
                  <p className="text-sm text-slate-400">Align your thoughts. Match 3 crystals to clear the board.</p>
                </div>
              </button>

              {/* Game Card 2 */}
              <button 
                onClick={() => setActiveGame('rescue')}
                className="group relative h-80 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-400 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-slate-800 flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center text-5xl">
                  🧩
                </div>
                <div className="p-6 flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-serif text-white group-hover:text-emerald-300 transition-colors">Serenity Rescue</h3>
                  <p className="text-sm text-slate-400">Collapse blocks of stress. Find patterns to clear the clutter.</p>
                </div>
              </button>

              {/* Game Card 3 */}
              <button 
                onClick={() => setActiveGame('memory')}
                className="group relative h-80 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-400 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-slate-800 flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center text-5xl">
                  🎴
                </div>
                <div className="p-6 flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-serif text-white group-hover:text-purple-300 transition-colors">Memory Mist</h3>
                  <p className="text-sm text-slate-400">Focus your mind. Find the matching runes in the fog.</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center animate-fade-in">
              {activeGame === 'match3' && <CrystalClarity onWin={onWin} onBack={() => setActiveGame(null)} />}
              {activeGame === 'rescue' && <SerenityRescue onWin={onWin} onBack={() => setActiveGame(null)} />}
              {activeGame === 'memory' && <MemoryMist onWin={onWin} onBack={() => setActiveGame(null)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGame;