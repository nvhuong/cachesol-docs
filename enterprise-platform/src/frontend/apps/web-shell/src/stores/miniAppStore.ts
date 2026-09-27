import { create } from 'zustand';
import type { MiniAppPackage, MiniAppManifest } from '@cachesol/shared-types';

/**
 * Infer route prefix from manifest id.
 *
 *   'hrm-mini-app'      → 'hrm'              (mounted at /hrm/*)
 *   'registry-admin'    → 'registry-admin'   (mounted at /registry-admin/*)
 *   'landing-mini-app'  → null               (mounted at root paths, no prefix)
 *
 * The landing-mini-app is special: it's the public catalog mounted at the root
 * path. We detect it by `manifest.id === 'landing-mini-app'` since it does not
 * declare a routePrefix but still does not want a URL prefix.
 */
export function getRoutePrefix(manifest: MiniAppManifest): string | null {
  // First, honor explicit declaration.
  if (manifest.routePrefix !== undefined) {
    // empty string '' = explicit no-prefix (landing uses this pattern)
    return manifest.routePrefix.length > 0 ? manifest.routePrefix : null;
  }
  // Defaults: the public landing mini-app has no prefix.
  if (manifest.id === 'landing-mini-app') return null;
  // Otherwise derive from id: strip '-mini-app' suffix.
  return manifest.id.replace(/-mini-app$/, '');
}

/** Return the effective full path for a route inside a mini-app shell. */
export function joinPath(prefix: string | null, routePath: string): string {
  if (!prefix) return routePath; // landing: no prefix
  return `/${prefix}${routePath}`;
}

export interface MiniAppRouteEntry {
  /** Full path as mounted in the browser, e.g. '/registry/tenants' or '/register'. */
  path: string;
  /** Route prefix of the mini-app, e.g. 'registry' | 'hrm' | null (landing). */
  miniAppId: string;
  component: () => Promise<{ default: React.ComponentType }>;
  permissions?: string[];
  layout?: string;
  title?: string;
}

interface MiniAppState {
  miniApps: MiniAppPackage[];
  registered: boolean;
  /** ID of the currently active (focused) mini-app in the sidebar. */
  activeMiniAppId: string | null;
  registerMiniApps: (apps: MiniAppPackage[]) => void;
  getManifests: () => MiniAppManifest[];
  /** Returns all routes with their full mounted paths and miniAppId. */
  getRoutes: () => MiniAppRouteEntry[];
  /** Returns menu items for the active mini-app only. */
  getMenuItems: () => MiniAppManifest['menu'];
  /** Switch which mini-app is "active" in the shell (updates sidebar + active state). */
  setActiveMiniApp: (id: string | null) => void;
  /** Get manifest for a specific mini-app. */
  getManifest: (id: string) => MiniAppManifest | undefined;
}

export const useMiniAppStore = create<MiniAppState>((set, get) => ({
  miniApps: [],
  registered: false,
  activeMiniAppId: null,

  registerMiniApps: (apps) => {
    // Default active mini-app: the first non-landing one.
    const first = apps.find((a) => !a.manifest.routePrefix === false);
    set({ miniApps: apps, registered: true, activeMiniAppId: first?.manifest.id ?? null });
  },

  getManifests: () => get().miniApps.map((app) => app.manifest),

  getRoutes: () => {
    const result: MiniAppRouteEntry[] = [];
    for (const app of get().miniApps) {
      const prefix = getRoutePrefix(app.manifest);
      for (const route of app.manifest.routes) {
        result.push({
          path: joinPath(prefix, route.path),
          miniAppId: app.manifest.id,
          component: route.component,
          permissions: route.permissions,
          layout: route.layout,
          title: route.title,
        });
      }
    }
    return result;
  },

  getMenuItems: () => {
    const { activeMiniAppId, miniApps } = get();
    if (!activeMiniAppId) return [];
    const app = miniApps.find((a) => a.manifest.id === activeMiniAppId);
    return app?.manifest.menu ?? [];
  },

  setActiveMiniApp: (id) => set({ activeMiniAppId: id }),

  getManifest: (id) => get().miniApps.find((a) => a.manifest.id === id)?.manifest,
}));
