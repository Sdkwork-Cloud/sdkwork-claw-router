import { createIamShardingContext, type IamAppContext, type IamDeploymentMode, type IamEnvironment, type IamShardingContext } from "@sdkwork/iam-contracts";
import { createSdkworkIamService, type IamStoredSession, type SdkworkIamService } from "@sdkwork/iam-service";
import { assertIamAppSdkClient, assertIamBackendSdkClient, type IamAppSdkClient, type IamBackendSdkClient } from "@sdkwork/iam-sdk-ports";
import { createSdkworkRuntimeBootstrap } from "@sdkwork/runtime-bootstrap";

export interface IamRuntimeConfig {
  appApiBaseUrl?: string;
  appId: string;
  backendApiBaseUrl?: string;
  deploymentMode: IamDeploymentMode;
  environment: IamEnvironment;
}

export interface IamTokenStore {
  clear(): Promise<void> | void;
  get(): Promise<IamStoredSession> | IamStoredSession;
  set(session: IamStoredSession): Promise<void> | void;
}

export interface IamContextStore {
  clear(): Promise<void> | void;
  getAppContext(): Promise<IamAppContext | undefined> | IamAppContext | undefined;
  getShardingContext(): Promise<IamShardingContext | undefined> | IamShardingContext | undefined;
  setAppContext(context: IamAppContext): Promise<void> | void;
}

export interface IamRuntime {
  config: IamRuntimeConfig;
  contextStore: IamContextStore;
  getAuthHeaders(): Promise<Record<string, string>>;
  service: SdkworkIamService;
  tokenStore: IamTokenStore;
}

export interface CreateIamRuntimeInput {
  clients: {
    app: IamAppSdkClient;
    backend?: IamBackendSdkClient;
  };
  config: IamRuntimeConfig;
  contextStore?: IamContextStore;
  localeProvider?: () => string | undefined;
  tokenStore: IamTokenStore;
}

export function createIamRuntime(input: CreateIamRuntimeInput): IamRuntime {
  const bootstrap = createSdkworkRuntimeBootstrap({
    clients: input.clients,
    config: input.config,
    localeProvider: input.localeProvider,
    tokenStore: input.tokenStore,
    validateAppClient: assertIamAppSdkClient,
    validateBackendClient: assertIamBackendSdkClient,
  });

  const contextStore = input.contextStore ?? createMemoryIamContextStore();
  const service = createSdkworkIamService({
    appClient: bootstrap.clients.app,
    backendClient: bootstrap.clients.backend,
    onSessionCleared: async () => {
      await input.tokenStore.clear();
      await contextStore.clear();
    },
    onSessionChanged: async (session) => {
      if (session.context) {
        await contextStore.setAppContext(session.context);
      }
    },
    persistSession: (session) => input.tokenStore.set(session),
  });

  return {
    config: { ...bootstrap.config },
    contextStore,
    getAuthHeaders: () => bootstrap.getRequestHeaders(),
    service,
    tokenStore: input.tokenStore,
  };
}

export function createMemoryIamTokenStore(initial: IamStoredSession = {}): IamTokenStore {
  let current = { ...initial };

  return {
    clear: () => {
      current = {};
    },
    get: () => ({ ...current }),
    set: (session) => {
      current = { ...session };
    },
  };
}

export function createMemoryIamContextStore(): IamContextStore {
  let appContext: IamAppContext | undefined;

  return {
    clear: () => {
      appContext = undefined;
    },
    getAppContext: () => appContext ? { ...appContext, dataScope: [...appContext.dataScope], permissionScope: [...appContext.permissionScope] } : undefined,
    getShardingContext: () => appContext ? createIamShardingContext(appContext) : undefined,
    setAppContext: (context) => {
      appContext = {
        ...context,
        dataScope: [...context.dataScope],
        permissionScope: [...context.permissionScope],
      };
    },
  };
}

export type { IamSession, IamStoredSession, SdkworkIamService } from "@sdkwork/iam-service";
