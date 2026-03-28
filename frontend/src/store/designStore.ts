import { create } from 'zustand';
import { DesignStyle, PreviewImage, Project, AIModel } from '../types';
import { api, SERVER_URL } from '../api/client';
import { useAuthStore } from './authStore';

/** Convert relative /uploads/... paths to full http://... URLs */
function fullUrl(urlOrPath: string | undefined | null): string | undefined {
  if (!urlOrPath) return undefined;
  if (urlOrPath.startsWith('http')) return urlOrPath;
  return `${SERVER_URL}${urlOrPath}`;
}

/** Cost constants (fixed to 1 credit per action to match backend) */
export const CREDITS_PER_PREVIEW = 1;
export const CREDITS_PER_FINAL = 1;

interface DesignState {
  // Current project
  currentProjectId: string | null;
  originalImageUri: string | null;
  originalImageUrl: string | null;
  selectedStyle: string | null;
  previews: PreviewImage[];
  finalImageUrl: string | null;
  status: 'idle' | 'uploading' | 'previewing' | 'generating' | 'completed' | 'error';

  // Per-card regeneration
  regeneratingStyle: string | null;

  // Styles & Models
  styles: DesignStyle[];
  stylesLoaded: boolean;
  models: AIModel[];
  selectedModel: string | null;

  // History
  history: Project[];
  historyLoaded: boolean;

  // Credits
  credits: number | null;
  freeCredits: number | null;
  paidCredits: number | null;
  possibleGenerations: number | null;
  nextRefillAt: string | null;

  // Error
  error: string | null;
  /** Whether the last generation used mock AI */
  isMock: boolean;

  // Actions
  setOriginalImage: (uri: string) => void;
  uploadImage: (imageUri: string) => Promise<string | null>;
  generatePreviews: (projectId: string | undefined, styles?: string[], roomType?: string, guestImageUrl?: string) => Promise<void>;
  generateFinal: (projectId: string, styleName: string, roomType?: string, guestImageUrl?: string, customPrompt?: string) => Promise<void>;
  regenerateSinglePreview: (styleName: string, projectId?: string, guestImageUrl?: string) => Promise<void>;
  selectStyle: (styleName: string) => void;
  selectModel: (modelId: string) => void;
  loadStyles: () => Promise<void>;
  loadModels: () => Promise<void>;
  loadHistory: () => Promise<void>;
  loadCredits: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  currentProjectId: null,
  originalImageUri: null,
  originalImageUrl: null,
  selectedStyle: null,
  previews: [],
  finalImageUrl: null,
  status: 'idle',
  regeneratingStyle: null,
  styles: [],
  stylesLoaded: false,
  models: [],
  selectedModel: null,
  history: [],
  historyLoaded: false,
  credits: null,
  freeCredits: null,
  paidCredits: null,
  possibleGenerations: null,
  nextRefillAt: null,
  error: null,
  isMock: false,

  setOriginalImage: (uri: string) => {
    set({ originalImageUri: uri, status: 'idle', error: null });
  },

  uploadImage: async (imageUri: string) => {
    set({ status: 'uploading', error: null });
    try {
      const response = await api.uploadImage(imageUri);
      if (response.success && response.data) {
        const imageUrl = fullUrl(response.data.originalImageUrl) || null;
        set({
          currentProjectId: response.data.projectId || null,
          originalImageUrl: imageUrl,
          status: 'idle',
        });
        return response.data.projectId || null;
      }
      return null;
    } catch (error: any) {
      set({ error: error.message, status: 'error' });
      return null;
    }
  },

  generatePreviews: async (projectId: string | undefined, styles?: string[], roomType?: string, guestImageUrl?: string) => {
    set({ status: 'previewing', error: null, previews: [] });
    try {
      const response = await api.generatePreview(projectId, styles, roomType, guestImageUrl, get().selectedModel || undefined);
      if (response.success && response.data) {
        set({
          previews: response.data.previews.map((p: PreviewImage) => ({
            ...p,
            imageUrl: fullUrl(p.imageUrl) || p.imageUrl,
          })),
          isMock: !!(response.data as any).isMock,
          status: 'idle',
        });
        // Refresh credits after generating
        get().loadCredits();
      }
    } catch (error: any) {
      set({ error: error.message, status: 'error' });
    }
  },

  generateFinal: async (projectId: string, styleName: string, roomType?: string, guestImageUrl?: string, customPrompt?: string) => {
    set({ status: 'generating', error: null, selectedStyle: styleName });
    try {
      const response = await api.generateFinal(projectId, styleName, roomType, guestImageUrl, get().selectedModel || undefined, customPrompt);
      if (response.success && response.data) {
        set({
          finalImageUrl: fullUrl(response.data.finalImageUrl) || null,
          originalImageUrl: fullUrl(response.data.originalImageUrl) || null,
          isMock: !!(response.data as any).isMock,
          status: 'completed',
        });
        // Refresh credits after generating
        get().loadCredits();
      }
    } catch (error: any) {
      set({ error: error.message, status: 'error' });
    }
  },

  regenerateSinglePreview: async (styleName: string, projectId?: string, guestImageUrl?: string) => {
    set({ regeneratingStyle: styleName, error: null });
    try {
      const response = await api.generatePreview(
        projectId,
        [styleName],
        undefined,
        guestImageUrl,
        get().selectedModel || undefined,
      );
      if (response.success && response.data && response.data.previews.length > 0) {
        const newPreview = response.data.previews[0];
        const updatedPreview: PreviewImage = {
          ...newPreview,
          imageUrl: fullUrl(newPreview.imageUrl) || newPreview.imageUrl,
        };
        // Replace the matching preview in the list
        const currentPreviews = get().previews;
        const updatedPreviews = currentPreviews.map((p) =>
          p.styleName === styleName ? updatedPreview : p
        );
        set({ previews: updatedPreviews });
        // Refresh credits
        get().loadCredits();
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ regeneratingStyle: null });
    }
  },

  selectStyle: (styleName: string) => {
    set({ selectedStyle: styleName });
  },

  selectModel: (modelId: string) => {
    set({ selectedModel: modelId });
  },

  loadStyles: async () => {
    try {
      const response = await api.getStyles();
      if (response.success && response.data) {
        set({ styles: response.data, stylesLoaded: true });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadModels: async () => {
    try {
      const response = await api.getModels();
      if (response.success && response.data) {
        set({
          models: response.data,
          // Auto-select first recommended model if none is selected
          selectedModel: get().selectedModel || response.data.find(m => m.recommended)?.id || response.data[0]?.id || null
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadHistory: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ history: [], historyLoaded: true });
      return;
    }
    try {
      const response = await api.getHistory();
      if (response.success && response.data) {
        set({
          history: response.data.map((p: Project) => ({
            ...p,
            originalImageUrl: fullUrl(p.originalImageUrl) || p.originalImageUrl,
            finalImageUrl: fullUrl(p.finalImageUrl) || p.finalImageUrl,
          })),
          historyLoaded: true,
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadCredits: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ credits: null, freeCredits: null, paidCredits: null, possibleGenerations: null, nextRefillAt: null });
      return;
    }
    try {
      const response = await api.getCredits();
      if (response.success && response.data) {
        set({ 
          credits: response.data.credits,
          freeCredits: response.data.freeCredits ?? null,
          paidCredits: response.data.paidCredits ?? null,
          possibleGenerations: response.data.possibleGenerations ?? response.data.credits,
          nextRefillAt: response.data.nextRefillAt || null
        });
      }
    } catch {
      // Silently fail — credits display is non-critical
    }
  },

  deleteProject: async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      const currentHistory = get().history;
      set({ history: currentHistory.filter((p: Project) => p.id !== projectId) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reset: () => {
    set({
      currentProjectId: null,
      originalImageUri: null,
      originalImageUrl: null,
      selectedStyle: null,
      previews: [],
      finalImageUrl: null,
      status: 'idle',
      regeneratingStyle: null,
      error: null,
      isMock: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
