import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

const parserPath = "./packages/sdkwork-claw-router-admin-memberships/src/forms/membershipFormValues.ts";
const formFiles = [
  "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageDrawerForm.tsx",
  "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPackageGroupDrawerForm.tsx",
  "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPlanDrawerForm.tsx",
  "./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipRechargePackageDrawerForm.tsx",
];

test("admin membership drawer forms use shared strict value parsers", () => {
  assert.ok(existsSync(new URL(parserPath, import.meta.url)), "shared membership form value parser must exist");

  const parserSource = readPortalFile(parserPath);
  for (const exportedMember of [
    "MembershipFormValidationError",
    "formatMembershipFormValidationError",
    "parseOptionalNonNegativeIntegerField",
    "parseRequiredMoneyAmountField",
    "parseRequiredNonNegativeIntegerField",
    "parseRequiredPositiveIntegerField",
  ]) {
    assert.match(parserSource, new RegExp(`export (?:class|function) ${exportedMember}\\b`), `${exportedMember} must be exported by membership form values`);
  }

  for (const formFile of formFiles) {
    const source = readPortalFile(formFile);
    assert.match(source, /from '\.\/membershipFormValues'/, `${formFile} must import shared membership form value parsers`);
    assert.doesNotMatch(source, /\bfunction parse(?:Number|Integer|OptionalInteger)\b/, `${formFile} must not define local numeric parser helpers`);
    assert.doesNotMatch(source, /\bNumber\.parseInt\b/, `${formFile} must not use parseInt directly`);
    assert.doesNotMatch(source, /\bparseInt\s*\(/, `${formFile} must not use parseInt directly`);
  }

  const planFormSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/forms/MembershipPlanDrawerForm.tsx");
  assert.match(planFormSource, /\busageLimitText\b/, "plan form must preserve raw usage limit text until submit validation");
  assert.doesNotMatch(
    planFormSource,
    /onChange=\{\(value\) => updateBenefit\(index, \{ usageLimit:/,
    "plan benefit usage limit must not parse and discard invalid text during typing",
  );
});

test("membership form value parsers fail closed for invalid business numbers", async () => {
  const values = await import("./packages/sdkwork-claw-router-admin-memberships/src/forms/membershipFormValues.ts");

  assert.equal(values.parseRequiredPositiveIntegerField("30", "Duration"), 30);
  assert.equal(values.parseRequiredNonNegativeIntegerField("0", "Bonus"), 0);
  assert.equal(values.parseOptionalNonNegativeIntegerField("", "Usage limit"), undefined);
  assert.equal(values.parseOptionalNonNegativeIntegerField(" 12 ", "Usage limit"), 12);
  assert.equal(values.parseRequiredMoneyAmountField("10.50", "RMB Amount"), "10.50");

  assertValidationRule(() => values.parseRequiredPositiveIntegerField("", "Duration"), "required");
  assertValidationRule(() => values.parseRequiredPositiveIntegerField("0", "Duration"), "positiveInteger");
  assertValidationRule(() => values.parseRequiredPositiveIntegerField("1abc", "Duration"), "positiveInteger");
  assertValidationRule(() => values.parseRequiredPositiveIntegerField("1.5", "Duration"), "positiveInteger");
  assertValidationRule(() => values.parseRequiredNonNegativeIntegerField("-1", "Bonus"), "nonNegativeInteger");
  assertValidationRule(() => values.parseRequiredNonNegativeIntegerField("1abc", "Bonus"), "nonNegativeInteger");
  assertValidationRule(() => values.parseOptionalNonNegativeIntegerField("abc", "Usage limit"), "nonNegativeInteger");
  assertValidationRule(() => values.parseRequiredMoneyAmountField("", "RMB Amount"), "required");
  assertValidationRule(() => values.parseRequiredMoneyAmountField("10.999", "RMB Amount"), "moneyAmount");
  assertValidationRule(() => values.parseRequiredMoneyAmountField("-1", "RMB Amount"), "moneyAmount");

  const validationError = captureError(() => values.parseRequiredPositiveIntegerField("0", "Duration"));
  assert.ok(validationError instanceof values.MembershipFormValidationError);
  assert.equal(validationError.fieldLabel, "Duration");
  assert.equal(validationError.rule, "positiveInteger");

  const translated = values.formatMembershipFormValidationError(
    validationError,
    (key: string, fallback: string, options?: Record<string, unknown>) => `${key}:${fallback}:${String(options?.field)}`,
    "Fallback",
  );
  assert.equal(translated, "admin.commerce.memberships.formValidation.positiveInteger:Duration must be a positive integer:Duration");
  assert.equal(
    values.formatMembershipFormValidationError(new Error("backend failed"), () => "unused", "Fallback"),
    "backend failed",
  );
  assert.equal(
    values.formatMembershipFormValidationError("unknown", () => "unused", "Fallback"),
    "Fallback",
  );
});

function assertValidationRule(action: () => unknown, expectedRule: string): void {
  const error = captureError(action);
  assert.equal(error.rule, expectedRule);
}

function captureError(action: () => unknown): { fieldLabel?: string; rule?: string } {
  try {
    action();
  } catch (error) {
    return error as { fieldLabel?: string; rule?: string };
  }
  assert.fail("expected parser to throw a validation error");
}
