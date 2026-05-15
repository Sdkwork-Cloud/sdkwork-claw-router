import {
  SdkworkIamAuthRoutes,
  type SdkworkAuthRuntimeConfig,
} from '@sdkwork/auth-pc-react';
import { useTranslation } from 'react-i18next';
import { getClawRouterIamRuntime } from 'sdkwork-claw-router-commons/runtime';
import { clawRouterTauriAuthHostReadiness } from './clawRouterTauriAuthHost';

const AUTH_METHOD_UNAVAILABLE_MESSAGE = 'This Claw Router auth method is not available in the current app contract.';

const clawRouterAuthRuntimeConfig: SdkworkAuthRuntimeConfig = {
  leftRailMode: 'qr-only',
  loginMethods: ['password', 'emailCode', 'phoneCode', 'sessionBridge'],
  oauthLoginEnabled: true,
  oauthProviders: ['wechat', 'alipay', 'douyin'],
  qrLoginEnabled: true,
  recoveryMethods: ['email', 'phone'],
  registerMethods: ['email', 'phone'],
};

void clawRouterTauriAuthHostReadiness;

export function ClawRouterAuthRoutes() {
  const { i18n } = useTranslation();

  return (
    <SdkworkIamAuthRoutes
      basePath="/auth"
      getRuntime={getClawRouterIamRuntime}
      homePath="/console"
      locale={i18n.language}
      methodUnavailableMessage={AUTH_METHOD_UNAVAILABLE_MESSAGE}
      runtimeConfig={clawRouterAuthRuntimeConfig}
    />
  );
}
