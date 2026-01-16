
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // Optional base64 image data for display
  groundingLinks?: GroundingLink[];
  timestamp: number;
  audioData?: string; // Base64 encoded PCM audio for the response
}

export interface GroundingLink {
  title: string;
  uri: string;
  source?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LandmarkInfo {
  name: string;
  rating: number;
  history: string;
  openingHours: string;
  funFact: string;
  reviewSnippet: string;
}

export enum AppView {
  CHAT = 'CHAT',
  EXPLORE = 'EXPLORE',
  REVIEWS = 'REVIEWS',
  EMERGENCY = 'EMERGENCY'
}
