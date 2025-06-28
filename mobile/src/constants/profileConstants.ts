// constants/profileConstants.ts

export const PROFILE_CONSTANTS = {
  // Colors
  COLORS: {
    PRIMARY: '#4CAF50',
    WHITE: '#fff',
    BLACK: '#000',
    BACKGROUND: '#f5f5f5',
    TEXT_PRIMARY: '#333',
    TEXT_SECONDARY: '#666',
    ERROR: '#ff4444',
    BORDER: '#e0e0e0',
    WHITE_TRANSPARENT: 'rgba(255,255,255,0.8)',
    BLACK_OVERLAY: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Sizes
  SIZES: {
    PADDING: 20,
    MARGIN_BOTTOM: 20,
    BORDER_RADIUS: 10,
    VIDEO_HEIGHT: 200,
  },
  
  // Text sizes
  TEXT_SIZES: {
    HEADER: 20,
    LABEL: 16,
    INPUT: 16,
    BUTTON: 18,
    ERROR: 12,
  },
  
  // Form limits
  FORM_LIMITS: {
    AGE_MIN: 18,
    AGE_MAX: 100,
    ABOUT_MAX_LENGTH: 500,
    INTERESTS_MAX_LENGTH: 200,
  },
  
  // Validation messages
  VALIDATION_MESSAGES: {
    REQUIRED: 'Detta fält är obligatoriskt',
    INVALID_AGE: 'Ange en giltig ålder',
    AGE_TOO_YOUNG: 'Du måste vara minst 18 år',
    AGE_TOO_OLD: 'Ange en realistisk ålder',
    TOO_SHORT: 'För kort text',
    TOO_LONG: 'För lång text',
  },
} as const;

export type ProfileConstants = typeof PROFILE_CONSTANTS;