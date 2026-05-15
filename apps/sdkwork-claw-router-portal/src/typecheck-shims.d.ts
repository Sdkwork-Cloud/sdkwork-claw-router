declare module '@sdkwork/iam-service' {
  export interface IamStoredSession {
    accessToken?: string;
    authToken?: string;
    refreshToken?: string;
  }
}

declare module '@sdkwork/iam-runtime' {
  import type { IamStoredSession } from '@sdkwork/iam-service';

  export interface IamRuntimeConfig {
    appId: string;
    deploymentMode: 'local' | 'private' | 'saas';
    environment: 'dev' | 'prod' | 'test';
  }

  export interface IamTokenStore {
    clear(): Promise<void> | void;
    get(): Promise<IamStoredSession> | IamStoredSession;
    set(session: IamStoredSession): Promise<void> | void;
  }

  export interface IamRuntime {
    config: IamRuntimeConfig;
    getAuthHeaders(): Promise<Record<string, string>>;
    tokenStore: IamTokenStore;
    service: unknown;
  }

  export interface CreateIamRuntimeInput {
    clients: {
      app: unknown;
      backend?: unknown;
    };
    config: IamRuntimeConfig;
    tokenStore: IamTokenStore;
  }

  export function createIamRuntime(input: CreateIamRuntimeInput): IamRuntime;
}

declare module '@sdkwork/generation-pc-react' {
  export type SdkworkGenerationStatus = 'completed' | 'failed' | 'queued' | 'running';

  export interface SdkworkGenerationRun {
    id: string;
    latencyMs: number;
    model: string;
    promptPreview: string;
    status: SdkworkGenerationStatus;
    title: string;
    tokensUsed: number;
    updatedAt: string;
  }

  export interface SdkworkGenerationDigest {
    completedRuns: number;
    failedRuns: number;
    runningRuns: number;
    totalRuns: number;
    totalTokensUsed: number;
  }

  export interface SdkworkGenerationWorkspaceData {
    digest: SdkworkGenerationDigest;
    isAuthenticated: boolean;
    runs: SdkworkGenerationRun[];
  }

  export interface CreateSdkworkGenerationServiceOptions {
    getSessionTokens?: () => {
      authToken?: string;
    };
    listRuns?: () => Promise<readonly SdkworkGenerationRun[]>;
    runs?: readonly SdkworkGenerationRun[];
  }

  export interface SdkworkGenerationService {
    getEmptyWorkspace(): SdkworkGenerationWorkspaceData;
    getWorkspace(): Promise<SdkworkGenerationWorkspaceData>;
  }

  export function createSdkworkGenerationService(
    options?: CreateSdkworkGenerationServiceOptions,
  ): SdkworkGenerationService;
}

declare module '@sdkwork/auth-pc-react' {
  import type { CSSProperties, ReactNode } from 'react';

  export type SdkworkAuthLoginMethod = 'emailCode' | 'password' | 'phoneCode' | 'sessionBridge';
  export type SdkworkAuthRegisterMethod = 'email' | 'phone';
  export type SdkworkAuthRecoveryMethod = 'email' | 'phone';
  export type SdkworkAuthLeftRailMode = 'auto' | 'highlights-only' | 'qr-only';
  export type SdkworkAuthOAuthProviderRegion = 'mainland' | 'overseas';

  export interface SdkworkAuthDevelopmentPrefillConfig {
    account?: string;
    email?: string;
    enabled?: boolean;
    loginMethod?: SdkworkAuthLoginMethod;
    password?: string;
    phone?: string;
    verificationCode?: string;
    verificationCodeBypassEnabled?: boolean;
  }

  export interface SdkworkAuthVerificationPolicyConfig {
    emailCodeLoginEnabled?: boolean;
    emailRegistrationVerificationRequired?: boolean;
    phoneCodeLoginEnabled?: boolean;
    phoneRegistrationVerificationRequired?: boolean;
  }

  export interface SdkworkAuthRuntimeConfig {
    developmentPrefill?: SdkworkAuthDevelopmentPrefillConfig;
    leftRailMode?: SdkworkAuthLeftRailMode;
    loginMethods?: SdkworkAuthLoginMethod[];
    oauthLoginEnabled?: boolean;
    oauthProviderRegion?: SdkworkAuthOAuthProviderRegion;
    oauthProviders?: string[];
    qrLoginEnabled?: boolean;
    recoveryMethods?: SdkworkAuthRecoveryMethod[];
    registerMethods?: SdkworkAuthRegisterMethod[];
    verificationPolicy?: SdkworkAuthVerificationPolicyConfig;
  }

  export interface SdkworkIamRuntimeAuthRuntimeLike {
    service: unknown;
    tokenStore?: unknown;
  }

  export interface CreateSdkworkIamRuntimeAuthControllerOptions {
    getRuntime: () => Promise<SdkworkIamRuntimeAuthRuntimeLike> | SdkworkIamRuntimeAuthRuntimeLike;
    methodUnavailableMessage?: string;
  }

  export interface SdkworkIamAuthRoutesProps {
    basePath?: string;
    children?: ReactNode;
    className?: string;
    getRuntime: () => Promise<SdkworkIamRuntimeAuthRuntimeLike> | SdkworkIamRuntimeAuthRuntimeLike;
    homePath?: string;
    locale?: string | null;
    methodUnavailableMessage?: string;
    runtimeConfig?: SdkworkAuthRuntimeConfig;
    style?: CSSProperties;
  }

  export function createSdkworkIamRuntimeAuthController(
    options: CreateSdkworkIamRuntimeAuthControllerOptions,
  ): unknown;

  export function SdkworkIamAuthRoutes(props: SdkworkIamAuthRoutesProps): JSX.Element;
}

declare module '@sdkwork/host-tauri-pc-react' {
  export type SdkworkTauriUnlisten = () => void | Promise<void>;

  export interface SdkworkTauriEvent<TPayload = unknown> {
    event: string;
    payload: TPayload;
  }

  export interface SdkworkTauriWindowTransport {
    close?: () => Promise<void>;
    hide?: () => Promise<void>;
    isMaximized?: () => Promise<boolean>;
    maximize?: () => Promise<void>;
    minimize?: () => Promise<void>;
    show?: () => Promise<void>;
    unmaximize?: () => Promise<void>;
  }

  export interface SdkworkTauriTransport {
    available?: boolean | (() => boolean);
    invoke: (command: string, payload?: unknown) => Promise<unknown>;
    listen: <TPayload>(
      event: string,
      listener: (event: SdkworkTauriEvent<TPayload>) => void,
    ) => Promise<SdkworkTauriUnlisten>;
    window?: SdkworkTauriWindowTransport;
  }

  export interface SdkworkTauriHostBridge {
    descriptor: unknown;
    isAvailable(): boolean;
    transport: SdkworkTauriTransport;
  }

  export interface CreateSdkworkTauriHostBridgeOptions {
    descriptor?: Record<string, unknown>;
    transport: SdkworkTauriTransport;
  }

  export interface EvaluateTauriHostBridgeReadinessOptions {
    requiredCapabilities?: string[];
    requiredCommands?: string[];
    requiredEvents?: string[];
    requiredWindowOperations?: string[];
  }

  export interface SdkworkTauriHostBridgeReadinessSummary {
    available: boolean;
    missingCapabilities: string[];
    missingCommands: string[];
    missingEvents: string[];
    missingWindowOperations: string[];
    ready: boolean;
  }

  export function createTauriHostBridge(
    options: CreateSdkworkTauriHostBridgeOptions,
  ): SdkworkTauriHostBridge;

  export function evaluateTauriHostBridgeReadiness(
    bridge: SdkworkTauriHostBridge,
    options?: EvaluateTauriHostBridgeReadinessOptions,
  ): SdkworkTauriHostBridgeReadinessSummary;

  export const hostTauriPackageMeta: {
    architecture: string;
    domain: string;
    package: string;
    status: string;
  };
}

declare module '@sdkwork/appbase-pc-react' {
  const appbasePcReact: unknown;
  export default appbasePcReact;
}

declare module '@sdkwork/auth-runtime-pc-react' {
  const authRuntimePcReact: unknown;
  export default authRuntimePcReact;
}

declare module '@sdkwork/host-pc-react' {
  const hostPcReact: unknown;
  export default hostPcReact;
}

declare module '@sdkwork/i18n-pc-react' {
  const i18nPcReact: unknown;
  export default i18nPcReact;
}

declare module '@sdkwork/iam-contracts' {
  const iamContracts: unknown;
  export default iamContracts;
}

declare module '@sdkwork/iam-core-pc-react' {
  const iamCorePcReact: unknown;
  export default iamCorePcReact;
}

declare module '@sdkwork/iam-react' {
  const iamReact: unknown;
  export default iamReact;
}

declare module '@sdkwork/iam-sdk-ports' {
  const iamSdkPorts: unknown;
  export default iamSdkPorts;
}

declare module '@sdkwork/ui-pc-react' {
  const uiPcReact: unknown;
  export default uiPcReact;
}

declare module '@sdkwork/ui-pc-react/theme' {
  const uiPcReactTheme: unknown;
  export default uiPcReactTheme;
}
