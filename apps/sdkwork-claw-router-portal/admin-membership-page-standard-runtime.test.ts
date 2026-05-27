import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin membership pages share standardized table and action controls", () => {
  const controlsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipPageControls.tsx");
  const shellSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipAdminPageShell.tsx");
  const tablePages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipEntitlementsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];
  const mutationPages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];
  const destructivePages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];

  for (const exportedMember of [
    "MembershipIconActionButton",
    "MembershipTableActions",
    "MembershipTablePanel",
    "confirmMembershipAction",
  ]) {
    assert.match(controlsSource, new RegExp(`export (?:function|const) ${exportedMember}\\b`), `${exportedMember} must be exported by shared membership page controls`);
  }

  assert.match(controlsSource, /aria-label=\{label\}/);
  assert.match(controlsSource, /title=\{label\}/);
  assert.match(controlsSource, /window\.confirm\(message\)/);
  assert.match(shellSource, /className="[^"]*justify-end[^"]*"/, "membership shell must keep only a compact right-aligned action toolbar");
  assert.doesNotMatch(shellSource, /\n\s+(?:title|description): string/, "membership shell must not expose duplicate page header props");
  assert.doesNotMatch(shellSource, /<h3[^>]*>\{title\}<\/h3>/, "membership shell must not render a duplicate page title");
  assert.doesNotMatch(shellSource, /\{description\}/, "membership shell must not render duplicate page description copy");

  for (const pageFile of tablePages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /from '\.\.\/components\/MembershipPageControls'/, `${pageFile} must import shared page controls`);
    assert.match(source, /<MembershipTablePanel\b/, `${pageFile} must wrap tables in the shared table panel`);
    assert.doesNotMatch(source, /<MembershipAdminPageShell\s*\n\s+title=\{/, `${pageFile} must not pass duplicate page titles to the shell`);
    assert.doesNotMatch(source, /^\s+description=\{/m, `${pageFile} must not pass duplicate page descriptions to the shell`);
    assert.doesNotMatch(source, /overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white\/10 dark:bg-white\/5/, `${pageFile} must not duplicate the table panel class`);
  }

  for (const pageFile of mutationPages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /<MembershipIconActionButton\b/, `${pageFile} must use the shared icon action button`);
  }

  for (const pageFile of destructivePages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /confirmMembershipAction\(/, `${pageFile} must route destructive confirmations through shared confirm helper`);
    assert.doesNotMatch(source, /window\.confirm\(/, `${pageFile} must not call window.confirm directly`);
  }
});
