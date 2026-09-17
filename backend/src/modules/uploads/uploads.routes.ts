import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../../middleware/auth';
import { config } from '../../config';
import prisma from '../../lib/prisma';
import { AuthRequest } from '../../types';

const router = Router();

// Ensure uploads folder exists
if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

router.post(
  '/',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
        return;
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const entityType = (req.body.entityType as string) || 'DOCUMENT';

      const metadata = await prisma.fileMetadata.create({
        data: {
          originalName: req.file.originalname,
          storageKey: req.file.filename,
          mimeType: req.file.mimetype,
          size: req.file.size,
          uploadedBy: req.user!.userId,
          entityType,
          entityId: req.body.entityId,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          fileUrl,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          metadata,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
