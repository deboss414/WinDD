import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    // Update user's avatar URL in database
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router; 