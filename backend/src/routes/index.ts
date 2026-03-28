import { Router } from 'express';
import authRoutes from './auth.routes';
import designRoutes from './design.routes';
import aiRoutes from './ai.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/design', designRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI Interior Design API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
