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

## Mock data

For development without Platform Registry backend ready:

- `api/mock-catalog.ts` — 6 hardcoded mini-apps (HRM, Sales, Finance, Operations, Analytics, Helpdesk)
- `api/mock-registration.ts` — Returns mock `tenantId` + admin URL after 1.2s delay

To wire to real backend, swap these mocks with `fetch()` calls.

## Styles

- Component styles in `src/styles/landing.css`
- Consumes CacheSol Design System via `@cachesol/design-system`
