# @sdkwork/cache-core

Framework-level cache contracts, instance registry, runtime binding, and cache facade primitives.

## Runtime Model

`@sdkwork/cache-core` is the common cache boundary for SDKWork apps and
services. Product code talks to namespaces through the facade and never depends
on a concrete cache adapter.

- Provider kinds are `local_cache` and `redis_cache`.
- Desktop packaged runtimes use `local_cache`.
- Server, Docker, Kubernetes, and other service runtimes use `redis_cache`.
- A runtime may define multiple cache instances. Namespace policies decide
  which instance stores each namespace.
- Cache instance `keyPrefix` values must be unique and non-overlapping. For
  example, `service` and `service:auth` must not be used together. They must
  also be normalized, with no leading/trailing whitespace and no leading or
  trailing `:`.
- Redis connection details live in named connection profiles and should point to
  secret references instead of embedding passwords in browser-visible config.

## Core Concepts

`SdkworkCacheInstanceSpec` describes one cache instance: provider kind, key
prefix, default TTL, runtime targets, sensitivity, optional max entries, and
optional Redis connection profile.

`SdkworkCacheNamespacePolicy` describes one cache namespace: instance binding,
TTL, scope, sensitivity, consistency level, failure mode, jitter, tags, and
enablement.

`SdkworkCacheFacade` is the application-facing API. It supports `get`, `set`,
`delete`, and `resolveInstance` with namespace-based routing.

`SdkworkCacheManager` is the operations-facing API. It supports:

- `snapshot()` for admin overview pages and health inspection.
- `refreshAll()` and `refreshInstance()` for expired-entry cleanup or adapter
  maintenance.
- `deleteNamespace()` for namespace-wide invalidation.
- `deleteKey()` for precise key invalidation.

Management operations are always scoped by the cache instance key prefix. This
is required because multiple cache instances may share the same Redis database
or Redis driver while remaining operationally isolated by `keyPrefix`.

## Required Binding

Desktop packaged mode must bind only local cache instances:

```ts
createSdkworkCacheManager({
  instances: [desktopInstance],
  namespacePolicies: [qrLoginPolicy],
  runtimeTarget: "desktop_packaged",
  stores: [{ instance: desktopInstance, store: new SdkworkLocalCacheStore() }],
});
```

Service mode must bind only Redis cache instances:

```ts
createSdkworkCacheManager({
  connectionProfiles: [{ name: "primary-redis", host: "127.0.0.1", port: 6379 }],
  instances: [serviceInstance],
  namespacePolicies: [qrLoginPolicy],
  runtimeTarget: "service",
  stores: [{ instance: serviceInstance, store: new SdkworkRedisCacheStore(redisDriver) }],
});
```

`SdkworkRedisCacheStore` is an adapter wrapper around an injected Redis driver.
Production code must provide a real Redis-backed driver. Tests may use
`SdkworkInMemoryRedisCacheDriver` to exercise framework routing without a Redis
server.

## QR Login Example

QR login challenges should use a short-lived, session-scoped namespace:

```ts
const qrPolicy = {
  consistency: "coordination_critical",
  enabled: true,
  failureMode: "fail_closed",
  instanceName: "service-default",
  jitterPercent: 5,
  namespace: "auth.qr.challenge",
  scope: "session",
  sensitivity: "sensitive",
  tags: ["auth", "qr", "login"],
  ttlSeconds: 300,
} as const;
```

Desktop uses local cache for this namespace. Server deployments use Redis so QR
create, polling, and confirmation survive process boundaries and are not
regenerated too frequently.

## Admin Management Standard

Admin cache pages should call product/backend APIs backed by `SdkworkCacheManager`
semantics instead of reaching into adapter internals.

Required admin capabilities:

- list runtime target, instances, namespace policies, active entries, and
  expired entries;
- refresh all instances;
- refresh one instance;
- delete all keys under a namespace;
- delete one key under a namespace.

Unknown cache instances or namespaces are not system failures. Management APIs
should map them to not-found responses.

Admin statistics and refresh operations must not scan or count unrelated Redis
keys. The cache manager passes an instance prefix to the bound store, and the
store is responsible for applying prefix-scoped `SCAN`, `DEL`, stats, and
refresh semantics.

## Verification

Run from `apps/sdkwork-appbase`:

```sh
pnpm exec vitest run packages/common/foundation/sdkwork-cache-core/tests/cache-core.standard.test.ts --config vitest.config.ts --configLoader native --pool vmThreads
pnpm exec tsc -p packages/common/foundation/sdkwork-cache-core/tsconfig.json --noEmit
```
