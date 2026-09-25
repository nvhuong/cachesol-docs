/**
 * Dev-only entry: renders Landing mini-app as a standalone SPA (no shell).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LandingPage } from './pages/LandingPage';
import { MiniAppDetailPage } from './pages/MiniAppDetailPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import '@cachesol/design-system/tokens.css';
import '@cachesol/design-system/styles.css';
import 'antd/dist/reset.css';
import './styles/landing.css';

function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/apps" element={<LandingPage />} />
            <Route path="/apps/:appId" element={<MiniAppDetailPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/register/success" element={<RegistrationSuccessPage />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </StrictMode>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
