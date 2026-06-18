import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PortalQueryProvider } from 'sdkwork-clawrouter-pc-commons';
import { initializeThemePreferences } from './themePreference.ts';
import './index.css';
import 'sdkwork-clawrouter-pc-i18n';

initializeThemePreferences();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortalQueryProvider>
      <App />
    </PortalQueryProvider>
  </StrictMode>,
);
