import { VideoJob } from '../types';
import path from 'path';

class VideoService {
  private videoJobs = new Map<string, VideoJob>();

  createJob(id: string, originalFile: string, originalSize: number): VideoJob {
    const job: VideoJob = {
      id,
      status: 'processing',
      progress: 0,
      originalFile,
      originalSize,
      createdAt: new Date().toISOString()
    };
    
    this.videoJobs.set(id, job);
    return job;
  }

  getJob(id: string): VideoJob | undefined {
    return this.videoJobs.get(id);
  }

  updateProgress(id: string, progress: number): void {
    const job = this.videoJobs.get(id);
    if (job) {
      job.progress = progress;
      this.videoJobs.set(id, job);
    }
  }

  completeJob(id: string, outputPath: string, size: number): void {
    const job = this.videoJobs.get(id);
    if (job) {
      job.status = 'completed';
      job.progress = 100;
      job.compressedFile = path.basename(outputPath);
      job.compressedSize = size;
      job.completedAt = new Date().toISOString();
      this.videoJobs.set(id, job);
    }
  }

  failJob(id: string, error: string): void {
    const job = this.videoJobs.get(id);
    if (job) {
      job.status = 'failed';
      job.error = error;
      this.videoJobs.set(id, job);
    }
  }

  deleteJob(id: string): void {
    this.videoJobs.delete(id);
  }
}

export const videoService = new VideoService();