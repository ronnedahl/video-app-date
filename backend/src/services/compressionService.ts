import ffmpeg from 'fluent-ffmpeg';
import { VideoJob, CompressionOptions } from '../types';
import { videoService } from './videoService';

export class CompressionService {
  compress(
    inputPath: string,
    outputPath: string,
    videoId: string,
    options: CompressionOptions
  ): Promise<{ size: number }> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .videoCodec(options.videoCodec)
        // ÄNDRING: Använd scale filter som bevarar aspect ratio
        .outputOptions([
          '-vf', 'scale=480:-2',  // Sätter bredden till 480px, höjden beräknas automatiskt
          `-preset ${options.preset}`,
          `-crf ${options.crf}`,
          '-movflags +faststart',
          '-pix_fmt yuv420p'
        ])
        .videoBitrate(options.videoBitrate)
        .audioCodec(options.audioCodec)
        .audioBitrate(options.audioBitrate)
        .output(outputPath);

      command
        .on('start', (cmd) => {
          console.log('FFmpeg started:', cmd);
        })
        .on('progress', (progress) => {
          videoService.updateProgress(videoId, Math.round(progress.percent || 0));
          console.log(`Progress ${videoId}: ${Math.round(progress.percent || 0)}%`);
        })
        .on('end', async () => {
          const { size } = require('fs').statSync(outputPath);
          videoService.completeJob(videoId, outputPath, size);
          resolve({ size });
        })
        .on('error', (err) => {
          videoService.failJob(videoId, err.message);
          reject(err);
        })
        .run();
    });
  }
}

export const compressionService = new CompressionService();