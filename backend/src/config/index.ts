import path from 'path';

export const config = {
  port: process.env.PORT || 3000,
  uploadDir: path.join(__dirname, '../../uploads'),
  compressedDir: path.join(__dirname, '../../compressed'),
  tempDir: path.join(__dirname, '../../temp'),
  
  cors: {
    origin: [
      'http://localhost:8081',
      'http://localhost:19000',
      'http://192.168.1.*:*',
      'exp://192.168.1.*:*',
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
      /^exp:\/\/192\.168\.\d+\.\d+:\d+$/
    ],
    credentials: true
  },
  
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedExtensions: ['.mp4', '.mov', '.avi']
  },
  
  compression: {
    videoCodec: 'libx264',
    audioCodec: 'aac',
    size: '854x480',
    videoBitrate: '800k',
    audioBitrate: '96k',
    preset: 'medium',
    crf: 28
  }
};