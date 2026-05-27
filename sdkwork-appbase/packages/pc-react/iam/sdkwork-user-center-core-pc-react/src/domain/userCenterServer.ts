import type {
  UserCenterBridgeConfig,
  UserCenterIntegrationKind,
  UserCenterLocalAuthorityColumn,
  UserCenterLocalAuthorityEntityTable,
  UserCenterLocalAuthoritySchemaContract,
  UserCenterProviderConfig,
  UserCenterServerAuthorityContract,
  UserCenterServerManifest,
  UserCenterServerOperationContract,
  UserCenterServerPluginDefinition,
  UserCenterServerPluginDefinitionOptions,
  UserCenterServerRepositoryContract,
  UserCenterServerServiceContract,
  UserCenterStandardEntityName,
  UserCenterWorkspaceManifestBase,
} from "../types/userCenterTypes.ts";
import { createUserCenterAuthInteropContract } from "./userCenterAuthInterop.ts";
import { createUserCenterBridgeConfig } from "./userCenterBridge.ts";
import {
  createUserCenterCanonicalServerOperations,
  USER_CENTER_PROTECTED_TOKEN_PREFERENCE,
} from "./userCenterCanonicalRoutes.ts";
import { createUserCenterDeploymentProfiles } from "./userCenterDeployment.ts";

const SERVER_PACKAGE_NAMES = ["@sdkwork/user-center-core-pc-react"];
function toUniquePackageNames(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function createServerManifestBase(options: {
  description?: string;
  id: string;
  packageNames: string[];
  title: string;
}): UserCenterWorkspaceManifestBase {
  return {
    ...(options.description ? { description: options.description } : {}),
    host: "server",
    id: options.id,
    packageNames: toUniquePackageNames(options.packageNames),
    title: options.title,
  };
}

function createLocalAuthorityColumns(
  standardEntityName: UserCenterStandardEntityName,
): UserCenterLocalAuthorityColumn[] {
  switch (standardEntityName) {
    case "IamUser":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "tenant_id", nullable: true, role: "tenant-id" },
        { dataType: "varchar(128)", indexed: true, name: "username", nullable: true, role: "relation" },
        { dataType: "varchar(128)", name: "display_name", nullable: true, role: "relation" },
        { dataType: "varchar(128)", name: "nickname", nullable: true, role: "relation" },
        { dataType: "varchar(128)", indexed: true, name: "email", nullable: true, role: "relation" },
        { dataType: "varchar(32)", indexed: true, name: "status", nullable: true, role: "status" },
        { dataType: "varchar(32)", name: "type", nullable: true, role: "relation" },
        { dataType: "json", name: "metadata_json", nullable: true, role: "metadata" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
    case "IamTenant":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "code", nullable: true, role: "relation" },
        { dataType: "varchar(128)", name: "name", nullable: true, role: "relation" },
        { dataType: "varchar(32)", name: "biz_type", nullable: true, role: "relation" },
        { dataType: "varchar(32)", name: "type", nullable: true, role: "relation" },
        { dataType: "varchar(32)", indexed: true, name: "status", nullable: true, role: "status" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
    case "IamAccount":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "user_id", nullable: true, role: "user-id" },
        { dataType: "varchar(64)", indexed: true, name: "owner_id", nullable: true, role: "owner-id" },
        { dataType: "varchar(32)", name: "owner", nullable: true, role: "relation" },
        { dataType: "decimal(18,2)", name: "available_balance", nullable: false, role: "amount" },
        { dataType: "decimal(18,2)", name: "frozen_balance", nullable: false, role: "amount" },
        { dataType: "bigint", name: "available_points", nullable: false, role: "amount" },
        { dataType: "bigint", name: "frozen_points", nullable: false, role: "amount" },
        { dataType: "bigint", name: "token_balance", nullable: false, role: "amount" },
        { dataType: "bigint", name: "frozen_token_balance", nullable: false, role: "amount" },
        { dataType: "varchar(32)", indexed: true, name: "status", nullable: true, role: "status" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
    case "IamMembership":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "user_id", nullable: true, role: "user-id" },
        { dataType: "varchar(64)", indexed: true, name: "membership_level_id", nullable: true, role: "relation" },
        { dataType: "bigint", name: "point_balance", nullable: false, role: "amount" },
        { dataType: "bigint", name: "total_recharged_points", nullable: false, role: "amount" },
        { dataType: "varchar(32)", indexed: true, name: "status", nullable: true, role: "status" },
        { dataType: "timestamp", name: "valid_from", nullable: true, role: "timestamp" },
        { dataType: "timestamp", name: "valid_to", nullable: true, role: "timestamp" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
    case "IamOrganizationMember":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "user_id", nullable: true, role: "user-id" },
        { dataType: "varchar(64)", indexed: true, name: "owner_id", nullable: true, role: "owner-id" },
        { dataType: "varchar(32)", name: "owner", nullable: true, role: "relation" },
        { dataType: "boolean", name: "is_active", nullable: false, role: "flag" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
    case "IamMemberRelation":
      return [
        { dataType: "varchar(64)", indexed: true, name: "id", nullable: false, role: "id" },
        { dataType: "varchar(64)", indexed: true, name: "member_id", nullable: true, role: "relation" },
        { dataType: "varchar(64)", indexed: true, name: "target_id", nullable: true, role: "relation" },
        { dataType: "varchar(32)", indexed: true, name: "relation_type", nullable: true, role: "relation" },
        { dataType: "boolean", name: "is_primary", nullable: false, role: "flag" },
        { dataType: "boolean", name: "is_active", nullable: false, role: "flag" },
        { dataType: "timestamp", name: "created_at", nullable: false, role: "timestamp" },
        { dataType: "timestamp", name: "updated_at", nullable: false, role: "timestamp" },
      ];
  }
}

function createLocalAuthoritySchemaContract(
  bridgeConfig: UserCenterBridgeConfig,
): UserCenterLocalAuthoritySchemaContract {
  return {
    databaseKey: bridgeConfig.storageTopology.databaseKey,
    migrationNamespace: bridgeConfig.storageTopology.migrationNamespace,
    ...(bridgeConfig.storageTopology.schemaName
      ? { schemaName: bridgeConfig.storageTopology.schemaName }
      : {}),
    tablePrefix: bridgeConfig.storageTopology.tablePrefix,
    tables: bridgeConfig.storageTopology.entityBindings.map((binding): UserCenterLocalAuthorityEntityTable => ({
      columns: createLocalAuthorityColumns(binding.standardEntityName),
      primaryKeyColumnName: binding.primaryKeyColumnName,
      standardEntityName: binding.standardEntityName,
      tableName: binding.tableName,
    })),
  } as UserCenterLocalAuthoritySchemaContract;
}

function createServerRepositories(): UserCenterServerRepositoryContract[] {
  return [
    {
      entityNames: ["IamUser"],
      id: "user-repository",
      purpose: "Persists canonical IAM user records.",
    },
    {
      entityNames: ["IamTenant"],
      id: "tenant-repository",
      purpose: "Persists canonical IAM tenant records.",
    },
    {
      entityNames: ["IamAccount"],
      id: "account-repository",
      purpose: "Persists canonical IAM account balance records.",
    },
    {
      entityNames: ["IamMembership"],
      id: "membership-repository",
      purpose: "Persists canonical IAM membership lifecycle records.",
    },
    {
      entityNames: ["IamOrganizationMember"],
      id: "organization-member-repository",
      purpose: "Persists canonical IAM organization membership rows.",
    },
    {
      entityNames: ["IamMemberRelation"],
      id: "member-relations-repository",
      purpose: "Persists canonical IAM member relation rows.",
    },
    {
      entityNames: [],
      id: "session-repository",
      purpose: "Persists AuthToken, AccessToken, RefreshToken, and session shadow state.",
    },
  ];
}

function createServerServices(): UserCenterServerServiceContract[] {
  return [
    {
      id: "auth-service",
      operationIds: [
        "auth.getConfig",
        "auth.getSession",
        "auth.login",
        "auth.login.email",
        "auth.login.phone",
        "auth.register",
        "auth.verify.send",
        "auth.verify.check",
        "auth.password.reset.request",
        "auth.password.reset",
        "auth.refresh",
        "auth.logout",
        "auth.session.exchange",
      ],
      purpose: "Owns login, verification, recovery, refresh, logout, and upstream session exchange.",
    },
    {
      id: "profile-service",
      operationIds: ["user.profile.get", "user.profile.update"],
      purpose: "Owns profile read/write behavior and canonical user snapshot projection.",
    },
    {
      id: "settings-service",
      operationIds: ["user.settings.get", "user.settings.update"],
      purpose: "Owns user settings persistence for local authority and upstream mirrors.",
    },
    {
      id: "membership-service",
      operationIds: ["membership.current.get", "membership.current.update"],
      purpose: "Owns membership balance, status, and upgrade projection behavior.",
    },
    {
      id: "tenant-service",
      operationIds: ["tenant.root.get"],
      purpose: "Owns tenant projection and tenant-aware authority lookup.",
    },
    {
      id: "account-service",
      operationIds: ["account.summary.get"],
      purpose: "Owns wallet/account balance projection and quota read models.",
    },
    {
      id: "health-service",
      operationIds: ["health.get"],
      purpose: "Owns deployment readiness and authority health signalling.",
    },
  ];
}

function createServerApiOperations(
  bridgeConfig: UserCenterBridgeConfig,
): UserCenterServerOperationContract[] {
  return createUserCenterCanonicalServerOperations(bridgeConfig);
}

function resolveActiveProvider(
  bridgeConfig: UserCenterBridgeConfig,
): UserCenterProviderConfig {
  if (bridgeConfig.integration.activeKind === "builtin-local") {
    return {
      kind: "builtin-local",
      providerKey: `${bridgeConfig.namespace}-local`,
    };
  }

  return {
    ...bridgeConfig.provider,
  };
}

function createServerAuthorityContract(
  bridgeConfig: UserCenterBridgeConfig,
  deployment = createUserCenterDeploymentProfiles(bridgeConfig),
): UserCenterServerAuthorityContract {
  const localAuthorityEnabled = bridgeConfig.integration.activeKind === "builtin-local";
  const localAuthoritySchema = createLocalAuthoritySchemaContract(bridgeConfig);
  const authInterop = createUserCenterAuthInteropContract(bridgeConfig.auth);

  return {
    activeIntegrationKind: bridgeConfig.integration.activeKind,
    activeProvider: resolveActiveProvider(bridgeConfig),
    api: {
      basePath: bridgeConfig.localApi.health.replace(/\/health$/u, ""),
      operations: createServerApiOperations(bridgeConfig),
    },
    authInterop: {
      authMode: authInterop.authMode,
      handshake: {
        freshnessWindowMs: authInterop.handshake.freshnessWindowMs,
        mode: authInterop.handshake.mode,
        required: authInterop.handshake.enabled,
      },
      protectedTokenPreference: [...USER_CENTER_PROTECTED_TOKEN_PREFERENCE],
      tokenHeaders: {
        ...authInterop.tokenHeaders,
      },
    },
    localAuthority: {
      enabled: localAuthorityEnabled,
      schema: localAuthoritySchema,
      storageTopology: bridgeConfig.storageTopology,
    },
    repositories: createServerRepositories(),
    services: createServerServices(),
    upstream: {
      appApi: {
        ...(bridgeConfig.integration.externalAppApi.upstreamBaseUrl
          ? { baseUrl: bridgeConfig.integration.externalAppApi.upstreamBaseUrl }
          : {}),
        enabled: bridgeConfig.integration.externalAppApi.enabled,
        handshake: deployment.externalAppApi.handshake,
        providerKey: bridgeConfig.integration.externalAppApi.providerKey,
      },
      ...(bridgeConfig.integration.externalUserCenter && deployment.externalUserCenter
        ? {
            thirdParty: {
              ...(bridgeConfig.integration.externalUserCenter.upstreamBaseUrl
                ? { baseUrl: bridgeConfig.integration.externalUserCenter.upstreamBaseUrl }
                : {}),
              enabled: bridgeConfig.integration.externalUserCenter.enabled,
              handshake: deployment.externalUserCenter.handshake,
              providerKey: bridgeConfig.integration.externalUserCenter.providerKey,
            },
          }
        : {}),
    },
  };
}

export function createUserCenterServerPluginDefinition(
  options: UserCenterServerPluginDefinitionOptions,
): UserCenterServerPluginDefinition {
  const bridgeConfig = createUserCenterBridgeConfig(options);
  const deployment = createUserCenterDeploymentProfiles(bridgeConfig);
  const authority = createServerAuthorityContract(bridgeConfig, deployment);
  const integrationKinds: UserCenterIntegrationKind[] = [
    "builtin-local",
    "sdkwork-cloud-app-api",
    ...(deployment.externalUserCenter ? (["external-user-center"] as const) : []),
  ];
  const serverManifest: UserCenterServerManifest = {
    ...createServerManifestBase({
      description:
        options.description
        ?? "Server plugin for local authority storage, canonical user-center APIs, and upstream authority bridging.",
      id: `${bridgeConfig.namespace}-user-center-server`,
      packageNames: options.packageNames ?? SERVER_PACKAGE_NAMES,
      title: options.title ?? "User Center Server",
    }),
    activeIntegrationKind: bridgeConfig.integration.activeKind,
    capability: "server",
    integrationKinds: [...integrationKinds],
  };

  return {
    bridgeConfig,
    capability: "user-center-server",
    deployment,
    server: {
      authority,
      deployment,
      manifests: {
        server: serverManifest,
      },
    },
  };
}
