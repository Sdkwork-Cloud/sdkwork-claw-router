import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createDefaultSdkworkAssetCollections,
  createEmptySdkworkAssetsWorkspace,
  type SdkworkAsset,
  type SdkworkAssetCollection,
  type SdkworkAssetsWorkspaceData,
} from "./assets";

export interface CreateSdkworkAssetsServiceOptions {
  assets?: readonly SdkworkAsset[];
  collections?: readonly SdkworkAssetCollection[];
  getSessionTokens?: () => { authToken?: string };
  listAssets?: () => Promise<readonly SdkworkAsset[]>;
}

export interface SdkworkAssetsService {
  getEmptyWorkspace(): SdkworkAssetsWorkspaceData;
  getWorkspace(): Promise<SdkworkAssetsWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function createSdkworkAssetsService(
  options: CreateSdkworkAssetsServiceOptions = {},
): SdkworkAssetsService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkAssetsWorkspace({
        assets: options.assets,
        collections: options.collections ?? createDefaultSdkworkAssetCollections(),
        isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
      });
    },

    async getWorkspace() {
      try {
        const assets = options.listAssets ? await options.listAssets() : options.assets;
        return createEmptySdkworkAssetsWorkspace({
          assets,
          collections: options.collections ?? createDefaultSdkworkAssetCollections(),
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        });
      } catch {
        return createEmptySdkworkAssetsWorkspace({
          assets: options.assets,
          collections: options.collections ?? createDefaultSdkworkAssetCollections(),
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
        });
      }
    },
  };
}

export const sdkworkAssetsService = createSdkworkAssetsService();
