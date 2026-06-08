import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getAdminModuleMenu } from "./src/adminModuleRegistry.ts";

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

test("admin messaging center exposes a complete email delivery menu", () => {
  const navigationSource = readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-navigation.ts");
  const menu = getAdminModuleMenu("messagingCenter");
  const configuredPaths = menu.groups.flatMap((group) => group.items.map((item) => item.path));

  assert.deepEqual(configuredPaths, [
    "/admin/messaging/providers",
    "/admin/messaging/sender-identities",
    "/admin/messaging/templates",
    "/admin/messaging/route-rules",
    "/admin/messaging/send-requests",
    "/admin/messaging/diagnostics",
    "/admin/messaging/suppressions",
    "/admin/messaging/rate-limits",
    "/admin/messaging/verification-policies",
  ]);

  for (const expected of [
    '"admin.header.messagingCenter": "Email & Messaging"',
    '"admin.menu.messagingCenter.configuration": "Email Delivery Configuration"',
    '"admin.menu.messagingCenter.operations": "Email Delivery Operations"',
    '"admin.menu.messagingCenter.governance": "Email Delivery Governance"',
    '"admin.menu.messaging.providers": "Email/SMS Provider Accounts"',
    '"admin.menu.messaging.senderIdentities": "Email Sender Identities"',
    '"admin.menu.messaging.templates": "Email & Message Templates"',
    '"admin.menu.messaging.routeRules": "Delivery Route Rules"',
    '"admin.menu.messaging.sendRequests": "Delivery Requests"',
    '"admin.menu.messaging.diagnostics": "Delivery Diagnostics"',
    '"admin.menu.messaging.suppressions": "Email Suppressions"',
    '"admin.menu.messaging.rateLimits": "Delivery Rate Limits"',
    '"admin.menu.messaging.verificationPolicies": "Verification Code Policies"',
    '"admin.header.messagingCenter": "邮件与消息"',
    '"admin.menu.messagingCenter.configuration": "邮件投递配置"',
    '"admin.menu.messagingCenter.operations": "邮件投递运营"',
    '"admin.menu.messagingCenter.governance": "邮件投递治理"',
    '"admin.menu.messaging.providers": "邮件/短信服务商账号"',
    '"admin.menu.messaging.senderIdentities": "邮件发信身份"',
    '"admin.menu.messaging.templates": "邮件与消息模板"',
    '"admin.menu.messaging.routeRules": "投递路由规则"',
    '"admin.menu.messaging.sendRequests": "投递请求"',
    '"admin.menu.messaging.diagnostics": "投递诊断"',
    '"admin.menu.messaging.suppressions": "邮件退订与屏蔽"',
    '"admin.menu.messaging.rateLimits": "投递限流"',
    '"admin.menu.messaging.verificationPolicies": "验证码策略"',
  ]) {
    assert.ok(navigationSource.includes(expected), `missing email menu i18n: ${expected}`);
  }
});
