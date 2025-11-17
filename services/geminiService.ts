

import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';

if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getLeadScore = async (lead: Lead): Promise<{ score: number; reasoning: string }> => {
  const prompt = `
    Analyze the following educational institute lead and provide a lead score from 1 to 100.
    - A higher score means the lead is more likely to convert into an admission.
    - Consider factors like the lead source, the recency of contact, the nature of follow-ups, and the course they are interested in.
    - Provide a brief reasoning for your score.

    Lead Details:
    - Name: ${lead.name}
    - Status: ${lead.status}
    - Source: ${lead.source}
    - Last Contacted: ${lead.lastContacted}
    - Enquiry For: ${lead.enquiryFor}
    // FIX: Property 'followUps' does not exist on type 'Lead'. Changed to 'activities' to match the type definition.
    - Follow-up Notes: ${lead.activities.map(f => f.notes).join(', ')}

    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The lead score from 1 to 100."
            },
            reasoning: {
              type: Type.STRING,
              description: "A brief explanation for the calculated score."
            }
          },
          required: ["score", "reasoning"]
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (typeof result.score === 'number' && typeof result.reasoning === 'string') {
      return result;
    } else {
      throw new Error("Invalid JSON structure from Gemini API");
    }

  } catch (error) {
    console.error("Error fetching lead score from Gemini:", error);
    // Fallback in case of API error
    return {
      score: 0,
      reasoning: "Could not generate AI score due to an error. Please check the console for details."
    };
  }
};