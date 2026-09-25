/**
 * Registration API client — gọi Platform Registry public registration endpoint.
 *
 * Endpoint: {@code POST /public-api/v1/tenants/register}
 *
 * Source of truth: backend `platform-registry` (xem
 * `src/backend/platform/platform-registry/src/main/java/.../PublicRegistrationController.java`).
 *
 * Fallback: nếu backend không khả dụng, dùng `mock-registration` để UI vẫn demo
 * được flow.
 */
import type {
  RegistrationRequest,
  RegistrationResponse,
} from '../types/registration.types';
import { submitMockRegistration } from './mock-registration';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string } | null;
}

const REGISTER_URL = '/public-api/v1/tenants/register';

async function unwrap<T>(res: Response): Promise<T> {
  const env = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !env || env.success !== true || env.data == null) {
    const code = env?.error?.code ?? 'REGISTRATION_FAILED';
    const msg = env?.error?.message ?? `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { code?: string; details?: string[] };
    err.code = code;
    throw err;
  }
  return env.data;
}

export async function submitRegistration(
  payload: RegistrationRequest
): Promise<RegistrationResponse> {
  try {
    const data = await unwrap<RegistrationResponse>(
      await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'omit',
      })
    );
    return data;
  } catch (err) {
    // Network fail → fallback to mock so UI vẫn demo được.
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[registration-api] backend unreachable, fallback to mock:', msg);
    return submitMockRegistration(payload);
  }
}
