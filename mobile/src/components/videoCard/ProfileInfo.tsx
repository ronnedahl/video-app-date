import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DatingProfile } from '../../types/dating';
import { formatProfileInfo, formatProfileDetails } from '../../utils/videoCardUtils';
import { VIDEO_CONSTANTS } from '../../constants/videoCardConstants';

const { COLORS, Z_INDEX, SIZES, TEXT_SIZES, ICONS } = VIDEO_CONSTANTS;

interface ProfileInfoProps {
  profile: DatingProfile;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const nameInfo = formatProfileInfo(profile);
  const detailsInfo = formatProfileDetails(profile);

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{nameInfo}</Text>
      {detailsInfo && <Text style={styles.detailsText}>{detailsInfo}</Text>}
      {profile.location && (
        <View style={styles.locationContainer}>
          <Ionicons name={ICONS.LOCATION as any} size={16} color={COLORS.WHITE} />
          <Text style={styles.locationText}>{profile.location}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SIZES.PROFILE_INFO_BOTTOM,
    left: 20,
    right: 20,
    backgroundColor: COLORS.OVERLAY_BACKGROUND,
    padding: SIZES.PROFILE_INFO_PADDING,
    borderRadius: SIZES.PROFILE_INFO_RADIUS,
    zIndex: Z_INDEX.UI_ELEMENTS,
  },
  nameText: {
    fontSize: TEXT_SIZES.NAME,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 8,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailsText: {
    fontSize: TEXT_SIZES.DETAILS,
    color: COLORS.WHITE,
    marginBottom: 8,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: TEXT_SIZES.LOCATION,
    color: COLORS.WHITE,
    marginLeft: 5,
    textShadowColor: COLORS.TEXT_SHADOW,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});