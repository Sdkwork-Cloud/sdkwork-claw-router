import type { ElementType } from 'react';
import { Cloud, Layout, Server, Settings } from 'lucide-react';
import type {
  ApiCategory,
  ApiCategorySidebarNode,
  ApiSchemaTabsDocument,
  ApiSystemData as ApiReferenceSystemData,
} from 'sdkwork-clawrouter-pc-api-reference/apiReferenceSchemaTabs';
import {
  buildApiCategorySidebarTree,
  buildApiReferenceSystemsFromTabs,
  loadApiReferenceSystems,
} from 'sdkwork-clawrouter-pc-api-reference/apiReferenceSchemaTabs';
import { readClawRouterRuntimeEnv } from 'sdkwork-clawrouter-pc-commons/runtime';
import { APP_API_PREFIX, BACKEND_API_PREFIX, CLOUD_API_PREFIX, SDK_SYSTEM_CONFIG } from 'sdkwork-clawrouter-pc-commons/runtime';
import type { ClawRouterGeneratedSdkMetadata, ClawRouterGeneratedSdkType } from 'sdkwork-clawrouter-pc-commons/runtime';

export type SdkReferenceSystem = 'gateway' | 'cloud-services' | 'app' | 'backend';
export type GeneratedSdkType = ClawRouterGeneratedSdkType;
export type GeneratedSdkMetadata = ClawRouterGeneratedSdkMetadata;

const GATEWAY_GENERATED_SDK_DEFAULT_BASE_URL = 'https://api.sdkwork.com';

export interface SdkReferenceSystemData extends Omit<ApiReferenceSystemData, 'id' | 'icon'> {
  id: SdkReferenceSystem;
  icon: ElementType;
}

export interface GeneratedSdkToolConfig {
  name: string;
  version: string;
  language: string;
  sdkType: GeneratedSdkType;
  outputPath: string;
  apiSpecPath: string;
  baseUrl: string;
  apiPrefix: string;
  endpointPath?: string;
  endpointMethod?: string;
  operationId?: string;
  packageName: string;
  author: string;
  license: string;
  description: string;
}

export async function loadSdkReferenceSystems(): Promise<SdkReferenceSystemData[]> {
  const systems = await loadApiReferenceSystems();
  return systems
    .filter(isSdkReferenceSystemData)
    .map((system) => ({
      ...system,
      icon: iconForSdkSystem(system.id),
    }));
}

export async function buildSdkReferenceSystems(
  manifest: ApiSchemaTabsDocument,
  fetchJson: (url: string) => Promise<unknown>,
): Promise<SdkReferenceSystemData[]> {
  const sdkManifest: ApiSchemaTabsDocument = {
    ...manifest,
    tabs: manifest.tabs.filter((tab) => isSdkReferenceSystemId(tab.id)),
  };
  const schemaUrlById = new Map(
    sdkManifest.tabs.map((tab) => [
      tab.id,
      tab.defaultSchemaUrl || tab.schemaUrls[0] || defaultSchemaUrlForSystem(tab.id),
    ]),
  );
  const systems = await buildApiReferenceSystemsFromTabs(sdkManifest, fetchJson);
  return systems
    .filter(isSdkReferenceSystemData)
    .map((system) => ({
      ...system,
      icon: iconForSdkSystem(system.id),
      schemaUrl: schemaUrlById.get(system.id) || defaultSchemaUrlForSystem(system.id),
    }));
}

export function getGeneratedSdkMetadataForSystem(system: SdkReferenceSystem): GeneratedSdkMetadata {
  return SDK_SYSTEM_CONFIG[system];
}

export function createGeneratedSdkToolConfig(
  system: SdkReferenceSystem,
  languageId: string,
  schemaUrl = defaultSchemaUrlForSystem(system),
): GeneratedSdkToolConfig {
  const sdkMetadata = getGeneratedSdkMetadataForSystem(system);
  const language = normalizeSdkReferenceLanguage(languageId);
  return {
    name: sdkMetadata.name,
    version: sdkMetadata.version,
    language,
    sdkType: sdkMetadata.sdkType,
    outputPath: './sdk',
    apiSpecPath: schemaUrl,
    baseUrl: resolveGeneratedSdkBaseUrl(system),
    apiPrefix: resolveGeneratedSdkApiPrefix(system),
    packageName: sdkMetadata.packageName,
    author: 'SDKWork',
    license: 'MIT',
    description: sdkMetadata.description,
  };
}

export function normalizeSdkReferenceLanguage(languageId: string): string {
  const normalizedLanguageId = languageId.toLowerCase();
  let language = normalizedLanguageId;
  if (language === 'node' || language === 'javascript') language = 'typescript';
  if (language === 'c#') language = 'csharp';
  return language;
}

export function isGeneratedSdkArchiveLanguage(languageId: string): boolean {
  const language = normalizeSdkReferenceLanguage(languageId);
  if (language === 'shell' || language === 'cpp') {
    return false;
  }
  return true;
}

export function buildSdkReferenceSidebarTree(categories: ApiCategory[]): ApiCategorySidebarNode[] {
  return buildApiCategorySidebarTree(categories);
}

function resolveGeneratedSdkBaseUrl(system: SdkReferenceSystem): string {
  const sdkMetadata = getGeneratedSdkMetadataForSystem(system);
  const configuredBaseUrl = readClawRouterRuntimeEnv(sdkMetadata.runtimeEnvName)
    ?? (system === 'gateway' ? readClawRouterRuntimeEnv('VITE_API_BASE_URL') : undefined);
  if (system === 'gateway') {
    return stripGatewayOpenAiVersionBaseUrl(configuredBaseUrl ?? GATEWAY_GENERATED_SDK_DEFAULT_BASE_URL);
  }
  return configuredBaseUrl ?? sdkMetadata.apiPrefix;
}

function resolveGeneratedSdkApiPrefix(system: SdkReferenceSystem): string {
  if (system === 'gateway') {
    return '';
  }
  return getGeneratedSdkMetadataForSystem(system).apiPrefix;
}

function stripGatewayOpenAiVersionBaseUrl(baseUrl: string): string {
  const normalized = baseUrl.trim().replace(/\/+$/g, '');
  if (!normalized.endsWith('/v1')) {
    return normalized;
  }
  const withoutOpenAiVersion = normalized.slice(0, -'/v1'.length);
  if (withoutOpenAiVersion) {
    return withoutOpenAiVersion;
  }
  return readBrowserOrigin() ?? GATEWAY_GENERATED_SDK_DEFAULT_BASE_URL;
}

function readBrowserOrigin(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const origin = window.location?.origin?.trim();
  if (!origin || origin === 'null') {
    return undefined;
  }
  return origin.replace(/\/+$/g, '');
}

function isSdkReferenceSystemData(system: ApiReferenceSystemData): system is ApiReferenceSystemData & { id: SdkReferenceSystem } {
  return isSdkReferenceSystemId(system.id);
}

function isSdkReferenceSystemId(system: string): system is SdkReferenceSystem {
  return system === 'gateway' || system === 'cloud-services' || system === 'app' || system === 'backend';
}

function iconForSdkSystem(system: SdkReferenceSystem): ElementType {
  if (system === 'cloud-services') return Cloud;
  if (system === 'backend') return Settings;
  if (system === 'app') return Layout;
  return Server;
}

function defaultSchemaUrlForSystem(system: string): string {
  if (system === 'backend') return `${BACKEND_API_PREFIX}/openapi.json`;
  if (system === 'app') return `${APP_API_PREFIX}/openapi.json`;
  if (system === 'cloud-services') return `${CLOUD_API_PREFIX}/openapi.json`;
  return '/openapi.json';
}
