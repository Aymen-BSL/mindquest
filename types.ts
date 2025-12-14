export enum AppScreen {
  HOME = 'HOME',
  JOURNEY = 'JOURNEY',
  SANCTUARY = 'SANCTUARY',
  MIRROR = 'MIRROR',
}

export enum Emotion {
  NEUTRAL = 'NEUTRAL',
  STRESSED = 'STRESSED',
  CALM = 'CALM',
  HOPEFUL = 'HOPEFUL',
  CONFUSED = 'CONFUSED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  analysis?: string; // Populated after journey
}

export interface JourneyRecord {
  id: string;
  createdAt: string;
  story: string; // Serialized JSON of the path taken
}

export interface PlayerState {
  isRegistered: boolean; // New flag for onboarding
  userId?: string; // Link to the DB user
  userName?: string;
  stress: number; // 0-100
  clarity: number; // 0-100
  mood: number; // 0-100
  journeyComplete: boolean;
  lastJourneyDate?: number; // Timestamp of last completion
  journeyHistory: string[]; // Log of choices made
  journeyAnalysis: string; // AI Summary of the journey
  sanctuaryUnlocked: boolean;
  mirrorUnlocked: boolean;
  clarityPoints: number; // Currency from mini-game
}

export interface StoryNode {
  id: string;
  text: string;
  image?: string; // URL for the scene image
  options: StoryOption[];
  isEnding?: boolean;
}

export interface StoryOption {
  text: string;
  nextNodeId: string;
  effects: {
    stress?: number;
    clarity?: number;
    mood?: number;
  };
  logText: string; // Short text to save to history
}

export interface SanctuaryContent {
  tips: string[];
  exercises: string[];
  readings: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}