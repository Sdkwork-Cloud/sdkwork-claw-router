export type SdkworkDeploymentMode = "saas" | "private" | "local" | "test";
export type SdkworkRuntimeEnvironment = "dev" | "test" | "prod" | "production";
export type SdkworkApiKind = keyof typeof SDKWORK_API_PREFIXES;

export interface SdkworkTokenSnapshot {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export interface SdkworkTokenStore {
  get(): Promise<SdkworkTokenSnapshot> | SdkworkTokenSnapshot;
}

export interface SdkworkRuntimeBootstrapConfig {
  appId: string;
  appApiBaseUrl?: string;
  backendApiBaseUrl?: string;
  deploymentMode: string;
  environment: string;
}

export interface SdkworkRuntimeClients<TAppClient, TBackendClient = undefined> {
  app: TAppClient;
  backend?: TBackendClient;
}

export interface CreateSdkworkRuntimeBootstrapInput<
  TAppClient,
  TBackendClient = undefined,
  TConfig extends SdkworkRuntimeBootstrapConfig = SdkworkRuntimeBootstrapConfig,
> {
  clients: SdkworkRuntimeClients<TAppClient, TBackendClient>;
  config: TConfig;
  localeProvider?: () => string | undefined;
  tokenStore?: SdkworkTokenStore;
  validateAppClient?: (client: TAppClient) => void;
  validateBackendClient?: (client: NonNullable<TBackendClient>) => void;
}

export interface SdkworkRuntimeBootstrap<
  TAppClient,
  TBackendClient = undefined,
  TConfig extends SdkworkRuntimeBootstrapConfig = SdkworkRuntimeBootstrapConfig,
> {
  clients: Readonly<SdkworkRuntimeClients<TAppClient, TBackendClient>>;
  config: Readonly<TConfig>;
  getRequestHeaders(): Promise<Record<string, string>>;
}

export const SDKWORK_API_PREFIXES = {
  app: "/app/v3/api",
  backend: "/backend/v3/api",
} as const;

export const SDKWORK_RUNTIME_HEADERS = {
  acceptLanguage: "Accept-Language",
  accessToken: "Access-Token",
  authorization: "Authorization",
} as const;

const AUTHORIZATION_SCHEME = "Bearer";
const FORBIDDEN_SDKWORK_API_PREFIX_PATTERN =
  /\/(?:api\/app\/v\d+(?:\/api)?|api\/backend\/v\d+(?:\/api)?|api\/v\d+\/app(?:\/api)?|api\/v\d+\/backend(?:\/api)?|app\/v[12](?:\/api)?|backend\/v[12](?:\/api)?)(?:\/)?$/u;

export function createSdkworkRuntimeBootstrap<
  TAppClient,
  TBackendClient = undefined,
  TConfig extends SdkworkRuntimeBootstrapConfig = SdkworkRuntimeBootstrapConfig,
>(
  input: CreateSdkworkRuntimeBootstrapInput<TAppClient, TBackendClient, TConfig>,
): SdkworkRuntimeBootstrap<TAppClient, TBackendClient, TConfig> {
  input.validateAppClient?.(input.clients.app);

  if (input.clients.backend !== undefined) {
    input.validateBackendClient?.(input.clients.backend as NonNullable<TBackendClient>);
  }

  return {
    clients: {
      app: input.clients.app,
      ...(input.clients.backend !== undefined ? { backend: input.clients.backend } : {}),
    },
    config: normalizeRuntimeConfig(input.config),
    getRequestHeaders: async () => {
      const token = await input.tokenStore?.get();
      const headers: Record<string, string> = {};
      const locale = input.localeProvider?.();

      if (locale) {
        headers[SDKWORK_RUNTIME_HEADERS.acceptLanguage] = locale;
      }

      if (token?.authToken) {
        headers[SDKWORK_RUNTIME_HEADERS.authorization] = `${AUTHORIZATION_SCHEME} ${token.authToken}`;
      }

      if (token?.accessToken) {
        headers[SDKWORK_RUNTIME_HEADERS.accessToken] = token.accessToken;
      }

      return headers;
    },
  };
}

export function normalizeSdkworkApiBaseUrl(baseUrl: string, apiKind: SdkworkApiKind): string {
  const prefix = SDKWORK_API_PREFIXES[apiKind];
  const oppositePrefix = apiKind === "app" ? SDKWORK_API_PREFIXES.backend : SDKWORK_API_PREFIXES.app;
  const trimmedBaseUrl = trimTrailingSlashes(baseUrl.trim());

  if (trimmedBaseUrl.endsWith(prefix)) {
    return trimmedBaseUrl;
  }

  if (trimmedBaseUrl.endsWith(oppositePrefix)) {
    throw new Error(`SDKWork ${apiKind} API base URL must not already include ${oppositePrefix}`);
  }

  if (FORBIDDEN_SDKWORK_API_PREFIX_PATTERN.test(trimmedBaseUrl)) {
    throw new Error(`SDKWork ${apiKind} API base URL contains a noncanonical SDKWork API prefix`);
  }

  return `${trimmedBaseUrl}${prefix}`;
}

function normalizeRuntimeConfig<TConfig extends SdkworkRuntimeBootstrapConfig>(config: TConfig): TConfig {
  return {
    ...config,
    ...(config.appApiBaseUrl ? { appApiBaseUrl: normalizeSdkworkApiBaseUrl(config.appApiBaseUrl, "app") } : {}),
    ...(config.backendApiBaseUrl ? { backendApiBaseUrl: normalizeSdkworkApiBaseUrl(config.backendApiBaseUrl, "backend") } : {}),
  } as TConfig;
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/u, "");
}
