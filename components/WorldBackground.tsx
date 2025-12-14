import React from 'react';
import { Emotion } from '../types';

interface WorldBackgroundProps {
  emotion: Emotion;
  variant?: 'default' | 'sanctuary' | 'mirror';
  children: React.ReactNode;
}

const WorldBackground: React.FC<WorldBackgroundProps> = ({ emotion, variant = 'default', children }) => {
  // Base background logic
  let bgGradient = 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]'; 
  
  // Override for sanctuary/mirror modes (brighter, softer)
  if (variant === 'sanctuary') {
    bgGradient = 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
  } else if (variant === 'mirror') {
    bgGradient = 'bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-900';
  }

  let accentGradient = '';

  if (variant === 'default') {
    switch (emotion) {
      case Emotion.STRESSED:
        accentGradient = 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-red-900/20 after:to-transparent';
        break;
      case Emotion.CALM:
        accentGradient = 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-900/20 after:to-transparent';
        break;
      case Emotion.HOPEFUL:
        accentGradient = 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-amber-900/10 after:to-transparent';
        break;
      case Emotion.CONFUSED:
        accentGradient = 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-gray-900/30 after:to-transparent';
        break;
    }
  } else {
    // softer overlays for internal pages
    accentGradient = 'after:absolute after:inset-0 after:bg-white/5 after:pointer-events-none';
  }

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 ${bgGradient} text-slate-100 ${accentGradient} overflow-y-auto overflow-x-hidden`}>
      {/* Background ambient glow effects */}
      <div className={`absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${variant === 'default' ? 'bg-indigo-600/20' : 'bg-pink-500/10'}`}></div>
      <div className={`absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${variant === 'default' ? 'bg-blue-600/10' : 'bg-amber-500/10'}`}></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default WorldBackground;