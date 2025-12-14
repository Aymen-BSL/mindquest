import { StoryNode } from './types';

// Static Story Data - Expanded
export const STORY_DATA: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
    text: "You stand at the edge of the Whispering Woods. A heavy mist obscures the path ahead. You feel a weight in your chest, a burden of unvoiced worries. Two paths reveal themselves.",
    options: [
      {
        text: "Charge through the thicket, eager to find the end.",
        nextNodeId: 'rushed_path',
        effects: { stress: 10, clarity: -5, mood: 0 },
        logText: "Chose to rush through the obstacle."
      },
      {
        text: "Sit for a moment and observe the mist patterns.",
        nextNodeId: 'calm_path',
        effects: { stress: -10, clarity: 10, mood: 5 },
        logText: "Chose to pause and observe."
      }
    ]
  },
  // --- Path A: Rushed ---
  'rushed_path': {
    id: 'rushed_path',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2560&auto=format&fit=crop',
    text: "Thorns snag your clothes. The mist seems to thicken, reacting to your haste. You hear a low growl—is it a beast, or your own heartbeat echoing?",
    options: [
      {
        text: "Draw your sword and shout into the fog.",
        nextNodeId: 'confrontation',
        effects: { stress: 15, clarity: 0, mood: -10 },
        logText: "Reacted with aggression/defensiveness."
      },
      {
        text: "Take a deep breath and slow your pace.",
        nextNodeId: 'realization',
        effects: { stress: -5, clarity: 5, mood: 0 },
        logText: "Attempted to regulate pace after rushing."
      }
    ]
  },
  'confrontation': {
    id: 'confrontation',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2560&auto=format&fit=crop',
    text: "Your shout fades into silence. The 'beast' was a twisted tree shadow. You are exhausted, but the fog has lifted slightly, revealing a steep cliff.",
    options: [
      {
        text: "Climb the cliff immediately.",
        nextNodeId: 'climb_struggle',
        effects: { stress: 10, clarity: 5, mood: 0 },
        logText: "Chose the hard path despite exhaustion."
      },
      {
        text: "Rest at the base and plan a route.",
        nextNodeId: 'climb_safe',
        effects: { stress: -10, clarity: 10, mood: 5 },
        logText: "Chose to rest before a challenge."
      }
    ]
  },
  'realization': {
    id: 'realization',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop',
    text: "Slowing down helps. The growling stops. You find an old stone marker pointing towards the Crystal Caves.",
    options: [
      {
        text: "Enter the dark caves.",
        nextNodeId: 'caves_entry',
        effects: { stress: 5, clarity: 10, mood: 0 },
        logText: "Braved the unknown calmly."
      },
      {
        text: "Walk around the hill instead.",
        nextNodeId: 'meadow_entry',
        effects: { stress: -5, clarity: 0, mood: 5 },
        logText: "Avoided the dark, sought open space."
      }
    ]
  },
  // --- Path B: Calm ---
  'calm_path': {
    id: 'calm_path',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop',
    text: "As you breathe, the mist recedes slightly. A glowing blue butterfly—a Luma wisp—appears. It flutters towards a shimmering stream.",
    options: [
      {
        text: "Follow the wisp towards the water.",
        nextNodeId: 'stream',
        effects: { stress: -5, clarity: 10, mood: 10 },
        logText: "Followed positive guidance."
      },
      {
        text: "Ignore it; I need to stick to the main road.",
        nextNodeId: 'road',
        effects: { stress: 5, clarity: -5, mood: -5 },
        logText: "Ignored intuition for rigid structure."
      }
    ]
  },
  'stream': {
    id: 'stream',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2560&auto=format&fit=crop',
    text: "The water is crystal clear. Looking into it, you see not your reflection, but a visualization of your current thoughts—swirling leaves.",
    options: [
      {
        text: "Try to catch the leaves.",
        nextNodeId: 'control_attempt',
        effects: { stress: 5, clarity: -5, mood: -5 },
        logText: "Tried to control flowing thoughts."
      },
      {
        text: "Watch the leaves float by.",
        nextNodeId: 'acceptance',
        effects: { stress: -10, clarity: 15, mood: 10 },
        logText: "Practiced mindfulness/acceptance."
      }
    ]
  },
  'road': {
    id: 'road',
    image: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?q=80&w=2560&auto=format&fit=crop',
    text: "The road is paved but monotonous. You feel safe but stagnant. The sky begins to turn grey, and rain begins to fall.",
    options: [
      {
        text: "Keep walking. Safety is priority.",
        nextNodeId: 'stagnation',
        effects: { stress: 0, clarity: -5, mood: -5 },
        logText: "Prioritized comfort over growth."
      },
      {
        text: "Step off the road into the wildflowers.",
        nextNodeId: 'meadow_entry',
        effects: { stress: 5, clarity: 5, mood: 10 },
        logText: "Stepped out of comfort zone."
      }
    ]
  },
  // --- Extended Paths ---
  'caves_entry': {
    id: 'caves_entry',
    image: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=2560&auto=format&fit=crop',
    text: "Inside the cave, glowing crystals line the walls. They pulse with a rhythm that matches your breath. A chasm blocks your way.",
    options: [
      {
        text: "Jump across the gap.",
        nextNodeId: 'end_deep',
        effects: { stress: 10, clarity: 5, mood: 5 },
        logText: "Took a leap of faith."
      },
      {
        text: "Build a bridge with fallen rocks.",
        nextNodeId: 'end_balanced',
        effects: { stress: -5, clarity: 15, mood: 5 },
        logText: "Problem solved methodically."
      }
    ]
  },
  'meadow_entry': {
    id: 'meadow_entry',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=2560&auto=format&fit=crop',
    text: "The meadow is vast. Ancient ruins stand in the center. You feel drawn to them, but a storm is gathering on the horizon.",
    options: [
      {
        text: "Run for the ruins for shelter.",
        nextNodeId: 'end_peace',
        effects: { stress: 5, clarity: 0, mood: 5 },
        logText: "Sought sanctuary."
      },
      {
        text: "Stand in the rain and feel it.",
        nextNodeId: 'end_zen',
        effects: { stress: -5, clarity: 10, mood: 15 },
        logText: "Embraced the elements."
      }
    ]
  },
  
  // --- Endings ---
  'climb_struggle': { 
    id: 'end_struggle', 
    image: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=2560&auto=format&fit=crop',
    text: "You reach the top, bruised but stronger. You conquered the mountain, but at a cost to your peace.", 
    options: [], 
    isEnding: true 
  },
  'climb_safe': { 
    id: 'end_balanced', 
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop',
    text: "You reach the top feeling refreshed. The view is clear. You learned that patience is a form of strength.", 
    options: [], 
    isEnding: true 
  },
  'end_deep': { 
    id: 'end_deep', 
    image: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=2560&auto=format&fit=crop',
    text: "The chasm was an illusion of light. You found a glowing gem of insight in the darkness. You are not afraid of the deep anymore.", 
    options: [], 
    isEnding: true 
  },
  'end_peace': { 
    id: 'end_peace', 
    image: 'https://images.unsplash.com/photo-1501854140884-074bf6bcbde0?q=80&w=2560&auto=format&fit=crop',
    text: "The ruins provide shelter. You watch the storm pass, safe and warm. Sometimes, the journey is just about surviving the storm.", 
    options: [], 
    isEnding: true 
  },
  'control_attempt': { 
    id: 'end_anxious', 
    image: 'https://images.unsplash.com/photo-1482262319230-1925b4ec2b8b?q=80&w=2676&auto=format&fit=crop',
    text: "You are wet and cold from splashing in the stream. You realize you cannot control everything. The lesson is learned through failure.", 
    options: [], 
    isEnding: true 
  },
  'end_zen': { 
    id: 'end_zen', 
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2560&auto=format&fit=crop',
    text: "The rain washes away the dust of the road. You feel lighter, connected to the earth. Clarity is yours.", 
    options: [], 
    isEnding: true 
  },
  'acceptance': { 
    id: 'acceptance', 
    image: 'https://images.unsplash.com/photo-1476673160081-cf065607f39d?q=80&w=2560&auto=format&fit=crop',
    text: "The stream flows on. You feel lighter, as if the water carried away your burdens. Clarity is yours.", 
    options: [], 
    isEnding: true 
  },
  'stagnation': { 
    id: 'end_safe', 
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2682&auto=format&fit=crop',
    text: "You arrive at a shelter. You are safe, but you wonder what magic you missed in the woods.", 
    options: [], 
    isEnding: true 
  },
};
