import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { Crown } from "lucide-react";
import {
  createSdkworkVipToneStyle,
  useSdkworkVipController,
  useSdkworkVipControllerState,
  type SdkworkVipController,
} from "@sdkwork/vip-pc-react";
import type { SdkworkVipPurchaseMessagesOverrides } from "../vip-purchase-copy";
import {
  SdkworkVipPurchaseIntlProvider,
  useSdkworkVipPurchaseIntl,
} from "../vip-purchase-intl";
import type { SdkworkVipPurchaseService } from "../vip-purchase-service";
import { SdkworkVipPurchaseMenu } from "./vip-purchase-menu";

export interface SdkworkVipPurchaseHeaderEntryProps {
  controller?: SdkworkVipController;
  locale?: string | null;
  messages?: SdkworkVipPurchaseMessagesOverrides;
  onOpenCenter?: () => void;
  purchaseService?: Pick<SdkworkVipPurchaseService, "submitPackagePurchase">;
}

function SdkworkVipPurchaseHeaderEntryContent({
  controller: controllerProp,
  onOpenCenter,
  purchaseService,
}: Omit<SdkworkVipPurchaseHeaderEntryProps, "locale" | "messages">) {
  const controller = useSdkworkVipController(controllerProp);
  const state = useSdkworkVipControllerState(controller);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { copy } = useSdkworkVipPurchaseIntl();
  const label = state.dashboard.summary.isAuthenticated && state.dashboard.summary.currentLevelName
    ? state.dashboard.summary.currentLevelName
    : copy.header.title;

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="relative flex items-center">
      <button
        aria-label={copy.header.ariaLabel}
        className="inline-flex h-9 items-center gap-2 rounded-[1rem] border px-3 text-sm font-medium"
        onClick={() => setIsMenuOpen((current) => !current)}
        style={createSdkworkVipToneStyle("accent", {
          backgroundWeight: 12,
          borderWeight: 24,
        })}
        type="button"
      >
        <Crown className="h-4 w-4" />
        {label}
      </button>

      {isMenuOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50">
          <Suspense fallback={null}>
            <SdkworkVipPurchaseMenu
              controller={controller}
              onOpenCenter={onOpenCenter
                ? () => {
                  setIsMenuOpen(false);
                  onOpenCenter();
                }
                : undefined}
              onPurchased={() => {
                setIsMenuOpen(false);
              }}
              purchaseService={purchaseService}
            />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}

export function SdkworkVipPurchaseHeaderEntry({
  locale,
  messages,
  ...props
}: SdkworkVipPurchaseHeaderEntryProps) {
  const content = <SdkworkVipPurchaseHeaderEntryContent {...props} />;

  if (locale || messages) {
    return (
      <SdkworkVipPurchaseIntlProvider locale={locale} messages={messages}>
        {content}
      </SdkworkVipPurchaseIntlProvider>
    );
  }

  return content;
}
