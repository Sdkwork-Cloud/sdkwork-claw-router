export type SdkworkCacheProviderKind = "local_cache" | "redis_cache";
export type SdkworkCacheRuntimeTarget = "desktop_packaged" | "service";
export type SdkworkCacheFailureMode =
  | "fail_closed"
  | "origin_fallback"
  | "serve_stale"
  | "bypass_cache";
export type SdkworkCacheSensitivity =
  | "public"
  | "internal"
  | "sensitive"
  | "secret_ref";
export type SdkworkCacheConsistency = "relaxed" | "bounded_stale" | "coordination_critical";
export type SdkworkCacheScope =
  | "global"
  | "tenant"
  | "tenant_user"
  | "session"
  | "request";

export interface SdkworkCacheConnectionProfile {
  database?: number;
  host?: string;
  keyPrefix?: string;
  name: string;
  passwordSecretRef?: string;
  poolSize?: number;
  port?: number;
  tlsEnabled?: boolean;
  username?: string;
}

export interface SdkworkCacheInstanceSpec {
  defaultTtlSeconds: number;
  keyPrefix: string;
  maxEntries?: number;
  maxValueBytes?: number;
  name: string;
  providerKind: SdkworkCacheProviderKind;
  purpose: string;
  runtimeTargets: SdkworkCacheRuntimeTarget[];
  sensitivity: SdkworkCacheSensitivity;
  supportsInspect?: boolean;
  supportsLease?: boolean;
  supportsTagInvalidation?: boolean;
  connectionProfileName?: string;
}

export interface SdkworkCacheNamespacePolicy {
  consistency: SdkworkCacheConsistency;
  enabled: boolean;
  failureMode: SdkworkCacheFailureMode;
  instanceName: string;
  jitterPercent: number;
  namespace: string;
  scope: SdkworkCacheScope;
  sensitivity: SdkworkCacheSensitivity;
  staleWhileRevalidateSeconds?: number;
  tags: string[];
  ttlSeconds: number;
}

export interface SdkworkCacheValueEnvelope<TValue> {
  createdAt: string;
  expireAt: string;
  payload: TValue;
  payloadVersion: number;
  schemaVersion: number;
  writerIdentity: string;
}

export interface SdkworkCacheStore {
  delete(key: string): Promise<boolean>;
  deletePrefix(prefix: string): Promise<number>;
  get<TValue>(key: string): Promise<SdkworkCacheValueEnvelope<TValue> | null>;
  refreshPrefix(prefix: string): Promise<SdkworkCacheOperationOutcome>;
  set<TValue>(
    key: string,
    value: SdkworkCacheValueEnvelope<TValue>,
    ttlSeconds: number,
  ): Promise<void>;
  statsPrefix(prefix: string): Promise<SdkworkCacheStoreStats>;
}

export interface SdkworkRedisCacheDriver extends SdkworkCacheStore {}

export interface SdkworkNamedCacheStore {
  instance: SdkworkCacheInstanceSpec;
  store: SdkworkCacheStore;
}

export interface CreateSdkworkCacheManagerInput {
  connectionProfiles?: SdkworkCacheConnectionProfile[];
  instances: SdkworkCacheInstanceSpec[];
  namespacePolicies: SdkworkCacheNamespacePolicy[];
  runtimeTarget: SdkworkCacheRuntimeTarget;
  stores: SdkworkNamedCacheStore[];
}

export interface SdkworkCacheFacade {
  delete(namespace: string, key: string): Promise<boolean>;
  get<TValue>(namespace: string, key: string): Promise<SdkworkCacheValueEnvelope<TValue> | null>;
  resolveInstance(namespace: string): SdkworkCacheInstanceSpec;
  set<TValue>(namespace: string, key: string, payload: TValue): Promise<void>;
}

export interface SdkworkCacheManager {
  connectionProfiles: ReadonlyMap<string, SdkworkCacheConnectionProfile>;
  deleteKey(namespace: string, key: string): Promise<SdkworkCacheOperationOutcome>;
  deleteNamespace(namespace: string): Promise<SdkworkCacheOperationOutcome>;
  facade: SdkworkCacheFacade;
  instances: ReadonlyMap<string, SdkworkCacheInstanceSpec>;
  namespacePolicies: ReadonlyMap<string, SdkworkCacheNamespacePolicy>;
  refreshAll(): Promise<SdkworkCacheOperationOutcome>;
  refreshInstance(instanceName: string): Promise<SdkworkCacheOperationOutcome>;
  runtimeTarget: SdkworkCacheRuntimeTarget;
  snapshot(): Promise<SdkworkCacheRuntimeSnapshot>;
}

export interface SdkworkCacheStoreStats {
  entryCount: number;
  expiredEntryCount: number;
}

export interface SdkworkCacheInstanceSnapshot extends SdkworkCacheInstanceSpec {
  entryCount: number;
  expiredEntryCount: number;
  status: "ready" | "error";
}

export interface SdkworkCacheRuntimeSummary {
  expiredEntries: number;
  runtimeTarget: SdkworkCacheRuntimeTarget;
  totalEntries: number;
  totalInstances: number;
  totalNamespaces: number;
}

export interface SdkworkCacheRuntimeSnapshot {
  instances: SdkworkCacheInstanceSnapshot[];
  namespacePolicies: SdkworkCacheNamespacePolicy[];
  summary: SdkworkCacheRuntimeSummary;
}

export interface SdkworkCacheOperationOutcome {
  cacheKey: string | null;
  deletedEntries: number;
  instanceName: string | null;
  namespace: string | null;
  operation: "delete" | "delete_namespace" | "refresh" | "refresh_all";
  refreshedEntries: number;
  status: "completed";
}

export function createSdkworkCacheManager(
  input: CreateSdkworkCacheManagerInput,
): SdkworkCacheManager {
  const instances = new Map<string, SdkworkCacheInstanceSpec>();
  const storesByInstance = new Map<string, SdkworkCacheStore>();
  const namespacePolicies = new Map<string, SdkworkCacheNamespacePolicy>();
  const connectionProfiles = new Map<string, SdkworkCacheConnectionProfile>();

  for (const profile of input.connectionProfiles ?? []) {
    if (connectionProfiles.has(profile.name)) {
      throw new Error(`Duplicate cache connection profile: ${profile.name}`);
    }
    connectionProfiles.set(profile.name, profile);
  }

  for (const instance of input.instances) {
    validateRuntimeBinding(instance, input.runtimeTarget);
    if (instances.has(instance.name)) {
      throw new Error(`Duplicate cache instance: ${instance.name}`);
    }
    if (!instance.keyPrefix.trim()) {
      throw new Error(`Cache instance ${instance.name} must define a keyPrefix`);
    }
    if (instance.keyPrefix !== instance.keyPrefix.trim()) {
      throw new Error(
        `Cache instance ${instance.name} keyPrefix must not contain leading or trailing whitespace`,
      );
    }
    if (instance.keyPrefix.startsWith(":") || instance.keyPrefix.endsWith(":")) {
      throw new Error(`Cache instance ${instance.name} keyPrefix must not start or end with ':'`);
    }
    if (instance.defaultTtlSeconds <= 0) {
      throw new Error(`Cache instance ${instance.name} must define a positive defaultTtlSeconds`);
    }
    if (instance.providerKind === "redis_cache" && !instance.connectionProfileName?.trim()) {
      throw new Error(`Redis cache instance ${instance.name} requires a connectionProfileName`);
    }
    if (instance.connectionProfileName && !connectionProfiles.has(instance.connectionProfileName)) {
      throw new Error(
        `Cache instance ${instance.name} references unknown connection profile ${instance.connectionProfileName}`,
      );
    }
    instances.set(instance.name, instance);
  }
  validateNonOverlappingKeyPrefixes(instances);

  for (const namedStore of input.stores) {
    const registeredInstance = instances.get(namedStore.instance.name);
    if (!registeredInstance) {
      throw new Error(`Cache store references unknown instance ${namedStore.instance.name}`);
    }
    storesByInstance.set(namedStore.instance.name, namedStore.store);
  }

  for (const policy of input.namespacePolicies) {
    if (namespacePolicies.has(policy.namespace)) {
      throw new Error(`Duplicate cache namespace policy: ${policy.namespace}`);
    }
    const instance = instances.get(policy.instanceName);
    if (!instance) {
      throw new Error(
        `Cache namespace policy ${policy.namespace} references unknown instance ${policy.instanceName}`,
      );
    }
    if (policy.ttlSeconds <= 0) {
      throw new Error(`Cache namespace policy ${policy.namespace} must define a positive ttlSeconds`);
    }
    if (policy.jitterPercent < 0 || policy.jitterPercent > 100) {
      throw new Error(
        `Cache namespace policy ${policy.namespace} jitterPercent must be between 0 and 100`,
      );
    }
    namespacePolicies.set(policy.namespace, policy);
  }

  const facade: SdkworkCacheFacade = {
    delete: async (namespace, key) => {
      const { instance, store } = resolveBoundStore(namespace, instances, namespacePolicies, storesByInstance);
      return store.delete(composeCacheKey(instance, namespace, key));
    },
    get: async (namespace, key) => {
      const { instance, store } = resolveBoundStore(namespace, instances, namespacePolicies, storesByInstance);
      return store.get(composeCacheKey(instance, namespace, key));
    },
    resolveInstance: (namespace) =>
      resolveBoundStore(namespace, instances, namespacePolicies, storesByInstance).instance,
    set: async (namespace, key, payload) => {
      const { instance, policy, store } = resolveBoundStore(
        namespace,
        instances,
        namespacePolicies,
        storesByInstance,
      );
      const createdAt = new Date().toISOString();
      const expireAt = new Date(Date.now() + policy.ttlSeconds * 1000).toISOString();
      await store.set(composeCacheKey(instance, namespace, key), {
        createdAt,
        expireAt,
        payload,
        payloadVersion: 1,
        schemaVersion: 1,
        writerIdentity: "sdkwork-cache-core",
      }, policy.ttlSeconds);
    },
  };

  return {
    connectionProfiles,
    deleteKey: async (namespace, key) => {
      const { instance, store } = resolveBoundStore(namespace, instances, namespacePolicies, storesByInstance);
      const deleted = await store.delete(composeCacheKey(instance, namespace, key));
      return {
        cacheKey: key.trim(),
        deletedEntries: deleted ? 1 : 0,
        instanceName: instance.name,
        namespace,
        operation: "delete",
        refreshedEntries: 0,
        status: "completed",
      };
    },
    deleteNamespace: async (namespace) => {
      const { instance, store } = resolveBoundStore(namespace, instances, namespacePolicies, storesByInstance);
      const deletedEntries = await store.deletePrefix(composeCacheNamespacePrefix(instance, namespace));
      return {
        cacheKey: null,
        deletedEntries,
        instanceName: instance.name,
        namespace,
        operation: "delete_namespace",
        refreshedEntries: 0,
        status: "completed",
      };
    },
    facade,
    instances,
    namespacePolicies,
    refreshAll: async () => {
      let deletedEntries = 0;
      let refreshedEntries = 0;
      for (const instanceName of instances.keys()) {
        const outcome = await refreshInstance(instanceName, instances, storesByInstance);
        deletedEntries += outcome.deletedEntries;
        refreshedEntries += outcome.refreshedEntries;
      }
      return {
        cacheKey: null,
        deletedEntries,
        instanceName: null,
        namespace: null,
        operation: "refresh_all",
        refreshedEntries,
        status: "completed",
      };
    },
    refreshInstance: (instanceName) => refreshInstance(instanceName, instances, storesByInstance),
    runtimeTarget: input.runtimeTarget,
    snapshot: async () => {
      const snapshots: SdkworkCacheInstanceSnapshot[] = [];
      let totalEntries = 0;
      let expiredEntries = 0;
      for (const instance of instances.values()) {
        const store = storesByInstance.get(instance.name);
        if (!store) {
          throw new Error(`Cache instance ${instance.name} does not have a bound store`);
        }
        const stats = await store.statsPrefix(composeCacheInstancePrefix(instance));
        totalEntries += stats.entryCount;
        expiredEntries += stats.expiredEntryCount;
        snapshots.push({
          ...instance,
          entryCount: stats.entryCount,
          expiredEntryCount: stats.expiredEntryCount,
          status: "ready",
        });
      }
      return {
        instances: snapshots,
        namespacePolicies: Array.from(namespacePolicies.values()),
        summary: {
          expiredEntries,
          runtimeTarget: input.runtimeTarget,
          totalEntries,
          totalInstances: instances.size,
          totalNamespaces: namespacePolicies.size,
        },
      };
    },
  };
}

export class SdkworkLocalCacheStore implements SdkworkCacheStore {
  private readonly entries = new Map<string, {
    expireAtMs: number;
    value: SdkworkCacheValueEnvelope<unknown>;
  }>();

  async delete(key: string): Promise<boolean> {
    return this.entries.delete(key);
  }

  async deletePrefix(prefix: string): Promise<number> {
    let deleted = 0;
    for (const key of Array.from(this.entries.keys())) {
      if (key.startsWith(prefix) && this.entries.delete(key)) {
        deleted += 1;
      }
    }
    return deleted;
  }

  async get<TValue>(key: string): Promise<SdkworkCacheValueEnvelope<TValue> | null> {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expireAtMs <= Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry.value as SdkworkCacheValueEnvelope<TValue>;
  }

  async set<TValue>(
    key: string,
    value: SdkworkCacheValueEnvelope<TValue>,
    ttlSeconds: number,
  ): Promise<void> {
    this.entries.set(key, {
      expireAtMs: Date.now() + ttlSeconds * 1000,
      value,
    });
  }

  async refreshPrefix(prefix: string): Promise<SdkworkCacheOperationOutcome> {
    let deletedEntries = 0;
    for (const [key, entry] of Array.from(this.entries.entries())) {
      if (key.startsWith(prefix) && entry.expireAtMs <= Date.now() && this.entries.delete(key)) {
        deletedEntries += 1;
      }
    }
    return {
      deletedEntries,
      instanceName: null,
      cacheKey: null,
      namespace: null,
      operation: "refresh",
      refreshedEntries: Array.from(this.entries.entries())
        .filter(([key, entry]) => key.startsWith(prefix) && entry.expireAtMs > Date.now())
        .length,
      status: "completed",
    };
  }

  async statsPrefix(prefix: string): Promise<SdkworkCacheStoreStats> {
    let expiredEntryCount = 0;
    let entryCount = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (!key.startsWith(prefix)) {
        continue;
      }
      if (entry.expireAtMs <= Date.now()) {
        expiredEntryCount += 1;
      } else {
        entryCount += 1;
      }
    }
    return {
      entryCount,
      expiredEntryCount,
    };
  }
}

export class SdkworkRedisCacheStore implements SdkworkCacheStore {
  constructor(private readonly driver: SdkworkRedisCacheDriver) {}

  delete(key: string): Promise<boolean> {
    return this.driver.delete(key);
  }

  deletePrefix(prefix: string): Promise<number> {
    return this.driver.deletePrefix(prefix);
  }

  get<TValue>(key: string): Promise<SdkworkCacheValueEnvelope<TValue> | null> {
    return this.driver.get<TValue>(key);
  }

  refreshPrefix(prefix: string): Promise<SdkworkCacheOperationOutcome> {
    return this.driver.refreshPrefix(prefix);
  }

  set<TValue>(
    key: string,
    value: SdkworkCacheValueEnvelope<TValue>,
    ttlSeconds: number,
  ): Promise<void> {
    return this.driver.set(key, value, ttlSeconds);
  }

  statsPrefix(prefix: string): Promise<SdkworkCacheStoreStats> {
    return this.driver.statsPrefix(prefix);
  }
}

export class SdkworkInMemoryRedisCacheDriver implements SdkworkRedisCacheDriver {
  private readonly entries = new Map<string, {
    expireAtMs: number;
    value: SdkworkCacheValueEnvelope<unknown>;
  }>();

  async delete(key: string): Promise<boolean> {
    return this.entries.delete(key);
  }

  async deletePrefix(prefix: string): Promise<number> {
    let deleted = 0;
    for (const key of Array.from(this.entries.keys())) {
      if (key.startsWith(prefix) && this.entries.delete(key)) {
        deleted += 1;
      }
    }
    return deleted;
  }

  async get<TValue>(key: string): Promise<SdkworkCacheValueEnvelope<TValue> | null> {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expireAtMs <= Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry.value as SdkworkCacheValueEnvelope<TValue>;
  }

  async set<TValue>(
    key: string,
    value: SdkworkCacheValueEnvelope<TValue>,
    ttlSeconds: number,
  ): Promise<void> {
    this.entries.set(key, {
      expireAtMs: Date.now() + ttlSeconds * 1000,
      value,
    });
  }

  async refreshPrefix(prefix: string): Promise<SdkworkCacheOperationOutcome> {
    let deletedEntries = 0;
    for (const [key, entry] of Array.from(this.entries.entries())) {
      if (key.startsWith(prefix) && entry.expireAtMs <= Date.now() && this.entries.delete(key)) {
        deletedEntries += 1;
      }
    }
    return {
      deletedEntries,
      instanceName: null,
      cacheKey: null,
      namespace: null,
      operation: "refresh",
      refreshedEntries: Array.from(this.entries.entries())
        .filter(([key, entry]) => key.startsWith(prefix) && entry.expireAtMs > Date.now())
        .length,
      status: "completed",
    };
  }

  async statsPrefix(prefix: string): Promise<SdkworkCacheStoreStats> {
    let expiredEntryCount = 0;
    let entryCount = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (!key.startsWith(prefix)) {
        continue;
      }
      if (entry.expireAtMs <= Date.now()) {
        expiredEntryCount += 1;
      } else {
        entryCount += 1;
      }
    }
    return {
      entryCount,
      expiredEntryCount,
    };
  }
}

function validateRuntimeBinding(
  instance: SdkworkCacheInstanceSpec,
  runtimeTarget: SdkworkCacheRuntimeTarget,
): void {
  if (runtimeTarget === "desktop_packaged" && instance.providerKind !== "local_cache") {
    throw new Error(
      `Desktop packaged runtime requires local cache instances, but ${instance.name} uses ${instance.providerKind}`,
    );
  }
  if (runtimeTarget === "service" && instance.providerKind !== "redis_cache") {
    throw new Error(
      `Service runtime requires redis cache instances, but ${instance.name} uses ${instance.providerKind}`,
    );
  }
  if (!instance.runtimeTargets.includes(runtimeTarget)) {
    throw new Error(
      `Cache instance ${instance.name} is not allowed for runtime target ${runtimeTarget}`,
    );
  }
}

function validateNonOverlappingKeyPrefixes(
  instances: ReadonlyMap<string, SdkworkCacheInstanceSpec>,
): void {
  const keyPrefixes = Array.from(instances.values())
    .map((instance) => ({
      name: instance.name,
      keyPrefix: instance.keyPrefix.trim(),
    }))
    .sort((left, right) => left.keyPrefix.localeCompare(right.keyPrefix));

  for (let index = 1; index < keyPrefixes.length; index += 1) {
    const left = keyPrefixes[index - 1];
    const right = keyPrefixes[index];
    if (
      left.keyPrefix === right.keyPrefix ||
      right.keyPrefix.startsWith(`${left.keyPrefix}:`) ||
      left.keyPrefix.startsWith(`${right.keyPrefix}:`)
    ) {
      throw new Error(
        `Cache instance key prefixes must not overlap: ${left.name}=${left.keyPrefix}, ${right.name}=${right.keyPrefix}`,
      );
    }
  }
}

function resolveBoundStore(
  namespace: string,
  instances: ReadonlyMap<string, SdkworkCacheInstanceSpec>,
  namespacePolicies: ReadonlyMap<string, SdkworkCacheNamespacePolicy>,
  storesByInstance: ReadonlyMap<string, SdkworkCacheStore>,
): {
  instance: SdkworkCacheInstanceSpec;
  policy: SdkworkCacheNamespacePolicy;
  store: SdkworkCacheStore;
} {
  const policy = namespacePolicies.get(namespace);
  if (!policy) {
    throw new Error(`Unknown cache namespace policy: ${namespace}`);
  }
  if (!policy.enabled) {
    throw new Error(`Cache namespace policy ${namespace} is disabled`);
  }
  const instance = instances.get(policy.instanceName);
  if (!instance) {
    throw new Error(`Unknown cache instance: ${policy.instanceName}`);
  }
  const store = storesByInstance.get(instance.name);
  if (!store) {
    throw new Error(`Cache instance ${instance.name} does not have a bound store`);
  }
  return { instance, policy, store };
}

function composeCacheKey(
  instance: SdkworkCacheInstanceSpec,
  namespace: string,
  key: string,
): string {
  const normalizedKey = key.trim();
  if (!normalizedKey) {
    throw new Error(`Cache key for namespace ${namespace} is required`);
  }
  return `${instance.keyPrefix}:${namespace}:${normalizedKey}`;
}

function composeCacheNamespacePrefix(
  instance: SdkworkCacheInstanceSpec,
  namespace: string,
): string {
  if (!namespace.trim()) {
    throw new Error("Cache namespace is required");
  }
  return `${instance.keyPrefix}:${namespace}:`;
}

function composeCacheInstancePrefix(instance: SdkworkCacheInstanceSpec): string {
  const keyPrefix = instance.keyPrefix.trim();
  if (!keyPrefix) {
    throw new Error(`Cache instance ${instance.name} must define a keyPrefix`);
  }
  return `${keyPrefix}:`;
}

async function refreshInstance(
  instanceName: string,
  instances: ReadonlyMap<string, SdkworkCacheInstanceSpec>,
  storesByInstance: ReadonlyMap<string, SdkworkCacheStore>,
): Promise<SdkworkCacheOperationOutcome> {
  const instance = instances.get(instanceName);
  if (!instance) {
    throw new Error(`Unknown cache instance: ${instanceName}`);
  }
  const store = storesByInstance.get(instance.name);
  if (!store) {
    throw new Error(`Cache instance ${instance.name} does not have a bound store`);
  }
  const outcome = await store.refreshPrefix(composeCacheInstancePrefix(instance));
  return {
    ...outcome,
    instanceName: instance.name,
    operation: "refresh",
  };
}
