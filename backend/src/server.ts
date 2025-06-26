import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { config } from './config';
import videoRoutes from './routes/videoRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/videos', videoRoutes);

// Error handler
app.use(errorHandler);

// Create directories
const createDirectories = async () => {
  const dirs = [config.uploadDir, config.compressedDir, config.tempDir];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating ${dir}:`, error);
    }
  }
};

// Start server
const startServer = async () => {
  await createDirectories();
  
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📁 Upload dir: ${config.uploadDir}`);
    console.log(`📁 Compressed dir: ${config.compressedDir}`);
    console.log(`✅ Ready to receive videos!`);
  });
};

startServer();