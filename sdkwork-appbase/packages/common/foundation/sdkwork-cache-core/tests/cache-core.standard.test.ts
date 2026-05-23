import { describe, expect, it } from "vitest";

import {
  createSdkworkCacheManager,
  SdkworkInMemoryRedisCacheDriver,
  SdkworkLocalCacheStore,
  SdkworkRedisCacheStore,
  type SdkworkCacheInstanceSpec,
  type SdkworkCacheNamespacePolicy,
} from "../src/index.ts";

const DESKTOP_INSTANCE: SdkworkCacheInstanceSpec = {
  defaultTtlSeconds: 120,
  keyPrefix: "desktop-default",
  name: "desktop-default",
  providerKind: "local_cache",
  purpose: "Desktop packaged default cache",
  runtimeTargets: ["desktop_packaged"],
  sensitivity: "internal",
  supportsInspect: true,
};

const SERVICE_INSTANCE: SdkworkCacheInstanceSpec = {
  connectionProfileName: "primary-redis",
  defaultTtlSeconds: 180,
  keyPrefix: "service-default",
  name: "service-default",
  providerKind: "redis_cache",
  purpose: "Service default cache",
  runtimeTargets: ["service"],
  sensitivity: "internal",
  supportsInspect: true,
  supportsLease: true,
  supportsTagInvalidation: true,
};

const DESKTOP_POLICY: SdkworkCacheNamespacePolicy = {
  consistency: "bounded_stale",
  enabled: true,
  failureMode: "origin_fallback",
  instanceName: "desktop-default",
  jitterPercent: 10,
  namespace: "auth.qr.challenge",
  scope: "session",
  sensitivity: "sensitive",
  tags: ["auth", "qr"],
  ttlSeconds: 120,
};

const SERVICE_POLICY: SdkworkCacheNamespacePolicy = {
  consistency: "coordination_critical",
  enabled: true,
  failureMode: "fail_closed",
  instanceName: "service-default",
  jitterPercent: 5,
  namespace: "auth.qr.challenge",
  scope: "session",
  sensitivity: "sensitive",
  tags: ["auth", "qr"],
  ttlSeconds: 120,
};

describe("sdkwork-cache-core", () => {
  it("binds desktop packaged runtime to local cache instances only", async () => {
    const manager = createSdkworkCacheManager({
      instances: [DESKTOP_INSTANCE],
      namespacePolicies: [DESKTOP_POLICY],
      runtimeTarget: "desktop_packaged",
      stores: [{
        instance: DESKTOP_INSTANCE,
        store: new SdkworkLocalCacheStore(),
      }],
    });

    await manager.facade.set("auth.qr.challenge", "browser-1", { status: "pending" });
    expect(manager.facade.resolveInstance("auth.qr.challenge").providerKind).toBe("local_cache");
    await expect(manager.facade.get<{ status: string }>("auth.qr.challenge", "browser-1"))
      .resolves.toMatchObject({
        payload: { status: "pending" },
      });
  });

  it("rejects redis cache instances for desktop packaged runtime", () => {
    expect(() => createSdkworkCacheManager({
      connectionProfiles: [{
        host: "127.0.0.1",
        name: "primary-redis",
        port: 6379,
      }],
      instances: [SERVICE_INSTANCE],
      namespacePolicies: [SERVICE_POLICY],
      runtimeTarget: "desktop_packaged",
      stores: [{
        instance: SERVICE_INSTANCE,
        store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
      }],
    })).toThrow(/Desktop packaged runtime requires local cache instances/i);
  });

  it("binds service runtime to redis cache instances only", async () => {
    const manager = createSdkworkCacheManager({
      connectionProfiles: [{
        host: "127.0.0.1",
        name: "primary-redis",
        port: 6379,
      }],
      instances: [SERVICE_INSTANCE],
      namespacePolicies: [SERVICE_POLICY],
      runtimeTarget: "service",
      stores: [{
        instance: SERVICE_INSTANCE,
        store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
      }],
    });

    await manager.facade.set("auth.qr.challenge", "browser-2", { status: "pending" });
    expect(manager.facade.resolveInstance("auth.qr.challenge").providerKind).toBe("redis_cache");
    await expect(manager.facade.get<{ status: string }>("auth.qr.challenge", "browser-2"))
      .resolves.toMatchObject({
        payload: { status: "pending" },
      });
  });

  it("rejects local cache instances for service runtime", () => {
    expect(() => createSdkworkCacheManager({
      instances: [DESKTOP_INSTANCE],
      namespacePolicies: [DESKTOP_POLICY],
      runtimeTarget: "service",
      stores: [{
        instance: DESKTOP_INSTANCE,
        store: new SdkworkLocalCacheStore(),
      }],
    })).toThrow(/Service runtime requires redis cache instances/i);
  });

  it("rejects overlapping cache instance key prefixes", () => {
    const serviceDefault: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      keyPrefix: "service",
      name: "service-default",
    };
    const serviceAuth: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      keyPrefix: "service:auth",
      name: "service-auth",
    };

    expect(() => createSdkworkCacheManager({
      connectionProfiles: [{
        host: "127.0.0.1",
        name: "primary-redis",
        port: 6379,
      }],
      instances: [serviceDefault, serviceAuth],
      namespacePolicies: [],
      runtimeTarget: "service",
      stores: [
        {
          instance: serviceDefault,
          store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
        },
        {
          instance: serviceAuth,
          store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
        },
      ],
    })).toThrow(/Cache instance key prefixes must not overlap/i);
  });

  it("rejects unnormalized cache instance key prefixes", () => {
    const invalidInstance: SdkworkCacheInstanceSpec = {
      ...DESKTOP_INSTANCE,
      keyPrefix: "desktop-default:",
    };

    expect(() => createSdkworkCacheManager({
      instances: [invalidInstance],
      namespacePolicies: [],
      runtimeTarget: "desktop_packaged",
      stores: [{
        instance: invalidInstance,
        store: new SdkworkLocalCacheStore(),
      }],
    })).toThrow(/Cache instance desktop-default keyPrefix must not start or end with ':'/i);
  });

  it("supports multiple cache instances and namespace bindings", async () => {
    const serviceCoordination: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      defaultTtlSeconds: 60,
      keyPrefix: "service-coordination",
      name: "service-coordination",
      purpose: "Lease and coordination cache",
    };
    const serviceSnapshot: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      defaultTtlSeconds: 300,
      keyPrefix: "service-snapshot",
      name: "service-snapshot",
      purpose: "Snapshot cache",
    };

    const manager = createSdkworkCacheManager({
      connectionProfiles: [{
        host: "127.0.0.1",
        name: "primary-redis",
        port: 6379,
      }],
      instances: [serviceCoordination, serviceSnapshot],
      namespacePolicies: [
        {
          ...SERVICE_POLICY,
          instanceName: "service-coordination",
          namespace: "auth.qr.challenge",
        },
        {
          ...SERVICE_POLICY,
          consistency: "relaxed",
          failureMode: "serve_stale",
          instanceName: "service-snapshot",
          namespace: "admin.analytics.snapshot",
          tags: ["analytics", "snapshot"],
          ttlSeconds: 300,
        },
      ],
      runtimeTarget: "service",
      stores: [
        {
          instance: serviceCoordination,
          store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
        },
        {
          instance: serviceSnapshot,
          store: new SdkworkRedisCacheStore(new SdkworkInMemoryRedisCacheDriver()),
        },
      ],
    });

    await manager.facade.set("auth.qr.challenge", "browser-3", { status: "pending" });
    await manager.facade.set("admin.analytics.snapshot", "dashboard", { totalUsers: 2 });

    expect(manager.facade.resolveInstance("auth.qr.challenge").name).toBe("service-coordination");
    expect(manager.facade.resolveInstance("admin.analytics.snapshot").name).toBe("service-snapshot");
    await expect(manager.facade.get<{ totalUsers: number }>("admin.analytics.snapshot", "dashboard"))
      .resolves.toMatchObject({
        payload: { totalUsers: 2 },
      });
  });

  it("scopes shared redis driver management statistics by cache instance prefix", async () => {
    const sharedDriver = new SdkworkInMemoryRedisCacheDriver();
    const serviceAuth: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      keyPrefix: "service-auth",
      name: "service-auth",
      purpose: "Auth redis cache",
    };
    const serviceRuntime: SdkworkCacheInstanceSpec = {
      ...SERVICE_INSTANCE,
      keyPrefix: "service-runtime",
      name: "service-runtime",
      purpose: "Runtime redis cache",
    };

    const manager = createSdkworkCacheManager({
      connectionProfiles: [{
        host: "127.0.0.1",
        name: "primary-redis",
        port: 6379,
      }],
      instances: [serviceAuth, serviceRuntime],
      namespacePolicies: [
        {
          ...SERVICE_POLICY,
          instanceName: "service-auth",
          namespace: "auth.qr.challenge",
        },
        {
          ...SERVICE_POLICY,
          instanceName: "service-runtime",
          namespace: "runtime.invocation",
          scope: "tenant_user",
          sensitivity: "internal",
          tags: ["runtime"],
        },
      ],
      runtimeTarget: "service",
      stores: [
        {
          instance: serviceAuth,
          store: new SdkworkRedisCacheStore(sharedDriver),
        },
        {
          instance: serviceRuntime,
          store: new SdkworkRedisCacheStore(sharedDriver),
        },
      ],
    });

    await manager.facade.set("auth.qr.challenge", "browser-4", { status: "pending" });
    await manager.facade.set("runtime.invocation", "run-1", { status: "running" });

    await expect(manager.snapshot()).resolves.toMatchObject({
      summary: {
        totalEntries: 2,
      },
      instances: expect.arrayContaining([
        expect.objectContaining({
          entryCount: 1,
          name: "service-auth",
        }),
        expect.objectContaining({
          entryCount: 1,
          name: "service-runtime",
        }),
      ]),
    });
  });

  it("exposes cache management snapshots, refreshes, and precise deletion operations", async () => {
    const manager = createSdkworkCacheManager({
      instances: [DESKTOP_INSTANCE],
      namespacePolicies: [DESKTOP_POLICY],
      runtimeTarget: "desktop_packaged",
      stores: [{
        instance: DESKTOP_INSTANCE,
        store: new SdkworkLocalCacheStore(),
      }],
    });

    await manager.facade.set("auth.qr.challenge", "qr-1", { status: "pending" });
    await manager.facade.set("auth.qr.challenge", "qr-2", { status: "pending" });

    await expect(manager.snapshot()).resolves.toMatchObject({
      summary: {
        expiredEntries: 0,
        runtimeTarget: "desktop_packaged",
        totalEntries: 2,
        totalInstances: 1,
        totalNamespaces: 1,
      },
      instances: [{
        entryCount: 2,
        expiredEntryCount: 0,
        name: "desktop-default",
        providerKind: "local_cache",
        status: "ready",
      }],
      namespacePolicies: [{
        namespace: "auth.qr.challenge",
      }],
    });

    const deleteKeyOutcome = await manager.deleteKey("auth.qr.challenge", "qr-1");
    expect(deleteKeyOutcome).toMatchObject({
      cacheKey: "qr-1",
      deletedEntries: 1,
      namespace: "auth.qr.challenge",
      operation: "delete",
      status: "completed",
    });
    expect(deleteKeyOutcome).not.toHaveProperty("key");
    await expect(manager.facade.get("auth.qr.challenge", "qr-1")).resolves.toBeNull();

    await expect(manager.refreshInstance("desktop-default")).resolves.toMatchObject({
      instanceName: "desktop-default",
      operation: "refresh",
      refreshedEntries: 1,
      status: "completed",
    });

    await expect(manager.deleteNamespace("auth.qr.challenge")).resolves.toMatchObject({
      deletedEntries: 1,
      namespace: "auth.qr.challenge",
      operation: "delete_namespace",
      status: "completed",
    });
    await expect(manager.snapshot()).resolves.toMatchObject({
      summary: {
        totalEntries: 0,
        totalNamespaces: 1,
      },
    });
  });

  it("reports unknown cache management targets as not found errors", async () => {
    const manager = createSdkworkCacheManager({
      instances: [DESKTOP_INSTANCE],
      namespacePolicies: [DESKTOP_POLICY],
      runtimeTarget: "desktop_packaged",
      stores: [{
        instance: DESKTOP_INSTANCE,
        store: new SdkworkLocalCacheStore(),
      }],
    });

    await expect(manager.refreshInstance("missing-instance"))
      .rejects.toThrow(/Unknown cache instance: missing-instance/i);
    await expect(manager.deleteNamespace("missing.namespace"))
      .rejects.toThrow(/Unknown cache namespace policy: missing.namespace/i);
  });
});
