/**
 * Catalog API client — gọi Platform Registry public catalog endpoint.
 *
 * Endpoint: {@code GET /public-api/v1/public/mini-apps}
 *           {@code GET /public-api/v1/public/mini-apps/{code}}
 *
 * Source of truth: backend `platform-registry` (xem
 * `src/backend/platform/platform-registry/src/main/java/.../PublicCatalogController.java`).
 *
 * Fallback: nếu backend không khả dụng, dùng `mock-catalog` để UI vẫn render.
 */
import type {
  MiniAppCatalogResponse,
  PublicMiniApp,
} from '../types/miniapp-catalog.types';
import {
  fetchMockCatalog,
  fetchMockApp,
  MOCK_MINI_APPS,
} from './mock-catalog';

/** Standard API wrapper dùng bởi tất cả backend services. */
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string } | null;
}

const CATALOG_BASE = '/public-api/v1/public/mini-apps';

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  const env = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !env || env.success !== true || env.data == null) {
    const msg = env?.error?.message ?? fallbackMessage;
    throw new Error(msg);
  }
  return env.data;
}

export async function fetchCatalog(): Promise<MiniAppCatalogResponse> {
  try {
    const data = await unwrap<MiniAppCatalogResponse>(
      await fetch(`${CATALOG_BASE}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
      }),
      'Không tải được catalog mini-apps'
    );
    if (!Array.isArray(data.items)) {
      throw new Error('Catalog response thiếu items[]');
    }
    return data;
  } catch (err) {
    console.warn('[catalog-api] backend unreachable, fallback to mock:', err);
    return fetchMockCatalog();
  }
}

export async function fetchApp(code: string): Promise<PublicMiniApp | null> {
  try {
    const data = await unwrap<PublicMiniApp>(
      await fetch(`${CATALOG_BASE}/${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
      }),
      `Không tải được mini-app "${code}"`
    );
    return data;
  } catch (err) {
    console.warn(`[catalog-api] backend unreachable for "${code}", fallback to mock:`, err);
    return fetchMockApp(code);
  }
}

/**
 * Helper: list tất cả mini-apps từ mock — dùng cho test/preview khi cần dữ liệu
 * tĩnh không qua network.
 */
export function getMockApps(): PublicMiniApp[] {
  return MOCK_MINI_APPS;
}
