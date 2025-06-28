// constants/videoCardConstants.ts

import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const VIDEO_CONSTANTS = {
  // Video player settings
  DEFAULT_VOLUME: 0.5,
  LOOP_ENABLED: true,
  MUTED_DEFAULT: false,
  
  // Animation
  FADE_DURATION: 300,
  
  // Dimensions
  SCREEN_WIDTH: screenWidth,
  SCREEN_HEIGHT: screenHeight,
  GRADIENT_HEIGHT: screenHeight * 0.4,
  
  // Z-index layers
  Z_INDEX: {
    VIDEO: 1,
    GRADIENT: 2,
    UI_ELEMENTS: 3,
  },
  
  // Colors
  COLORS: {
    BACKGROUND: '#000',
    WHITE: '#fff',
    ERROR_ICON: '#fff',
    LOADING_SPINNER: '#fff',
    OVERLAY_BACKGROUND: 'rgba(0,0,0,0.5)',
    TEXT_SHADOW: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Sizes
  SIZES: {
    VOLUME_BUTTON: 40,
    ACTION_BUTTON: 60,
    ACTION_BUTTON_RADIUS: 30,
    PROFILE_INFO_PADDING: 15,
    PROFILE_INFO_RADIUS: 10,
    PROFILE_INFO_BOTTOM: 120,
  },
  
  // Text sizes
  TEXT_SIZES: {
    NAME: 28,
    DETAILS: 18,
    LOCATION: 16,
    LOADING: 14,
    ERROR: 16,
    ERROR_DETAIL: 12,
  },
  
  // Icons
  ICONS: {
    VOLUME_ON: 'volume-high',
    VOLUME_OFF: 'volume-mute',
    LOCATION: 'location',
    ERROR: 'alert-circle',
  },
  
  // Action button configurations
  ACTION_BUTTONS: [
    { action: 'dislike', icon: 'close', size: 35, color: '#FF4458' },
    { action: 'superlike', icon: 'star', size: 30, color: '#44D884' },
    { action: 'like', icon: 'heart', size: 35, color: '#1EC71E' },
    { action: 'boost', icon: 'flash', size: 30, color: '#9C39FF' },
  ],
} as const;

// Type exports för TypeScript
export type VideoConstants = typeof VIDEO_CONSTANTS;
export type ActionButtonConfig = typeof VIDEO_CONSTANTS.ACTION_BUTTONS[number];