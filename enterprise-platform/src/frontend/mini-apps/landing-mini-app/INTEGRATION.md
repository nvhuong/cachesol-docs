# CacheSol Landing Mini App

Public landing page hosted as a mini-app.

## Public, no auth required

- View list of available mini-apps
- View detail of each mini-app
- Submit registration form (POST to Platform Registry `POST /v1/tenants/register`)

## Routes

| Path | Purpose | Auth |
|------|---------|------|
| `/` | Home + app grid | None |
| `/apps/:appId` | Mini-app detail | None |
| `/register` | Registration form | None |
| `/register/success` | Success page | None |

## Pages

- `LandingPage` — Hero + grid + highlights
- `MiniAppDetailPage` — Detail with sticky buybox
- `RegistrationPage` — Multi-section form (company, contact, subscription)
- `RegistrationSuccessPage` — Result + next steps

## Mock data (fallback only)

When `platform-registry` is unreachable, the UI falls back to local mocks so
demo flows still render. The mocks are **not** the source of truth in any
deployed environment.

- `api/mock-catalog.ts` — 6 hardcoded mini-apps (HRM, Sales, Finance, Operations, Analytics, Helpdesk)
- `api/mock-registration.ts` — Returns mock `tenantId` + admin URL after 1.2s delay

---

## Backend integration

Landing mini-app consumes the **public catalog + self-service registration**
endpoints of `platform-registry`. Both endpoints are unauthenticated by
design (no JWT, no CORS preflight required beyond standard headers) so the
landing page can be served as a fully public SPA.

### Manifest contract

`src/manifest/index.ts` declares the integration endpoints so any host shell
(marketing site, embed, standalone dev) can resolve them through a single
source of truth:

```1:79:src/manifest/index.ts
export const manifest: MiniAppManifest = {
  // ...
  api: {
    baseUrl: (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_PLATFORM_REGISTRY_BASE_URL ?? '/public-api/v1',
    endpoints: {
      tenantRegister: '/tenants/register',
      miniAppsPublic: '/public/mini-apps',
      miniAppDetail: '/public/mini-apps/:code',
    },
  },
};
```

- `baseUrl` defaults to the relative path `/public-api/v1` so the dev server's
  Vite proxy or any production ingress can route to platform-registry without
  CORS work in the browser.
- Override via `VITE_PLATFORM_REGISTRY_BASE_URL` (e.g. `http://localhost:8087`
  for direct local dev, or `https://api.cachesol.io` for staging/prod).

### API clients

| File | Purpose | Backend endpoint |
|------|---------|------------------|
| `src/api/catalog-api.ts` | List + detail catalog | `GET /public-api/v1/public/mini-apps[/:code]` |
| `src/api/registration-api.ts` | Submit tenant registration | `POST /public-api/v1/tenants/register` |
| `src/api/mock-catalog.ts` | Local fallback for catalog | (none) |
| `src/api/mock-registration.ts` | Local fallback for registration | (none) |

Both clients share a common pattern:

1. `fetch()` against the manifest endpoint with `credentials: 'omit'`
   (public — no cookies/JWT).
2. Unwrap the standard envelope `{ success, data, error }`.
3. On network failure or non-2xx response → log a warning and fall back to
   the corresponding `mock-*` module so the page still renders something
   useful in offline / dev environments.
4. On success → return `env.data` typed against the strict DTO in
   `src/types/`.

### Endpoint contracts

#### `GET /public-api/v1/public/mini-apps`

Returns the marketing-shape catalog (6 mini-apps). Marketing fields
(`tagline`, `features`, `pricing`, `currency`, `publisherName`,
`publishedAt`) live in `mini_apps.metadata` JSONB. Source of truth:
`PublicCatalogController.list()` in
`src/backend/platform/platform-registry/src/main/java/.../PublicCatalogController.java`.

Response:
```json
{
  "success": true,
  "data": {
    "total": 6,
    "items": [
      {
        "id": "hrm",
        "name": "HRM",
        "tagline": "Quản lý nhân sự toàn diện",
        "description": "...",
        "category": "hr",
        "pricing": "per-user",
        "minSeats": 5,
        "currency": "VND",
        "pricePerMonth": 25000,
        "features": ["Hồ sơ nhân viên + lịch sử", "..."],
        "publisherName": "CacheSol",
        "publishedAt": "2025-01-15",
        "iconUrl": null,
        "installEndpoint": "/api/tenant-manager/v1/mini-apps/hrm/install"
      }
    ]
  }
}
```

#### `GET /public-api/v1/public/mini-apps/:code`

Detail by code (`hrm`, `sales`, `finance`, `operations`, `analytics`,
`helpdesk`). Returns `404` if the code is unknown or the app is
`is_active=false`. Source of truth: `PublicCatalogController.detail()`.

#### `POST /public-api/v1/tenants/register`

Self-service tenant registration. Validates consents, derives a slug from
`companyName`, creates a `Tenant (status=provisioning)`, provisions a
Keycloak realm (best-effort), and publishes `TenantCreatedEvent`. The
`tenant-manager` then init-schema flow completes the tenant and calls back
to flip the tenant to `active`.

Request:
```json
{
  "company":     { "companyName": "...", "taxCode": "...", "country": "VN", "companySize": "small" },
  "contact":     { "fullName": "...", "email": "...", "phone": "...", "jobTitle": "CEO" },
  "subscription":{ "selectedMiniAppIds": ["hrm","sales"], "estimatedSeats": 10, "billingCurrency": "VND" },
  "consents":    { "termsAccepted": true, "privacyAccepted": true, "marketingOptIn": false },
  "referrer":    "google"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "tenantId":        "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "tenantSlug":      "cong-ty-acme",
    "adminUrl":        "https://cong-ty-acme.vn.cachesol.io/admin",
    "contactEmail":    "ceo@acme.com",
    "provisioningEta": "5-10 phút"
  }
}
```

Validation error codes: `VALIDATION`, `CONSENT_REQUIRED`, `SLUG_TAKEN`,
`MISSING_COUNTRY`, `INTERNAL_ERROR`. Source of truth:
`PublicRegistrationController.register()`.

### Frontend wiring

| Page | Calls |
|------|-------|
| `LandingPage` | `fetchCatalog()` |
| `MiniAppDetailPage` | `fetchApp(appId)` |
| `RegistrationPage` | `fetchCatalog()` (mini-app dropdown) + `submitRegistration(values)` |
| `RegistrationSuccessPage` | reads `tenantId` + `adminUrl` from navigation state |

> **Note:** `RegistrationPage` previously used `fetchMockCatalog()` for the
> mini-app dropdown. As of the backend integration it now uses the real
> `fetchCatalog()` so the dropdown always reflects what the backend will
> accept on submission.

### Error handling

- **Network unreachable** → fallback to mock (logged via `console.warn`).
- **Backend returns 4xx** (e.g. `CONSENT_REQUIRED`, `SLUG_TAKEN`) → the
  error message from `error.message` is surfaced via `AntApp.message.error`
  in the registration form so the user can correct and retry.
- **Backend returns 5xx** → same path as 4xx; no auto-retry.

### Local development

The dev script (`npm run dev:landing`) proxies `/public-api/v1/*` to
`http://localhost:8087` (the platform-registry container). To target a
different host, set `VITE_PLATFORM_REGISTRY_BASE_URL=http://host:port` in
`.env.local`.

## Styles

- Component styles in `src/styles/landing.css`
- Consumes CacheSol Design System via `@cachesol/design-system`
