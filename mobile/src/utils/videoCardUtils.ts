// utils/videoCardUtils.ts

import { DatingProfile } from '../types/dating';

/**
 * Formaterar profilinformation (namn och ålder)
 */
export const formatProfileInfo = (profile: DatingProfile): string => {
  const parts: string[] = [];
  
  if (profile.name) {
    parts.push(profile.name);
  }
  
  if (profile.age) {
    parts.push(`${profile.age}`);
  }
  
  return parts.join(', ');
};

/**
 * Formaterar profildetaljer (yrke och intressen)
 */
export const formatProfileDetails = (profile: DatingProfile): string => {
  const parts: string[] = [];
  
  if (profile.occupation) {
    parts.push(profile.occupation);
  }
  
  if (profile.interests) {
    parts.push(profile.interests);
  }
  
  return parts.join(' & ');
};

/**
 * Validerar om en video URL är giltig
 */
export const isValidVideoUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:', 'file:'];
    return validProtocols.includes(urlObj.protocol);
  } catch {
    // Om URL är en lokal filsökväg
    return url.startsWith('/') || url.startsWith('file://');
  }
};

/**
 * Hämtar video filformat från URL
 */
export const getVideoFormat = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    const supportedFormats = ['mp4', 'mov', 'm4v', 'mkv'];
    
    return extension && supportedFormats.includes(extension) ? extension : null;
  } catch {
    // För lokala filer
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || null;
  }
};

/**
 * Logger för video debugging
 */
export const logVideoDebug = (
  message: string, 
  data?: any, 
  isError: boolean = false
): void => {
  if (__DEV__) {
    const prefix = '[VideoCard]';
    if (isError) {
      console.error(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`, data);
    }
  }
};

/**
 * Formaterar error meddelanden
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    return `Error code: ${error.code}`;
  }
  
  return 'Ett okänt fel uppstod';
};

/**
 * Delay utility för retry logic
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Saniterar profildata för säker rendering
 */
export const sanitizeProfile = (profile: DatingProfile): DatingProfile => {
  return {
    ...profile,
    name: profile.name?.trim() || '',
    occupation: profile.occupation?.trim() || '',
    interests: profile.interests?.trim() || '',
    location: profile.location?.trim() || '',
    // Säkerställ att age är ett nummer
    age: typeof profile.age === 'number' ? profile.age : 
         typeof profile.age === 'string' ? parseInt(profile.age) || undefined : 
         undefined,
  };
};