import React from 'react';
import { Emotion } from '../types';

interface LumaProps {
  emotion: Emotion;
  onClick?: () => void;
}

const Luma: React.FC<LumaProps> = ({ emotion, onClick }) => {
  let colorClass = 'bg-aether-hope';
  let glowClass = 'shadow-cyan-400/50';

  switch (emotion) {
    case Emotion.STRESSED:
      colorClass = 'bg-aether-stress';
      glowClass = 'shadow-red-500/50';
      break;
    case Emotion.CONFUSED:
      colorClass = 'bg-gray-400';
      glowClass = 'shadow-gray-400/50';
      break;
    case Emotion.CALM:
      colorClass = 'bg-aether-calm';
      glowClass = 'shadow-blue-400/50';
      break;
    case Emotion.HOPEFUL:
      colorClass = 'bg-aether-gold';
      glowClass = 'shadow-yellow-400/50';
      break;
  }

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 cursor-pointer animate-float group"
      onClick={onClick}
    >
      <div className={`w-16 h-16 rounded-full ${colorClass} shadow-lg ${glowClass} blur-sm absolute opacity-60 animate-pulse-slow`}></div>
      <div className={`relative w-12 h-12 m-2 rounded-full ${colorClass} shadow-xl flex items-center justify-center transition-all duration-1000`}>
        {/* Eyes */}
        <div className="flex gap-2">
           <div className={`w-2 h-2 bg-white rounded-full ${emotion === Emotion.STRESSED ? 'h-1' : 'h-2'}`}></div>
           <div className={`w-2 h-2 bg-white rounded-full ${emotion === Emotion.STRESSED ? 'h-1' : 'h-2'}`}></div>
        </div>
      </div>
      {/* Dialogue Bubble (Hidden by default, shown on hover/action) */}
      <div className="absolute bottom-20 right-0 w-48 p-3 bg-white/90 rounded-lg text-sm text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        {emotion === Emotion.STRESSED && "I'm here with you. Deep breaths."}
        {emotion === Emotion.CALM && "The air feels so light today!"}
        {emotion === Emotion.HOPEFUL && "We can do anything!"}
        {emotion === Emotion.CONFUSED && "Which way should we go?"}
        {emotion === Emotion.NEUTRAL && "I'm ready for the adventure."}
      </div>
    </div>
  );
};

export default Luma;
