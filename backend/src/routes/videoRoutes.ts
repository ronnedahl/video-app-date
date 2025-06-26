import express, { Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload';
import { videoService } from '../services/videoService';
import { compressionService } from '../services/compressionService';
import { config } from '../config/index';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const router = express.Router();

// Upload route
router.post('/upload', upload.single('video'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Ingen video uppladdad' });
    }
    
    const videoId = uuidv4();
    const outputPath = path.join(config.compressedDir, `${videoId}_compressed.mp4`);
    
    console.log(`📹 Ny video: ${req.file.filename} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const job = videoService.createJob(videoId, req.file.filename, req.file.size);
    
    compressionService.compress(
      req.file.path,
      outputPath,
      videoId,
      config.compression
    )
      .then(() => {
        console.log(`✅ Komprimering klar för ${videoId}`);
      })
      .catch((error) => {
        console.error(`❌ Komprimering misslyckades för ${videoId}:`, error);
      });
      
    res.status(202).json({
      message: 'Video uppladdad och komprimering startad',
      videoId,
      status: 'processing',
      originalSize: (req.file.size / (1024 * 1024)).toFixed(2) + 'MB'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Status route
router.get('/:id/status', (req: any, res: any) => {
  const job = videoService.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Video hittades inte' });
  }
  res.json({
    status: job.status,
    progress: job.progress || 0,
    error: job.error
  });
});

// Download route - HÄR ÄR VIKTIGA ÄNDRINGEN
router.get('/:id/download', (req: any, res: any) => {
  const job = videoService.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Video hittades inte' });
  }
  if (job.status !== 'completed') {
    return res.status(400).json({ error: 'Video är inte klar än' });
  }
  
  const filePath = path.join(config.compressedDir, job.compressedFile!);
  
  // Använd try-catch för download
  try {
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ladda ner fil' });
  }
});

// Delete route
router.delete('/:id', async (req: any, res: any) => {
  const job = videoService.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Video hittades inte' });
  }
  
  try {
    if (job.originalFile) {
      await fs.unlink(path.join(config.uploadDir, job.originalFile));
    }
    if (job.compressedFile) {
      await fs.unlink(path.join(config.compressedDir, job.compressedFile));
    }
  } catch (error) {
    console.error('Error deleting files:', error);
  }
  
  videoService.deleteJob(req.params.id);
  res.json({ message: 'Video borttagen' });
});

export default router;