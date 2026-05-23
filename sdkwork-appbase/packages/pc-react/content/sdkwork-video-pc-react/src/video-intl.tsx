import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { SdkworkVideoJobStatus } from "./video";
import {
  createSdkworkVideoMessages,
  normalizeSdkworkVideoLocale,
  type SdkworkVideoLocale,
  type SdkworkVideoMessages,
  type SdkworkVideoMessagesOverrides,
} from "./video-copy";

export interface SdkworkVideoIntlValue {
  copy: SdkworkVideoMessages;
  formatInteger: (value: number) => string;
  formatSceneCount: (value: number) => string;
  formatStatusLabel: (value: SdkworkVideoJobStatus | "all") => string;
  locale: SdkworkVideoLocale;
}

export interface SdkworkVideoIntlProviderProps extends PropsWithChildren {
  locale?: string | null;
  messages?: SdkworkVideoMessagesOverrides;
}

function createSdkworkVideoIntlValue(
  locale?: string | null,
  overrides?: SdkworkVideoMessagesOverrides,
): SdkworkVideoIntlValue {
  const resolvedLocale = normalizeSdkworkVideoLocale(locale);
  const copy = createSdkworkVideoMessages(resolvedLocale, overrides);
  const numberFormatter = new Intl.NumberFormat(resolvedLocale);

  return {
    copy,
    formatInteger(value) {
      return numberFormatter.format(value);
    },
    formatSceneCount(value) {
      const noun = Math.abs(value) === 1
        ? copy.gallery.sceneSingular
        : copy.gallery.scenePlural;

      return `${numberFormatter.format(value)} ${noun}`;
    },
    formatStatusLabel(value) {
      return copy.status[value];
    },
    locale: resolvedLocale,
  };
}

const DEFAULT_SDKWORK_VIDEO_INTL = createSdkworkVideoIntlValue();

const SdkworkVideoIntlContext = createContext<SdkworkVideoIntlValue>(
  DEFAULT_SDKWORK_VIDEO_INTL,
);

export function SdkworkVideoIntlProvider({
  children,
  locale,
  messages,
}: SdkworkVideoIntlProviderProps) {
  const value = useMemo(
    () => createSdkworkVideoIntlValue(locale, messages),
    [locale, messages],
  );

  return (
    <SdkworkVideoIntlContext.Provider value={value}>
      {children}
    </SdkworkVideoIntlContext.Provider>
  );
}

export function useSdkworkVideoIntl(): SdkworkVideoIntlValue {
  return useContext(SdkworkVideoIntlContext);
}
