import type { AdminAuthSettingsUpdateRequest } from '@sdkwork/clawrouter-backend-sdk';
import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  getClawRouterBackendSdkClient,
  readApiRecord,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export async function fetchClawRouterAuthRuntimeSettings(): Promise<ApiRecord> {
  const result = await getClawRouterAppSdkClient().auth.runtimeSettings.retrieve();
  ensurePlusApiSuccess(result, 'Unable to load Claw Router auth runtime settings');
  return readApiRecord(result);
}

export async function fetchClawRouterAuthSettings(): Promise<ApiRecord> {
  const result = await getClawRouterBackendSdkClient().system.auth.settings.retrieve();
  ensurePlusApiSuccess(result, 'Unable to load Claw Router auth settings');
  return readApiRecord(result);
}

export async function updateClawRouterAuthSettings(
  input: AdminAuthSettingsUpdateRequest,
): Promise<ApiRecord> {
  const result = await getClawRouterBackendSdkClient().system.auth.settings.update(input, {
    xRequestId: createRequestToken('auth-settings-update'),
  });
  ensurePlusApiSuccess(result, 'Unable to update Claw Router auth settings');
  return readApiRecord(result);
}
