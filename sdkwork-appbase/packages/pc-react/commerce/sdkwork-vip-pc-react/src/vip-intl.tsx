import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  createSdkworkVipMessages,
  formatSdkworkVipDurationLabel,
  formatSdkworkVipIncludedPointsLabel,
  formatSdkworkVipPriceWasLabel,
  formatSdkworkVipStatusLabel,
  formatSdkworkVipUsageLabel,
  normalizeSdkworkVipLocale,
  type SdkworkVipMessages,
  type SdkworkVipMessagesOverrides,
} from "./vip-copy";

export interface SdkworkVipIntlValue {
  copy: SdkworkVipMessages;
  formatDuration: (value: number | null) => string;
  formatIncludedPoints: (value: number) => string;
  formatPriceWas: (value: string) => string;
  formatStatus: (value: "free" | "guest" | "vip") => string;
  formatUsage: (used: number | null, limit: number | null) => string;
  locale: string;
}

export interface SdkworkVipIntlProviderProps extends PropsWithChildren {
  locale?: string | null;
  messages?: SdkworkVipMessagesOverrides;
}

function createSdkworkVipIntlValue(
  locale?: string | null,
  overrides?: SdkworkVipMessagesOverrides,
): SdkworkVipIntlValue {
  const resolvedLocale = normalizeSdkworkVipLocale(locale);
  const copy = createSdkworkVipMessages(resolvedLocale, overrides);

  return {
    copy,
    formatDuration(value) {
      return formatSdkworkVipDurationLabel(value, resolvedLocale, overrides);
    },
    formatIncludedPoints(value) {
      return formatSdkworkVipIncludedPointsLabel(value, resolvedLocale);
    },
    formatPriceWas(value) {
      return formatSdkworkVipPriceWasLabel(value, resolvedLocale, overrides);
    },
    formatStatus(value) {
      return formatSdkworkVipStatusLabel(value, resolvedLocale, overrides);
    },
    formatUsage(used, limit) {
      return formatSdkworkVipUsageLabel(used, limit, resolvedLocale, overrides);
    },
    locale: resolvedLocale,
  };
}

const DEFAULT_SDKWORK_VIP_INTL = createSdkworkVipIntlValue();

const SdkworkVipIntlContext = createContext<SdkworkVipIntlValue>(
  DEFAULT_SDKWORK_VIP_INTL,
);

export function SdkworkVipIntlProvider({
  children,
  locale,
  messages,
}: SdkworkVipIntlProviderProps) {
  const value = useMemo(
    () => createSdkworkVipIntlValue(locale, messages),
    [locale, messages],
  );

  return (
    <SdkworkVipIntlContext.Provider value={value}>
      {children}
    </SdkworkVipIntlContext.Provider>
  );
}

export function useSdkworkVipIntl(): SdkworkVipIntlValue {
  return useContext(SdkworkVipIntlContext);
}
