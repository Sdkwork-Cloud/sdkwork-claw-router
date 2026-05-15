export type ThemePreference = 'light' | 'dark';

export const CLAW_ROUTER_THEME_STORAGE_KEY = 'claw-router-theme';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark';
}

export function resolveInitialThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const storedTheme = window.localStorage.getItem(CLAW_ROUTER_THEME_STORAGE_KEY);
    if (isThemePreference(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Continue to system preference when storage is unavailable.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function persistThemePreference(theme: ThemePreference): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CLAW_ROUTER_THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in private or embedded contexts.
  }
}

export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
