import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useMiniAppStore } from '@/stores/miniAppStore';

export function buildRouter() {
  const miniAppRoutes: RouteObject[] = useMiniAppStore.getState().getRoutes().map((route) => ({
    path: route.path,
    lazy: async () => {
      const Module = await route.component();
      return { Component: Module.default };
    },
  }));

  return createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      element: <RequireAuth />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: 'dashboard',
              lazy: async () => {
                const Module = await import('@/pages/DashboardPage');
                return { Component: Module.DashboardPage };
              },
            },
            ...miniAppRoutes,
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
}
