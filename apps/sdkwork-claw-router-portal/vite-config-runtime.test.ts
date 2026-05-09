import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import type { UserConfig } from "vite";

import portalViteConfig from "./vite.config.ts";

async function resolvePortalViteConfig(): Promise<UserConfig> {
  if (typeof portalViteConfig !== "function") {
    return portalViteConfig as UserConfig;
  }

  return portalViteConfig({
    command: "serve",
    mode: "development",
    isSsrBuild: false,
    isPreview: false,
  }) as UserConfig | Promise<UserConfig>;
}

test("dependency optimizer compiles workspace TSX with automatic React runtime", async () => {
  const config = await resolvePortalViteConfig();

  assert.equal(config.optimizeDeps?.esbuildOptions?.jsx, "automatic");
  assert.equal(config.optimizeDeps?.esbuildOptions?.jsxImportSource, "react");
});

test("dependency optimizer pre-bundles recharts instead of serving its mixed ESM and CommonJS sources", async () => {
  const config = await resolvePortalViteConfig();

  assert.ok(config.optimizeDeps?.include?.includes("recharts"));
  assert.ok(config.optimizeDeps?.needsInterop?.includes("es-toolkit/compat/get"));
});

test("API reference workspace package is not served from stale dependency optimizer cache", async () => {
  const config = await resolvePortalViteConfig();

  assert.ok(config.optimizeDeps?.exclude?.includes("sdkwork-claw-router-api-reference"));
});

test("SDK reference workspace package is not served from stale dependency optimizer cache", async () => {
  const config = await resolvePortalViteConfig();

  assert.ok(config.optimizeDeps?.exclude?.includes("sdkwork-claw-router-sdk-reference"));
});

test("portal dev server may serve workspace SDK sources resolved by aliases", async () => {
  const config = await resolvePortalViteConfig();
  const workspaceRoot = path.resolve(import.meta.dirname, "../..");

  assert.ok(config.server?.fs?.allow?.includes(workspaceRoot));
});

test("workspace package imports resolve to one React and router runtime instance", async () => {
  const config = await resolvePortalViteConfig();

  assert.deepEqual(config.resolve?.dedupe, [
    "react",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "react-dom",
    "react-dom/client",
    "react-router",
    "react-router/dom",
    "react-router-dom",
  ]);
});

test("react i18next parser dependencies resolve through explicit aliases under symlink preservation", async () => {
  const config = await resolvePortalViteConfig();
  const aliases = config.resolve?.alias;

  assert.ok(Array.isArray(aliases));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "html-parse-stringify"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find instanceof RegExp
    && alias.find.source === "^recharts$"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "void-elements"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "clsx"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "cookie"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "decimal.js-light"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find === "set-cookie-parser"
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find instanceof RegExp
    && alias.find.source.includes("es-toolkit")
  )));
  assert.ok(aliases.some((alias) => (
    typeof alias === "object"
    && alias !== null
    && "find" in alias
    && alias.find instanceof RegExp
    && alias.find.source.includes("victory-vendor")
  )));
});

test("production TypeScript transform does not allocate source maps when build sourcemaps are disabled", () => {
  const source = readFileSync(new URL("./vite.config.ts", import.meta.url), "utf8");

  assert.match(source, /const\s+ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS\s*=\s*false/);
  assert.match(source, /sourceMap:\s*ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS/);
  assert.match(source, /inlineSources:\s*ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS/);
  assert.match(source, /map:\s*ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS/);
  assert.doesNotMatch(source, /sourceMap:\s*true/);
  assert.doesNotMatch(source, /inlineSources:\s*true/);
});
