import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {
  ApiResponse,
  AuthResult,
  DesignStyle,
  UploadResult,
  PreviewResult,
  FinalResult,
  Project,
  ProjectDetail,
  ShareResult,
  CreditsResult,
  CommunityProject,
  AIModel,
  GeneratedPrompt,
} from '../types';

// Lazy import to break circular dependency: client.ts <-> authStore.ts
function getAuthStore() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../store/authStore').useAuthStore;
}

function getAdminStore() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../store/adminStore').useAdminStore;
}

// Auto-detect backend URL based on environment
function getBackendUrl(): string {
  if (!__DEV__) {
    return 'https://your-production-api.com';
  }

  // Try to get the debugger host (works in Expo Go)
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (debuggerHost) {
    // debuggerHost is like "192.168.0.103:8081" — replace port with 4000
    const host = debuggerHost.split(':')[0];
    return `http://${host}:4000`;
  }

  // Fallback for emulators
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  return 'http://localhost:4000';
}

/** Server origin (e.g. http://192.168.0.103:4000) — use to prefix image paths */
export const SERVER_URL = getBackendUrl();
const API_BASE_URL = `${SERVER_URL}/api`;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(isMultipart = false): HeadersInit {
    const headers: HeadersInit = {};
    const token = getAuthStore().getState().token;
    const adminSecret = getAdminStore().getState().secret;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (adminSecret) {
      headers['x-admin-password'] = adminSecret;
    }

    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.body instanceof FormData),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // ── Auto-clear broken/expired token on 401 ────────────────────────────
        if (response.status === 401) {
          // Log out user and show error
          getAuthStore().getState().logout().catch(() => { });
          const err = new Error('Session expired. Please login again.') as any;
          err.statusCode = 401;
          throw err;
        }
        const errMsg = data.error || `Request failed with status ${response.status}`;
        const err = new Error(errMsg) as any;
        err.code = data.code || null;
        err.statusCode = response.status;
        throw err;
      }

      return data;
    } catch (error: any) {
      if (error.message === 'Network request failed') {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }


  // Auth
  async register(email: string, username: string, password: string): Promise<ApiResponse<AuthResult>> {
    return this.request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResult>> {
    return this.request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/profile');
  }

  // Styles & Models
  async getStyles(): Promise<ApiResponse<DesignStyle[]>> {
    return this.request<DesignStyle[]>('/design/styles');
  }

  async getModels(): Promise<ApiResponse<AIModel[]>> {
    return this.request<AIModel[]>('/ai/models');
  }

  async uploadImage(imageUri: string): Promise<ApiResponse<UploadResult>> {
    const formData = this.buildImageFormData(imageUri);

    try {
      return await this.request<UploadResult>('/design/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (error: any) {
      // ── If 401: token was already cleared by request(). Retry as Guest ───────
      if (error.statusCode === 401) {
        const guestFormData = this.buildImageFormData(imageUri);
        const url = `${this.baseUrl}/design/upload`;
        const response = await fetch(url, { method: 'POST', body: guestFormData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed');
        return data;
      }
      throw error;
    }
  }

  // ── Helper: build multipart FormData for any image URI ────────────────────
  private buildImageFormData(imageUri: string): FormData {
    const formData = new FormData();
    const uriParts = imageUri.split('/');
    let filename = uriParts.pop() || 'photo.jpg';
    const extMatch = /\.(jpe?g|png|webp|heic|heif)$/i.exec(filename);
    if (!extMatch) filename = `photo_${Date.now()}.jpg`;
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
    };
    const type = mimeMap[ext] || 'image/jpeg';
    formData.append('image', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      name: filename,
      type,
    } as any);
    return formData;
  }

  // Generate Prompt
  async generatePrompt(
    imageUrl: string,
    selectedStyle?: string,
    userInstructions?: string,
    modelName?: string,
  ): Promise<ApiResponse<GeneratedPrompt>> {
    return this.request<GeneratedPrompt>('/ai/generate-prompt', {
      method: 'POST',
      body: JSON.stringify({
        imageUrl,
        selectedStyle,
        userInstructions,
        modelName,
      }),
    });
  }

  // Object Removal
  async removeObject(
    imageUrl: string,
    objectName: string,
    replacement?: string,
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return this.request<{ imageUrl: string }>('/ai/remove-object', {
      method: 'POST',
      body: JSON.stringify({
        imageUrl,
        objectName,
        replacement,
      }),
    });
  }

  // Room Analysis
  async analyzeRoom(imageUrl: string): Promise<ApiResponse<any>> {
    return this.request<any>('/design/analyze-room', {
      method: 'POST',
      body: JSON.stringify({ imageUrl }),
    });
  }

  // Suggest Prompt
  async suggestPrompt(roomType: string, styleName: string): Promise<ApiResponse<{ prompt: string }>> {
    return this.request<{ prompt: string }>('/design/suggest-prompt', {
      method: 'POST',
      body: JSON.stringify({ roomType, styleName }),
    });
  }

  // Generate preview
  async generatePreview(
    projectId: string | undefined,
    styles?: string[],
    roomType?: string,
    guestImageUrl?: string,
    modelName?: string,
  ): Promise<ApiResponse<PreviewResult>> {
    return this.request<PreviewResult>('/design/generate-preview', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        styles,
        roomType,
        modelName,
        // For guest mode — backend uses this instead of looking up DB project
        ...(guestImageUrl ? { originalImageUrl: guestImageUrl } : {}),
      }),
    });
  }

  // Generate final
  async generateFinal(
    projectId: string,
    styleName: string,
    roomType?: string,
    guestImageUrl?: string,
    modelName?: string,
    customPrompt?: string,
  ): Promise<ApiResponse<FinalResult>> {
    return this.request<FinalResult>('/design/generate-final', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        styleName,
        roomType,
        modelName,
        customPrompt,
        ...(guestImageUrl ? { originalImageUrl: guestImageUrl } : {}),
      }),
    });
  }

  // History
  async getHistory(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/design/history');
  }

  // Project detail
  async getProject(projectId: string): Promise<ApiResponse<ProjectDetail>> {
    return this.request<ProjectDetail>(`/design/project/${projectId}`);
  }

  // Delete
  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/design/image/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Share
  async shareProject(projectId: string): Promise<ApiResponse<ShareResult>> {
    return this.request<ShareResult>('/design/share', {
      method: 'POST',
      body: JSON.stringify({ projectId }),
    });
  }

  // Like a project
  async toggleLike(projectId: string): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
    return this.request<{ isLiked: boolean; likeCount: number }>(`/design/project/${projectId}/like`, {
      method: 'POST',
    });
  }

  // Credits
  async getCredits(): Promise<ApiResponse<CreditsResult>> {
    return this.request<CreditsResult>('/design/credits');
  }

  // Community feed
  async getCommunity(): Promise<ApiResponse<CommunityProject[]>> {
    return this.request<CommunityProject[]>('/design/community');
  }

  // Shared project (public)
  async getSharedProject(token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/design/shared/${token}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/health');
  }

  // Admin Dashboard
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/dashboard');
  }

  async getAdminUsers(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return this.request<any>(`/admin/users${suffix}`);
  }

  async getAdminUserDetail(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`);
  }

  async updateAdminUser(userId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async updateAdminUserCredits(userId: string, payload: { amount: number; mode: 'set' | 'add' | 'subtract' }): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}/credits`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateAdminUserStatus(userId: string, status: 'ACTIVE' | 'BLOCKED' | 'BANNED' | 'ADMIN'): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async deleteAdminUser(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Admin Verification
  async verifyAdmin(password: string): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // Profile Update

  async updateProfile(imageUri: string): Promise<ApiResponse<any>> {
    const formData = this.buildImageFormData(imageUri);
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: formData,
    });
  }

  async updateProfileInfo(data: { username?: string; email?: string; phone?: string; avatarUri?: string }): Promise<ApiResponse<any>> {
    if (data.avatarUri) {
      const formData = this.buildImageFormData(data.avatarUri);
      if (data.username) formData.append('username', data.username);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      return this.request<any>('/auth/profile-info', {
        method: 'PUT',
        body: formData,
      });
    } else {
      return this.request<any>('/auth/profile-info', {
        method: 'PUT',
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          phone: data.phone,
        }),
      });
    }
  }

  // Password Update
  async updatePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async searchUsers(query: string): Promise<ApiResponse<any[]>> {
    const q = encodeURIComponent(query.trim());
    return this.request<any[]>(`/auth/users/search?q=${q}`);
  }

  async getUserProfile(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/auth/users/${userId}/profile`);
  }

  async updateShowcase(projectIds: string[]): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/profile/showcase', {
      method: 'PATCH',
      body: JSON.stringify({ projectIds }),
    });
  }

  // Update base URL (for settings)
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  // App Settings
  async getAppSettings(): Promise<ApiResponse<{ beforeImageUrl: string; afterImageUrl: string }>> {
    return this.request<{ beforeImageUrl: string; afterImageUrl: string }>('/admin/settings');
  }

  async updateAppSettings(data: { beforeImageUrl?: string; afterImageUrl?: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
