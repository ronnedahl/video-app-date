import multer from 'multer';
import path from 'path';
import { config } from '../config/index';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueName}${extension}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!config.upload.allowedExtensions.includes(ext)) {
      return cb(new Error(`Filtyp ${ext} är inte tillåten`));
    }
    cb(null, true);
  }
});