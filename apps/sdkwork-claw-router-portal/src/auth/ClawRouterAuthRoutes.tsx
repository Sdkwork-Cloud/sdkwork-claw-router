import {
  SdkworkIamAuthRoutes,
} from '@sdkwork/auth-pc-react';
import { useTranslation } from 'react-i18next';
import { getClawRouterIamRuntime } from 'sdkwork-claw-router-commons/runtime';
import { useClawRouterAuthRuntimeConfig } from './clawRouterAuthConfig';
import { clawRouterTauriAuthHostReadiness } from './clawRouterTauriAuthHost';

const AUTH_METHOD_UNAVAILABLE_MESSAGE = 'This Claw Router sign-in method is temporarily unavailable.';

void clawRouterTauriAuthHostReadiness;

export function ClawRouterAuthRoutes() {
  const { i18n } = useTranslation();
  const runtimeConfig = useClawRouterAuthRuntimeConfig();

  return (
    <SdkworkIamAuthRoutes
      basePath="/auth"
      getRuntime={getClawRouterIamRuntime}
      homePath="/console"
      locale={i18n.language}
      methodUnavailableMessage={AUTH_METHOD_UNAVAILABLE_MESSAGE}
      runtimeConfig={runtimeConfig}
    />
  );
}
