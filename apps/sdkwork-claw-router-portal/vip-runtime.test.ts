import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { MembershipService } from "./packages/sdkwork-claw-router-console-memberships/src/membershipService.ts";
import { VipService } from "./packages/sdkwork-claw-router-vip/src/vipService.ts";

type CapturedSdkRequest = {
  body: string;
  method: string;
  url: string;
};

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

async function withMembershipSdkResponse<T>(
  responseBody: unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  return withMembershipSdkResponses(() => responseBody, fn);
}

async function withMembershipSdkResponses<T>(
  responseForRequest: (path: string) => unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      body: typeof init?.body === "string" ? init.body : "",
      method: init?.method ?? "GET",
      url,
    });
    return new Response(JSON.stringify(responseForRequest(requestPath(url))), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("VIP purchase page remains a dedicated product module backed by standard membership APIs", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const packageJson = readPortalFile("./package.json");
  const lockfile = readPortalFile("./pnpm-lock.yaml");
  const workspace = readPortalFile("./pnpm-workspace.yaml");
  const tsconfig = readPortalFile("./tsconfig.typecheck.json");
  const viteConfig = readPortalFile("./vite.config.ts");
  const navbarSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/components/Navbar.tsx");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");

  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-console-memberships/package.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-admin-memberships/package.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-vip/package.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-vip/src/VipView.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-vip/src/vipService.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("./packages/sdkwork-claw-router-admin-vip", import.meta.url)), false);

  assert.match(appSource, /const VipView = lazyRoute\(\(\) => import\('sdkwork-claw-router-vip'\), 'VipView'\)/);
  assert.match(appSource, /<Route path="\/vip" element=\{<VipView \/>\} \/>/);
  assert.match(appSource, /const MembershipsView = lazyRoute\(\(\) => import\('sdkwork-claw-router-console-memberships'\), 'MembershipsView'\)/);
  assert.match(appSource, /<Route path="memberships" element=\{<MembershipsView \/>\} \/>/);
  assert.match(appSource, /const MembershipsAdmin = lazyRoute(?:<[^>]+>)?\(\(\) => import\('sdkwork-claw-router-admin-memberships'\), 'MembershipsAdmin'\)/);
  assert.match(appSource, /<Route path="memberships" element=\{<Navigate to="\/admin\/memberships\/packages" replace \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/packages" element=\{<MembershipsAdmin sectionId="packages" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/members" element=\{<MembershipsAdmin sectionId="members" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/entitlements" element=\{<MembershipsAdmin sectionId="entitlements" \/>} \/>/);
  assert.match(navbarSource, /t\('nav\.buyVip', 'Buy VIP'\)/u);
  assert.match(navbarSource, /href: '\/vip'/u);
  assert.match(packageJson, /"sdkwork-claw-router-vip": "workspace:\*"/);
  assert.match(packageJson, /"sdkwork-claw-router-console-memberships": "workspace:\*"/);
  assert.match(packageJson, /"sdkwork-claw-router-admin-memberships": "workspace:\*"/);
  assert.match(lockfile, /sdkwork-claw-router-vip:/);
  assert.match(tsconfig, /"sdkwork-claw-router-vip"/);
  assert.match(tsconfig, /"sdkwork-claw-router-console-memberships"/);
  assert.match(tsconfig, /"sdkwork-claw-router-admin-memberships"/);
  assert.match(routeClassification, /route: \/vip[\s\S]*package: sdkwork-claw-router-vip[\s\S]*api_surface: app/);
  assert.match(routeClassification, /route: \/console\/memberships[\s\S]*package: sdkwork-claw-router-console-memberships[\s\S]*api_surface: app/);
  assert.match(routeClassification, /route: \/admin\/memberships[\s\S]*package: sdkwork-claw-router-admin-memberships[\s\S]*api_surface: backend/);

  for (const retiredToken of [
    "sdkwork-claw-router-admin-vip",
    "@sdkwork/vip-pc-react",
    "@sdkwork/vip-admin-pc-react",
    "@sdkwork/vip-purchase-pc-react",
    "@sdkwork/subscription-pc-react",
    "@sdkwork/payment-pc-react",
    "@sdkwork/coupon-pc-react",
    "/admin/vip",
    "/app/v3/api/billing/vip",
    "/backend/v3/api/billing/vip",
    "/app/v3/api/vip",
    "/backend/v3/api/vip",
  ]) {
    const pattern = new RegExp(escapeRegExp(retiredToken));
    assert.doesNotMatch(appSource, pattern);
    assert.doesNotMatch(packageJson, pattern);
    assert.doesNotMatch(lockfile, pattern);
    assert.doesNotMatch(tsconfig, pattern);
    assert.doesNotMatch(viteConfig, pattern);
    assert.doesNotMatch(routeClassification, pattern);
  }

  assert.match(workspace, /sdkwork-appbase\/packages\/common\/commerce\/\*/);
});

test("VIP service preserves product purchase APIs while using generated app SDK membership paths", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/vipService.ts");
  const indexSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/index.ts");

  for (const marker of [
    "VipView",
    "VipPurchasePage",
    "VipPurchaseModal",
    "formatRechargeCurrencyAmount",
    "VipService.fetchVipCatalog",
    "VipService.purchaseVipPackage",
    "handlePurchase",
    "purchaseErrorMsg",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredMarker of [
    "selectedPackageId",
    "selectedPackage",
    "vip.selectedPackage",
    "vip.notSelected",
    "qrPayloadLabel",
    "break-all text-[10px]",
  ]) {
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredMarker)));
  }

  for (const purchaseModalMarker of [
    "paymentDialog",
    "vip.paymentTitle",
    "vip.paymentScanTitle",
    "vip.paymentAgreement",
    "vip.paymentRequestNo",
    "vip.paymentClose",
    "bg-[#24282d]",
    "grid-cols-[minmax(0,1.05fr)_auto_minmax(280px,0.9fr)]",
    "qrCodePayload",
    "readMediaResourceUrl(paymentDialog.qrCode)",
    "toDataURL(paymentDialog.qrCodePayload",
    "handlePurchase(pkg)",
    "onPurchased?.()",
    "variant === 'modal'",
    "aria-modal=\"true\"",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(purchaseModalMarker)));
  }

  assert.match(indexSource, /export \{ VipView, VipPurchasePage, VipPurchaseModal \} from '\.\/VipView'/);

  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.current\.retrieve\(\)/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packageGroups\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packageGroups\.packages\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.purchases\.create/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.system\.promotions\.codes\.redemptions\.create/);
  assert.doesNotMatch(serviceSource, /commerce\.coupons/);
  assert.doesNotMatch(serviceSource, /fetch\(/);
  assert.doesNotMatch(serviceSource, /axios/);
  assert.doesNotMatch(serviceSource, /billing\(\)\.vip|\/billing\/vip|\/app\/v3\/api\/vip|\/backend\/v3\/api\/vip/);
});

test("VIP public page skips current membership and current user requests when no portal session is stored", async () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/vipService.ts");

  assert.match(viewSource, /hasStoredPortalSession/);
  assert.match(viewSource, /if \(!hasStoredPortalSession\(\)\) \{\s*setCurrentUser\(null\);\s*return;\s*\}/u);
  assert.doesNotMatch(serviceSource, /Promise\.resolve\s*\(/u);

  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        throw new Error("VIP public page should not request current membership without a stored portal session");
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 1,
                name: "Monthly purchase",
                packages: [
                  {
                    id: 101,
                    name: "Monthly Lite",
                    planName: "Lite member",
                    price: "19.90",
                    durationDays: 30,
                  },
                ],
              },
            ],
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async (captured) => {
      const catalog = await VipService.fetchVipCatalog();

      assert.equal(catalog.groups.length, 1);
      assert.equal(captured.some((request) => requestPath(request.url) === "/app/v3/api/memberships/current"), false);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/package_groups");
    },
  );
});

test("VIP page localizes public tab, package, and feature copy", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/vipService.ts");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/vip.ts");

  for (const marker of [
    "t(pkg.badge",
    "t(feature.name",
    "vip.pointsPerMonth",
    "vip.durationDays",
    "vip.currentPlanExpires",
    "vip.durationUnits.",
    "vip.status.",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }
  assert.doesNotMatch(viewSource, /路/u);

  for (const marker of [
    "vip.title",
    "vip.subtitle",
    "vip.purchaseSuccess",
    "vip.errors.packageGroupsLoadError",
    "vip.badges.recommended",
    "vip.features.credits",
    "vip.pointsPerMonth",
    "vip.durationDays",
    "vip.durationUnits.year",
    "vip.status.active",
    "vip.paymentScanTitle",
    "vip.paymentAgreement",
    "vip.paymentReminder",
  ]) {
    assert.match(i18nSource, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredCopy of [
    "credits/month",
    "Membership credits and usage privileges",
    "Standard order, payment, refund, and invoice lifecycle",
    "Priority generation and higher concurrency",
    "Remove product watermark from generated assets",
    "Premium support and enterprise entitlement options",
  ]) {
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredCopy)));
    assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(retiredCopy)));
  }
});

test("VIP page exposes direct points purchase and membership redeem modals", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/vip.ts");

  for (const marker of [
    "VipPointsPurchaseModal",
    "VipMembershipRedeemModal",
    "pointsPurchaseDialogOpen",
    "membershipRedeemDialogOpen",
    "vip.directPurchasePrefix",
    "vip.buyPoints",
    "vip.membershipRedeem",
    "vip.pointsPurchase.title",
    "vip.pointsPurchase.scanTitle",
    "vip.membershipRedeem.title",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    "vip.directPurchasePrefix",
    "vip.buyPoints",
    "vip.membershipRedeem",
    "vip.pointsPurchase.title",
    "vip.pointsPurchase.description",
    "vip.pointsPurchase.currentBalance",
    "vip.pointsPurchase.scanTitle",
    "vip.pointsPurchase.agreement",
    "vip.pointsPurchase.rules",
    "vip.membershipRedeem.title",
    "vip.membershipRedeem.description",
    "vip.membershipRedeem.codeLabel",
    "vip.membershipRedeem.submit",
  ]) {
    assert.match(i18nSource, new RegExp(escapeRegExp(marker)));
  }
});

test("VIP points purchase modal creates in-dialog recharge checkout QR instead of routing away", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const vipPackageJson = readPortalFile("./packages/sdkwork-claw-router-vip/package.json");

  for (const marker of [
    "RechargePackageSelector",
    "RechargeService.submitRecharge",
    "CheckoutService.fetchCheckoutStatus",
    "toDataURL(pointsCheckoutStatus.qrCodePayload",
    "selectedRechargeOptionId",
    "handleRechargeOptionChange",
    "activeCheckoutOrderRef",
    "pointsCheckoutStatus",
    "document.body.style.overflow",
    "vip.pointsPurchase.scanTitle",
    "vip.pointsPurchase.paymentHint",
    "vip.pointsPurchase.agreement",
    "vip.pointsPurchase.rules",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredMarker of [
    'href="/console/recharge"',
    "vip.pointsPurchase.goRecharge",
    "RechargeService.fetchPackages",
    "rechargePackages.map",
    "createPointsCheckout(firstPackage",
    "handlePointsCheckout",
  ]) {
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredMarker)));
  }

  assert.match(vipPackageJson, /"sdkwork-claw-router-console-recharge": "workspace:\*"/);
  assert.match(vipPackageJson, /"sdkwork-claw-router-console-checkout": "workspace:\*"/);
});

test("VIP points purchase modal automatically updates the payment code on package selection and reuses pending unpaid orders without cancellation", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");

  assert.match(viewSource, /RechargeService\.submitRecharge/);
  assert.match(viewSource, /activeCheckoutOrderRef/);
  assert.match(viewSource, /const canReuseActiveOrder =/);
  assert.match(viewSource, /void createPointsCheckout\(option/);
  assert.match(viewSource, /setTimeout\(/);
  assert.doesNotMatch(viewSource, /cancelRechargeOrderSilently/);
  assert.doesNotMatch(viewSource, /cancelActiveCheckoutOrder/);
  assert.doesNotMatch(viewSource, /handleCheckoutAction/);
  assert.doesNotMatch(viewSource, /vip\.pointsPurchase\.checkoutAction/);
  assert.doesNotMatch(viewSource, /vip\.pointsPurchase\.refreshAction/);
});

test("VIP points purchase modal uses current user avatar with localized fallback identity copy", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/vip.ts");
  const vipPackageJson = readPortalFile("./packages/sdkwork-claw-router-vip/package.json");

  for (const marker of [
    "UserService.fetchCurrentUser",
    "type UserProfile",
    "currentUser",
    "currentUserAvatarUrl",
    "currentUserDisplayName",
    "vip.pointsPurchase.defaultUserName",
    "vip.pointsPurchase.defaultAvatarLabel",
    "vip.pointsPurchase.userAvatarAlt",
    "vip.pointsPurchase.accountLabel",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(viewSource, /<img[\s\S]*src=\{currentUserAvatarUrl\}/);
  assert.match(viewSource, /<User[\s\S]*aria-hidden="true"/);
  assert.match(viewSource, /readMediaResourceUrl\(currentUser\?\.avatar\)/);
  assert.doesNotMatch(viewSource, /currentUser\?\.avatar\?\.trim\(\)/);
  assert.doesNotMatch(viewSource, />\s*Z\s*</);
  assert.doesNotMatch(viewSource, /vip\.pointsPurchase\.brand/);
  assert.match(vipPackageJson, /"sdkwork-claw-router-console-user": "workspace:\*"/);

  for (const marker of [
    "vip.pointsPurchase.defaultUserName",
    "vip.pointsPurchase.defaultAvatarLabel",
    "vip.pointsPurchase.userAvatarAlt",
    "vip.pointsPurchase.accountLabel",
    "vip.pointsPurchase.packageTitle",
    "vip.pointsPurchase.selectPackageHint",
    "vip.pointsPurchase.paymentHint",
    "vip.pointsPurchase.rules",
  ]) {
    assert.equal((i18nSource.match(new RegExp(escapeRegExp(marker), "g")) ?? []).length, 2, `${marker} should be localized in English and Chinese`);
  }

  for (const staleCopy of [
    "Click a package to refresh the payment code",
    "点击套餐刷新支付码",
    "Credit rules",
    " 积分规则",
  ]) {
    assert.doesNotMatch(i18nSource, new RegExp(escapeRegExp(staleCopy)));
  }
});

test("VIP points purchase agreement copy uses configurable site branding instead of a fixed brand", () => {
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/vip.ts");

  for (const marker of [
    "useSiteBranding",
    "agreementBrandName",
    "brandName: agreementBrandName",
    "{{brandName}} Paid Service Agreement (including auto-renewal terms)",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    '"vip.pointsPurchase.agreement": "{{brandName}} Paid Service Agreement (including auto-renewal terms)"',
    '"vip.pointsPurchase.agreement": "《{{brandName}}付费服务协议（含自动续费条款）》"',
  ]) {
    assert.match(i18nSource, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredBrandName of [
    "Bangzhao",
    "榜招",
    "vip.pointsPurchase.brand",
  ]) {
    assert.doesNotMatch(i18nSource, new RegExp(escapeRegExp(retiredBrandName)));
  }
});

test("VIP points purchase product design treats credits as the primary product and money as secondary context", () => {
  const rechargeViewSource = readPortalFile("./packages/sdkwork-claw-router-console-recharge/src/RechargeView.tsx");
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-vip/src/VipView.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/vip.ts");

  for (const marker of [
    "vip.pointsPurchase.pointsPrimary",
    "vip.pointsPurchase.paySecondary",
    "vip.pointsPurchase.bonusLabel",
  ]) {
    assert.match(i18nSource, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    "variant === 'vip'",
    "vip.pointsPurchase.pointsPrimary",
    "vip.pointsPurchase.paySecondary",
    "vip.pointsPurchase.bonusLabel",
    "option.points.toLocaleString('en-US')",
  ]) {
    assert.match(rechargeViewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    "paymentStatusText",
    ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredMarker of [
    "vip.pointsPurchase.receiveSummary",
    "vip.pointsPurchase.paymentSummary",
    "selectedPointsText",
    "selectedPaymentAmountText",
    "selectedBonusPointsText",
    "vip.pointsPurchase.waitingOrder",
  ]) {
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredMarker)));
    assert.doesNotMatch(i18nSource, new RegExp(escapeRegExp(retiredMarker)));
  }
});

test("membership console package owns direct membership purchase and a professional entitlement dashboard", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-console-memberships/src/MembershipsView.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-console-memberships/src/membershipService.ts");
  const packageJson = readPortalFile("./packages/sdkwork-claw-router-console-memberships/package.json");

  for (const marker of [
    "MembershipsView",
    "MembershipService.fetchMembershipPackages",
    "MembershipService.purchaseMembership",
    "handleMembershipPurchase",
    "purchasePackages",
    "MembershipStatusHero",
    "MembershipPurchasePanel",
    "MembershipPurchaseOption",
    "EntitlementOverviewPanel",
    "EntitlementStatusSummary",
    "UsageSnapshotPanel",
    "EntitlementAccessBadge",
    "entitlementRows",
    "entitlementAccessCounts",
    "console.memberships.actions.purchase",
    "console.memberships.dashboard.heroEyebrow",
    "console.memberships.packageGroups.title",
    "console.memberships.entitlements.includedTitle",
    "console.memberships.entitlements.tableHeaderBenefit",
    "console.memberships.entitlements.tableHeaderQuota",
    "console.memberships.entitlements.tableHeaderPeriod",
    "console.memberships.entitlements.tableHeaderAccess",
    "console.memberships.entitlements.accessIncluded",
    "console.memberships.usage.title",
    "table-fixed",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(marker)));
  }

  assert.doesNotMatch(source, /VipPurchaseModal/);
  assert.doesNotMatch(source, /vipPurchaseModalOpen/);
  assert.doesNotMatch(source, /openVipPurchaseModal/);
  assert.doesNotMatch(source, /console\.memberships\.actions\.openVipPurchase/);
  assert.doesNotMatch(source, /sdkwork-claw-router-vip/);

  for (const retiredMarker of [
    "MembershipPackageCard",
    "runPackageAction",
    "handleMembershipPackageAction",
    "selectedMembershipPackageId",
    "PackageConfigurationPanel",
    "PackageSummaryRow",
    "MembershipLifecyclePanel",
    "console.memberships.lifecycle.title",
    "mt-1 rounded-xl bg-lobster-50 p-2 text-lobster-600",
    "console.memberships.packages.configuredGroups",
  ]) {
    assert.doesNotMatch(source, new RegExp(escapeRegExp(retiredMarker)));
  }

  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.current\.retrieve\(\)/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packageGroups\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.benefits\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.packages\.list/);
  assert.match(serviceSource, /getClawRouterAppSdkClient\(\)\.commerce\.memberships\.purchases\.create/);
  assert.doesNotMatch(serviceSource, /fetch\(/);
  assert.doesNotMatch(serviceSource, /axios/);
  assert.doesNotMatch(serviceSource, /billing\(\)\.vip|\/billing\/vip|\/vip/);
  assert.doesNotMatch(packageJson, /"sdkwork-claw-router-vip": "workspace:\*"/);
});

test("VIP catalog uses the generated app SDK standard membership package group path", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 2,
                name: "Yearly purchase",
                description: "Yearly membership packages",
                sortWeight: 20,
              },
            ],
          },
        };
      }
      if (path === "/app/v3/api/memberships/package_groups/2/packages") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 401,
                currencyCode: "CNY",
                durationDays: 365,
                name: "Yearly Premium",
                planName: "Premium member",
                price: "199.00",
                recommended: true,
                sortWeight: 10,
                tags: ["yearly", "premium"],
              },
            ],
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async (captured) => {
      const catalog = await VipService.fetchVipCatalog();
      const packageGroupsRequest = captured.find((request) => requestPath(request.url) === "/app/v3/api/memberships/package_groups");
      const groupPackagesRequest = captured.find((request) => requestPath(request.url) === "/app/v3/api/memberships/package_groups/2/packages");

      assert.equal(catalog.groups.length, 1);
      assert.equal(catalog.groups[0]?.id, "2");
      assert.equal(catalog.groups[0]?.name, "Yearly purchase");
      assert.equal(catalog.groups[0]?.packages[0]?.id, "401");
      assert.equal(catalog.groups[0]?.packages[0]?.groupId, "2");
      assert.equal(catalog.groups[0]?.packages[0]?.planName, "Yearly Premium");
      assert.equal(catalog.groups[0]?.packages[0]?.planId, "premium");
      assert.ok(packageGroupsRequest, "package groups request must be captured");
      assert.ok(groupPackagesRequest, "group packages request must be captured");
      assert.equal(packageGroupsRequest.method, "GET");
      assert.equal(captured.some((request) => requestPath(request.url) === "/app/v3/api/memberships/packages"), false);
    },
  );
});

test("VIP catalog loads tabs from generated app SDK membership package groups", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 1,
                name: "Monthly purchase",
                description: "Monthly membership packages",
                sortWeight: 10,
                packages: [
                  {
                    id: 303,
                    name: "Monthly Advanced",
                    planName: "Advanced member",
                    price: "69.90",
                    originalPrice: "129.00",
                    pointAmount: 45000,
                    durationDays: 30,
                    sortWeight: 30,
                    recommended: true,
                    tags: ["monthly", "advanced", "recommended"],
                  },
                ],
              },
              {
                id: 2,
                name: "Yearly purchase",
                description: "Yearly membership packages",
                sortWeight: 20,
                packages: [
                  {
                    id: 403,
                    name: "Yearly Advanced",
                    planName: "Advanced member",
                    price: "699.00",
                    originalPrice: "999.00",
                    pointAmount: 540000,
                    durationDays: 365,
                    sortWeight: 30,
                    recommended: true,
                    tags: ["yearly", "advanced", "recommended"],
                  },
                ],
              },
            ],
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async (captured) => {
      const catalog = await VipService.fetchVipCatalog();
      const packageGroupsRequest = captured.find((request) => requestPath(request.url) === "/app/v3/api/memberships/package_groups");

      assert.equal(catalog.groups.length, 2);
      assert.equal(catalog.groups[0]?.id, "1");
      assert.equal(catalog.groups[0]?.name, "Monthly purchase");
      assert.equal(catalog.groups[0]?.sortOrder, 10);
      assert.equal(catalog.groups[0]?.packages[0]?.id, "303");
      assert.equal(catalog.groups[0]?.packages[0]?.groupId, "1");
      assert.equal(catalog.groups[0]?.packages[0]?.planId, "advanced");
      assert.equal(catalog.groups[0]?.packages[0]?.planName, "Monthly Advanced");
      assert.equal(catalog.groups[0]?.packages[0]?.priceAmount, "69.90");
      assert.equal(catalog.groups[0]?.packages[0]?.pointsPerMonth, 45000);
      assert.equal(catalog.groups[1]?.id, "2");
      assert.equal(catalog.groups[1]?.packages[0]?.durationUnit, "year");
      assert.ok(packageGroupsRequest, "package groups request must be captured");
      assert.equal(captured.some((request) => requestPath(request.url) === "/app/v3/api/memberships/packages"), false);
    },
  );
});

test("VIP catalog keeps renderable packages when API prices are not purchaseable", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "2000",
          data: {
            items: [
              {
                id: 9,
                name: "Fault tolerant purchase",
                packages: [
                  {
                    id: 901,
                    currencyCode: "CNY",
                    durationDays: 30,
                    name: "Zero price package",
                    planName: "Standard member",
                    priceAmount: "0",
                    tags: ["monthly", "standard"],
                  },
                  {
                    id: 902,
                    currencyCode: "CNY",
                    durationDays: "",
                    name: "Missing price package",
                    planName: "",
                  },
                ],
              },
            ],
          },
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async () => {
      const catalog = await VipService.fetchVipCatalog();

      assert.equal(catalog.groups.length, 1);
      assert.equal(catalog.groups[0]?.packages.length, 2);
      assert.equal(catalog.groups[0]?.packages[0]?.priceAmount, "0.00");
      assert.equal(catalog.groups[0]?.packages[0]?.isPurchasable, false);
      assert.equal(catalog.groups[0]?.packages[1]?.priceAmount, "0.00");
      assert.equal(catalog.groups[0]?.packages[1]?.durationDays, 30);
      assert.equal(catalog.groups[0]?.packages[1]?.isPurchasable, false);
    },
  );
});

test("VIP catalog falls back to preview packages when membership groups cannot be read", async () => {
  await withMembershipSdkResponses(
    (path) => {
      if (path === "/app/v3/api/memberships/current") {
        return { code: "2000", data: {} };
      }
      if (path === "/app/v3/api/memberships/package_groups") {
        return {
          code: "5000",
          msg: "membership package groups unavailable",
        };
      }
      return { code: "2000", data: { items: [] } };
    },
    async () => {
      const catalog = await VipService.fetchVipCatalog();

      assert.equal(catalog.groups.length > 0, true);
      assert.equal(catalog.groups[0]?.packages.length > 0, true);
      assert.equal(catalog.groups[0]?.packages[0]?.isPreview, true);
      assert.equal(catalog.groups[0]?.packages[0]?.isPurchasable, false);
    },
  );
});

test("VIP purchase uses idempotent generated app SDK membership purchase path", async () => {
  const qrCode = {
    kind: "image",
    publicUrl: "https://im.sdkwork.com/pay/qrcode/payment-vip-1.png",
    source: "external_url",
    url: "https://im.sdkwork.com/pay/qrcode/payment-vip-1.png",
  };

  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-1&paymentId=payment-vip-1",
        nextAction: "scan_qr",
        paymentId: "payment-vip-1",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCode,
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-1&paymentId=payment-vip-1",
        requestNo: "vip-request-1",
        status: "accepted",
        success: true,
      },
    },
    async (captured) => {
      const result = await VipService.purchaseVipPackage("1");

      assert.deepEqual(result, {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-1&paymentId=payment-vip-1",
        nextAction: "scan_qr",
        paymentId: "payment-vip-1",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCode,
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-1&paymentId=payment-vip-1",
        requestNo: "vip-request-1",
        status: "accepted",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/purchases");
      assert.equal(captured[0]?.method, "POST");
      assert.deepEqual(JSON.parse(captured[0]?.body ?? "{}"), {
        packageId: 1,
      });
    },
  );
});

test("VIP purchase keeps qrCodePayload as the standard public field for payment links", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&paymentId=payment-vip-link-1",
        nextAction: "scan_qr",
        paymentId: "payment-vip-link-1",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&paymentId=payment-vip-link-1",
        requestNo: "vip-request-link-1",
        status: "accepted",
        success: true,
      },
    },
    async () => {
      const result = await VipService.purchaseVipPackage("1");

      assert.deepEqual(result, {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&paymentId=payment-vip-link-1",
        nextAction: "scan_qr",
        paymentId: "payment-vip-link-1",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&paymentId=payment-vip-link-1",
        requestNo: "vip-request-link-1",
        status: "accepted",
        success: true,
      });
    },
  );
});

test("VIP purchase rejects non-http qrCodePayload values for qr scan payments", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        paymentId: "payment-vip-link-2",
        qrCodePayload: "weixin://wxpay/bizpayurl?pr=vip-request-link-2",
        requestNo: "vip-request-link-2",
        status: "accepted",
        success: true,
      },
    },
    async () => {
      await assert.rejects(
        () => VipService.purchaseVipPackage("1"),
        /VIP qrCodePayload must be an http\(s\) url when present/,
      );
    },
  );
});

test("VIP purchase accepts backend responses that omit the success flag when an order request exists", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-without-success&paymentId=payment-without-success",
        nextAction: "scan_qr",
        paymentId: "payment-without-success",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-without-success&paymentId=payment-without-success",
        requestNo: "vip-request-without-success",
        status: "accepted",
      },
    },
    async () => {
      const result = await VipService.purchaseVipPackage("1");

      assert.deepEqual(result, {
        cashierUrl: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-without-success&paymentId=payment-without-success",
        nextAction: "scan_qr",
        paymentId: "payment-without-success",
        paymentMethod: "wechat",
        paymentProduct: "wechat_native",
        providerCode: "wechat_pay",
        qrCodePayload: "https://im.sdkwork.com/cashier?scene=membership&orderId=vip-request-without-success&paymentId=payment-without-success",
        requestNo: "vip-request-without-success",
        status: "accepted",
        success: true,
      });
    },
  );
});

test("VIP purchase rejects explicit failed purchase responses", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        requestNo: "vip-request-failed",
        status: "failed",
        success: false,
      },
    },
    async () => {
      await assert.rejects(
        () => VipService.purchaseVipPackage("1"),
        /VIP purchase was not accepted/,
      );
    },
  );
});

test("VIP membership redeem uses idempotent generated app SDK promotion code redemption path", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        requestNo: "vip-redeem-request-1",
        status: "accepted",
        success: true,
      },
    },
    async (captured) => {
      const result = await VipService.redeemMembershipCode(" VIP-CODE-001 ");

      assert.deepEqual(result, {
        requestNo: "vip-redeem-request-1",
        status: "accepted",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/promotions/codes/redemptions");
      assert.equal(captured[0]?.method, "POST");
      assert.match(captured[0]?.body ?? "", /"clientRequestNo":"vip-membership-redemption-/);
      const body = JSON.parse(captured[0]?.body ?? "{}");
      assert.deepEqual(body, {
        clientRequestNo: body.clientRequestNo,
        code: "VIP-CODE-001",
        scene: "membership_redeem",
        source: "vip-page",
      });
      assert.equal(body.metadata, undefined);
    },
  );
});

test("membership package listing uses the generated app SDK standard path", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            currency_code: "CNY",
            duration_days: 365,
            package_no: "member-pkg-1",
            plan_id: "vip-pro",
            price_amount: "199.00",
            recurrence_cycle: "one_time",
            sku_id: "sku-vip-pro",
            status: "active",
          },
        ],
      },
    },
    async (captured) => {
      const packages = await MembershipService.fetchMembershipPackages();

      assert.deepEqual(packages, [
        {
          currencyCode: "CNY",
          durationDays: 365,
          id: "member-pkg-1",
          isPurchasable: false,
          packageGroupId: null,
          packageNo: "member-pkg-1",
          planId: "vip-pro",
          planName: "vip-pro",
          priceAmount: "199.00",
          recurrenceCycle: "one_time",
          skuId: "sku-vip-pro",
          status: "active",
        },
      ]);
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/packages");
      assert.equal(captured[0]?.method, "GET");
      assert.match(captured[0]?.url ?? "", /page=1/);
      assert.match(captured[0]?.url ?? "", /page_size=100/);
      assert.match(captured[0]?.url ?? "", /status=active/);
    },
  );
});

test("membership purchase uses idempotent generated app SDK purchase path", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        requestNo: "membership-request-1",
        status: "accepted",
        success: true,
      },
    },
    async (captured) => {
      const result = await MembershipService.purchaseMembership("1");

      assert.deepEqual(result, {
        requestNo: "membership-request-1",
        status: "accepted",
        success: true,
      });
      assert.equal(requestPath(captured[0]?.url), "/app/v3/api/memberships/purchases");
      assert.equal(captured[0]?.method, "POST");
      assert.deepEqual(JSON.parse(captured[0]?.body ?? "{}"), {
        packageId: 1,
      });
    },
  );
});

test("membership service fails closed for malformed packages and blank purchase ids", async () => {
  await withMembershipSdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            package_no: "member-pkg-1",
            plan_id: "vip-pro",
            price_amount: "free",
            sku_id: "sku-vip-pro",
            status: "active",
          },
        ],
      },
    },
    async () => {
      const packages = await MembershipService.fetchMembershipPackages();

      assert.deepEqual(packages, [
        {
          currencyCode: "CNY",
          durationDays: 0,
          id: "member-pkg-1",
          isPurchasable: false,
          packageGroupId: null,
          packageNo: "member-pkg-1",
          planId: "vip-pro",
          planName: "vip-pro",
          priceAmount: "0.00",
          recurrenceCycle: "one_time",
          skuId: "sku-vip-pro",
          status: "active",
        },
      ]);
    },
  );

  await withMembershipSdkResponse(
    { code: "2000", data: { requestNo: "unexpected", success: true } },
    async (captured) => {
      await assert.rejects(
        () => MembershipService.purchaseMembership("   "),
        /packageId must be a positive integer/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("OpenAPI and generated SDK expose standard membership APIs and reject billing VIP aliases", () => {
  const appOpenapi = readPortalFile("../../generated/openapi/clawrouter-app-openapi.json");
  const backendOpenapi = readPortalFile("../../generated/openapi/clawrouter-backend-openapi.json");
  const appCommerceSdk = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/commerce.ts");
  const backendCommerceSdk = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/commerce.ts");

  for (const path of [
    "/app/v3/api/memberships/current",
    "/app/v3/api/memberships/package_groups",
    "/app/v3/api/memberships/package_groups/{packageGroupId}/packages",
    "/app/v3/api/memberships/packages",
    "/app/v3/api/memberships/purchases",
  ]) {
    assert.match(appOpenapi, new RegExp(escapeRegExp(`"${path}"`)));
  }

  for (const path of [
    "/backend/v3/api/memberships/entitlements",
    "/backend/v3/api/memberships/members",
    "/backend/v3/api/memberships/packages",
    "/backend/v3/api/memberships/plans",
  ]) {
    assert.match(backendOpenapi, new RegExp(escapeRegExp(`"${path}"`)));
  }

  for (const marker of [
    "class CommerceMembershipsCurrentApi",
    "class CommerceMembershipsPackageGroupsApi",
    "class CommerceMembershipsPackageGroupsPackagesApi",
    "class CommerceMembershipsPackagesApi",
    "class CommerceMembershipsPurchasesApi",
    "appApiPath(`/memberships/current`)",
    "appApiPath(`/memberships/package_groups`)",
    "appApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}/packages`)",
    "appApiPath(`/memberships/packages`)",
    "appApiPath(`/memberships/purchases`)",
  ]) {
    assert.match(appCommerceSdk, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    '"paymentId"',
    '"qrCodePayload"',
    '"qrCode"',
  ]) {
    assert.match(appOpenapi, new RegExp(escapeRegExp(marker)));
  }
  assert.doesNotMatch(appOpenapi, /"qrcodeContent"/);
  assert.doesNotMatch(appOpenapi, /"qrCodeContent"/);
  assert.doesNotMatch(appOpenapi, /"paymentUrl"/);

  const commerceOperationResponseSource = readPortalFile("../../sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/commerce-operation-response.ts");
  for (const marker of [
    "import type { MediaResource } from './media-resource';",
    "paymentId?: string | null",
    "qrCode?: MediaResource",
    "qrCodePayload?: string | null",
  ]) {
    assert.match(commerceOperationResponseSource, new RegExp(escapeRegExp(marker)));
  }
  assert.doesNotMatch(commerceOperationResponseSource, /qrCodeImageUrl/);

  for (const marker of [
    "class CommerceMembershipsEntitlementsApi",
    "class CommerceMembershipsMembersApi",
    "class CommerceMembershipsPackagesApi",
    "class CommerceMembershipsPlansApi",
    "backendApiPath(`/memberships/entitlements`)",
    "backendApiPath(`/memberships/members`)",
    "backendApiPath(`/memberships/packages`)",
    "backendApiPath(`/memberships/plans`)",
  ]) {
    assert.match(backendCommerceSdk, new RegExp(escapeRegExp(marker)));
  }

  for (const retiredToken of [
    "/app/v3/api/billing/vip",
    "/backend/v3/api/billing/vip",
    "/app/v3/api/vip",
    "/backend/v3/api/vip",
  ]) {
    assert.doesNotMatch(appOpenapi, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(backendOpenapi, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(appCommerceSdk, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(backendCommerceSdk, new RegExp(escapeRegExp(retiredToken)));
  }
});

function requestPath(url: string | undefined): string {
  assert.ok(url, "captured request URL is required");
  return url.split("?", 1)[0] ?? url;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
