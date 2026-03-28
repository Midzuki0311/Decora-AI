import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service';
import {
  generateDesign,
  generateMultipleDesignPreviews,
  isFreeProvider,
  getActiveProvider,
  analyzeRoom,
  suggestPrompt
} from '../services/ai.service';
import { getStyleByName, getAllStyles } from '../prompts/styles';
import { BadRequestError, NotFoundError, ForbiddenError, AppError } from '../utils/errors';
import { deleteFile } from '../services/image.service';
import { config } from '../config';
import logger from '../utils/logger';

const DAILY_FREE_CREDITS = 3;

async function getCurrentCreditState(userId: string): Promise<{
  user: { id: string; credits: number; lastCreditRefillAt: Date };
  freeCredits: number;
  paidCredits: number;
  totalCredits: number;
  nextRefillAt: Date;
}> {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const now = new Date();
  const lastRefill = new Date(user.lastCreditRefillAt);
  const hoursSinceRefill = (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60);

  if (hoursSinceRefill >= 24) {
    const refreshedCredits = Math.max(user.credits, DAILY_FREE_CREDITS);
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: refreshedCredits,
        lastCreditRefillAt: now,
      },
    });
  }

  const totalCredits = user.credits;
  const freeCredits = Math.min(DAILY_FREE_CREDITS, totalCredits);
  const paidCredits = Math.max(0, totalCredits - DAILY_FREE_CREDITS);
  const nextRefillAt = new Date(new Date(user.lastCreditRefillAt).getTime() + 24 * 60 * 60 * 1000);

  return {
    user: { id: user.id, credits: user.credits, lastCreditRefillAt: user.lastCreditRefillAt },
    freeCredits,
    paidCredits,
    totalCredits,
    nextRefillAt,
  };
}

// ─── Validation Schemas ───────────────────
const previewSchema = z.object({
  projectId: z.string().optional(),            // Optional — guests don't have a DB project
  originalImageUrl: z.string().url().optional(), // Guest mode: direct Cloudinary URL
  styles: z.array(z.string()).optional(),
  roomType: z.string().max(100).optional(),
  customPrompt: z.string().max(500).optional(),
  modelName: z.string().optional(),
});


const finalSchema = z.object({
  projectId: z.string().optional(),              // Optional — guests don't have a DB project
  originalImageUrl: z.string().url().optional(), // Guest mode: direct Cloudinary URL
  styleName: z.string().min(1, 'Style name is required'),
  roomType: z.string().max(100).optional(),
  additionalInstructions: z.string().max(500).optional(),
  customPrompt: z.string().max(500).optional(),
  modelName: z.string().optional(),
});

// ─── Upload ───────────────────────────────
export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    const isGuest = !req.userId;
    logger.info(`[Upload] Started for ${isGuest ? 'GUEST' : `user ${req.userId}`}`);

    const cloudResult = await uploadToCloudinary(req.file.path, 'ai-interior/originals');
    deleteFile(req.file.path);

    // ── Guest mode: skip DB, return Cloudinary URL directly ───────────────
    if (isGuest) {
      logger.info(`[Upload] Guest upload — Cloudinary OK, no DB project created`);
      res.status(201).json({
        success: true,
        data: {
          projectId: null,           // No DB project for guests
          originalImageUrl: cloudResult.url,
          cloudinaryPublicId: cloudResult.publicId,
          status: 'UPLOADED',
          guestMode: true,
        },
      });
      return;
    }

    // ── Authenticated: create DB project ──────────────────────────────────
    const project = await prisma.project.create({
      data: {
        userId: req.userId!,
        originalImageUrl: cloudResult.url,
        originalPublicId: cloudResult.publicId,
        status: 'UPLOADED',
      },
    });

    logger.info(`[Upload] Project created: ${project.id} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      data: {
        projectId: project.id,
        originalImageUrl: project.originalImageUrl,
        status: project.status,
        guestMode: false,
      },
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    next(error);
  }
};


// ─── Generate Previews ────────────────────
export const generatePreviewImages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = previewSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }
    const { projectId, styles: requestedStyles, roomType, customPrompt, modelName } = parsed.data;

    const isGuest = !req.userId;
    const isFree = isFreeProvider(modelName);

    // ── Resolve source image URL ──────────────────────────────────────────────
    // Guests pass originalImageUrl directly (no DB project)
    let originalImageUrl: string;
    if (isGuest) {
      // For guests, projectId field is repurposed to carry the Cloudinary image URL
      originalImageUrl = req.body.originalImageUrl as string;
      if (!originalImageUrl) throw new BadRequestError('originalImageUrl is required for guest mode');
      logger.info(`[Preview] GUEST mode — using direct image URL`);
    } else {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) throw new NotFoundError('Project not found');
      if (project.userId !== req.userId) throw new ForbiddenError('Access denied to this project');
      originalImageUrl = project.originalImageUrl;

      const creditState = await getCurrentCreditState(req.userId!);
      if (creditState.totalCredits < 1) {
        logger.warn(`[ADMIN_ALERT] Credits exhausted for user ${req.userId} on preview generation`);
        throw new AppError('Credits exhausted. Please top up your paid credits or wait for free refill.', 402);
      }

      await prisma.project.update({ where: { id: projectId }, data: { status: 'PREVIEWING', roomType } });
    }

    const styleNames: string[] = requestedStyles || ['minimalism', 'modern', 'scandinavian'];
    const stylesToGenerate = styleNames
      .map((name: string) => getStyleByName(name))
      .filter(Boolean) as NonNullable<ReturnType<typeof getStyleByName>>[];

    if (stylesToGenerate.length === 0) throw new BadRequestError('No valid styles provided');

    logger.info(`[Preview] Starting AI preview ${isGuest ? '(GUEST)' : `for project ${projectId}`}, styles: ${stylesToGenerate.map(s => s.name).join(', ')}`);

    let results;
    try {
      results = await generateMultipleDesignPreviews(originalImageUrl, stylesToGenerate, roomType, customPrompt, modelName);
    } catch (genError: any) {
      logger.error(`[Preview] generateMultipleDesignPreviews failed: ${genError.message}`);
      if (!isGuest && projectId) {
        await prisma.project.update({ where: { id: projectId }, data: { status: 'FAILED' } }).catch(() => { });
      }
      const statusCode = genError.statusCode || 500;
      const errorCode = statusCode === 503 ? 'AI_BILLING' : 'AI_FAILED';
      if (statusCode === 503) {
        logger.warn(`[ADMIN_ALERT] AI billing/API key issue on preview for user ${req.userId || 'guest'}`);
      }
      res.status(statusCode).json({ success: false, error: genError.message, code: errorCode });
      return;
    }

    if (results.length === 0) {
      if (!isGuest && projectId) {
        await prisma.project.update({ where: { id: projectId }, data: { status: 'FAILED' } }).catch(() => { });
      }
      res.status(500).json({ success: false, error: 'Could not generate any designs.' });
      return;
    }

    // ── Guest: return results without saving to DB ────────────────────────────
    if (isGuest) {
      logger.info(`[Preview] GUEST — ${results.length} previews generated (not saved to DB)`);
      res.status(200).json({
        success: true,
        data: {
          projectId: null,
          previews: results.map(r => ({ styleName: r.styleName, imageUrl: r.imageUrl })),
          creditsRemaining: 9999,
          isFree: true,
          guestMode: true,
        },
      });
      return;
    }

    // ── Authenticated: save to DB + deduct credits ────────────────────────────
    const savedImages = await Promise.all(
      results.map((r) =>
        prisma.generatedImage.create({
          data: {
            projectId: projectId!,   // safe: auth path only (isGuest=false)
            styleName: r.styleName,
            imageUrl: r.imageUrl,
            publicId: r.publicId,
            imageType: 'PREVIEW',
            prompt: r.prompt,
            modelUsed: r.modelUsed,
          },
        })
      )
    );


    const updatedUser = await prisma.user.update({
      where: { id: req.userId! },
      data: { credits: { decrement: 1 } },
    });
    const creditsRemaining = updatedUser.credits;
    const freeCreditsRemaining = Math.min(DAILY_FREE_CREDITS, creditsRemaining);
    const paidCreditsRemaining = Math.max(0, creditsRemaining - DAILY_FREE_CREDITS);

    logger.info(`[Preview] Generated ${savedImages.length} previews ${isFree ? '(FREE)' : '(PAID)'}`);
    await prisma.project.update({ where: { id: projectId }, data: { status: 'PREVIEWING' } });

    res.status(200).json({
      success: true,
      data: {
        projectId,
        previews: savedImages.map((img) => ({ id: img.id, styleName: img.styleName, imageUrl: img.imageUrl })),
        creditsRemaining,
        freeCreditsRemaining,
        paidCreditsRemaining,
        possibleGenerations: creditsRemaining,
        isFree,
        guestMode: false,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ─── Generate Final ───────────────────────
export const generateFinalImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = finalSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }
    const { projectId, styleName, roomType, additionalInstructions, customPrompt, modelName } = parsed.data;

    const style = getStyleByName(styleName);
    if (!style) throw new BadRequestError(`Style "${styleName}" not found`);

    const isGuest = !req.userId;
    const isFree = isFreeProvider(modelName);

    // ── Resolve source image ──────────────────────────────────────────────────
    let originalImageUrl: string;
    if (isGuest) {
      originalImageUrl = req.body.originalImageUrl as string;
      if (!originalImageUrl) throw new BadRequestError('originalImageUrl is required for guest mode');
      logger.info(`[Final] GUEST mode — style: ${styleName}`);
    } else {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) throw new NotFoundError('Project not found');
      if (project.userId !== req.userId) throw new ForbiddenError('Access denied to this project');
      originalImageUrl = project.originalImageUrl;

      const creditState = await getCurrentCreditState(req.userId!);
      if (creditState.totalCredits < 1) {
        logger.warn(`[ADMIN_ALERT] Credits exhausted for user ${req.userId} on final generation`);
        throw new AppError('Credits exhausted. Please top up your paid credits or wait for free refill.', 402);
      }

      await prisma.project.update({ where: { id: projectId }, data: { status: 'GENERATING', style: styleName } });
    }

    logger.info(`[Final] Generating — style: ${styleName} ${isGuest ? '(GUEST)' : `project: ${projectId}`} ${isFree ? '(FREE)' : '(PAID)'}`);

    let result;
    try {
      result = await generateDesign('final', originalImageUrl, style, roomType, additionalInstructions, customPrompt, modelName);
    } catch (genError: any) {
      logger.error(`[Final] generateDesign failed: ${genError.message}`);
      if (!isGuest && projectId) {
        await prisma.project.update({ where: { id: projectId }, data: { status: 'FAILED' } }).catch(() => { });
      }
      const statusCode = genError.statusCode || 500;
      const errorCode = statusCode === 503 ? 'AI_BILLING' : 'AI_FAILED';
      if (statusCode === 503) {
        logger.warn(`[ADMIN_ALERT] AI billing/API key issue on final for user ${req.userId || 'guest'}`);
      }
      res.status(statusCode).json({ success: false, error: genError.message, code: errorCode });
      return;
    }

    // ── Guest: return directly without DB ────────────────────────────────────
    if (isGuest) {
      logger.info(`[Final] GUEST complete — result: ${result.imageUrl}`);
      res.status(200).json({
        success: true,
        data: {
          projectId: null,
          styleName,
          finalImageUrl: result.imageUrl,
          originalImageUrl,
          status: 'COMPLETED',
          creditsRemaining: 9999,
          isFree: true,
          guestMode: true,
        },
      });
      return;
    }

    // ── Auth: save to DB + deduct credits ────────────────────────────────────
    const savedImage = await prisma.generatedImage.create({
      data: {
        projectId: projectId!,  // safe: auth path only (isGuest=false)
        styleName: result.styleName,
        imageUrl: result.imageUrl,
        publicId: result.publicId,
        imageType: 'FINAL',
        prompt: result.prompt,
        modelUsed: result.modelUsed,
      },
    });


    const updatedUser = await prisma.user.update({
      where: { id: req.userId! },
      data: { credits: { decrement: 1 } },
    });
    const creditsRemaining = updatedUser.credits;
    const freeCreditsRemaining = Math.min(DAILY_FREE_CREDITS, creditsRemaining);
    const paidCreditsRemaining = Math.max(0, creditsRemaining - DAILY_FREE_CREDITS);

    logger.info(`[Final] Completed — project ${projectId} ${isFree ? '(FREE)' : '(PAID)'}`);
    await prisma.project.update({ where: { id: projectId }, data: { status: 'COMPLETED' } });

    res.status(200).json({
      success: true,
      data: {
        projectId,
        styleName,
        finalImageUrl: savedImage.imageUrl,
        originalImageUrl,
        status: 'COMPLETED',
        creditsRemaining,
        freeCreditsRemaining,
        paidCreditsRemaining,
        possibleGenerations: creditsRemaining,
        isFree,
        guestMode: false,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ─── History ──────────────────────────────
export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    // Fixed N+1: use include to fetch images in one query; filter soft-deleted projects
    const projects = await prisma.project.findMany({
      where: {
        userId: req.userId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        generatedImages: true,
      },
    });

    const data = projects.map((p) => ({
      id: p.id,
      originalImageUrl: p.originalImageUrl,
      finalImageUrl: p.generatedImages.find((img) => img.imageType === 'FINAL')?.imageUrl || null,
      style: p.style,
      status: p.status,
      previewCount: p.generatedImages.filter((img) => img.imageType === 'PREVIEW').length,
      createdAt: p.createdAt,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─── Project Detail ───────────────────────
export const getProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { 
        generatedImages: true,
        _count: { select: { likes: true } },
        likes: { where: { userId: req.userId } }
      },
    });

    if (!project) throw new NotFoundError('Project not found');
    if (project.userId !== req.userId) throw new ForbiddenError('Access denied to this project');

    res.status(200).json({
      success: true,
      data: {
        id: project.id,
        originalImageUrl: project.originalImageUrl,
        finalImageUrl: project.generatedImages.find((img) => img.imageType === 'FINAL')?.imageUrl || null,
        style: project.style,
        status: project.status,
        previewImages: project.generatedImages
          .filter((img) => img.imageType === 'PREVIEW')
          .map((img) => ({
            id: img.id,
            styleName: img.styleName,
            imageUrl: img.imageUrl,
          })),
        likeCount: project._count.likes,
        isLiked: project.likes.length > 0,
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Project (Soft Delete) ─────────
export const deleteImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) throw new NotFoundError('Project not found');
    if (project.userId !== req.userId) throw new ForbiddenError('Access denied');

    // Soft delete — preserve data for audit trail
    await prisma.project.update({
      where: { id: projectId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    logger.info(`[Delete] Project ${projectId} soft-deleted by user ${req.userId}`);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── Styles ───────────────────────────────
export const getStyles = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const styles = getAllStyles().map((s) => ({
      name: s.name,
      displayName: s.displayName,
      description: s.description,
      colorPalette: s.colorPalette,
      materials: s.materials,
    }));

    res.status(200).json({ success: true, data: styles });
  } catch (error) {
    next(error);
  }
};

// ─── Share Project ────────────────────────
export const shareImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectId } = req.body;

    if (!projectId) throw new BadRequestError('Project ID is required');

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundError('Project not found');
    if (project.userId !== req.userId) throw new ForbiddenError('Access denied');

    let shareToken = project.shareToken;
    if (!shareToken) {
      shareToken = uuidv4();
      await prisma.project.update({
        where: { id: projectId },
        data: { shareToken, isPublic: true },
      });
    }

    const finalImage = await prisma.generatedImage.findFirst({
      where: { projectId, imageType: 'FINAL' },
    });

    res.status(200).json({
      success: true,
      data: {
        shareUrl: `/shared/${shareToken}`,
        shareToken,
        projectId,
        imageUrl: finalImage?.imageUrl || project.originalImageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Public Shared Project ────────────────
export const getSharedProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.params.token as string;

    // Fixed N+1: fetch project + user + images in efficient queries
    const project = await prisma.project.findFirst({
      where: { shareToken: token, isPublic: true },
      include: {
        generatedImages: true,
        user: { select: { username: true } },
      },
    });

    if (!project) throw new NotFoundError('Shared project not found');

    res.status(200).json({
      success: true,
      data: {
        id: project.id,
        originalImageUrl: project.originalImageUrl,
        finalImageUrl: project.generatedImages.find((img) => img.imageType === 'FINAL')?.imageUrl || null,
        style: project.style,
        author: project.user?.username || 'Unknown',
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Community Feed ───────────────────────
export const getCommunityFeed = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Fixed N+1: single query with includes instead of N+1 nested queries
    const projects = await prisma.project.findMany({
      where: { isPublic: true, status: 'COMPLETED', isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        generatedImages: {
          where: { imageType: 'FINAL' },
          take: 1,
        },
        user: { select: { username: true } },
      },
    });

    const feed = projects.map((p) => ({
      id: p.id,
      originalImageUrl: p.originalImageUrl,
      finalImageUrl: p.generatedImages[0]?.imageUrl || null,
      style: p.style,
      author: p.user?.username || 'Unknown',
      createdAt: p.createdAt,
    }));

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    next(error);
  }
};

// ─── User Credits ─────────────────────────
export const getUserCredits = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const creditState = await getCurrentCreditState(req.userId!);

    res.status(200).json({ 
      success: true, 
      data: { 
        credits: creditState.totalCredits,
        freeCredits: creditState.freeCredits,
        paidCredits: creditState.paidCredits,
        possibleGenerations: creditState.totalCredits,
        nextRefillAt: creditState.nextRefillAt.toISOString()
      } 
    });
  } catch (error) {
    next(error);
  }
};

// ─── Toggle Like ──────────────────────────
export const toggleLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const userId = req.userId!;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundError('Project not found');

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    let isLiked = false;
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      isLiked = false;
    } else {
      await prisma.like.create({ data: { userId, projectId } });
      isLiked = true;
    }

    const likeCount = await prisma.like.count({ where: { projectId } });

    res.status(200).json({ success: true, data: { isLiked, likeCount } });
  } catch (error) {
    next(error);
  }
};

// ─── AI Room Analysis ──────────────────────
const analyzeSchema = z.object({
  imageUrl: z.string().url(),
});

export const analyzeRoomImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = analyzeSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }

    const { imageUrl } = parsed.data;
    logger.info(`[Analysis] Starting room analysis for image: ${imageUrl}`);

    const analysis = await analyzeRoom(imageUrl);

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// ─── AI Prompt Suggestion ─────────────────
const suggestPromptSchema = z.object({
  roomType: z.string().min(1, 'Room type is required'),
  styleName: z.string().min(1, 'Style name is required'),
});

export const suggestRoomPrompt = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = suggestPromptSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }

    const { roomType, styleName } = parsed.data;
    const style = getStyleByName(styleName);
    if (!style) throw new BadRequestError(`Style "${styleName}" not found`);

    logger.info(`[PromptGen] Generating prompt for ${roomType} in style ${styleName}`);

    const recommendedPrompt = await suggestPrompt(roomType, style);

    res.status(200).json({
      success: true,
      data: {
        prompt: recommendedPrompt,
      },
    });
  } catch (error) {
    next(error);
  }
};
