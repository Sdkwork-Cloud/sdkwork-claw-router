import type { AdminAuthSettingsUpdateRequest } from '@sdkwork/clawrouter-backend-sdk';
import {
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  getClawRouterBackendSdkClient,
  readApiRecord,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export async function fetchClawRouterAuthRuntimeSettings(): Promise<ApiRecord> {
  const result = await getClawRouterAppSdkClient().system.iam.runtime.retrieve();
  ensureSdkworkApiSuccess(result, 'Unable to load Claw Router auth runtime settings');
  return readApiRecord(result);
}

export async function fetchClawRouterAuthVerificationPolicy(): Promise<ApiRecord> {
  const result = await getClawRouterAppSdkClient().system.iam.verificationPolicy.retrieve();
  ensureSdkworkApiSuccess(result, 'Unable to load Claw Router auth verification policy');
  return readApiRecord(result);
}

export async function fetchClawRouterAuthSettings(): Promise<ApiRecord> {
  const result = await getClawRouterBackendSdkClient().system.auth.settings.retrieve();
  ensureSdkworkApiSuccess(result, 'Unable to load Claw Router auth settings');
  return readApiRecord(result);
}

export async function updateClawRouterAuthSettings(
  input: AdminAuthSettingsUpdateRequest,
): Promise<ApiRecord> {
  const result = await getClawRouterBackendSdkClient().system.auth.settings.update(input);
  ensureSdkworkApiSuccess(result, 'Unable to update Claw Router auth settings');
  return readApiRecord(result);
}
