import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin messaging center follows the usage page adaptive viewport pattern", () => {
  const messagingSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-messaging/src/index.tsx");
  const adminResourceCenterSource = readPortalFile("./packages/sdkwork-clawrouter-pc-commons/src/components/AdminResourceCenter.tsx");

  for (const expected of [
    'data-admin-messaging="delivery-center"',
    "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden",
    "overflow-hidden",
  ]) {
    assert.ok(messagingSource.includes(expected), `missing adaptive messaging viewport marker: ${expected}`);
  }

  assert.doesNotMatch(messagingSource, /h-\[calc\(100vh-/);

  for (const expected of [
    "custom-scrollbar",
    "className=\"flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 custom-scrollbar\"",
    "viewportClassName=\"min-h-0 flex-1 custom-scrollbar\"",
  ]) {
    assert.ok(adminResourceCenterSource.includes(expected), `missing reusable resource viewport marker: ${expected}`);
  }
});
