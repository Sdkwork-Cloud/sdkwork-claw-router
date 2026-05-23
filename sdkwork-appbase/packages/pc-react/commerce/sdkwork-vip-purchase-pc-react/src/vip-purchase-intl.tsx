import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import {
  createSdkworkVipPurchaseMessages,
  formatSdkworkVipPurchasePaymentMethod,
  normalizeSdkworkVipPurchaseLocale,
  type SdkworkVipPurchaseMessages,
  type SdkworkVipPurchaseMessagesOverrides,
} from "./vip-purchase-copy";

export interface SdkworkVipPurchaseIntlValue {
  copy: SdkworkVipPurchaseMessages;
  formatPaymentMethod: (method: "ALIPAY" | "WECHAT") => string;
  locale: string;
}

export interface SdkworkVipPurchaseIntlProviderProps extends PropsWithChildren {
  locale?: string | null;
  messages?: SdkworkVipPurchaseMessagesOverrides;
}

function createSdkworkVipPurchaseIntlValue(
  locale?: string | null,
  overrides?: SdkworkVipPurchaseMessagesOverrides,
): SdkworkVipPurchaseIntlValue {
  const resolvedLocale = normalizeSdkworkVipPurchaseLocale(locale);
  const copy = createSdkworkVipPurchaseMessages(resolvedLocale, overrides);

  return {
    copy,
    formatPaymentMethod(method) {
      return formatSdkworkVipPurchasePaymentMethod(method, resolvedLocale, overrides);
    },
    locale: resolvedLocale,
  };
}

const DEFAULT_SDKWORK_VIP_PURCHASE_INTL = createSdkworkVipPurchaseIntlValue();
const SdkworkVipPurchaseIntlContext = createContext<SdkworkVipPurchaseIntlValue>(
  DEFAULT_SDKWORK_VIP_PURCHASE_INTL,
);

export function SdkworkVipPurchaseIntlProvider({
  children,
  locale,
  messages,
}: SdkworkVipPurchaseIntlProviderProps) {
  const value = useMemo(
    () => createSdkworkVipPurchaseIntlValue(locale, messages),
    [locale, messages],
  );

  return (
    <SdkworkVipPurchaseIntlContext.Provider value={value}>
      {children}
    </SdkworkVipPurchaseIntlContext.Provider>
  );
}

export function useSdkworkVipPurchaseIntl(): SdkworkVipPurchaseIntlValue {
  return useContext(SdkworkVipPurchaseIntlContext);
}
