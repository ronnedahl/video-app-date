import { API_BASE_URL } from '../config/constants';

export class ApiService {
  static async uploadVideo(videoUri: string): Promise<{ videoId: string; message: string }> {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    } as any);

    const response = await fetch(`${API_BASE_URL}/videos/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  static async checkStatus(videoId: string): Promise<{ status: string; progress: number }> {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/status`);
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    return response.json();
  }
}