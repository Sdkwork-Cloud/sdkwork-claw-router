import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkDeviceCatalog,
  type SdkworkDeviceCatalogData,
  type SdkworkManagedDevice,
} from "./device";

export interface GetSdkworkDeviceCatalogInput {
  deviceId?: string | null;
}

export interface CreateSdkworkDeviceServiceOptions {
  devices?: readonly SdkworkManagedDevice[];
  getSessionTokens?: () => {
    authToken?: string;
  };
}

export interface SdkworkDeviceService {
  getCatalog(input?: GetSdkworkDeviceCatalogInput): Promise<SdkworkDeviceCatalogData>;
  getEmptyCatalog(input?: GetSdkworkDeviceCatalogInput): SdkworkDeviceCatalogData;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkDeviceService(
  options: CreateSdkworkDeviceServiceOptions = {},
): SdkworkDeviceService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    async getCatalog(input = {}) {
      return createEmptySdkworkDeviceCatalog({
        devices: options.devices,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        selectedDeviceId: input.deviceId ?? null,
      });
    },

    getEmptyCatalog(input = {}) {
      return createEmptySdkworkDeviceCatalog({
        devices: options.devices,
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        selectedDeviceId: input.deviceId ?? null,
      });
    },
  };
}

export const sdkworkDeviceService = createSdkworkDeviceService();
