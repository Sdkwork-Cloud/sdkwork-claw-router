import {
  SdkworkAuthOAuthCallbackPage,
  SdkworkAuthPage,
  type SdkworkAuthRuntimeConfig,
} from '@sdkwork/auth-pc-react';
import { clawRouterAuthController } from './clawRouterAuthController';
import { clawRouterTauriAuthHostReadiness } from './clawRouterTauriAuthHost';

const clawRouterAuthRuntimeConfig: SdkworkAuthRuntimeConfig = {
  leftRailMode: 'highlights-only',
  loginMethods: ['password', 'sessionBridge'],
  oauthLoginEnabled: false,
  qrLoginEnabled: false,
  recoveryMethods: [],
  registerMethods: [],
};

void clawRouterTauriAuthHostReadiness;

export function ClawRouterAuthRoutes() {
  return (
    <SdkworkAuthPage
      basePath="/auth"
      controller={clawRouterAuthController}
      homePath="/console"
      runtimeConfig={clawRouterAuthRuntimeConfig}
    />
  );
}

export function ClawRouterAuthOAuthCallbackRoute() {
  return (
    <SdkworkAuthOAuthCallbackPage
      basePath="/auth"
      controller={clawRouterAuthController}
      homePath="/console"
      runtimeConfig={clawRouterAuthRuntimeConfig}
    />
  );
}
