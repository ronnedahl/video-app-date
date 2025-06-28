// utils/deviceInfoUtils.ts

import { Platform } from 'react-native';
import * as Device from 'expo-device';

interface DeviceInfo {
  platform: string;
  model: string;
  osVersion: string;
  brand?: string;
  deviceType?: string;
}

/**
 * Säker metod för att hämta device information
 * Använder expo-device om tillgängligt, annars Platform constants
 */
export const getDeviceInfo = (): DeviceInfo => {
  // Om expo-device är installerat (rekommenderat)
  if (Device) {
    return {
      platform: Platform.OS,
      model: Device.modelName || 'Unknown Model',
      osVersion: Device.osVersion || Platform.Version.toString(),
      brand: Device.brand || undefined,
      deviceType: Device.deviceType ? getDeviceTypeString(Device.deviceType) : undefined,
    };
  }

  // Fallback: Använd Platform constants
  return {
    platform: Platform.OS,
    model: getPlatformModel(),
    osVersion: Platform.Version.toString(),
  };
};

/**
 * Hämta device model från Platform constants
 */
const getPlatformModel = (): string => {
  try {
    if (Platform.OS === 'ios') {
      // iOS specific
      const iosConstants = Platform.constants as any;
      return iosConstants.Model || 
             iosConstants.systemName || 
             'iPhone';
    } else if (Platform.OS === 'android') {
      // Android specific
      const androidConstants = Platform.constants as any;
      return androidConstants.Model || 
             androidConstants.Brand || 
             androidConstants.Manufacturer || 
             'Android Device';
    }
  } catch (error) {
    console.warn('Could not get device model:', error);
  }
  
  return 'Unknown Device';
};

/**
 * Konvertera device type enum till string
 */
const getDeviceTypeString = (deviceType: number): string => {
  switch (deviceType) {
    case Device.DeviceType.PHONE:
      return 'phone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.TV:
      return 'tv';
    default:
      return 'unknown';
  }
};

/**
 * Kontrollera om device är tablet
 */
export const isTablet = (): boolean => {
  if (Device && Device.deviceType) {
    return Device.deviceType === Device.DeviceType.TABLET;
  }
  
  // Fallback baserat på skärmstorlek eller platform
  if (Platform.OS === 'ios') {
    const model = getPlatformModel().toLowerCase();
    return model.includes('ipad');
  }
  
  return false;
};

/**
 * Få en readable device beskrivning
 */
export const getDeviceDescription = (): string => {
  const info = getDeviceInfo();
  return `${info.model} (${info.platform} ${info.osVersion})`;
};