import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore } from '@/stores/miniAppStore';
import { useI18n } from '@/hooks/useI18n';
import { buildRouter } from '@/shell/buildRouter';
import type { MiniAppPackage } from '@cachesol/shared-types';

interface AppProps {
  miniApps: MiniAppPackage[];
}

const App = ({ miniApps }: AppProps) => {
  const { registerMiniApps } = useMiniAppStore();
  const { loadMiniAppI18n } = useI18n();
  const { token } = useAuthStore();

  // Register mini apps khi component mount
  useEffect(() => {
    registerMiniApps(miniApps);
    
    // Load i18n từ các mini apps
    miniApps.forEach((app) => {
      if (app.manifest.i18n) {
        loadMiniAppI18n(app.manifest.id, app.manifest.i18n);
      }
      // Call onMount lifecycle
      app.manifest.lifecycle?.onMount?.();
    });

    return () => {
      miniApps.forEach((app) => {
        app.manifest.lifecycle?.onUnmount?.();
      });
    };
  }, [miniApps, registerMiniApps, loadMiniAppI18n]);

  const router = useMemo(() => buildRouter(), [token]);

  return <RouterProvider router={router} />;
};

export default App;
