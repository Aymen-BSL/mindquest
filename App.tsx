import React, { useState, useEffect } from "react";
import { AppScreen, Emotion, PlayerState, SanctuaryContent } from "./types";
import { STORY_DATA } from "./constants";
import WorldBackground from "./components/WorldBackground";
import Luma from "./components/Luma";
import MiniGame from "./components/MiniGame";
import {
  generateSanctuaryContent,
  reframeThought,
} from "./services/geminiService";
import { db } from "./services/database"; // This now points to the API version

// --- Icons (SVGs) ---
const CastleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M2,22V20C2,20 7,20 7,20V15H5V11H7V7H5V4H7V2H9V4H11V2H13V4H15V2H17V4H19V7H17V11H19V15H17V20C17,20 22,20 22,20V22H2M9,15H11V20H9V15M13,15H15V20H13V15Z" />
  </svg>
);

const MirrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" />
  </svg>
);

const TreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M12,2L5,12H8V15H4V22H20V15H16V12H19L12,2Z" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M19,2L14,6.5V17.5L19,13.5V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,20.9 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,18.9 12,20V4C10.55,2.9 8.45,2.5 6.5,2.5C4.55,2.5 2.45,2.9 1,4V5.5C1.75,5.15 2.4,5 6.5,5Z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-12 h-12 text-slate-400"
  >
    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8C19.1,8 20,8.9 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.9 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
  </svg>
);

const TimeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-12 h-12 text-slate-400"
  >
    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-12 h-12 text-aether-gold"
  >
    <path d="M14.1,9L15,11L15.9,9L18,8.1L15.9,7.2L15,5.2L14.1,7.2L12,8.1L14.1,9M12,19L12.9,16.9L15,16L12.9,15.1L12,13L11.1,15.1L9,16L11.1,16.9L12,19M9.1,13L10,11L10.9,13L13,13.9L10.9,14.8L10,16.8L9.1,14.8L7,13.9L9.1,13Z" />
  </svg>
);

// --- Helper Functions ---

const COOLDOWN_DAYS = 7;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

const getDaysRemaining = (lastDate?: number) => {
  if (!lastDate) return 0;
  const diff = Date.now() - lastDate;
  if (diff >= COOLDOWN_MS) return 0;
  return Math.ceil((COOLDOWN_MS - diff) / (24 * 60 * 60 * 1000));
};

// --- Layout Components ---

const Header = ({
  state,
  onNavigate,
}: {
  state: PlayerState;
  onNavigate: (s: AppScreen) => void;
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 z-40 shadow-lg">
      {/* Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigate(AppScreen.HOME)}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform"></div>
        <h1 className="text-xl font-serif font-bold tracking-wider text-slate-100">
          MINDQUEST
        </h1>
      </div>

      {/* Stats Center */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-[10px] text-red-300 font-bold uppercase tracking-wider">
            <span>Stress</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${state.stress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-[10px] text-teal-300 font-bold uppercase tracking-wider">
            <span>Calm</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-1000"
              style={{ width: `${state.clarity}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-[10px] text-amber-300 font-bold uppercase tracking-wider">
            <span>Hope</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-1000"
              style={{ width: `${state.mood}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Icons - Functional Buttons */}
      <div className="flex items-center gap-4">
        {state.userName && (
          <span className="hidden md:inline text-sm text-slate-400 font-serif mr-2">
            Hello, {state.userName}
          </span>
        )}
        <button
          onClick={() =>
            state.sanctuaryUnlocked && onNavigate(AppScreen.SANCTUARY)
          }
          className={`p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all 
            ${
              state.sanctuaryUnlocked
                ? "text-pink-400 bg-pink-400/10 hover:bg-pink-400/20 cursor-pointer hover:scale-110"
                : "text-slate-600 cursor-not-allowed opacity-60"
            }`}
          title={state.sanctuaryUnlocked ? "Go to Sanctuary" : "Locked"}
        >
          <div className="w-6 h-6">
            <BookIcon />
          </div>
        </button>
        <button
          onClick={() => state.mirrorUnlocked && onNavigate(AppScreen.MIRROR)}
          className={`p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all 
            ${
              state.mirrorUnlocked
                ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 cursor-pointer hover:scale-110"
                : "text-slate-600 cursor-not-allowed opacity-60"
            }`}
          title={state.mirrorUnlocked ? "Go to Mirror" : "Locked"}
        >
          <div className="w-6 h-6">
            <EyeIcon />
          </div>
        </button>
      </div>
    </header>
  );
};

// --- Screen Components ---

const OnboardingScreen = ({
  onRegister,
}: {
  onRegister: (name: string, email: string) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onRegister(name, email);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in relative z-20">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center">
            <span className="text-3xl">⚔️</span>
          </div>
          <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">
            Welcome, Traveler
          </h1>
          <p className="text-slate-400 font-light">
            Before you enter Aetheria, we must know who seeks the inner truth.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-serif"
              placeholder="Your name"
              disabled={isSubmitting}
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-serif"
              placeholder="spirit@example.com"
              disabled={isSubmitting}
            />
          </div>

          <button
            disabled={!name.trim() || !email.trim() || isSubmitting}
            onClick={handleSubmit}
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-widest uppercase rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              "Begin Your Quest"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePortal = ({
  onNavigate,
  state,
  onOpenMiniGame,
  onResetCooldown,
}: {
  onNavigate: (s: AppScreen) => void;
  state: PlayerState;
  onOpenMiniGame: () => void;
  onResetCooldown: (e: React.MouseEvent) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const daysRemaining = getDaysRemaining(state.lastJourneyDate);
  const isJourneyAvailable = daysRemaining === 0;

  useEffect(() => {
    if (state.journeyComplete) {
      const timer = setTimeout(() => setExpanded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setExpanded(false);
    }
  }, [state.journeyComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-10 px-4 overflow-x-hidden">
      <div className="text-center mb-16 md:mb-24 animate-fade-in relative z-20">
        <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          MINDQUEST
        </h1>
        <p className="text-lg text-slate-300 font-light max-w-lg mx-auto leading-relaxed">
          Embark on your journey of self-discovery.
          <br />
          Only through experience can wisdom be unlocked.
        </p>
      </div>

      <div className="relative w-full max-w-6xl h-[900px] md:h-[400px] flex items-center justify-center">
        {/* Card 2: Sanctuary (Left) */}
        <div
          className={`absolute top-0 md:top-auto transition-all duration-1000 ease-in-out w-full md:max-w-[260px] lg:max-w-[320px] h-80
            ${
              expanded
                ? "md:left-0 md:translate-x-0 top-[350px] md:top-auto z-10 scale-100 opacity-100 rotate-0"
                : "md:left-1/2 md:-translate-x-[110%] top-4 z-0 scale-90 opacity-60 md:-rotate-6"
            }`}
        >
          <button
            disabled={!state.journeyComplete}
            onClick={() => onNavigate(AppScreen.SANCTUARY)}
            className={`w-full h-full rounded-2xl border transition-all shadow-2xl overflow-hidden backdrop-blur-sm
              ${
                state.journeyComplete
                  ? "bg-slate-900/60 border-slate-700 hover:border-pink-500/50 hover:-translate-y-2 cursor-pointer group"
                  : "bg-slate-950/80 border-slate-800 cursor-not-allowed"
              }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              {state.journeyComplete ? (
                <>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]">
                    <BookIcon />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-3 tracking-wide">
                    THE SANCTUARY
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed px-4">
                    A haven of wisdom built from your journey's insights.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6 text-slate-600">
                    <BookIcon />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LockIcon />
                  </div>
                  <div className="mt-12 opacity-50">
                    <h2 className="text-2xl font-serif font-bold text-slate-500 mb-3 tracking-wide">
                      THE SANCTUARY
                    </h2>
                    <p className="text-sm text-slate-600 px-4">
                      A haven of wisdom built from your journey's insights.
                    </p>
                  </div>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Card 1: Journey (Middle) */}
        <div
          className={`absolute top-0 md:top-auto transition-all duration-1000 ease-in-out w-full md:max-w-[260px] lg:max-w-[320px] h-80
            ${
              expanded
                ? "left-1/2 -translate-x-1/2 top-0 md:top-auto z-20 scale-100"
                : "left-1/2 -translate-x-1/2 top-0 md:top-auto z-20 scale-110 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            }`}
        >
          {/* Main Card Button */}
          <button
            disabled={!isJourneyAvailable}
            onClick={() => onNavigate(AppScreen.JOURNEY)}
            className={`w-full h-full rounded-2xl border transition-all overflow-hidden shadow-2xl backdrop-blur-sm group
              ${
                isJourneyAvailable
                  ? "bg-slate-900/80 border-slate-600 hover:border-emerald-500/50 hover:-translate-y-2 cursor-pointer"
                  : "bg-slate-950/90 border-slate-800 cursor-not-allowed opacity-80"
              }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              {isJourneyAvailable ? (
                <>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <TreeIcon />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-3 tracking-wide">
                    THE JOURNEY
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed px-4">
                    Enter the Forest of Thoughts. Analyze your stress, mood, and
                    clarity.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6 text-slate-500">
                    <TimeIcon />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-slate-400 mb-2 tracking-wide">
                    SPIRITS ARE RESTING
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed px-4">
                    The forest needs time to regrow.
                  </p>
                  <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-emerald-500/80 text-xs font-mono">
                    Opens in {daysRemaining}{" "}
                    {daysRemaining === 1 ? "day" : "days"}
                  </div>
                </>
              )}
            </div>
            {/* Subtle gradient overlay on hover (only if available) */}
            {isJourneyAvailable && (
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </button>

          {/* Reset Button (Only visible when locked) */}
          {!isJourneyAvailable && (
            <button
              onClick={onResetCooldown}
              className="absolute top-3 right-3 z-30 p-2 bg-slate-800/80 rounded-full text-slate-500 hover:text-emerald-400 hover:bg-slate-700 border border-slate-600 hover:border-emerald-500/50 transition-all shadow-lg"
              title="Reset Cooldown (Debug)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Card 3: Mirror (Right) */}
        <div
          className={`absolute top-0 md:top-auto transition-all duration-1000 ease-in-out w-full md:max-w-[260px] lg:max-w-[320px] h-80
             ${
               expanded
                 ? "md:right-0 md:translate-x-0 top-[700px] md:top-auto z-10 scale-100 opacity-100 rotate-0"
                 : "md:right-1/2 md:translate-x-[110%] top-8 z-0 scale-90 opacity-60 md:rotate-6"
             }`}
        >
          <button
            disabled={!state.journeyComplete}
            onClick={() => onNavigate(AppScreen.MIRROR)}
            className={`w-full h-full rounded-2xl border transition-all shadow-2xl overflow-hidden backdrop-blur-sm
              ${
                state.journeyComplete
                  ? "bg-slate-900/60 border-slate-700 hover:border-amber-500/50 hover:-translate-y-2 cursor-pointer group"
                  : "bg-slate-950/80 border-slate-800 cursor-not-allowed"
              }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              {state.journeyComplete ? (
                <>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    <EyeIcon />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mb-3 tracking-wide">
                    MIRROR OF CLARITY
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed px-4">
                    Reflect upon your burdens. The mirror evolves based on your
                    journey.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6 text-slate-600">
                    <EyeIcon />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LockIcon />
                  </div>
                  <div className="mt-12 opacity-50">
                    <h2 className="text-2xl font-serif font-bold text-slate-500 mb-3 tracking-wide">
                      MIRROR OF CLARITY
                    </h2>
                    <p className="text-sm text-slate-600 px-4">
                      Reflect upon your burdens. The mirror evolves based on
                      your journey.
                    </p>
                  </div>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="mt-8 md:mt-16 relative z-20">
        <button
          onClick={onOpenMiniGame}
          className="text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4 transition-all text-sm font-light tracking-wide flex items-center gap-2"
        >
          <span>🕹️</span> Enter the Arcade
        </button>
      </div>
    </div>
  );
};

const JourneyEngine = ({
  onComplete,
  updateStats,
}: {
  onComplete: (history: string[], finalNode: string) => void;
  updateStats: (effects: any) => void;
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);

  // Track history for backtracking: stores previous node ID and the effects applied at that step
  const [stepHistory, setStepHistory] = useState<
    { nodeId: string; effects: any }[]
  >([]);

  const node = STORY_DATA[currentNodeId];

  const handleChoice = (option: any) => {
    updateStats(option.effects);

    // Save current state before moving forward
    setStepHistory((prev) => [
      ...prev,
      { nodeId: currentNodeId, effects: option.effects },
    ]);

    const newHistory = [...history, option.logText];
    setHistory(newHistory);

    const nextNode = STORY_DATA[option.nextNodeId];
    if (nextNode && nextNode.isEnding) {
      setCurrentNodeId(option.nextNodeId);
      setTimeout(() => onComplete(newHistory, nextNode.text), 6000);
    } else {
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleBack = () => {
    if (stepHistory.length === 0) return;

    const lastStep = stepHistory[stepHistory.length - 1];

    // Revert stats
    const reversedEffects = {
      stress: -(lastStep.effects.stress || 0),
      clarity: -(lastStep.effects.clarity || 0),
      mood: -(lastStep.effects.mood || 0),
    };
    updateStats(reversedEffects);

    // Revert location
    setCurrentNodeId(lastStep.nodeId);

    // Remove last history entry
    setStepHistory((prev) => prev.slice(0, -1));
    setHistory((prev) => prev.slice(0, -1));
  };

  if (!node) return <div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 animate-fade-in max-w-4xl mx-auto">
      {/* Title Box */}
      <div className="w-full border border-slate-700 bg-slate-950 p-6 md:p-8 rounded-t-lg border-b-0 text-center relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-widest uppercase">
          {!node.isEnding ? "The Path of Choices" : "Journey's End"}
        </h2>
      </div>

      {/* Story Box with Image */}
      <div className="w-full bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-b-lg overflow-hidden shadow-2xl relative">
        {/* Scene Image */}
        {node.image && (
          <div className="w-full h-64 md:h-80 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
            <img
              src={node.image}
              alt="Scene"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        )}

        {/* Back Button (Floating) */}
        {stepHistory.length > 0 && !node.isEnding && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 z-30 px-4 py-2 bg-slate-900/80 border border-slate-600 rounded-full text-slate-300 hover:text-white hover:border-white transition-all text-sm uppercase tracking-wider backdrop-blur-md shadow-lg"
          >
            ← Return
          </button>
        )}

        <div className="p-8 md:p-12 relative z-20 -mt-20">
          <div className="bg-slate-900/90 p-8 rounded-xl border border-slate-700/50 shadow-xl">
            <p className="text-xl md:text-2xl leading-loose text-slate-100 font-light text-center">
              {node.text}
            </p>
          </div>
        </div>
      </div>

      {/* Choices Box */}
      {!node.isEnding ? (
        <div className="w-full grid md:grid-cols-2 gap-4 mt-8">
          {node.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt)}
              className="h-32 p-6 rounded-lg bg-slate-950 border border-slate-700 hover:border-slate-400 hover:bg-slate-900 transition-all text-white font-serif text-lg tracking-wide shadow-lg group text-left flex items-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="w-full relative z-10">{opt.text}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-slate-400 animate-pulse">
          Redirecting to home...
        </div>
      )}
    </div>
  );
};

const Sanctuary = ({
  journeyHistory,
  emotionalStateString,
}: {
  journeyHistory: string[];
  emotionalStateString: string;
}) => {
  const [content, setContent] = useState<SanctuaryContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const summary = journeyHistory.join(", ");
      const data = await generateSanctuaryContent(
        summary,
        emotionalStateString
      );
      setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-8 pb-12 flex flex-col items-center">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif text-indigo-100 mb-4 drop-shadow-md">
          THE SANCTUARY
        </h2>
        <p className="text-indigo-200 font-light">
          Based on your journey, the Elder Spirits have prepared these scrolls
          for you.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-200 animate-pulse font-serif tracking-widest">
            COMMUNING WITH SPIRITS...
          </p>
        </div>
      ) : content ? (
        <div className="grid md:grid-cols-3 gap-12 w-full max-w-7xl">
          {/* Card 1: Tip */}
          <div className="relative pt-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-full border-4 border-indigo-900/50 z-20 flex items-center justify-center shadow-lg">
              <span className="text-3xl">💡</span>
            </div>
            <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/80 border border-indigo-500/30 rounded-t-[100px] rounded-b-lg p-8 pt-16 min-h-[400px] text-center shadow-2xl backdrop-blur-sm flex flex-col items-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                TIP
              </h3>
              <h4 className="text-2xl font-serif text-white mb-8">
                ANCIENT WISDOM
              </h4>
              <div className="space-y-6 text-slate-200 font-light leading-relaxed">
                {content.tips.map((tip, i) => (
                  <p key={i} className="italic">
                    "{tip}"
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Exercise */}
          <div className="relative pt-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full border-4 border-purple-900/50 z-20 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🧘</span>
            </div>
            <div className="bg-gradient-to-b from-purple-900/40 to-slate-900/80 border border-purple-500/30 rounded-t-[100px] rounded-b-lg p-8 pt-16 min-h-[400px] text-center shadow-2xl backdrop-blur-sm flex flex-col items-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-purple-300 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                EXERCISE
              </h3>
              <h4 className="text-2xl font-serif text-white mb-8">
                GROUNDING RITUALS
              </h4>
              <div className="space-y-6 text-slate-200 font-light leading-relaxed">
                {content.exercises.map((ex, i) => (
                  <p key={i}>"{ex}"</p>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Reading */}
          <div className="relative pt-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-teal-500 to-teal-700 rounded-full border-4 border-teal-900/50 z-20 flex items-center justify-center shadow-lg">
              <span className="text-3xl">📜</span>
            </div>
            <div className="bg-gradient-to-b from-teal-900/40 to-slate-900/80 border border-teal-500/30 rounded-t-[100px] rounded-b-lg p-8 pt-16 min-h-[400px] text-center shadow-2xl backdrop-blur-sm flex flex-col items-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-teal-300 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                READING
              </h3>
              <h4 className="text-2xl font-serif text-white mb-8">
                CHRONICLES
              </h4>
              <div className="space-y-6 text-slate-200 font-light leading-relaxed">
                {content.readings.map((read, i) => (
                  <p key={i} className="italic">
                    "{read}"
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Mirror = ({
  emotionalStateString,
  onReframed,
}: {
  emotionalStateString: string;
  onReframed: () => void;
}) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<{
    reframe: string;
    effect: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await reframeThought(input, emotionalStateString);
    setResponse(result);
    setLoading(false);
    onReframed();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-serif text-white mt-14 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          THE MIRROR OF CLARITY
        </h2>
        <p className="text-blue-200 font-light">
          Your journey has brought you here. Now, speak your truth.
        </p>
      </div>

      {/* Realistic Mirror Container - Dark Mode */}
      <div className="relative group perspective-1000">
        {/* The Frame - Dark Metal */}
        <div className="w-[350px] md:w-[600px] min-h-[500px] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-4 rounded-[40px] md:rounded-[100px] shadow-[0_0_60px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.5)] border-2 border-slate-900">
          {/* Inner Bevel/Depth */}
          <div className="w-full h-full bg-slate-950 rounded-[35px] md:rounded-[90px] p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            {/* The Mirror Surface - Deep Dark */}
            <div className="w-full h-full bg-gradient-to-b from-slate-600 to-slate-900 rounded-[30px] md:rounded-[85px] border border-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 shadow-inner">
              {/* Reflection/Sheen effects - Subtle on dark */}
              {/* <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-white/5 to-transparent rotate-45 pointer-events-none transform translate-y-[-20%]"></div> */}

              {/* Content inside the mirror */}
              <div className="relative z-10 w-full flex flex-col gap-6 text-center">
                {!response ? (
                  <>
                    <h3 className="text-xl md:text-2xl font-serif text-slate-300 drop-shadow-md">
                      Reflect Your Thoughts
                    </h3>

                    {/* Input */}
                    <div className="relative group/input">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="What clouds your mind today?"
                        className="relative w-full h-40 bg-slate-800/60 border border-slate-600 focus:border-blue-500 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-800 transition-all resize-none text-center font-serif text-lg md:text-xl leading-relaxed shadow-inner"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !input}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/20 rounded-full text-white font-serif tracking-[0.2em] shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? "DISSOLVING MIST..." : "REVEAL CLARITY"}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="flex justify-center mb-6">
                      <SparkleIcon />
                    </div>

                    <p className="text-2xl font-serif italic text-white mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      "{response.reframe}"
                    </p>

                    <div className="inline-block px-4 py-2 bg-slate-800 rounded-full border border-slate-600 text-amber-200 font-bold text-xs tracking-widest uppercase mb-8 shadow-md">
                      Effect: {response.effect}
                    </div>

                    <button
                      onClick={() => {
                        setResponse(null);
                        setInput("");
                      }}
                      className="px-8 py-3 bg-transparent border border-slate-500 hover:border-slate-300 text-slate-400 hover:text-white rounded-full transition-all uppercase tracking-wider text-sm"
                    >
                      Gaze Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.HOME);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state with defaults
  const [playerState, setPlayerState] = useState<PlayerState>({
    isRegistered: false,
    userId: undefined,
    userName: undefined,
    stress: 20,
    clarity: 40,
    mood: 60,
    journeyComplete: false,
    journeyHistory: [],
    journeyAnalysis: "",
    sanctuaryUnlocked: false,
    mirrorUnlocked: false,
    clarityPoints: 0,
  });

  // Load state from DB and LocalStorage on mount
  useEffect(() => {
    const initApp = async () => {
      // 1. Load persistent UI state (cooldowns, mood) from LocalStorage
      const saved = localStorage.getItem("mindquest_state");
      let localState = {};
      if (saved) {
        try {
          localState = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved state", e);
        }
      }

      // 2. Load User from Database (Async check)
      const dbUser = await db.getUser();

      // 3. Merge states (DB is authority on identity)
      setPlayerState((prev) => ({
        ...prev,
        ...localState,
        isRegistered: !!dbUser,
        userId: dbUser?.id,
        userName: dbUser?.name,
      }));

      setIsLoading(false);
    };

    initApp();
  }, []);

  // Save UI state whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("mindquest_state", JSON.stringify(playerState));
    }
  }, [playerState, isLoading]);

  const handleRegister = async (name: string, email: string) => {
    try {
      const newUser = await db.createUser(name, email);
      setPlayerState((prev) => ({
        ...prev,
        isRegistered: true,
        userId: newUser.id,
        userName: newUser.name,
      }));
    } catch (e) {
      console.error("Registration failed", e);
      alert("Could not register. Please ensure the backend server is running.");
    }
  };

  const getEmotion = (): Emotion => {
    if (playerState.stress > 70) return Emotion.STRESSED;
    if (playerState.clarity < 30) return Emotion.CONFUSED;
    if (playerState.mood > 70) return Emotion.HOPEFUL;
    if (playerState.stress < 30 && playerState.mood > 50) return Emotion.CALM;
    return Emotion.NEUTRAL;
  };

  const handleStatsUpdate = (effects: {
    stress?: number;
    clarity?: number;
    mood?: number;
  }) => {
    setPlayerState((prev) => ({
      ...prev,
      stress: Math.max(0, Math.min(100, prev.stress + (effects.stress || 0))),
      clarity: Math.max(
        0,
        Math.min(100, prev.clarity + (effects.clarity || 0))
      ),
      mood: Math.max(0, Math.min(100, prev.mood + (effects.mood || 0))),
    }));
  };

  const handleJourneyComplete = async (
    history: string[],
    finalNodeText: string
  ) => {
    // 1. Save to DB (Fire and forget, or await if you want strict consistency)
    try {
      await db.createJourney(history);
      if (playerState.userId) {
        await db.updateUserAnalysis(playerState.userId, finalNodeText);
      }
    } catch (e) {
      console.error("Failed to sync journey with DB", e);
    }

    setPlayerState((prev) => ({
      ...prev,
      journeyComplete: true,
      lastJourneyDate: Date.now(),
      sanctuaryUnlocked: true,
      mirrorUnlocked: true,
      journeyHistory: history,
      journeyAnalysis: finalNodeText,
    }));
    setScreen(AppScreen.HOME);
  };

  const handleMiniGameWin = (points: number) => {
    setPlayerState((prev) => ({
      ...prev,
      clarity: Math.min(100, prev.clarity + 10),
      stress: Math.max(0, prev.stress - 10),
      clarityPoints: prev.clarityPoints + points,
    }));
  };

  const handleReframing = () => {
    setPlayerState((prev) => ({
      ...prev,
      mood: Math.min(100, prev.mood + 10),
      clarity: Math.min(100, prev.clarity + 10),
    }));
  };

  const handleResetCooldown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayerState((prev) => ({
      ...prev,
      lastJourneyDate: undefined,
    }));
  };

  // Determine Background Variant
  let bgVariant: "default" | "sanctuary" | "mirror" = "default";
  if (screen === AppScreen.SANCTUARY) bgVariant = "sanctuary";
  if (screen === AppScreen.MIRROR) bgVariant = "mirror";

  // --- Render Flow ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-500 font-serif">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p>Connecting to Aetheria...</p>
      </div>
    );
  }

  if (!playerState.isRegistered) {
    return (
      <WorldBackground emotion={Emotion.NEUTRAL} variant="default">
        <OnboardingScreen onRegister={handleRegister} />
      </WorldBackground>
    );
  }

  return (
    <WorldBackground emotion={getEmotion()} variant={bgVariant}>
      <Header state={playerState} onNavigate={setScreen} />

      <main className="relative z-10 w-full flex-grow">
        {screen === AppScreen.HOME && (
          <HomePortal
            onNavigate={setScreen}
            state={playerState}
            onOpenMiniGame={() => setShowMiniGame(true)}
            onResetCooldown={handleResetCooldown}
          />
        )}
        {screen === AppScreen.JOURNEY && (
          <JourneyEngine
            onComplete={handleJourneyComplete}
            updateStats={handleStatsUpdate}
          />
        )}
        {screen === AppScreen.SANCTUARY && (
          <Sanctuary
            journeyHistory={playerState.journeyHistory}
            emotionalStateString={`Stress: ${playerState.stress}, Clarity: ${playerState.clarity}, Mood: ${playerState.mood}`}
          />
        )}
        {screen === AppScreen.MIRROR && (
          <Mirror
            emotionalStateString={`Stress: ${playerState.stress}, Clarity: ${playerState.clarity}`}
            onReframed={handleReframing}
          />
        )}
      </main>

      <Luma
        emotion={getEmotion()}
        onClick={() => {
          if (playerState.stress > 60) setShowMiniGame(true);
        }}
      />

      {showMiniGame && (
        <MiniGame
          onWin={handleMiniGameWin}
          onClose={() => setShowMiniGame(false)}
        />
      )}
    </WorldBackground>
  );
};

export default App;
