/**
 * Structural regression for web-shell MainLayout.
 *
 * Goal: prove that MainLayout renders exactly ONE AdminShell wrapper
 * (class "cs-admin-shell") and exactly ONE AppHeader (class "cs-app-header").
 *
 * Uses react-dom/server renderToStaticMarkup — no DOM, no antd runtime,
 * no JSDOM, fully synchronous. Mocks the design-system's heavy exports
 * with stubs that emit the same class names MainLayout's source produces.
 *
 * Run: npx vitest run src/__verify__/mainlayout.structural.test.tsx
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

// ── Mocks for the design-system shell chrome ──────────────────────────
// We only need MainLayout to render its own DOM structure; the
// design-system's AppHeader/AdminShell internals are out of scope here.
vi.mock('@cachesol/design-system', async () => {
  const React = await import('react');
  return {
    // Stub AdminShell → emits a single .cs-admin-shell wrapper around children.
    AdminShell: ({
      children,
      appName,
      logo,
    }: {
      children?: React.ReactNode;
      appName?: string;
      logo?: React.ReactNode;
    }) =>
      React.createElement(
        'div',
        { className: 'cs-admin-shell', 'data-appname': appName },
        React.createElement('div', { className: 'cs-admin-shell__logo' }, logo),
        React.createElement('header', { className: 'cs-app-header' }, 'AppHeader'),
        React.createElement('main', null, children),
      ),
    // Stub useShell — MainLayout reads .headerVisible + setters.
    useShell: () => ({
      headerVisible: true,
      setHeaderVisible: () => {},
      toggleHeaderVisible: () => {},
      brand: { name: 'Platform Registry' },
      setBrand: () => {},
      appSwitcher: [],
      setAppSwitcher: () => {},
      activeAppId: 'registry-admin',
      setActiveAppId: () => {},
      user: { name: 'Test User', email: 'test@example.com' },
      setUser: () => {},
      notifications: [],
      markNotificationRead: () => {},
      markAllNotificationsRead: () => {},
      configItems: [],
      language: 'vi',
      setLanguage: () => {},
      theme: 'light',
      setTheme: () => {},
    }),
    // Stub AppHeader → emits a single <header class="cs-app-header">.
    AppHeader: () => React.createElement('header', { className: 'cs-app-header' }, 'AppHeader'),
    AppSwitcherItem: class {},
    cachesolTheme: {},
    ShellProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import { MainLayout } from '@/layouts/MainLayout';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore } from '@/stores/miniAppStore';

beforeAll(() => {
  useAuthStore.setState({
    token: 't',
    isAuthenticated: true,
    user: { id: 'u1', name: 'Test User', email: 'test@example.com' },
  });
  useMiniAppStore.setState({
    miniApps: [],
    registered: true,
    activeMiniAppId: 'registry-admin',
  });
});

function renderAt(initialPath: string) {
  const tree = (
    <AntApp>
      <ConfigProvider theme={{}} locale={viVN}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/registry" element={<MainLayout />}>
              <Route index element={<div data-testid="page">INDEX</div>} />
              <Route path="tenants" element={<div data-testid="page">TENANTS</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ConfigProvider>
    </AntApp>
  );
  return renderToStaticMarkup(tree);
}

describe('MainLayout structural regression', () => {
  it('renders exactly one cs-admin-shell wrapper on /registry', () => {
    const html = renderAt('/registry');
    const matches = html.match(/class="cs-admin-shell"/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it('renders exactly one cs-app-header on /registry', () => {
    const html = renderAt('/registry');
    const matches = html.match(/class="cs-app-header"/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it('renders header + outlet content for /registry/tenants', () => {
    const html = renderAt('/registry/tenants');
    expect((html.match(/class="cs-admin-shell"/g) ?? []).length).toBe(1);
    expect((html.match(/class="cs-app-header"/g) ?? []).length).toBe(1);
    expect(html).toContain('TENANTS');
  });

  it('never nests a second cs-admin-shell wrapper inside the first', () => {
    const html = renderAt('/registry');
    // Only count the *root* wrapper opening-tag, not BEM children.
    const matches = html.match(/class="cs-admin-shell"/g) ?? [];
    expect(matches.length).toBe(1);
    // And sanity-check the structural shape we want: a header-wrap, body, etc.
    expect(html).toContain('cs-admin-shell__header-wrap');
    expect(html).toContain('cs-admin-shell__body');
    expect(html).toContain('cs-admin-shell__content');
  });
});