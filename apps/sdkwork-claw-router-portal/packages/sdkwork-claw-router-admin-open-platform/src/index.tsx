import { useMemo } from "react";
import {
  SdkworkOpenPlatformAdminPage,
  createSdkworkOpenPlatformAdminController,
} from "@sdkwork/open-platform-admin-pc-react";
import { createClawRouterOpenPlatformAdminService } from "./openPlatformAdminService";

export function OpenPlatformAdmin() {
  const controller = useMemo(() => {
    const service = createClawRouterOpenPlatformAdminService();
    return createSdkworkOpenPlatformAdminController({ service });
  }, []);

  return <SdkworkOpenPlatformAdminPage controller={controller} />;
}
