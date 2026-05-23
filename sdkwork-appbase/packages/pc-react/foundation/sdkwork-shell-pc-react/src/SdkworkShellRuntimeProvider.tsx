import { useEffect, type PropsWithChildren } from "react";
import {
  persistPcReactShellPreferences,
  usePcReactResolvedShellPreferences,
  type PcReactLocalePreference,
  type PcReactResolvedShellPreferences,
  type PcReactThemeColor,
  type PcReactThemeSelection,
} from "@sdkwork/core-pc-react";
import type { SdkworkShellProviderProps } from "./SdkworkShellProvider";
import { SdkworkShellProvider } from "./SdkworkShellProvider";

export interface SdkworkShellRuntimeProviderProps
  extends PropsWithChildren,
    Omit<
      SdkworkShellProviderProps,
      | "locale"
      | "localePreference"
      | "themeColor"
      | "themeSelection"
      | "onLocalePreferenceChange"
      | "onThemeColorChange"
      | "onThemeSelectionChange"
    > {
  onLocalePreferenceChange?: (value: PcReactLocalePreference) => void;
  onShellPreferencesChange?: (value: PcReactResolvedShellPreferences) => void;
  onThemeColorChange?: (value: PcReactThemeColor) => void;
  onThemeSelectionChange?: (value: PcReactThemeSelection) => void;
}

export function SdkworkShellRuntimeProvider({
  children,
  onLocalePreferenceChange,
  onShellPreferencesChange,
  onThemeColorChange,
  onThemeSelectionChange,
  ...props
}: SdkworkShellRuntimeProviderProps) {
  const preferences = usePcReactResolvedShellPreferences();

  useEffect(() => {
    onShellPreferencesChange?.(preferences);
  }, [
    onShellPreferencesChange,
    preferences.colorMode,
    preferences.locale,
    preferences.localePreference,
    preferences.themeColor,
    preferences.themeSelection,
  ]);

  return (
    <SdkworkShellProvider
      {...props}
      locale={preferences.locale}
      localePreference={preferences.localePreference}
      onLocalePreferenceChange={(value) => {
        persistPcReactShellPreferences({
          localePreference: value,
        });
        onLocalePreferenceChange?.(value);
      }}
      onThemeColorChange={(value) => {
        persistPcReactShellPreferences({
          themeColor: value,
        });
        onThemeColorChange?.(value);
      }}
      onThemeSelectionChange={(value) => {
        persistPcReactShellPreferences({
          themeSelection: value,
        });
        onThemeSelectionChange?.(value);
      }}
      themeColor={preferences.themeColor}
      themeSelection={preferences.themeSelection}
    >
      {children}
    </SdkworkShellProvider>
  );
}
