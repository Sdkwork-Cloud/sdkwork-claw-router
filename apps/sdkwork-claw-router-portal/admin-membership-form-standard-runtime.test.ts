import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin membership drawer forms share standardized form controls", () => {
  const controlsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipFormControls.tsx");
  const formFiles = [
    "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipMemberStatusDrawerForm.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageDrawerForm.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageGroupDrawerForm.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPlanDrawerForm.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipRechargePackageDrawerForm.tsx",
  ];

  for (const exportedComponent of [
    "MembershipFormActions",
    "MembershipFormError",
    "MembershipFormFrame",
    "MembershipSelectField",
    "MembershipTextField",
  ]) {
    assert.match(controlsSource, new RegExp(`export function ${exportedComponent}\\b`), `${exportedComponent} must be exported by shared membership form controls`);
  }

  assert.match(controlsSource, /useTranslation/);
  assert.match(controlsSource, /common\.actions\.cancel/);
  assert.match(controlsSource, /Loader2/);

  for (const formFile of formFiles) {
    const source = readPortalFile(formFile);
    assert.match(source, /from '\.\.\/components\/MembershipFormControls'/, `${formFile} must import shared form controls`);
    assert.match(source, /<MembershipFormFrame\b/, `${formFile} must render the shared frame and error region`);
    assert.match(source, /<MembershipFormActions\b/, `${formFile} must render the shared action bar`);
    assert.doesNotMatch(source, /\bLoader2\b/, `${formFile} must not own the saving indicator implementation`);
    assert.doesNotMatch(source, /function (?:FormActions|FormError|FormFrame|SelectField|TextField)\b/, `${formFile} must not define duplicate local form controls`);
  }
});
