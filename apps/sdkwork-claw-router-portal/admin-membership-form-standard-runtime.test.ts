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

test("admin membership package group form generates code on create and uses billing cycle options", () => {
  const groupFormSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageGroupDrawerForm.tsx");

  assert.match(groupFormSource, /function buildPackageGroupCode\b/, "package group form must generate the group code internally");
  assert.match(groupFormSource, /mode === 'edit'[\s\S]*initialValue\?\.code[\s\S]*buildPackageGroupCode\(name\)/, "create mode must generate code from the group name while edit mode keeps the original code");
  assert.doesNotMatch(groupFormSource, /setCode\b/, "package group form must not expose manually edited group code state");
  assert.doesNotMatch(groupFormSource, /groups\.form\.code[\s\S]*<MembershipTextField/, "package group create form must not render a manual code text field");
  assert.match(groupFormSource, /<MembershipSelectField[\s\S]*groups\.form\.billingCycle[\s\S]*billingCycleOptions/, "billing cycle must be rendered as a select field");
  assert.match(groupFormSource, /durationDayOptions[\s\S]*<MembershipSelectField[\s\S]*groups\.form\.duration/, "duration must be rendered as a select field");
  assert.match(groupFormSource, /onChange=\{\(value\) => handleBillingCycleChange\(normalizeBillingCycle\(value\)\)\}/, "changing billing cycle must update duration consistently");

  for (const expectedCycle of [
    "one_time",
    "day",
    "week",
    "month",
    "quarter",
    "year",
  ]) {
    assert.match(groupFormSource, new RegExp(`value: '${expectedCycle}'`), `billing cycle option ${expectedCycle} must be available`);
  }

  for (const expectedDuration of ["1", "7", "30", "90", "365"]) {
    assert.match(groupFormSource, new RegExp(`value: '${expectedDuration}'`), `duration option ${expectedDuration} must be available`);
  }
});

test("admin membership package form generates code and uses select-backed fixed options", () => {
  const packageFormSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageDrawerForm.tsx");

  assert.match(packageFormSource, /function buildMembershipPackageCode\b/, "package form must generate the package code internally");
  assert.match(packageFormSource, /mode === 'edit'[\s\S]*initialValue\?\.packageNo[\s\S]*buildMembershipPackageCode\(name\)/, "create mode must generate package code from the package name while edit mode keeps the original package number");
  assert.doesNotMatch(packageFormSource, /setCode\b/, "package form must not expose manually edited package code state");
  assert.doesNotMatch(packageFormSource, /form\.code[\s\S]*<MembershipTextField/, "package form must not render a manual package code text field");
  assert.match(packageFormSource, /currencyCodeOptions[\s\S]*<MembershipSelectField[\s\S]*form\.currency/, "currency code must be rendered as a select field");
  assert.match(packageFormSource, /durationDayOptions[\s\S]*<MembershipSelectField[\s\S]*form\.duration/, "duration must be rendered as a select field");

  for (const expectedCurrency of ["CNY", "USD"]) {
    assert.match(packageFormSource, new RegExp(`value: '${expectedCurrency}'`), `currency option ${expectedCurrency} must be available`);
  }

  for (const expectedDuration of ["1", "7", "30", "90", "365"]) {
    assert.match(packageFormSource, new RegExp(`value: '${expectedDuration}'`), `duration option ${expectedDuration} must be available`);
  }
});

test("admin membership plan form generates code on create", () => {
  const planFormSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPlanDrawerForm.tsx");

  assert.match(planFormSource, /function buildMembershipPlanCode\b/, "plan form must generate the plan code internally");
  assert.match(planFormSource, /mode === 'edit'[\s\S]*initialValue\?\.(?:planNo|levelCode)[\s\S]*buildMembershipPlanCode\(name\)/, "create mode must generate plan code from the plan name while edit mode keeps the original plan code");
  assert.doesNotMatch(planFormSource, /setCode\b/, "plan form must not expose manually edited plan code state");
  assert.doesNotMatch(planFormSource, /plans\.form\.code[\s\S]*<MembershipTextField/, "plan form must not render a manual plan code text field");
  assert.match(planFormSource, /<MembershipSelectField[\s\S]*plans\.form\.benefitType[\s\S]*benefitTypeOptions/, "benefit type must be rendered as a select field");
  assert.doesNotMatch(planFormSource, /<MembershipTextField[^\n]*plans\.form\.benefitType/, "benefit type must not be a free text field");

  for (const expectedBenefitType of ["quota", "feature", "discount", "service"]) {
    assert.match(planFormSource, new RegExp(`value: '${expectedBenefitType}'`), `benefit type option ${expectedBenefitType} must be available`);
  }
});
