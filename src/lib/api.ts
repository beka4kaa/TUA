/**
 * API Client for Django Backend
 * 
 * This file provides a type-safe wrapper around fetch for communicating
 * with the Django REST API.
 */

// ============================================
// Type Definitions
// ============================================

export type UserRole = 'USER' | 'MEMBER' | 'ADMIN';
export type UserStatus = 'NEW' | 'ACTIVE' | 'SUSPENDED';
export type SubscriptionTier = 'FREE' | 'STANDARD' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Subscription {
  id: number;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string | null;
}

export interface UserWithSubscription extends User {
  subscription: Subscription | null;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PostAuthor {
  id: string;
  displayName: string;
  image: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatus;
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  author: PostAuthor;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  publishedAt: string | null;
  readingTimeMinutes: number;
  coverImageUrl: string | null;
  author: PostAuthor;
  tags: Tag[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Paginated response from Django StandardPagination */
export interface BookingsPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: UserWithSubscription;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface ApiSuccess {
  success: boolean;
  message: string;
}

// ============================================
// API Configuration
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ymit-production.up.railway.app/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'tua_access_token';
const REFRESH_TOKEN_KEY = 'tua_refresh_token';

// ============================================
// Token Management
// ============================================

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setTokens: (access: string, refresh: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  isLoggedIn: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};

// ============================================
// Base Fetch Wrapper
// ============================================

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      tokenStorage.setTokens(data.access, refreshToken);
      return true;
    }
  } catch {
    // Refresh failed
  }
  
  tokenStorage.clearTokens();
  return false;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth header if logged in
  if (!skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  
  // If unauthorized, try refreshing token
  if (response.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = tokenStorage.getAccessToken();
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    }
  }
  
  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new ApiClientError(response.status, errorData.error || 'Request failed', errorData.details);
  }
  
  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// ============================================
// Error Handling
// ============================================

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
  
  getFieldError(field: string): string | undefined {
    return this.details?.[field]?.[0];
  }
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  signUp: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiSuccess & { email: string; verificationUrl?: string }> => {
    return apiFetch('/auth/signup/', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.firstName || '',
        last_name: data.lastName || '',
      }),
      skipAuth: true,
    });
  },
  
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const response = await apiFetch<AuthTokens>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    
    tokenStorage.setTokens(response.access, response.refresh);
    return response;
  },
  
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      await apiFetch('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } finally {
      tokenStorage.clearTokens();
    }
  },
  
  verifyEmail: async (token: string): Promise<ApiSuccess> => {
    return apiFetch('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
      skipAuth: true,
    });
  },
  
  resendVerification: async (email: string): Promise<ApiSuccess> => {
    return apiFetch('/auth/resend-verification/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },
  
  forgotPassword: async (email: string): Promise<ApiSuccess> => {
    return apiFetch('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },
  
  resetPassword: async (token: string, password: string): Promise<ApiSuccess> => {
    return apiFetch('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      skipAuth: true,
    });
  },
  
  getMe: async (): Promise<UserWithSubscription> => {
    return apiFetch('/auth/me/');
  },
  
  updateMe: async (data: Partial<{
    firstName: string;
    lastName: string;
    image: string;
  }>): Promise<UserWithSubscription> => {
    return apiFetch('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        image: data.image,
      }),
    });
  },
  
  refreshToken: async (): Promise<{ access: string } | null> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;
    
    try {
      const response = await apiFetch<{ access: string }>('/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        skipAuth: true,
      });
      
      tokenStorage.setTokens(response.access, refreshToken);
      return response;
    } catch {
      tokenStorage.clearTokens();
      return null;
    }
  },
};

// ============================================
// Users API (Admin)
// ============================================

export const usersApi = {
  list: async (params?: {
    page?: number;
    search?: string;
    role?: string;
    status?: string;
    tier?: string;
    excludeAdmins?: boolean;
  }): Promise<PaginatedResponse<UserWithSubscription>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.tier) searchParams.set('tier', params.tier);
    if (params?.excludeAdmins) searchParams.set('exclude_admins', 'true');
    
    const query = searchParams.toString();
    return apiFetch(`/users/${query ? `?${query}` : ''}`);
  },
  
  get: async (id: string): Promise<UserWithSubscription> => {
    return apiFetch(`/users/${id}/`);
  },
  
  delete: async (id: string): Promise<void> => {
    return apiFetch(`/users/${id}/`, { method: 'DELETE' });
  },
  
  updateRole: async (id: string, role: UserRole): Promise<{ success: boolean; role: UserRole }> => {
    return apiFetch(`/users/${id}/role/`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
  
  updateStatus: async (id: string, status: UserStatus): Promise<{ success: boolean; status: UserStatus }> => {
    return apiFetch(`/users/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  adminUpdate: async (id: string, data: { role?: UserRole; status?: UserStatus }): Promise<{ success: boolean; user: UserWithSubscription }> => {
    return apiFetch(`/users/${id}/admin-update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Blog API
// ============================================

export const blogApi = {
  listPosts: async (params?: {
    page?: number;
    tag?: string;
    status?: PostStatus;
    author?: string;
    search?: string;
  }): Promise<PaginatedResponse<PostListItem>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.author) searchParams.set('author', params.author);
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiFetch(`/posts/${query ? `?${query}` : ''}`, { skipAuth: true });
  },
  
  getPost: async (slug: string): Promise<Post> => {
    return apiFetch(`/posts/${slug}/`, { skipAuth: true });
  },
  
  getTags: async (): Promise<Tag[]> => {
    return apiFetch('/tags/', { skipAuth: true });
  },
  
  // Admin methods
  createPost: async (data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    status?: PostStatus;
    coverImageUrl?: string;
    tags?: number[];
  }): Promise<Post> => {
    return apiFetch('/posts/', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        cover_image_url: data.coverImageUrl,
        tags: data.tags,
      }),
    });
  },
  
  updatePost: async (slug: string, data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    status: PostStatus;
    coverImageUrl: string;
    tags: number[];
  }>): Promise<Post> => {
    return apiFetch(`/posts/${slug}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        cover_image_url: data.coverImageUrl,
        tags: data.tags,
      }),
    });
  },
  
  deletePost: async (slug: string): Promise<void> => {
    return apiFetch(`/posts/${slug}/`, { method: 'DELETE' });
  },
};

// ============================================
// Bookings API
// ============================================

export interface Booking {
  id: number;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    displayName: string;
    image: string | null;
  };
}

export const bookingsApi = {
  create: async (data: {
    scheduled_date: string;
    scheduled_time: string;
    notes?: string;
  }): Promise<Booking> => {
    return apiFetch('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  list: async (params?: { page?: number; status?: string }): Promise<BookingsPaginatedResponse<Booking>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.status) searchParams.set('status', params.status);
    
    const query = searchParams.toString();
    return apiFetch(`/bookings/${query ? `?${query}` : ''}`);
  },
  
  /** Fetch all booked slots (from any user) for availability display */
  getBookedSlots: async (params?: { from?: string; to?: string }): Promise<{ bookedSlots: string[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.set('from', params.from);
    if (params?.to) searchParams.set('to', params.to);
    
    const query = searchParams.toString();
    return apiFetch(`/bookings/slots/${query ? `?${query}` : ''}`);
  },
  
  get: async (id: number): Promise<Booking> => {
    return apiFetch(`/bookings/${id}/`);
  },
  
  updateStatus: async (id: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'): Promise<Booking> => {
    return apiFetch(`/bookings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  cancel: async (id: number): Promise<Booking> => {
    return apiFetch(`/bookings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
  },
};

// ============================================
// Billing API
// ============================================

export interface BillingInfo {
  id: number;
  tier: 'FREE' | 'PREMIUM';
  subscriptionStatus: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  isActive: boolean;
  isPremium: boolean;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

export const billingApi = {
  /** Get current user's billing info */
  getMe: async (): Promise<BillingInfo> => {
    return apiFetch('/billing/me/');
  },
  
  /** Create Stripe checkout session for upgrade */
  createCheckoutSession: async (): Promise<CheckoutSessionResponse> => {
    return apiFetch('/billing/create-checkout-session/', {
      method: 'POST',
    });
  },
  
  /** Create Stripe customer portal session */
  createPortalSession: async (): Promise<PortalSessionResponse> => {
    return apiFetch('/billing/create-portal-session/', {
      method: 'POST',
    });
  },
};

// ============================================
// Export default client
// ============================================

export const api = {
  auth: authApi,
  users: usersApi,
  blog: blogApi,
  bookings: bookingsApi,
  billing: billingApi,
};

export default api;
