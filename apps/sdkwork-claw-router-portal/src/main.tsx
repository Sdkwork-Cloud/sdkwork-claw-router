import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { initializeThemePreferences } from './themePreference.ts';
import './index.css';
import 'sdkwork-claw-router-i18n';

initializeThemePreferences();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
