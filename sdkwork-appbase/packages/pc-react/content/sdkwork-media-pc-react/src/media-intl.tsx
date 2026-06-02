import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { SdkworkMediaItemKind, SdkworkMediaPublishPosture } from "./media";
import {
  createSdkworkMediaMessages,
  normalizeSdkworkMediaLocale,
  type SdkworkMediaLocale,
  type SdkworkMediaMessages,
  type SdkworkMediaMessagesOverrides,
} from "./media-copy";

export interface SdkworkMediaIntlValue {
  copy: SdkworkMediaMessages;
  formatInteger: (value: number) => string;
  formatKindLabel: (value: SdkworkMediaItemKind) => string;
  formatPublishPostureLabel: (value: SdkworkMediaPublishPosture | "all") => string;
  locale: SdkworkMediaLocale;
}

export interface SdkworkMediaIntlProviderProps extends PropsWithChildren {
  locale?: string | null;
  messages?: SdkworkMediaMessagesOverrides;
}

function createSdkworkMediaIntlValue(
  locale?: string | null,
  overrides?: SdkworkMediaMessagesOverrides,
): SdkworkMediaIntlValue {
  const resolvedLocale = normalizeSdkworkMediaLocale(locale);
  const copy = createSdkworkMediaMessages(resolvedLocale, overrides);
  const numberFormatter = new Intl.NumberFormat(resolvedLocale);

  return {
    copy,
    formatInteger(value) {
      return numberFormatter.format(value);
    },
    formatKindLabel(value) {
      return copy.kind[value];
    },
    formatPublishPostureLabel(value) {
      return copy.publishPosture[value];
    },
    locale: resolvedLocale,
  };
}

const DEFAULT_SDKWORK_MEDIA_INTL = createSdkworkMediaIntlValue();

const SdkworkMediaIntlContext = createContext<SdkworkMediaIntlValue>(
  DEFAULT_SDKWORK_MEDIA_INTL,
);

export function SdkworkMediaIntlProvider({
  children,
  locale,
  messages,
}: SdkworkMediaIntlProviderProps) {
  const value = useMemo(
    () => createSdkworkMediaIntlValue(locale, messages),
    [locale, messages],
  );

  return (
    <SdkworkMediaIntlContext.Provider value={value}>
      {children}
    </SdkworkMediaIntlContext.Provider>
  );
}

export function useSdkworkMediaIntl(): SdkworkMediaIntlValue {
  return useContext(SdkworkMediaIntlContext);
}
