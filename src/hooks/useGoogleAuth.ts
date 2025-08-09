import { useEffect, useState } from 'react';

// Get Google Client ID from environment or use demo for testing
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-client-id.apps.googleusercontent.com";

interface GoogleUser {
  credential: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
  };
}

interface ParsedCredential {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

export const useGoogleAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Identity Services is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsLoaded(true);
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: () => {}, // This will be overridden by individual components
        });
      } else {
        // If not loaded, check again in 100ms
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const signInWithGoogle = (callback: (user: GoogleUser) => void) => {
    if (!isLoaded) {
      console.error('Google Identity Services not loaded yet');
      return;
    }

    // For demo purposes, we'll simulate a successful Google sign-in
    // In a real app, you'd use: window.google.accounts.id.prompt() or window.google.accounts.oauth2.initTokenClient()
    
    // Simulate Google OAuth response
    setTimeout(() => {
      const mockGoogleUser: GoogleUser = {
        credential: "mock-jwt-token",
        user: {
          id: '123456789',
          email: 'user@gmail.com',
          name: 'John Doe',
          picture: 'https://via.placeholder.com/150',
          given_name: 'John',
          family_name: 'Doe'
        }
      };
      
      callback(mockGoogleUser);
    }, 1000);
  };

  const parseGoogleCredential = (credential: string): ParsedCredential => {
    // In a real app, you'd decode the JWT token
    // For demo, we'll return mock data
    return {
      id: '123456789',
      email: 'user@gmail.com',
      name: 'John Doe',
      picture: 'https://via.placeholder.com/150',
      given_name: 'John',
      family_name: 'Doe'
    };
  };

  return {
    isLoaded,
    signInWithGoogle,
    parseGoogleCredential
  };
};