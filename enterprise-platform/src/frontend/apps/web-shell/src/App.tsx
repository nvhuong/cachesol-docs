import { useEffect, useMemo } from 'react';
import { RouterProvider, createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom';
import { LandingPage } from '@cachesol/landing-mini-app';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppPickerPage } from '@/pages/AppPickerPage';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore, getRoutePrefix } from '@/stores/miniAppStore';
import type { MiniAppPackage } from '@cachesol/shared-types';

function IndexPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function buildRoutes(): RouteObject[] {
  const miniApps = useMiniAppStore.getState().miniApps;
  const result: RouteObject[] = [];

  // Public top-level: login + index.
  result.push({ path: '/login', element: <LoginPage /> });
  result.push({ path: '/', element: <IndexPage /> });

  // Landing mini-app routes (mounted at root, no prefix).
  const landingApp = miniApps.find((app) => getRoutePrefix(app.manifest) === null);
  if (landingApp) {
    for (const route of landingApp.manifest.routes) {
      if (route.path === '/') continue;
      result.push({
        path: route.path,
        lazy: async () => {
          const Module = await route.component();
          return { Component: Module.default };
        },
      });
    }
  }

  // Protected routes, grouped per mini-app routePrefix.
  const protectedChildren: RouteObject[] = [
    { path: 'dashboard', element: <AppPickerPage /> },
  ];
  for (const app of miniApps) {
    const prefix = getRoutePrefix(app.manifest);
    if (!prefix) continue;
    const subChildren: RouteObject[] = [];
    for (const route of app.manifest.routes) {
      if (route.layout !== 'main' && route.layout !== 'auth') continue;
      // The mini-app's root route (path === '/') is exposed as an index under
      // its routePrefix, e.g. /registry and /tenant-manager render the dashboard.
      // All other routes use their relative path.
      if (route.path === '/') {
        subChildren.push({
          index: true,
          lazy: async () => {
            const Module = await route.component();
            return { Component: Module.default };
          },
        });
      } else {
        subChildren.push({
          path: route.path.replace(/^\//, ''),
          lazy: async () => {
            const Module = await route.component();
            return { Component: Module.default };
          },
        });
      }
    }
    if (subChildren.length === 0) continue;
    protectedChildren.push({ path: prefix, children: subChildren });
  }
  result.push({
    element: <RequireAuth />,
    children: [{ element: <MainLayout />, children: protectedChildren }],
  });
  result.push({ path: '*', element: <NotFoundPage /> });
  return result;
}

interface AppProps {
  miniApps: MiniAppPackage[];
}

const App = ({ miniApps }: AppProps) => {
  // Register mini-apps (defensive: main.tsx already registered, but re-mounts in dev/HMR).
  useEffect(() => {
    if (useMiniAppStore.getState().miniApps.length === 0) {
      useMiniAppStore.getState().registerMiniApps(miniApps);
    }
    miniApps.forEach((app) => app.manifest.lifecycle?.onMount?.());
    return () => {
      miniApps.forEach((app) => app.manifest.lifecycle?.onUnmount?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild router on token change so RequireAuth picks up new auth state.
  const token = useAuthStore((s) => s.token);
  const router = useMemo(() => createBrowserRouter(buildRoutes()), [token]);

  return <RouterProvider router={router} />;
};

export default App;
