import { createSdkworkTheme, type CreateSdkworkThemeOptions, type SdkworkColorMode, type SdkworkTheme } from "@sdkwork/ui-pc-react/theme";
import type {
  SdkworkShellThemeColor,
  SdkworkShellThemeSelection,
} from "@sdkwork/appbase-pc-react";

export interface CreateSdkworkShellThemeOptions
  extends Omit<CreateSdkworkThemeOptions, "colorMode" | "preset"> {
  prefersDarkMode?: boolean;
  themeColor?: SdkworkShellThemeColor;
  themeSelection?: SdkworkShellThemeSelection;
}

export function resolveShellColorMode(
  themeSelection: SdkworkShellThemeSelection,
  prefersDarkMode: boolean,
): SdkworkColorMode {
  if (themeSelection === "system") {
    return prefersDarkMode ? "dark" : "light";
  }

  return themeSelection;
}

function readSystemPrefersDarkMode(): boolean {
  if (
    typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return false;
  }

  return true;
}

export function createSdkworkShellTheme({
  prefersDarkMode = readSystemPrefersDarkMode(),
  themeColor = "lobster",
  themeSelection = "system",
  ...overrides
}: CreateSdkworkShellThemeOptions = {}): SdkworkTheme {
  const colorMode = resolveShellColorMode(themeSelection, prefersDarkMode);

  return createSdkworkTheme({
    ...overrides,
    colorMode,
    themeColor,
  });
}
