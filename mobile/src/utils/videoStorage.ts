// För att spara frågor med videon
export interface StoredVideo {
  uri: string;
  questions: string[];
  recordedAt: string;
  videoId: string;
}

export const saveVideoMetadata = async (
  videoUri: string,
  questions: string[],
  videoId: string
): Promise<void> => {
  // Här kan du använda AsyncStorage eller annan lagring
  const metadata: StoredVideo = {
    uri: videoUri,
    questions,
    recordedAt: new Date().toISOString(),
    videoId,
  };
  
  // Exempel med AsyncStorage (installera @react-native-async-storage/async-storage)
  // await AsyncStorage.setItem(`video_${videoId}`, JSON.stringify(metadata));
  
  console.log('Video metadata saved:', metadata);
};

export const getVideoMetadata = async (videoId: string): Promise<StoredVideo | null> => {
  // Hämta från storage
  // const data = await AsyncStorage.getItem(`video_${videoId}`);
  // return data ? JSON.parse(data) : null;
  
  return null;
};