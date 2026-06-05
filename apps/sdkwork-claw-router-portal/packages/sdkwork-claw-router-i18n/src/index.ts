import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const consoleGatewayI18nKeyRegistry = {
  en: [
    "console.gateway.title",
    "console.gateway.subtitle",
    "console.gateway.summary.traceRows",
    "console.gateway.summary.successful",
    "console.gateway.summary.failed",
    "console.gateway.summary.channels",
    "console.gateway.table.title",
    "console.gateway.table.description",
    "console.gateway.table.traceId",
    "console.gateway.table.timestamp",
    "console.gateway.table.clientIp",
    "console.gateway.table.method",
    "console.gateway.table.endpoint",
    "console.gateway.table.status",
    "console.gateway.table.duration",
    "console.gateway.table.routedChannel",
    "console.gateway.states.loading",
    "console.gateway.states.loadErrorTitle",
    "console.gateway.states.loadErrorFallback",
    "console.gateway.states.emptyTitle",
    "console.gateway.states.emptyDescription",
  ],
  zh: [
    "console.gateway.title",
    "console.gateway.subtitle",
    "console.gateway.summary.traceRows",
    "console.gateway.summary.successful",
    "console.gateway.summary.failed",
    "console.gateway.summary.channels",
    "console.gateway.table.title",
    "console.gateway.table.description",
    "console.gateway.table.traceId",
    "console.gateway.table.timestamp",
    "console.gateway.table.clientIp",
    "console.gateway.table.method",
    "console.gateway.table.endpoint",
    "console.gateway.table.status",
    "console.gateway.table.duration",
    "console.gateway.table.routedChannel",
    "console.gateway.states.loading",
    "console.gateway.states.loadErrorTitle",
    "console.gateway.states.loadErrorFallback",
    "console.gateway.states.emptyTitle",
    "console.gateway.states.emptyDescription",
  ],
} as const;

interface LegacyNavigatorLanguage {
  userLanguage?: string;
}

const getBrowserLanguage = () => {
  // 1. Explicit user selection (ignore legacy i18nextLng cache from plugin)
  const userSelected = localStorage.getItem('user_explicit_lang');
  if (userSelected) {
    if (userSelected.toLowerCase().includes('zh')) return 'zh';
    if (userSelected.toLowerCase().includes('en')) return 'en';
    return userSelected;
  }

  // 2. OS / browser language detection
  const navigatorLanguage = window.navigator as Navigator & LegacyNavigatorLanguage;
  const browserLang = navigatorLanguage.language || navigatorLanguage.userLanguage || navigatorLanguage.languages?.[0];
  if (browserLang) {
    if (browserLang.toLowerCase().includes('zh')) return 'zh';
  }
  return 'en'; // default to english
};

i18n
  .use(initReactI18next)
  .init({
    lng: getBrowserLanguage(),
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "zh"],
    interpolation: { escapeValue: false },
  });

export default i18n;
