import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { SdkworkThemeProvider, type SdkworkTheme, type SdkworkThemeOverrides } from "@sdkwork/ui-pc-react/theme";
import type {
  SdkworkShellThemeColor,
  SdkworkShellThemeSelection,
} from "@sdkwork/appbase-pc-react";
import { createSdkworkShellTheme } from "./sdkworkTheme";
import {
  normalizeSdkworkShellLocale,
  normalizeSdkworkShellLocalePreference,
  resolveDefaultSdkworkShellLocale,
  resolveSdkworkShellDirection,
  type SdkworkShellLocaleDirection,
  type SdkworkShellLocalePreference,
} from "./locale";

export interface SdkworkShellThemeState {
  setThemeColor: (value: SdkworkShellThemeColor) => void;
  setThemeSelection: (value: SdkworkShellThemeSelection) => void;
  theme: SdkworkTheme;
  themeColor: SdkworkShellThemeColor;
  themeSelection: SdkworkShellThemeSelection;
}

export interface SdkworkShellLocaleState {
  locale: string;
  localePreference: SdkworkShellLocalePreference;
  setLocalePreference: (value: SdkworkShellLocalePreference) => void;
}

export interface SdkworkShellState extends SdkworkShellLocaleState, SdkworkShellThemeState {
  isCommandPaletteOpen: boolean;
  isNavigationOpen: boolean;
  setCommandPaletteOpen: (value: boolean) => void;
  setNavigationOpen: (value: boolean) => void;
  toggleCommandPalette: () => void;
  toggleNavigationOpen: () => void;
}

const SdkworkShellThemeContext = createContext<SdkworkShellState | null>(null);

export interface SdkworkShellProviderProps extends PropsWithChildren {
  defaultCommandPaletteOpen?: boolean;
  defaultLocale?: string;
  defaultLocalePreference?: SdkworkShellLocalePreference;
  defaultNavigationOpen?: boolean;
  defaultThemeColor?: SdkworkShellThemeColor;
  defaultThemeSelection?: SdkworkShellThemeSelection;
  dir?: SdkworkShellLocaleDirection;
  locale?: string;
  localePreference?: SdkworkShellLocalePreference;
  onLocalePreferenceChange?: (value: SdkworkShellLocalePreference) => void;
  onThemeColorChange?: (value: SdkworkShellThemeColor) => void;
  onThemeSelectionChange?: (value: SdkworkShellThemeSelection) => void;
  overrides?: SdkworkThemeOverrides;
  themeColor?: SdkworkShellThemeColor;
  themeSelection?: SdkworkShellThemeSelection;
}

export function SdkworkShellProvider({
  children,
  defaultCommandPaletteOpen = false,
  defaultLocale,
  defaultLocalePreference = "system",
  defaultNavigationOpen = true,
  defaultThemeColor = "lobster",
  defaultThemeSelection = "system",
  dir,
  locale: localeProp,
  localePreference: localePreferenceProp,
  onLocalePreferenceChange,
  onThemeColorChange,
  onThemeSelectionChange,
  overrides,
  themeColor: themeColorProp,
  themeSelection: themeSelectionProp,
}: SdkworkShellProviderProps) {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(defaultCommandPaletteOpen);
  const [isNavigationOpen, setNavigationOpen] = useState<boolean>(defaultNavigationOpen);
  const [uncontrolledThemeColor, setUncontrolledThemeColor] = useState<SdkworkShellThemeColor>(defaultThemeColor);
  const [uncontrolledThemeSelection, setUncontrolledThemeSelection] = useState<SdkworkShellThemeSelection>(
    defaultThemeSelection,
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (
      typeof window !== "undefined"
      && typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return false;
    }

    return true;
  });
  const [uncontrolledLocalePreference, setUncontrolledLocalePreference] = useState<SdkworkShellLocalePreference>(
    normalizeSdkworkShellLocalePreference(defaultLocalePreference),
  );
  const systemLocale = useMemo(
    () => resolveDefaultSdkworkShellLocale(defaultLocale),
    [defaultLocale],
  );
  const themeColor = themeColorProp ?? uncontrolledThemeColor;
  const themeSelection = themeSelectionProp ?? uncontrolledThemeSelection;
  const localePreference = normalizeSdkworkShellLocalePreference(
    localePreferenceProp ?? uncontrolledLocalePreference,
  );
  const locale = normalizeSdkworkShellLocale(localeProp)
    ?? (localePreference === "system" ? systemLocale : localePreference);
  const resolvedDirection = resolveSdkworkShellDirection(dir, locale);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSystemPrefersDark(!event.matches);
    };

    setSystemPrefersDark(!mediaQuery.matches);
    mediaQuery.addEventListener?.("change", handleChange);
    mediaQuery.addListener?.(handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
      mediaQuery.removeListener?.(handleChange);
    };
  }, []);

  function setThemeColor(value: SdkworkShellThemeColor): void {
    if (themeColorProp === undefined) {
      setUncontrolledThemeColor(value);
    }

    onThemeColorChange?.(value);
  }

  function setThemeSelection(value: SdkworkShellThemeSelection): void {
    if (themeSelectionProp === undefined) {
      setUncontrolledThemeSelection(value);
    }

    onThemeSelectionChange?.(value);
  }

  function setLocalePreference(value: SdkworkShellLocalePreference): void {
    const normalized = normalizeSdkworkShellLocalePreference(value);
    if (localePreferenceProp === undefined) {
      setUncontrolledLocalePreference(normalized);
    }

    onLocalePreferenceChange?.(normalized);
  }

  const theme = useMemo(
    () =>
      createSdkworkShellTheme({
        ...overrides,
        prefersDarkMode: systemPrefersDark,
        themeColor,
        themeSelection,
      }),
    [overrides, systemPrefersDark, themeColor, themeSelection],
  );

  const value = useMemo(
    () => ({
      isCommandPaletteOpen,
      isNavigationOpen,
      locale,
      localePreference,
      setCommandPaletteOpen,
      setLocalePreference,
      setNavigationOpen,
      setThemeColor,
      setThemeSelection,
      theme,
      themeColor,
      themeSelection,
      toggleCommandPalette: () => setCommandPaletteOpen((open) => !open),
      toggleNavigationOpen: () => setNavigationOpen((open) => !open),
    }),
    [isCommandPaletteOpen, isNavigationOpen, locale, localePreference, theme, themeColor, themeSelection],
  );

  return (
    <SdkworkShellThemeContext.Provider value={value}>
      <SdkworkThemeProvider
        dir={resolvedDirection}
        locale={locale}
        overrides={overrides}
        themeColor={themeColor}
        themeSelection={themeSelection}
      >
        <div
          data-sdk-shell-theme=""
          data-sdk-shell-theme-color={themeColor}
          data-sdk-shell-theme-selection={themeSelection}
        >
          {children}
        </div>
      </SdkworkThemeProvider>
    </SdkworkShellThemeContext.Provider>
  );
}

export function useSdkworkShell() {
  const context = useContext(SdkworkShellThemeContext);
  if (!context) {
    throw new Error("useSdkworkShell must be used inside SdkworkShellProvider");
  }

  return context;
}

export function useSdkworkShellTheme() {
  const {
    setThemeColor,
    setThemeSelection,
    theme,
    themeColor,
    themeSelection,
  } = useSdkworkShell();

  return {
    setThemeColor,
    setThemeSelection,
    theme,
    themeColor,
    themeSelection,
  };
}

export function useSdkworkShellLocale() {
  const {
    locale,
    localePreference,
    setLocalePreference,
  } = useSdkworkShell();

  return {
    locale,
    localePreference,
    setLocalePreference,
  };
}
