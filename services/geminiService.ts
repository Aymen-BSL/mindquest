import { GoogleGenAI, Type } from "@google/genai";
import { SanctuaryContent } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure API_KEY is available in your environment

const ai = new GoogleGenAI({ apiKey });

export const generateSanctuaryContent = async (
  journeySummary: string,
  emotionalState: string
): Promise<SanctuaryContent> => {
  try {
    const model = ai.models;
    
    const prompt = `
      You are a wise sage in the magical world of Aetheria. 
      The traveler has just finished a journey with these key decisions: ${journeySummary}.
      Their current emotional state is: ${emotionalState}.
      
      Generate 3 distinct lists of resources for them to appear on magical scrolls.
      1. Tips: Quick mental health advice metaphorically related to magic.
      2. Exercises: Breathing or grounding exercises described as magical rituals.
      3. Readings: Short philosophical or comforting quotes/thoughts.
      
      Return JSON only.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
            readings: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['tips', 'exercises', 'readings'],
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned");
    return JSON.parse(jsonText) as SanctuaryContent;

  } catch (error) {
    console.error("Gemini Sanctuary Error:", error);
    // Fallback content if API fails or key is missing
    return {
      tips: ["Breathe like the wind.", "Stand firm like the mountain.", "Flow like the river."],
      exercises: ["Box breathing: 4s in, 4s hold, 4s out.", "Identify 5 blue objects around you."],
      readings: ["Even the darkest night will end and the sun will rise."]
    };
  }
};

export const reframeThought = async (
  negativeThought: string,
  emotionalContext: string
): Promise<{ reframe: string; effect: string }> => {
  try {
    const prompt = `
      User thought: "${negativeThought}".
      Context: ${emotionalContext}.
      
      Act as "The Mirror of Clarity". Provide a constructive, compassionate reframe of this thought.
      Also describe a brief visual magical effect that happens in the world of Aetheria because of this clarity.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reframe: { type: Type.STRING },
            effect: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text;
    if(!jsonText) throw new Error("No reframe generated");
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Reframe Error:", error);
    return {
      reframe: "This is a heavy thought, but clouds always pass to reveal the sky.",
      effect: "A soft light breaks through the fog."
    };
  }
};
