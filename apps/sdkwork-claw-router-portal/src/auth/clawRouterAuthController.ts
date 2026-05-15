import { createSdkworkIamRuntimeAuthController } from '@sdkwork/auth-pc-react';
import { getClawRouterIamRuntime } from 'sdkwork-claw-router-commons/runtime';

const AUTH_METHOD_UNAVAILABLE_MESSAGE = 'This Claw Router auth method is not available in the current app contract.';

export const clawRouterAuthController = createSdkworkIamRuntimeAuthController({
  getRuntime: getClawRouterIamRuntime,
  methodUnavailableMessage: AUTH_METHOD_UNAVAILABLE_MESSAGE,
});

export type ClawRouterAuthController = typeof clawRouterAuthController;
