import { User, JourneyRecord } from "../types";

const API_URL = "http://localhost:8080";

export const db = {
  // --- User Operations ---

  createUser: async (name: string, email: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  },

  getUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/first`);
      if (!response.ok) return null;
      // If body is null/empty text, return null
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      console.error("Error fetching user:", e);
      return null;
    }
  },

  updateUserAnalysis: async (userId: string, analysis: string) => {
    await fetch(`${API_URL}/users/${userId}/analysis`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis }),
    });
  },

  // --- Journey Operations ---

  createJourney: async (storyHistory: string[]) => {
    await fetch(`${API_URL}/journeys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story: storyHistory }),
    });
  },
};
