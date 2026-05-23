import {
  createSdkworkOpenPlatformAdminService,
  type SdkworkOpenPlatformAdminAccountInput,
  type SdkworkOpenPlatformAdminAccountUpdateInput,
  type SdkworkOpenPlatformAdminBackendClient,
  type SdkworkOpenPlatformAdminEntryInput,
  type SdkworkOpenPlatformAdminEntryUpdateInput,
  type SdkworkOpenPlatformAdminPayBindingInput,
  type SdkworkOpenPlatformAdminService,
} from "@sdkwork/open-platform-admin-pc-react";
import { getClawRouterBackendSdkClient } from "sdkwork-claw-router-commons/sdk-clients";

type BackendOpenPlatform = ReturnType<typeof getClawRouterBackendSdkClient>["openPlatform"];

export function createClawRouterOpenPlatformAdminService(): SdkworkOpenPlatformAdminService {
  return createSdkworkOpenPlatformAdminService({
    backendClient: createClawRouterOpenPlatformBackendClient(),
  });
}

function createClawRouterOpenPlatformBackendClient(): SdkworkOpenPlatformAdminBackendClient {
  return {
    openPlatform: {
      providers: {
        list: (params?: Parameters<BackendOpenPlatform["providers"]["list"]>[0]) =>
          getClawRouterBackendSdkClient().openPlatform.providers.list(params),
      },
      manifests: {
        list: (params?: Parameters<BackendOpenPlatform["manifests"]["list"]>[0]) =>
          getClawRouterBackendSdkClient().openPlatform.manifests.list(params),
      },
      accounts: {
        list: (params?: Parameters<BackendOpenPlatform["accounts"]["list"]>[0]) =>
          getClawRouterBackendSdkClient().openPlatform.accounts.list(params),
        create: (input: SdkworkOpenPlatformAdminAccountInput) =>
          getClawRouterBackendSdkClient().openPlatform.accounts.create(input),
        retrieve: (accountId: string) =>
          getClawRouterBackendSdkClient().openPlatform.accounts.retrieve(accountId),
        update: (accountId: string, input: SdkworkOpenPlatformAdminAccountUpdateInput) =>
          getClawRouterBackendSdkClient().openPlatform.accounts.update(accountId, input),
        delete: (accountId: string) =>
          getClawRouterBackendSdkClient().openPlatform.accounts.delete(accountId),
        entries: {
          list: (accountId: string) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.entries.list(accountId),
          create: (accountId: string, input: SdkworkOpenPlatformAdminEntryInput) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.entries.create(accountId, input),
          update: (accountId: string, entryId: string, input: SdkworkOpenPlatformAdminEntryUpdateInput) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.entries.update(accountId, entryId, input),
          delete: (accountId: string, entryId: string) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.entries.delete(accountId, entryId),
        },
        payBindings: {
          list: (accountId: string) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.list(accountId),
          create: (accountId: string, input: SdkworkOpenPlatformAdminPayBindingInput) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.create(accountId, input),
          delete: (accountId: string, bindingId: string) =>
            getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.delete(accountId, bindingId),
        },
      },
    },
  };
}

export async function listOpenPlatformProviders(params?: Parameters<BackendOpenPlatform["providers"]["list"]>[0]) {
  return getClawRouterBackendSdkClient().openPlatform.providers.list(params);
}

export async function listOpenPlatformManifests(params?: Parameters<BackendOpenPlatform["manifests"]["list"]>[0]) {
  return getClawRouterBackendSdkClient().openPlatform.manifests.list(params);
}

export async function listOpenPlatformAccounts(params?: Parameters<BackendOpenPlatform["accounts"]["list"]>[0]) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.list(params);
}

export async function createOpenPlatformAccount(input: SdkworkOpenPlatformAdminAccountInput) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.create(input);
}

export async function retrieveOpenPlatformAccount(accountId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.retrieve(accountId);
}

export async function updateOpenPlatformAccount(
  accountId: string,
  input: SdkworkOpenPlatformAdminAccountUpdateInput,
) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.update(accountId, input);
}

export async function deleteOpenPlatformAccount(accountId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.delete(accountId);
}

export async function listOpenPlatformAccountEntries(accountId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.entries.list(accountId);
}

export async function createOpenPlatformAccountEntry(
  accountId: string,
  input: SdkworkOpenPlatformAdminEntryInput,
) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.entries.create(accountId, input);
}

export async function updateOpenPlatformAccountEntry(
  accountId: string,
  entryId: string,
  input: SdkworkOpenPlatformAdminEntryUpdateInput,
) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.entries.update(accountId, entryId, input);
}

export async function deleteOpenPlatformAccountEntry(accountId: string, entryId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.entries.delete(accountId, entryId);
}

export async function listOpenPlatformAccountPayBindings(accountId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.list(accountId);
}

export async function createOpenPlatformAccountPayBinding(
  accountId: string,
  input: SdkworkOpenPlatformAdminPayBindingInput,
) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.create(accountId, input);
}

export async function deleteOpenPlatformAccountPayBinding(accountId: string, bindingId: string) {
  return getClawRouterBackendSdkClient().openPlatform.accounts.payBindings.delete(accountId, bindingId);
}
