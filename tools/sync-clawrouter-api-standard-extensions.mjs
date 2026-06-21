import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
]);

const TARGETS = [
  {
    surface: "app-api",
    apiSurface: "app",
    packageName: "sdkwork-router-app-api",
    capability: "router",
    apiAuthority: "sdkwork-clawrouter-app-api",
    sdkFamily: "clawrouter-app-sdk",
    prefix: "/app/v3/api",
    crateRoot: "crates/sdkwork-router-app-api",
    openApiPaths: [
      "apis/app-api/clawrouter/clawrouter-app-api.openapi.json",
      "generated/openapi/clawrouter-app-openapi.json",
    ],
    routeManifestPath:
      "sdks/_route-manifests/app-api/sdkwork-router-app-api.route-manifest.json",
  },
  {
    surface: "backend-api",
    apiSurface: "backend",
    packageName: "sdkwork-router-backend-api",
    capability: "router",
    apiAuthority: "sdkwork-clawrouter-backend-api",
    sdkFamily: "clawrouter-backend-sdk",
    prefix: "/backend/v3/api",
    crateRoot: "crates/sdkwork-router-backend-api",
    openApiPaths: [
      "apis/backend-api/clawrouter/clawrouter-backend-api.openapi.json",
      "generated/openapi/clawrouter-backend-openapi.json",
    ],
    routeManifestPath:
      "sdks/_route-manifests/backend-api/sdkwork-router-backend-api.route-manifest.json",
  },
  {
    surface: "open-api",
    apiSurface: "open",
    packageName: "sdkwork-router-open-api",
    capability: "router",
    apiAuthority: "sdkwork-clawrouter-open-api",
    sdkFamily: "clawrouter-open-sdk",
    prefix: "/v1",
    crateRoot: "crates/sdkwork-router-llm-open-api",
    openApiPaths: [
      "apis/open-api/clawrouter/clawrouter-open-api.openapi.json",
      "sdks/clawrouter-open-sdk/openapi/clawrouter-open-sdk.openapi.json",
    ],
    routeManifestPath:
      "sdks/_route-manifests/open-api/sdkwork-router-open-api.route-manifest.json",
  },
];

function parseArgs(argv) {
  return {
    apply: argv.includes("--apply"),
    check: argv.includes("--check") || !argv.includes("--apply"),
  };
}

function inferAuth(operation) {
  const security = Array.isArray(operation.security) ? operation.security : [];
  if (security.length === 0) {
    return { mode: "public", required: false };
  }
  const names = Object.keys(security[0] ?? {});
  if (names.includes("ApiKeyAuth") || names.includes("X-API-Key")) {
    return { mode: "api-key", required: true };
  }
  return { mode: "dual-token", required: true };
}

function stampOpenApiExtensions(document, target) {
  let changed = 0;
  const paths = document.paths ?? {};
  for (const [routePath, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method) || !operation || typeof operation !== "object") {
        continue;
      }
      const extensions = {
        "x-sdkwork-owner": "sdkwork-clawrouter",
        "x-sdkwork-api-authority": target.apiAuthority,
        "x-sdkwork-request-context": "WebRequestContext",
        "x-sdkwork-api-surface": target.apiSurface,
        "x-sdkwork-source-route-crate": target.packageName,
      };
      for (const [key, value] of Object.entries(extensions)) {
        if (operation[key] !== value) {
          operation[key] = value;
          changed += 1;
        }
      }
      if (!operation.operationId && routePath) {
        operation.operationId = `${method}.${routePath.replace(/[{}]/g, "")}`;
        changed += 1;
      }
    }
  }
  return changed;
}

function buildRouteManifest(document, target) {
  const routes = [];
  const paths = document.paths ?? {};
  for (const [routePath, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method) || !operation || typeof operation !== "object") {
        continue;
      }
      routes.push({
        method: method.toUpperCase(),
        path: routePath,
        operationId: operation.operationId ?? null,
        tags: Array.isArray(operation.tags) ? operation.tags : [],
        auth: inferAuth(operation),
        handler: {
          module: "crate::routes",
          name: null,
        },
        ownership: {
          owner: "sdkwork-clawrouter",
          apiAuthority: target.apiAuthority,
        },
        requestContext: "WebRequestContext",
        apiSurface: target.apiSurface,
      });
    }
  }

  return {
    schemaVersion: 1,
    kind: "sdkwork.route.manifest",
    packageName: target.packageName,
    surface: target.surface,
    owner: "sdkwork-clawrouter",
    domain: "platform",
    capability: target.capability,
    apiAuthority: target.apiAuthority,
    sdkFamily: target.sdkFamily,
    prefix: target.prefix,
    source: {
      crateRoot: target.crateRoot,
      crateImport: target.packageName.replaceAll("-", "_"),
      openApiAuthority: target.openApiPaths[0],
    },
    routes,
  };
}

async function processTarget(target, mode) {
  const primaryOpenApiPath = path.join(workspaceRoot, target.openApiPaths[0]);
  const document = JSON.parse(await readFile(primaryOpenApiPath, "utf8"));
  const stampedChanges = stampOpenApiExtensions(document, target);
  const routeManifest = buildRouteManifest(document, target);
  const manifestJson = `${JSON.stringify(routeManifest, null, 2)}\n`;
  const openApiJson = `${JSON.stringify(document, null, 2)}\n`;
  const manifestSha = createHash("sha256").update(manifestJson).digest("hex");

  const outputs = [
    ...target.openApiPaths.map((relativePath) => ({
      relativePath,
      content: openApiJson,
    })),
    {
      relativePath: target.routeManifestPath,
      content: manifestJson,
    },
  ];

  const messages = [];
  for (const output of outputs) {
    const absolutePath = path.join(workspaceRoot, output.relativePath);
    let existing = null;
    try {
      existing = await readFile(absolutePath, "utf8");
    } catch {
      existing = null;
    }
    if (existing === output.content) {
      messages.push(`ok ${output.relativePath}`);
      continue;
    }
    if (mode.check) {
      messages.push(`drift ${output.relativePath}`);
      continue;
    }
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, output.content, "utf8");
    messages.push(`wrote ${output.relativePath}`);
  }

  return {
    stampedChanges,
    routeCount: routeManifest.routes.length,
    manifestSha,
    messages,
  };
}

async function main() {
  const mode = parseArgs(process.argv.slice(2));
  const summaries = [];
  for (const target of TARGETS) {
    summaries.push({
      surface: target.surface,
      ...(await processTarget(target, mode)),
    });
  }

  const drift = summaries.flatMap((summary) =>
    summary.messages.filter((message) => message.startsWith("drift ")),
  );
  for (const summary of summaries) {
    console.log(
      `[${summary.surface}] routes=${summary.routeCount} stamped=${summary.stampedChanges} manifestSha=${summary.manifestSha}`,
    );
    for (const message of summary.messages) {
      console.log(`  ${message}`);
    }
  }

  if (mode.check && drift.length > 0) {
    console.error(`OpenAPI/route-manifest standard extensions are out of date (${drift.length} files).`);
    process.exitCode = 1;
  }
}

await main();
