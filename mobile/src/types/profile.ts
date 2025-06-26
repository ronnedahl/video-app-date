export interface UserProfile {
  email: string;
  name?: string;
  gender?: string;
  age?: string;
  location?: string;
  occupation?: string;
  interests?: string;
  about?: string;
  videoURL?: string;
  videoId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileFormData {
  gender: string;
  age: string;
  location: string;
  occupation: string;
  interests: string;
  about: string;
}