export interface User {
  id: string;
  email: string;
  username: string;
  credits: number;
  avatarUrl?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  recommended: boolean;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface DesignStyle {
  name: string;
  displayName: string;
  description: string;
  colorPalette: string[];
  materials: string[];
}

export interface PreviewImage {
  id: string;
  styleName: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  originalImageUrl: string;
  finalImageUrl?: string;
  style?: string;
  status: 'uploaded' | 'previewing' | 'generating' | 'completed' | 'failed';
  previewCount: number;
  createdAt: string;
}

export interface ProjectDetail extends Project {
  previewImages: PreviewImage[];
  likeCount?: number;
  isLiked?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResult {
  projectId: string;
  originalImageUrl: string;
  status: string;
}

export interface PreviewResult {
  projectId: string;
  previews: PreviewImage[];
}

export interface GeneratedPrompt {
  mainPrompt: string;
  styleDetails: string;
  colorSuggestions: string;
  fullPrompt: string;
}

export interface FinalResult {
  projectId: string;
  styleName: string;
  finalImageUrl: string;
  originalImageUrl: string;
  status: string;
}

export interface ShareResult {
  shareUrl: string;
  shareToken: string;
  projectId: string;
  imageUrl: string;
}

export interface CreditsResult {
  credits: number;
  freeCredits?: number;
  paidCredits?: number;
  possibleGenerations?: number;
  nextRefillAt?: string;
}

export interface CommunityProject {
  id: string;
  originalImageUrl: string;
  finalImageUrl: string | null;
  style: string | null;
  author: string;
  createdAt: string;
}
