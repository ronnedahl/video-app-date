export interface VideoJob {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  originalFile: string;
  originalSize: number;
  compressedFile?: string;
  compressedSize?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface CompressionOptions {
  videoCodec: string;
  audioCodec: string;
  size: string;
  videoBitrate: string;
  audioBitrate: string;
  preset: string;
  crf: number;
}