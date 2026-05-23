export type SdkworkShellLocaleDirection = "auto" | "ltr" | "rtl";
export type SdkworkShellLocalePreference = string | "system";

const RTL_LANGUAGE_PREFIXES = [
  "ar",
  "dv",
  "fa",
  "ha",
  "he",
  "iw",
  "ji",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
] as const;

export function normalizeSdkworkShellLocale(value: string | null | undefined): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
}

export function normalizeSdkworkShellLocalePreference(
  value: string | null | undefined,
): SdkworkShellLocalePreference {
  const normalized = normalizeSdkworkShellLocale(value);
  if (!normalized) {
    return "system";
  }

  return normalized.toLowerCase() === "system" ? "system" : normalized;
}

export function resolveDefaultSdkworkShellLocale(
  fallbackLocale?: string | null,
): string {
  const fallback = normalizeSdkworkShellLocale(fallbackLocale);
  if (fallback) {
    return fallback;
  }

  if (typeof document !== "undefined") {
    const documentLocale = normalizeSdkworkShellLocale(document.documentElement.lang);
    if (documentLocale) {
      return documentLocale;
    }
  }

  if (typeof navigator !== "undefined") {
    const navigatorLocale = normalizeSdkworkShellLocale(navigator.language);
    if (navigatorLocale) {
      return navigatorLocale;
    }
  }

  return "en-US";
}

export function resolveSdkworkShellLocaleDirection(
  locale: string | null | undefined,
): Exclude<SdkworkShellLocaleDirection, "auto"> {
  const normalized = normalizeSdkworkShellLocale(locale)?.toLowerCase() ?? "";
  const languageCode = normalized.split(/[-_]/)[0] ?? "";

  return RTL_LANGUAGE_PREFIXES.includes(languageCode as (typeof RTL_LANGUAGE_PREFIXES)[number])
    ? "rtl"
    : "ltr";
}

export function resolveSdkworkShellDirection(
  direction: SdkworkShellLocaleDirection | undefined,
  locale: string | null | undefined,
): Exclude<SdkworkShellLocaleDirection, "auto"> {
  if (direction === "ltr" || direction === "rtl") {
    return direction;
  }

  return resolveSdkworkShellLocaleDirection(locale);
}
