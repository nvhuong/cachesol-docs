import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { Book, BookPage, Category, Chapter, Library } from './types';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const developmentDefault = Platform.OS !== 'web' && expoHost
  ? `http://${expoHost}:8000`
  : Platform.OS === 'android' ? 'http://192.168.1.195:8000' : 'http://localhost:8000';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || developmentDefault;

function normalizeHosts<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/https?:\/\/(localhost|127\.0\.0\.1):8000/g, API_BASE_URL) as T;
  if (Array.isArray(value)) return value.map(normalizeHosts) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeHosts(item)])) as T;
  return value;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error(`Không thể kết nối tới ${API_BASE_URL}. Hãy dùng cùng Wi‑Fi và chạy Expo bằng --lan.`);
  }
  if (!response.ok) throw new Error(`Máy chủ trả về lỗi ${response.status}`);
  return normalizeHosts(await response.json() as T);
}

export const api = {
  categories: () => request<Category[]>('/api/v1/categories'),
  books: (params: { categoryId?: number; q?: string; cursor?: string; sort?: 'new' | 'hot' } = {}) => request<BookPage>(`/api/v1/books?${new URLSearchParams({ ...(params.categoryId ? { category_id: String(params.categoryId) } : {}), ...(params.q ? { q: params.q } : {}), ...(params.cursor ? { cursor: params.cursor } : {}), ...(params.sort ? { sort: params.sort } : {}) }).toString()}`),
  book: (id: number) => request<Book>(`/api/v1/books/${id}`),
  chapter: (id: number) => request<Chapter>(`/api/v1/chapters/${id}`),
  library: () => request<Library>('/api/v1/library'),
  startListening: (id: number) => request<{ chapter_id: number; next_chapter_id: number | null; status: string }>(`/api/v1/chapters/${id}/start-listening`, { method: 'POST' }),
};
