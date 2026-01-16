
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Message, Location, GroundingLink, LandmarkInfo } from "../types";

export const sendMessageToAi = async (
  text: string, 
  history: Message[], 
  location: Location | null
): Promise<Message> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user' as const,
    parts: [{ text: msg.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text }]
  });

  const config: any = {
    systemInstruction: "You are 'App Ka Mitra' (Your Friend), a world-class multilingual smart tourism guide for India. Provide helpful travel advice. Use Google Maps grounding. Respond in the same language the user uses (Hindi, Tamil, Bengali, English, etc.). Keep responses concise for a mobile chat interface.",
    tools: [{ googleMaps: {} }, { googleSearch: {} }],
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents as any,
      config
    });

    const resultText = response.text || "I'm sorry, I couldn't process that.";
    const groundingLinks: GroundingLink[] = [];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          groundingLinks.push({
            title: chunk.maps.title || "Map Location",
            uri: chunk.maps.uri,
            source: 'Google Maps'
          });
        } else if (chunk.web) {
          groundingLinks.push({
            title: chunk.web.title || "Search Result",
            uri: chunk.web.uri,
            source: 'Web Search'
          });
        }
      });
    }

    return {
      role: 'model',
      text: resultText,
      groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'model',
      text: "I encountered an error. Please check your connection.",
      timestamp: Date.now()
    };
  }
};

/**
 * Generates audio for a given text using the Gemini TTS model.
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak this clearly and warmly in its original language: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return null;
  }
};

/**
 * Analyzes an image (base64) to identify an Indian landmark and returns structured info using Gemini 3.
 */
export const analyzeImageForLandmark = async (
  base64Data: string, 
  location: Location | null
): Promise<LandmarkInfo | null> => {
  // Create a new instance right before making the call to ensure fresh configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Identify this Indian landmark or tourist site from the image. Provide cultural and historical context. 
  Current location: ${location ? `${location.latitude}, ${location.longitude}` : 'Unknown'}.
  Respond with a structured JSON object containing historical facts and visitor info.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The name of the landmark.',
            },
            rating: {
              type: Type.NUMBER,
              description: 'Tourist rating from 1 to 5.',
            },
            history: {
              type: Type.STRING,
              description: 'A brief history of the site.',
            },
            openingHours: {
              type: Type.STRING,
              description: 'Standard visiting hours.',
            },
            funFact: {
              type: Type.STRING,
              description: 'A surprising or interesting fact.',
            },
            reviewSnippet: {
              type: Type.STRING,
              description: 'A short fictional visitor experience snippet.',
            },
          },
          required: ["name", "rating", "history", "openingHours", "funFact", "reviewSnippet"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as LandmarkInfo;
    }
    return null;
  } catch (error) {
    console.error("Landmark Analysis Error:", error);
    return null;
  }
};
