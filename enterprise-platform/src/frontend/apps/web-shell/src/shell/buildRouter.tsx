import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppPickerPage } from '@/pages/AppPickerPage';
import { LandingPage } from '@cachesol/landing-mini-app';
import { useMiniAppStore, getRoutePrefix } from '@/stores/miniAppStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Root index — decides what unauthenticated vs authenticated users see at '/'.
 */
function IndexPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}

/**
 * Build router config for the web-shell.
 *
 * Routing model: prefix-per-mini-app.
 *   - Mini-app with routePrefix (e.g. 'registry', 'tenant-manager', 'hrm')
 *     is mounted at `/{prefix}/*` inside the protected shell layout.
 *   - Mini-app without routePrefix (e.g. landing) is mounted at root paths
 *     outside the shell, accessible without auth.
 */
function buildRoutes(): RouteObject[] {
  const miniApps = useMiniAppStore.getState().miniApps;

  const result: RouteObject[] = [];

  // ── Public routes ──────────────────────────────────────────────
  result.push({ path: '/login', element: <LoginPage /> });
  result.push({ path: '/', element: <IndexPage /> });

  // Landing mini-app (no routePrefix): mount its routes directly at root.
  const landingApp = miniApps.find(
    (app) => getRoutePrefix(app.manifest) === null
  );
  if (landingApp) {
    for (const route of landingApp.manifest.routes) {
      if (route.path === '/') continue; // already mounted as IndexPage
      result.push({
        path: route.path,
        lazy: async () => {
          const Module = await route.component();
          return { Component: Module.default };
        },
      });
    }
  }

  // ── Protected routes (one nested branch per mini-app with prefix) ─
  const protectedChildren: RouteObject[] = [
    { path: 'dashboard', element: <AppPickerPage /> },
  ];

  for (const app of miniApps) {
    const prefix = getRoutePrefix(app.manifest);
    if (!prefix) continue;
    const subChildren: RouteObject[] = [];
    for (const route of app.manifest.routes) {
      if (route.layout !== 'main' && route.layout !== 'auth') continue;
      subChildren.push({
        // Relative path inside the /{prefix} branch.
        path: route.path === '/' ? '' : route.path.replace(/^\//, ''),
        lazy: async () => {
          const Module = await route.component();
          return { Component: Module.default };
        },
      });
    }
    if (subChildren.length === 0) continue;
    protectedChildren.push({
      path: prefix,
      children: subChildren,
    });
  }

  result.push({
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: protectedChildren,
      },
    ],
  });

  result.push({ path: '*', element: <NotFoundPage /> });
  return result;
}

export function buildRouter(_opts?: { token?: string | null; buildKey?: number }) {
  try {
    const routes = buildRoutes();
    if (typeof window !== 'undefined') {
      (window as any).__BUILD_ROUTER_CALLED__ = ((window as any).__BUILD_ROUTER_CALLED__ ?? 0) + 1;
      (window as any).__BUILD_ROUTER_PATHS__ = routes.map(r => r.path).filter(Boolean).join('|');
    }
    return createBrowserRouter(routes);
  } catch (e) {
    if (typeof window !== 'undefined') {
      (window as any).__BUILD_ROUTER_ERROR__ = String((e as Error).message);
    }
    throw e;
  }
}
