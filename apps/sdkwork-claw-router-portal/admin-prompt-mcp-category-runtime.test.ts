import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const PORTAL_ROOT = import.meta.dirname;

function readPortalFile(relativePath: string): string {
  return readFileSync(resolve(PORTAL_ROOT, relativePath), "utf8");
}

test("admin prompt and mcp pages use left category management instead of section sidebar", () => {
  const promptSource = readPortalFile("packages/sdkwork-claw-router-admin-prompts/src/index.tsx");
  const mcpSource = readPortalFile("packages/sdkwork-claw-router-admin-mcp/src/index.tsx");
  const categoryTreePath = resolve(PORTAL_ROOT, "packages/sdkwork-claw-router-commons/src/components/AdminCategoryManagementSidebar.tsx");

  assert.ok(existsSync(categoryTreePath), "shared admin category management sidebar must exist");

  for (const [name, source, rootAttribute] of [
    ["prompts", promptSource, "admin-prompts-category-management"],
    ["mcp", mcpSource, "admin-mcp-category-management"],
  ] as const) {
    assert.match(source, /AdminCategoryManagementSidebar/);
    assert.match(source, new RegExp(`dataAttribute="${rootAttribute}"`));
    assert.match(source, /selectedCategoryId/);
    assert.match(source, /categoryModalState/);
    assert.match(source, /deleteCategoryTarget/);
    assert.match(source, /showSectionNavigation=\{false\}/);
    assert.doesNotMatch(source, /<div className="flex shrink-0 flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm[\s\S]*scope\.(?:prompt|server)/);
    assert.match(source, /activeSectionId=\{activeSectionId\}/, `${name} section tabs must be controlled outside the left sidebar`);
  }
});

test("admin prompt and mcp category management uses generated backend SDK category CRUD", () => {
  const categorySource = readPortalFile("packages/sdkwork-claw-router-commons/src/admin-category-options.ts");
  const promptServiceSource = readPortalFile("packages/sdkwork-claw-router-admin-prompts/src/promptService.ts");
  const mcpServiceSource = readPortalFile("packages/sdkwork-claw-router-admin-mcp/src/mcpService.ts");

  assert.match(categorySource, /createAdminAiCategory/);
  assert.match(categorySource, /updateAdminAiCategory/);
  assert.match(categorySource, /deleteAdminAiCategory/);
  assert.match(categorySource, /\.ecosystem\.skills\.categories\.create\(/);
  assert.match(categorySource, /\.ecosystem\.skills\.categories\.update\(/);
  assert.match(categorySource, /\.ecosystem\.skills\.categories\.delete\(/);
  assert.doesNotMatch(categorySource, /\bfetch\s*\(/);
  assert.doesNotMatch(categorySource, /\baxios\b/);
  assert.doesNotMatch(categorySource, /\/backend\/v3\/api/);

  assert.match(promptServiceSource, /normalizePromptListParams/);
  assert.match(promptServiceSource, /categoryId:\s*optionalPromptListCategoryId/);
  assert.match(mcpServiceSource, /normalizeMcpServerListParams/);
  assert.match(mcpServiceSource, /categoryId:\s*optionalMcpListCategoryId/);
});
