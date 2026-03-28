import { Router } from 'express';
import {
  uploadImage,
  generatePreviewImages,
  generateFinalImage,
  getHistory,
  getProject,
  deleteImage,
  getStyles,
  shareImage,
  getSharedProject,
  getCommunityFeed,
  getUserCredits,
  toggleLike,
  analyzeRoomImage,
  suggestRoomPrompt,
} from '../controllers/design.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { generateLimiter } from '../middleware/rateLimiter';

const router = Router();

// ─── Public (auth керак эмас) ────────────────────────────
router.get('/styles', getStyles);
router.get('/shared/:token', getSharedProject);
router.get('/community', getCommunityFeed);

// ─── Guest-friendly (optional auth) ─────────────────────
// Guests can upload and generate — no 401 thrown
router.get('/history', optionalAuth, getHistory);
router.post('/upload', optionalAuth, upload.single('image'), uploadImage);
router.post('/generate-preview', optionalAuth, generateLimiter, generatePreviewImages);
router.post('/generate-final', optionalAuth, generateLimiter, generateFinalImage);
router.post('/analyze-room', optionalAuth, analyzeRoomImage);
router.post('/suggest-prompt', optionalAuth, suggestRoomPrompt);

// ─── Auth required for user-specific actions ─────────────
router.get('/project/:id', authenticate, getProject);
router.delete('/image/:id', authenticate, deleteImage);
router.get('/credits', authenticate, getUserCredits);
router.post('/share', authenticate, shareImage);
router.post('/project/:id/like', authenticate, toggleLike);

export default router;
