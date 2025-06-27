export interface DatingProfile {
  id: string;
  email: string;
  name?: string;
  gender?: string;
  age?: number;
  location?: string;
  occupation?: string;
  interests?: string;
  about?: string;
  videoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SwipeAction = 'like' | 'dislike' | 'superlike' | 'boost';

export interface SwipeRecord {
  userId: string;
  targetUserId: string;
  action: SwipeAction;
  timestamp: string;
}

export interface DatingState {
  profiles: DatingProfile[];
  currentProfileIndex: number;
  isLoading: boolean;
  error: string | null;
  swipeHistory: SwipeRecord[];
}

export interface Match {
  id: string;
  users: string[];
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}