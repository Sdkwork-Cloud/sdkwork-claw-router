import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function portalPathExists(relativePath: string): boolean {
  return existsSync(new URL(relativePath, import.meta.url));
}

test("console agent route and sidebar menu are removed from the portal shell", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const layoutSource = readPortalFile("./packages/sdkwork-claw-router-console-core/src/ConsoleLayout.tsx");
  const packageJson = readPortalFile("./package.json");

  assert.doesNotMatch(appSource, /sdkwork-claw-router-console-agents/);
  assert.doesNotMatch(appSource, /const AgentsView\b/);
  assert.doesNotMatch(appSource, /\/console\/agents/);

  assert.doesNotMatch(layoutSource, /console\.menu\.group\.aiWorkspace/);
  assert.doesNotMatch(layoutSource, /console\.menu\.agents/);
  assert.doesNotMatch(layoutSource, /\/console\/agents/);
  assert.doesNotMatch(layoutSource, /\bBot\b/);

  assert.doesNotMatch(packageJson, /sdkwork-claw-router-console-agents/);
});

test("console agent local package and i18n bundle are removed", () => {
  const resourcesIndex = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/index.ts");
  const consoleCoreMessages = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/console/core.ts");

  assert.equal(portalPathExists("./packages/sdkwork-claw-router-console-agents/package.json"), false);
  assert.equal(portalPathExists("./packages/sdkwork-claw-router-console-agents/src/index.ts"), false);
  assert.equal(portalPathExists("./packages/sdkwork-claw-router-console-agents/src/AgentsView.tsx"), false);
  assert.equal(portalPathExists("./packages/sdkwork-claw-router-console-agents/src/agentService.ts"), false);
  assert.equal(portalPathExists("./packages/sdkwork-claw-router-console-agents/src/agentRuntimeApiOperations.ts"), false);
  assert.equal(portalPathExists("./packages/sdkwork-claw-router-i18n/src/resources/console/agents.ts"), false);

  assert.doesNotMatch(resourcesIndex, /consoleAgentsMessages/);
  assert.doesNotMatch(resourcesIndex, /\.\/console\/agents/);
  assert.doesNotMatch(consoleCoreMessages, /console\.menu\.group\.aiWorkspace/);
  assert.doesNotMatch(consoleCoreMessages, /console\.menu\.agents/);
});

test("console workspace lockfile no longer links the removed agent package", () => {
  const lockfile = readPortalFile("./pnpm-lock.yaml");

  assert.doesNotMatch(lockfile, /sdkwork-claw-router-console-agents/);
  assert.doesNotMatch(lockfile, /packages\/sdkwork-claw-router-console-agents/);
});

test("console agent retirement is reflected in schema governance", () => {
  const contractIndex = readPortalFile("../../docs/schema-registry/frontend-field-contracts/index.yaml");
  const contractRoutes = readPortalFile("../../docs/schema-registry/frontend-field-contracts/routes/routes.yaml");
  const compiledContract = readPortalFile("../../docs/schema-registry/frontend-field-contracts.yaml");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  for (const source of [contractIndex, contractRoutes, compiledContract, routeClassification]) {
    assert.doesNotMatch(source, /\/console\/agents/);
    assert.doesNotMatch(source, /sdkwork-claw-router-console-agents/);
    assert.doesNotMatch(source, /console-agents\.yaml/);
  }
});
