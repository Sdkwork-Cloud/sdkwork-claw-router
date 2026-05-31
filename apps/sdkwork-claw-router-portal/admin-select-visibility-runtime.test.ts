import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("portal global styles keep native select dropdown options readable in light and dark themes", () => {
  const source = readPortalFile("./src/index.css");

  assert.match(
    source,
    /select,\s*option,\s*optgroup\s*\{[\s\S]*color:\s*#0f172a;[\s\S]*background-color:\s*#ffffff;[\s\S]*\}/,
    "global light theme select option colors must stay readable",
  );
  assert.match(
    source,
    /\.dark\s+:is\(select,\s*option,\s*optgroup\)\s*\{[\s\S]*color:\s*#f8fafc;[\s\S]*background-color:\s*#202020;[\s\S]*\}/,
    "global dark theme select option colors must stay readable",
  );
});

test("membership shared select field declares readable light and dark control colors", () => {
  const source = readPortalFile(
    "./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipFormControls.tsx",
  );

  assert.match(
    source,
    /className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white\/20 dark:bg-white\/5 dark:text-white"/,
    "membership shared select field must define explicit readable foreground and background colors",
  );
});
