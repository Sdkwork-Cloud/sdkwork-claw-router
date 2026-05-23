import json
import os
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PORTAL_ROOT = ROOT / "apps" / "sdkwork-claw-router-portal"
PORTAL_PACKAGES = ROOT / "apps" / "sdkwork-claw-router-portal" / "packages"


class FrontendSourceHygieneStandardTest(unittest.TestCase):
    def test_portal_sources_do_not_ship_mock_or_fake_business_naming(self) -> None:
        violations: list[str] = []
        forbidden = re.compile(r"\b(?:mock|fake)[A-Za-z0-9_]*\b", re.IGNORECASE)

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            content = source.read_text(encoding="utf-8", errors="ignore")
            for line_number, line in enumerate(content.splitlines(), start=1):
                if forbidden.search(line):
                    violations.append(f"{relative}:{line_number}: {line.strip()}")

        self.assertEqual(
            [],
            violations,
            "Portal production source must use seed/catalog/sample naming instead of mock/fake business naming.",
        )

    def test_portal_sources_do_not_ship_known_mojibake_text(self) -> None:
        mojibake_markers = [
            "\u95b3",
            "\u68e3",
            "\u6960",
            "\u95ba",
            "\u95b8",
            "\u95bb",
            "\u59ab",
            "\u6fde",
            "\u7f01",
            "\u95c1",
            "\u5a34",
            "\u7035",
            "\u5a23",
            "\u7039",
            "\u9435\u56ec\u6531",
            "\u95b9\u517c\u7c8e",
            "\u940e\u7535\u5387",
            "\u95bb\u6a3f\u5796",
            "\u941f\u6b0f\u68dd",
            "\u95b9\u8235\u7260",
            "\u00e5\u00a6\u00af",
            "\u00e2\u201e\u0083",
            "\u00ee",
            "\u00e7\u00bc\u0081",
            "\u00e9\u008d",
            "\u00e9\u00bb\u0098\u00e8\u00ae\u00a4",
            "\u00e5\u0088\u0086\u00e7\u00bb\u0084",
            "\u00e4\u00bc\u0081\u00e4\u00b8\u009a",
            "\u00e5\u0086\u0085\u00e6\u00b5\u008b",
            "\u00e9\u00b2\u009c",
            "\u95b3\u30e6\u6530",
        ]
        violations: list[str] = []

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            content = source.read_text(encoding="utf-8", errors="ignore")
            for marker in mojibake_markers:
                if marker in content:
                    violations.append(f"{relative}: contains mojibake marker {marker!r}")

        self.assertEqual(
            [],
            violations,
            "Portal source text must be readable UTF-8 and must not ship mojibake UI copy.",
        )

    def test_portal_runtime_sources_do_not_log_errors_to_browser_console(self) -> None:
        allowed_example_sources = {
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/Docs.tsx",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-core/src/index.ts",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/pages/ModelDetails.tsx",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-sdk-reference/src/components/SdkEndpointView.tsx",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-sdk-reference/src/data/sdkData.ts",
        }
        violations: list[str] = []
        console_call = re.compile(r"\bconsole\.(?:log|error|warn|debug|trace)\s*\(")

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            if relative in allowed_example_sources:
                continue
            content = source.read_text(encoding="utf-8", errors="ignore")
            for line_number, line in enumerate(content.splitlines(), start=1):
                if console_call.search(line):
                    violations.append(f"{relative}:{line_number}: {line.strip()}")

        self.assertEqual(
            [],
            violations,
            "Portal runtime source must surface errors through UI state instead of browser console logging.",
        )

    def test_commons_json_highlighter_accepts_unknown_input_without_any_boundary(self) -> None:
        highlighter = PORTAL_PACKAGES / "sdkwork-claw-router-commons" / "src" / "utils" / "index.ts"
        source = highlighter.read_text(encoding="utf-8")

        self.assertIn("export const syntaxHighlightJson = (json: unknown): string =>", source)
        self.assertIn("formatSyntaxHighlightJsonValue", source)
        self.assertIn("escapeHtml", source)
        self.assertNotIn("json: any", source)
        self.assertNotIn(": any", source)
        self.assertNotIn("as any", source)

    def test_i18n_browser_language_detection_uses_typed_legacy_navigator(self) -> None:
        i18n_source_path = PORTAL_PACKAGES / "sdkwork-claw-router-i18n" / "src" / "index.ts"
        source = i18n_source_path.read_text(encoding="utf-8")

        self.assertIn("interface LegacyNavigatorLanguage", source)
        self.assertIn("const navigatorLanguage = window.navigator as Navigator & LegacyNavigatorLanguage", source)
        self.assertIn("navigatorLanguage.userLanguage", source)
        self.assertNotIn("window.navigator as any", source)
        self.assertNotIn("as any", source)

    def test_portal_services_do_not_cast_read_api_items_to_business_models(self) -> None:
        violations: list[str] = []
        forbidden = re.compile(r"readApiItems\([^;\n]*\)\s+as\s+(?:[A-Z][A-Za-z0-9_]*\[\]|Parameters<)")

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            content = source.read_text(encoding="utf-8", errors="ignore")
            for line_number, line in enumerate(content.splitlines(), start=1):
                if forbidden.search(line):
                    violations.append(f"{relative}:{line_number}: {line.strip()}")

        self.assertEqual(
            [],
            violations,
            "Portal services must validate SDK list payloads with explicit type guards instead of casting readApiItems results.",
        )

    def test_portal_remote_list_services_fail_closed_for_malformed_list_payloads(self) -> None:
        allowed_optional_sources = {
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/services/appService.ts",
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-skills-hub/src/services/skillService.ts",
        }
        violations: list[str] = []
        list_reader = re.compile(r"\breadApiItems\s*\(")

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            if "sdkwork-claw-router-commons" in source.parts:
                continue
            if relative in allowed_optional_sources:
                continue
            content = source.read_text(encoding="utf-8", errors="ignore")
            if "ensurePlusApiSuccess" not in content:
                continue
            for line_number, line in enumerate(content.splitlines(), start=1):
                if list_reader.search(line):
                    violations.append(f"{relative}:{line_number}: {line.strip()}")

        self.assertEqual(
            [],
            violations,
            "Remote list services must use readRequiredApiItems after SDK success checks so malformed list payloads do not render as empty states.",
        )

    def test_portal_paginated_log_services_require_total_metadata(self) -> None:
        paginated_log_services = [
            PORTAL_PACKAGES / "sdkwork-claw-router-console-usage" / "src" / "usageService.ts",
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-record" / "src" / "recordService.ts",
        ]
        violations: list[str] = []

        for source in paginated_log_services:
            relative = source.relative_to(ROOT).as_posix()
            content = source.read_text(encoding="utf-8", errors="ignore")
            if "readRequiredNonNegativeNumber(data, 'total'" not in content:
                violations.append(f"{relative}: missing required pagination total reader")
            for forbidden in (
                "readNumber(data, 'total', logs.length)",
                "readNumber(data, 'total', items.length)",
                "total: logs.length",
                "total: items.length",
            ):
                if forbidden in content:
                    violations.append(f"{relative}: {forbidden}")

        self.assertEqual(
            [],
            violations,
            "Paginated log services must require backend total metadata instead of falling back to current page length.",
        )

    def test_portal_paginated_log_services_normalize_query_before_sdk_calls(self) -> None:
        usage_service_path = (
            PORTAL_PACKAGES / "sdkwork-claw-router-console-usage" / "src" / "usageService.ts"
        )
        record_service_path = (
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-record" / "src" / "recordService.ts"
        )
        usage_service = usage_service_path.read_text(encoding="utf-8", errors="ignore")
        record_service = record_service_path.read_text(encoding="utf-8", errors="ignore")

        self.assertIn("toUsageLogQueryParams", usage_service)
        self.assertIn("const query = toUsageLogQueryParams(params)", usage_service)
        self.assertIn(".ai.usage.logs.list(query)", usage_service)
        self.assertNotIn(".ai.usage.logs.list(params)", usage_service)
        self.assertNotIn(".router.fetchLogs", usage_service)
        self.assertIn("MAX_USAGE_LOG_PAGE_SIZE", usage_service)
        self.assertIn("MAX_USAGE_LOG_QUERY_TEXT_LENGTH", usage_service)

        self.assertIn("toRecordLogQueryBody", record_service)
        self.assertIn(".system.records.list(toRecordLogQueryBody(filters))", record_service)
        self.assertNotIn(".record.fetchLogs(filters)", record_service)
        self.assertNotIn(".record.fetchLogs", record_service)
        self.assertIn("MAX_RECORD_LOG_PAGE_SIZE", record_service)
        self.assertIn("MAX_RECORD_LOG_FILTER_LENGTH", record_service)

    def test_portal_settlements_service_normalizes_year_query_before_sdk_call(self) -> None:
        settlement_service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-console-settlements"
            / "src"
            / "settlementsService.ts"
        )
        service = settlement_service_path.read_text(encoding="utf-8", errors="ignore")

        self.assertIn("toSettlementDashboardQueryParams", service)
        self.assertIn("const query = toSettlementDashboardQueryParams(params)", service)
        self.assertIn("appWalletLedgerEntriesList({ page: 1, pageSize: 500 })", service)
        self.assertIn("appInvoicesList({ page: 1, pageSize: 100 })", service)
        self.assertIn("buildSettlementDashboard(query.year, ledgerEntries, invoices)", service)
        self.assertIn("readRequiredApiItems(ledgerResult, 'Settlement ledger entries are required')", service)
        self.assertIn("readRequiredApiItems(invoiceResult, 'Settlement invoice records are required')", service)
        self.assertNotIn("getClawRouterCommerceService().settlements.dashboard.list(", service)
        self.assertNotIn(".billing.settlements.dashboard.list(params)", service)
        self.assertNotIn("getClawRouterAppSdkClient().billing.settlements.dashboard.list", service)
        self.assertNotIn(".router.fetchDashboardData", service)
        self.assertIn("MIN_SETTLEMENT_DASHBOARD_YEAR", service)
        self.assertIn("MAX_SETTLEMENT_DASHBOARD_YEAR", service)

    def test_portal_catalog_services_normalize_filters_before_sdk_calls(self) -> None:
        app_service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "appService.ts"
        )
        skill_service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "services"
            / "skillService.ts"
        )
        app_service = app_service_path.read_text(encoding="utf-8", errors="ignore")
        skill_service = skill_service_path.read_text(encoding="utf-8", errors="ignore")

        self.assertIn("toAppCatalogQueryParams", app_service)
        self.assertTrue(
            ".platform.apps.store.list(toAppCatalogQueryParams(filters))" in app_service
            or (
                "const query = toAppCatalogQueryParams(filters)" in app_service
                and ".platform.apps.store.list(query)" in app_service
            ),
            "app catalog service must pass normalized query params into the generated SDK",
        )
        self.assertNotIn(".platform.apps.store.list(filters", app_service)
        self.assertNotIn(".app.getApps", app_service)
        self.assertNotIn("filters as Record<string, unknown>", app_service)
        self.assertIn("MAX_APP_CATALOG_PAGE_SIZE", app_service)
        self.assertIn("MAX_APP_CATALOG_QUERY_TEXT_LENGTH", app_service)

        self.assertIn("toSkillCatalogQueryParams", skill_service)
        self.assertTrue(
            ".ecosystem.skills.list(toSkillCatalogQueryParams(filters))" in skill_service
            or (
                "const query = toSkillCatalogQueryParams(filters)" in skill_service
                and ".ecosystem.skills.list(query)" in skill_service
            ),
            "skills catalog service must pass normalized query params into the generated SDK",
        )
        self.assertNotIn(".ecosystem.skills.list(filters", skill_service)
        self.assertNotIn(".skill.getSkills", skill_service)
        self.assertNotIn(".skills.getSkills", skill_service)
        self.assertNotIn("filters as Record<string, unknown>", skill_service)
        self.assertIn("MAX_SKILL_CATALOG_PAGE_SIZE", skill_service)
        self.assertIn("MAX_SKILL_CATALOG_QUERY_TEXT_LENGTH", skill_service)

    def test_portal_catalog_services_fail_closed_for_remote_contract_drift(self) -> None:
        app_service = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "appService.ts"
        ).read_text(encoding="utf-8", errors="ignore")
        app_runtime = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-app-center"
            / "src"
            / "appRuntime.ts"
        ).read_text(encoding="utf-8", errors="ignore")
        skill_service = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "services"
            / "skillService.ts"
        ).read_text(encoding="utf-8", errors="ignore")
        skill_runtime = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "skillRuntime.ts"
        ).read_text(encoding="utf-8", errors="ignore")

        self.assertIn("const items: SdkAppCatalogResponse['items']", app_service)
        self.assertIn("items.map(normalizeAppApiRecord)", app_service)
        self.assertIn("readRequiredRecord(value, 'App record is required')", app_runtime)
        self.assertIn("readRequiredFirstString(item, ['id', 'appId', 'app_id', 'code'], 'App id is required')", app_runtime)
        self.assertIn("readRequiredFirstString(item, ['name'], 'App name is required')", app_runtime)
        self.assertIn("readRequiredFirstString(item, ['developer', 'provider', 'publisher'], 'App developer is required')", app_runtime)
        self.assertIn("throw new Error(platformType ? `Unsupported app platform type: ${platformType}` : 'App platform type is required')", app_runtime)
        self.assertIn("throw new Error(os ? `Unsupported app operating system: ${os}` : `App operating system is required for ${platformType}`)", app_runtime)

        self.assertIn("const items: SdkSkillsCatalogResponse['items']", skill_service)
        self.assertIn("items.map(normalizeSkillApiRecord)", skill_service)
        self.assertIn("readRequiredRecord(value, 'Skill record is required')", skill_runtime)
        self.assertIn("readRequiredFirstString(item, ['id', 'skillId', 'skillKey'], 'Skill id is required')", skill_runtime)
        self.assertIn("readRequiredFirstString(item, ['name'], 'Skill name is required')", skill_runtime)
        self.assertIn("readRequiredFirstString(item, ['developer', 'provider'], 'Skill developer is required')", skill_runtime)
        self.assertIn("return value.map((item) => readRequiredRecord(item, 'Skill package record is required'))", skill_runtime)

        for relative_source, source in {
            "appService.ts": app_service,
            "skillService.ts": skill_service,
            "appRuntime.ts": app_runtime,
            "skillRuntime.ts": skill_runtime,
        }.items():
            self.assertNotIn(".filter(isRecord)", source, relative_source)
            self.assertNotIn("return value.filter(isRecord)", source, relative_source)

        self.assertNotIn("return PLATFORM_TYPES.includes(platformType as PlatformType) ? (platformType as PlatformType) : 'Web';", app_runtime)
        self.assertNotIn("return 'PC Web';", app_runtime)
        self.assertNotIn("return records.find(isRecord);", skill_runtime)

    def test_portal_catalog_detail_services_validate_sdk_path_ids(self) -> None:
        app_service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-app-center"
            / "src"
            / "services"
            / "appService.ts"
        )
        skill_service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-skills-hub"
            / "src"
            / "services"
            / "skillService.ts"
        )
        app_service = app_service_path.read_text(encoding="utf-8", errors="ignore")
        skill_service = skill_service_path.read_text(encoding="utf-8", errors="ignore")

        self.assertIn("requiredSafePathSegment(id, 'appId')", app_service)
        self.assertIn(".platform.apps.store.retrieve(requiredSafePathSegment(id, 'appId'))", app_service)
        self.assertIn("readRequiredApiItem(result, 'App detail response is missing data')", app_service)
        self.assertNotIn(".app.getAppById(id)", app_service)
        self.assertNotIn(".app.getAppById", app_service)
        self.assertNotIn("readApiItems(result).find", app_service)

        self.assertIn("requiredSafePathSegment(id, 'skillId')", skill_service)
        self.assertIn(".ecosystem.skills.retrieve(requiredSafePathSegment(id, 'skillId'))", skill_service)
        self.assertIn("readRequiredApiItem(result, 'Skill detail response is missing data')", skill_service)
        self.assertNotIn(".skill.getSkillById(id)", skill_service)
        self.assertNotIn(".skill.getSkillById", skill_service)
        self.assertNotIn(".skills.getSkillById", skill_service)
        self.assertNotIn("readApiItems(result).find", skill_service)

    def test_portal_console_api_key_service_fails_closed_for_remote_contract_drift(self) -> None:
        service_path = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        )
        service = service_path.read_text(encoding="utf-8", errors="ignore")

        self.assertIn("readRequiredApiItem", service)
        self.assertIn("readRequiredString", service)
        self.assertIn(
            "readRequiredApiItem(result, 'API key creation response is missing key data', ['item'])",
            service,
        )
        self.assertIn("readRequiredString(value, 'id', 'API key id is required')", service)
        self.assertIn(
            "readRequiredString(value, 'maskedKey', 'API key masked value is required')",
            service,
        )
        self.assertIn("readRequiredString(value, 'code', 'API key group code is required')", service)
        self.assertNotIn(".filter((item): item is ApiKey => item !== null)", service)
        self.assertNotIn(".filter((item): item is ApiKeyGroup => item !== null)", service)
        self.assertNotIn("normalizeApiKey(data.item)", service)

    def test_portal_money_message_and_history_services_fail_closed_for_remote_contract_drift(self) -> None:
        guarded_services = {
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-model" / "src" / "modelService.ts": [
                "return readRequiredApiItems(result, 'Failed to fetch vendors')\n      .map(normalizeVendor)",
                "const models = readRequiredApiItems(modelsResult, 'Failed to fetch models')\n      .map(normalizeModel)",
                "models: readRequiredApiItems(data, 'Failed to sync vendors and models', ['models'])\n        .map(normalizeModel)",
                "readRequiredRecord(value, 'Vendor record is required')",
                "readRequiredRecord(value, 'Model record is required')",
                "throw new Error(type ? `Unsupported model type: ${type}` : 'Model type is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-ratelimit" / "src" / "ratelimitService.ts": [
                "return readRequiredApiItems(result, 'Failed to fetch IP limits')\n      .map(normalizeIpLimit)",
                "return readRequiredApiItems(result, 'Failed to fetch token limits')\n      .map(normalizeTokenLimit)",
                "return readRequiredApiItems(result, 'Failed to fetch model limits')\n      .map(normalizeModelLimit)",
                "return readRequiredApiItems(result, 'Failed to fetch firewall rules')\n      .map(normalizeFirewall)",
                "readRequiredRecord(value, 'IP limit record is required')",
                "readRequiredRecord(value, 'Token limit record is required')",
                "readRequiredRecord(value, 'Model limit record is required')",
                "readRequiredRecord(value, 'Firewall rule record is required')",
                "readRequiredNumber(item, 'rps', 'IP limit rps is required')",
                "readRequiredNumber(item, 'rpd', 'Token limit rpd is required')",
                "readRequiredString(item, 'value', 'Firewall rule value is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-marketing" / "src" / "marketingService.ts": [
                "return readRequiredApiItems(result, 'Failed to fetch referral stats')\n      .map(normalizeReferralStat)",
                "readRequiredRecord(value, 'Referral stat record is required')",
                "readRequiredString(item, 'id', 'Referral stat id is required')",
                "readRequiredString(item, 'inviter', 'Referral inviter is required')",
                "readRequiredNumber(item, 'total_invited', 'Referral invited total is required')",
                "readRequiredString(item, 'total_revenue', 'Referral revenue is required')",
                "readRequiredString(item, 'bonus_awarded', 'Referral bonus is required')",
                "readRequiredString(item, 'link', 'Referral link is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-routing" / "src" / "routingService.ts": [
                "return readRequiredApiItems(result, 'console.routing.states.requestTraces.loadErrorFallback')\n      .map(normalizeRequestTrace)",
                "return readRequiredApiItems(result, 'console.routing.states.channels.loadErrorFallback')\n      .map(normalizeRoutingChannel)",
                "return readRequiredApiItems(result, 'console.routing.states.apiKeys.loadErrorFallback')\n      .map(normalizeRoutingApiKey)",
                "chartData: readRequiredApiItems(data, 'console.routing.states.usage.loadErrorFallback', ['chartData'])\n        .map(normalizeRoutingUsageData)",
                "mappingRules: readRequiredApiItems(item, 'Routing strategy mapping rules are required', ['mappingRules'])\n      .map(normalizeMappingRule)",
                "readRequiredRecord(value, 'Routing channel record is required')",
                "readRequiredRecord(value, 'Routing API key record is required')",
                "readRequiredRecord(value, 'Request trace record is required')",
                "readRequiredRecord(value, 'Routing mapping rule record is required')",
                "const displayKey = readRequiredFirstString(",
                "'Routing API key value is required'",
                "readRequiredFirstStringArray(item, ['models', 'modelList', 'model_list'], 'Routing channel models are required')",
                "readRequiredNonNegativeMetric(item, 'tokens', 'Request trace tokens are required')",
                "throw new Error(strategy ? `Unsupported routing strategy: ${strategy}` : 'Routing strategy is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-channel" / "src" / "channelService.ts": [
                "return readRequiredApiItems(result, 'Failed to fetch channels')\n      .map(normalizeChannel)",
                "return readRequiredApiItems(result, 'Failed to fetch provider credentials')\n      .map(normalizeProviderSecret)",
                "readRequiredRecord(value, 'Channel record is required')",
                "readRequiredRecord(value, 'Provider credential record is required')",
                "readRequiredStringArray(item, 'models', 'Channel models are required')",
                "readRequiredStringArray(item, 'capabilities', 'Channel capabilities are required')",
                "readRequiredString(item, 'secretRef', 'Provider credential secret reference is required')",
                "throw new Error(status ? `Unsupported channel status: ${status}` : 'Channel status is required')",
                "throw new Error(status ? `Unsupported provider credential status: ${status}` : 'Provider credential status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-user" / "src" / "userService.ts": [
                "return readRequiredApiItems(result, 'admin.user.errors.fetchUsersFallback')\n      .map(normalizeUser)",
                "readRequiredRecord(value, 'User record is required')",
                "readRequiredRecord(value, 'API key record is required')",
                "readRequiredString(item, 'email', 'User email is required')",
                "readRequiredString(item, 'key', 'API key value is required')",
                "result[userId] = value.map(normalizeApiKey)",
                "throw new Error(status ? `Unsupported user status: ${status}` : 'User status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-finance" / "src" / "financeService.ts": [
                "backendCouponsTemplatesList",
                "backendCouponsCampaignsList",
                "backendCouponsCodesList",
                "backendCouponsRedemptionsList",
                "readRequiredString(item, 'id', 'Coupon id is required')",
                "readRequiredString(item, 'id', 'Coupon batch id is required')",
                "readRequiredString(item, 'id', 'Promo code id is required')",
                "readRequiredString(item, 'id', 'Redemption record id is required')",
                "backendCommerceReportsPaymentReconciliationRetrieve",
                "backendCommerceReportsOrderRevenueList",
                "backendCommerceReportsRefundsList",
                "backendAuditCommerceEventsList",
                "readRequiredStableIdItems(result, 'Coupon records are required'",
                "readRequiredStableIdItems(result, 'Coupon batch records are required'",
                "readRequiredStableIdItems(result, 'Promo code records are required'",
                "readRequiredStableIdItems(result, 'Redemption records are required'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-wallet" / "src" / "walletService.ts": [
                "backendRechargesPackagesList",
                "backendRechargesOrdersList",
                "readRequiredApiItems(result, listMessage)",
                "readRequiredString(item, 'id', 'Recharge record id is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-wallet" / "src" / "walletService.ts": [
                "readRequiredRecord(value, 'Redeem history record is required')",
                "firstRequiredString(item, ['code', 'couponCode', 'coupon_code', 'templateCode', 'template_code'], 'Redeem history code is required')",
                "'Redeem history amount must be a money string'",
                "firstRequiredString(item, ['date', 'redeemedAt', 'redeemed_at', 'createdAt', 'created_at'], 'Redeem history date is required')",
                "throw new Error(`Unsupported billing status: ${status}`)",
                "readOptionalMoneyString(data, 'amount', 'Redeem amount must be a money string')",
                "readRequiredRecord(value, 'Recharge history record is required')",
                "firstRequiredString(item, ['orderNo', 'order_no', 'sourceId', 'source_id', 'requestNo', 'request_no'], 'Recharge history order number is required')",
                "readFirstString(item, ['method', 'paymentMethod', 'payment_method', 'sourceType', 'source_type']) || 'wallet'",
                "'Recharge history amount must be a money string'",
                "firstRequiredString(item, ['date', 'createdAt', 'created_at'], 'Recharge history date is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-checkout" / "src" / "checkoutService.ts": [
                "const safeOrderNo = requiredText(orderNo, 'orderNo')",
                "appRechargesOrdersRetrieve(safeOrderNo)",
                "return normalizeCheckoutStatus(readCommerceResourceRecord(result, 'Checkout order record is required'), safeOrderNo)",
                "const orderNo = readFirstString(item, ['orderNo', 'order_no', 'requestNo', 'request_no', 'id']) || fallbackOrderNo",
                "readFirstMoneyString(\n    item,\n    ['amount', 'priceAmount', 'price_amount', 'totalAmount', 'total_amount'],\n    'Checkout amount is required',\n    'Checkout amount must be a money string',\n  )",
                "points: readFirstNonNegativeNumber(item, ['points', 'grantAmount', 'grant_amount'], 'Checkout points are required')",
                "paymentMethod: readFirstString(item, ['paymentMethod', 'payment_method', 'method']) || 'wechat'",
                "outTradeNo: readFirstString(item, ['outTradeNo', 'out_trade_no', 'externalTradeNo', 'external_trade_no'])",
                "qrCodePayload: readFirstString(item, ['qrCodePayload', 'qr_code_payload', 'paymentUrl', 'payment_url'])",
                "function readCheckoutStatusValue(value: string): CheckoutStatusValue",
                "throw new Error(`Unsupported checkout status: ${status}`)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-recharge" / "src" / "rechargeService.ts": [
                "readRequiredRecord(value, 'Recharge package record is required')",
                "throw new Error('Recharge order number is required')",
                "'Recharge package money amount must be a money string'",
                "bonus: readOptionalNonNegativeNumber(item, 'bonus')",
                "readRequiredBoolean(data, 'success', 'Recharge success flag is required')",
                "throw new Error('Recharge submission was not accepted')",
                "amount: moneyAmount(amount, 'amount')",
                "paymentMethod: requiredText(method, 'method')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-announcement" / "src" / "announcementService.ts": [
                "readRequiredRecord(value, 'Announcement record is required')",
                "readRequiredString(item, 'title', 'Announcement title is required')",
                "target: readAnnouncementTarget(item)",
                "throw new Error(target ? `Unsupported announcement target: ${target}` : 'Announcement target is required')",
                "throw new Error(status ? `Unsupported announcement status: ${status}` : 'Announcement status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-group" / "src" / "groupService.ts": [
                "readRequiredRecord(value, 'Group record is required')",
                "readRequiredNestedRecord(item, 'capacity', 'Group capacity is required')",
                "readRequiredString(item, 'name', 'Group name is required')",
                "readRequiredNumber(item, 'rateMultiplier', 'Group rate multiplier is required')",
                "throw new Error(type ? `Unsupported group type: ${type}` : 'Group type is required')",
                "throw new Error(status ? `Unsupported group status: ${status}` : 'Group status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-monitor" / "src" / "monitorService.ts": [
                "readRequiredRecord(value, 'System node record is required')",
                "readRequiredRecord(value, 'Alert record is required')",
                "readRequiredRecord(value, 'Performance record is required')",
                "readRequiredString(item, 'name', 'System node name is required')",
                "readRequiredNonNegativeNumber(item, 'cpu', 'System node cpu is required')",
                "readRequiredString(item, 'title', 'Alert title is required')",
                "readRequiredString(item, 'time', 'Performance time is required')",
                "throw new Error(status ? `Unsupported system node status: ${status}` : 'System node status is required')",
                "throw new Error(severity ? `Unsupported alert severity: ${severity}` : 'Alert severity is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-dashboard" / "src" / "dashboardService.ts": [
                "readRequiredRecordArray(data, 'userConsumption', 'Dashboard userConsumption is required', 'Dashboard pie chart record is required')",
                "readRequiredRecordArray(data, 'traffic', 'Dashboard traffic is required', 'Dashboard traffic record is required')",
                "readRequiredRecordArray(data, 'recentUsage', 'Dashboard recentUsage is required', 'Recent usage trace record is required')",
                "readRequiredRecord(value, 'Recent usage trace record is required')",
                "readRequiredString(item, 'name', 'Dashboard pie chart name is required')",
                "readRequiredNonNegativeNumber(item, 'value', 'Dashboard pie chart value is required')",
                "readRequiredString(item, 'time', 'Dashboard traffic time is required')",
                "readRequiredString(item, 'user', 'Recent usage trace user is required')",
                "readRequiredDecimalString(",
                "'Recent usage trace cost must be a decimal string'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-usage" / "src" / "usageService.ts": [
                "readRequiredRecord(value, 'Usage log record is required')",
                "readRequiredString(item, 'requestId', 'Usage log request id is required')",
                "readRequiredNonNegativeNumber(item, 'inputTokens', 'Usage log input tokens are required')",
                "readRequiredDecimalString(",
                "'Usage log cost is required'",
                "'Usage log cost must be a decimal string'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-dashboard" / "src" / "dashboardService.ts": [
                "readRequiredRecordArray(record, 'chartData', 'Dashboard overview chartData is required', 'Dashboard overview chart record is required')",
                "readRequiredRecordArray(record, 'topModels', 'Dashboard overview topModels is required', 'Dashboard top model record is required')",
                "readRequiredRecordArray(record, 'announcements', 'Dashboard overview announcements is required', 'Dashboard announcement record is required')",
                "`Dashboard ${label} sparkline record is required`",
                "readRequiredRecord(value, 'Dashboard overview chart record is required')",
                "readRequiredFirstString(item, ['time', 'day', 'date', 'period'], 'Dashboard overview chart time is required')",
                "readRequiredFirstString(item, ['name', 'model'], 'Dashboard top model name is required')",
                "readRequiredFirstNumber(item, ['requests', 'requestCount', 'request_count'], 'Dashboard top model request count is required')",
                "readRequiredFirstString(item, ['text', 'title', 'summary', 'content'], 'Dashboard announcement text is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-account" / "src" / "accountService.ts": [
                "readRequiredRecordArray(value, 'consumptionByService', 'Account consumption record is required')",
                "readRequiredRecordArray(value, 'loginLogs', 'Account login log record is required')",
                "readRequiredRecord(value.invoiceSettings, 'Account invoice settings are required')",
                "readRequiredRecord(value.security, 'Account security summary is required')",
                "readRequiredString(item, 'name', 'Account consumption service name is required')",
                "readRequiredNonNegativeNumber(item, 'value', 'Account consumption value is required')",
                "readRequiredString(item, 'ip', 'Account login IP is required')",
                "throw new Error(status ? `Unsupported account login status: ${status}` : 'Account login status is required')",
                "readRequiredBoolean(value, 'isVerified', 'Account verification status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-user" / "src" / "userService.ts": [
                "name: readRequiredString(data, 'displayName', 'User profile display name is required')",
                "phone: readRequiredStringAllowEmpty(data, 'phone', 'User profile phone is required')",
                "language: readRequiredString(data, 'language', 'User profile language is required')",
                "avatar: readRequiredStringAllowEmpty(data, 'avatarUrl', 'User profile avatar URL is required')",
                "isVerified: readRequiredBoolean(data, 'isVerified', 'User profile verification status is required')",
                "twoFactorEnabled: readRequiredBoolean(data, 'twoFactorEnabled', 'User profile two-factor status is required')",
                "thirdPartyBound: readRequiredStringAllowEmpty(data, 'thirdPartyBound', 'User profile third-party binding summary is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-record" / "src" / "recordService.ts": [
                "readRequiredRecord(value, 'Log record is required')",
                "readRequiredString(item, 'requestId', 'Log request id is required')",
                "readRequiredNonNegativeNumber(item, 'inputTokens', 'Log input tokens are required')",
                "readRequiredDecimalString(",
                "'Log cost is required'",
                "'Log cost must be a decimal string'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-gateway" / "src" / "gatewayService.ts": [
                "return readRequiredApiItems(result, 'console.gateway.states.loadErrorFallback').map(readGatewayTrace)",
                "readRequiredRecord(value, 'Gateway trace record is required')",
                "readRequiredString(item, 'id', 'Gateway trace id is required')",
                "method: readHttpMethod(item.method)",
                "readRequiredNumber(item, 'status', 'Gateway trace status is required')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-commons" / "src" / "notificationService.ts": [
                "return readNotificationItems(result).map((item) => toSdkworkNotificationItem(readNotification(item)))",
                "throw new Error('Notification list response missing items')",
                "readRequiredString(value, 'id', 'Notification id is required')",
                "readRequiredString(value, 'desc', 'Notification description is required')",
                "readNotificationType(value.type)",
                "readNotificationRead(value.read)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-providers" / "src" / "providerService.ts": [
                "readRequiredRecord(value, 'Provider record is required')",
                "readRequiredString(item, 'id', 'Provider id is required')",
                "throw new Error(type ? `Unsupported provider family: ${type}` : 'Provider family is required')",
                "throw new Error(\n    integrationType\n      ? `Unsupported integration provider type: ${integrationType}`\n      : 'Integration provider type is required',\n  )",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-settlements" / "src" / "settlementsService.ts": [
                "readRequiredApiItems(ledgerResult, 'Settlement ledger entries are required')",
                "readRequiredApiItems(invoiceResult, 'Settlement invoice records are required')",
                "readRequiredRecord(item, 'Settlement ledger entry is required')",
                "readRequiredRecord(item, 'Settlement invoice record is required')",
                "buildSettlementDashboard(query.year, ledgerEntries, invoices)",
                "normalizeSettlementBill(invoice)",
                "settlementBucket(entry)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-playground" / "src" / "historyMapper.ts": [
                "return items.map(mapGenerationHistoryItem)",
                "readRequiredRecord(value, 'Playground history record is required')",
                "readRequiredString(item, 'id', 'Playground history id is required')",
                "readRequiredString(item, 'prompt', 'Playground history prompt is required')",
                "throw new Error('Playground history type is required')",
            ],
        }
        forbidden_fragments = {
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-model" / "src" / "modelService.ts": [
                ".filter(isRecord)",
                "return 'Chat';",
                "models: (Array.isArray(data.models) ? data.models : [])",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-ratelimit" / "src" / "ratelimitService.ts": [
                ".filter(isRecord)",
                "rps: readNumber(item, 'rps')",
                "rpd: readNumber(item, 'rpd')",
                "value: readString(item, 'value')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-marketing" / "src" / "marketingService.ts": [
                ".filter(isRecord)",
                "data.codes.filter(isRecord)",
                "value: readString(item, 'value')",
                "code: readString(item, 'code')",
                "count: readNumber(item, 'count')",
                "total_invited: readNumber(item, 'total_invited')",
                "return 'available';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-routing" / "src" / "routingService.ts": [
                ".filter(isRecord)",
                "readRecordArray(data, 'chartData')",
                "readRecordArray(item, 'mappingRules')",
                "models: readFirstStringArray(item, ['models', 'modelList', 'model_list'], ['default-model'])",
                "return 'latency';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-channel" / "src" / "channelService.ts": [
                ".filter(isRecord)",
                "models: readStringArray(item, 'models')",
                "capabilities: readStringArray(item, 'capabilities')",
                "return 'active';",
                "return readString(item, 'status') === 'disabled' ? 'disabled' : 'active';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-user" / "src" / "userService.ts": [
                ".filter(isRecord)",
                "email: readString(item, 'email')",
                "key: readString(item, 'key')",
                "status: readString(item, 'status') === 'banned' ? 'banned' : 'active'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-finance" / "src" / "financeService.ts": [
                ".filter(isRecord)",
                "return 'consume';",
                "return 'success';",
                "return 'paid';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-wallet" / "src" / "walletService.ts": [
                ".filter(isRecord)",
                "code: readString(item, 'code')",
                "orderNo: readString(item, 'orderNo')",
                "amount: readMoneyString(item, 'amount')",
                "date: readString(item, 'date')",
                "status: readBillingStatus(item)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-checkout" / "src" / "checkoutService.ts": [
                "fetchCheckoutStatus(orderNo);",
                ".payment.fetchCheckoutStatus(orderNo)",
                ".payment.fetchCheckoutStatus",
                ".payments.fetchCheckoutStatus",
                "orderNo: readString(item, 'orderNo')",
                "amount: readMoneyString(item, 'amount')",
                "points: readNumber(item, 'points')",
                "paymentMethod: readString(item, 'paymentMethod')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-recharge" / "src" / "rechargeService.ts": [
                ".filter(isRecord)",
                "orderNo: readString(data, 'orderNo')",
                "rmb: readMoneyString(item, 'rmb')",
                "bonus: readNumber(item, 'bonus')",
                "success: readBoolean(data, 'success', true)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-announcement" / "src" / "announcementService.ts": [
                ".filter(isRecord)",
                "title: readString(item, 'title')",
                "status: readString(item, 'status') === 'draft' ? 'draft' : 'published'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-group" / "src" / "groupService.ts": [
                ".filter(isRecord)",
                "name: readString(item, 'name')",
                "rateMultiplier: readNumber(item, 'rateMultiplier', 1)",
                "type: readString(item, 'type') === 'dedicated' ? 'dedicated' : 'public'",
                "status: readString(item, 'status') === 'disabled' ? 'disabled' : 'active'",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-monitor" / "src" / "monitorService.ts": [
                ".filter(isRecord)",
                "name: readString(item, 'name')",
                "cpu: readNumber(item, 'cpu')",
                "status: readString(item, 'status') === 'resolved' ? 'resolved' : 'active'",
                "return 'online';",
                "return 'info';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-dashboard" / "src" / "dashboardService.ts": [
                ".filter(isRecord)",
                "readRecordArray(data, 'userConsumption')",
                "readRecordArray(data, 'traffic')",
                "readRecordArray(data, 'recentUsage')",
                "user: readString(item, 'user')",
                "cost: readString(item, 'cost')",
                "isApiUser: readBoolean(item, 'isApiUser')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-usage" / "src" / "usageService.ts": [
                ".filter(isRecord)",
                "requestId: readString(item, 'requestId')",
                "inputTokens: readNumber(item, 'inputTokens')",
                "cost: readDecimalString(item, 'cost')",
                "isStream: readBoolean(item, 'isStream')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-dashboard" / "src" / "dashboardService.ts": [
                ".filter(isRecord)",
                "readRecordArray(record, 'chartData')",
                "readRecordArray(record, 'topModels')",
                "readRecordArray(record, 'announcements')",
                "readRecordArray(record, key)",
                "name: readFirstString(item, ['name', 'model'], 'unknown')",
                "supplier: readFirstString(item, ['supplier', 'vendor', 'vendorCode'], '-')",
                "normalizeAnnouncementType(readFirstString",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-account" / "src" / "accountService.ts": [
                ".filter(isRecord)",
                "readRecordArray(data, 'consumptionByService')",
                "readRecordArray(data, 'loginLogs')",
                "name: readString(item, 'name')",
                "const record = isRecord(value) ? value : {};",
                "const status = readString(item, 'status') === 'warning' ? 'warning' : 'success';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-user" / "src" / "userService.ts": [
                "name: readString(data, 'name')",
                "phone: readString(data, 'phone')",
                "isVerified: readBoolean(data, 'isVerified')",
                "twoFactorEnabled: readBoolean(data, 'twoFactorEnabled')",
                "thirdPartyBound: readString(data, 'thirdPartyBound')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-record" / "src" / "recordService.ts": [
                ".filter(isRecord)",
                "requestId: readString(item, 'requestId')",
                "inputTokens: readNumber(item, 'inputTokens')",
                "cost: readDecimalString(item, 'cost')",
                "isStream: readBoolean(item, 'isStream')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-gateway" / "src" / "gatewayService.ts": [
                ".filter(isGatewayTrace)",
                "function isGatewayTrace(",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-commons" / "src" / "notificationService.ts": [
                ".filter(isMessage)",
                "function isMessage(",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-providers" / "src" / "providerService.ts": [
                ".filter(isRecord)",
                "return 'opencode';",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-settlements" / "src" / "settlementsService.ts": [
                ".filter(isRecord)",
                "readRecordArray(data, 'chartData')",
                "readRecordArray(data, 'bills')",
                "const breakdown = isRecord(item.breakdown) ? item.breakdown : {};",
                "normalizeBreakdown(isRecord(breakdown.text) ? breakdown.text : {})",
                "readStringArray(item, 'models')",
                "period: readString(item, 'period')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-playground" / "src" / "historyMapper.ts": [
                "items.flatMap",
                "return null",
                "mapped ? [mapped] : []",
            ],
        }

        for service_path, required_fragments in guarded_services.items():
            relative = service_path.relative_to(ROOT).as_posix()
            source = service_path.read_text(encoding="utf-8", errors="ignore")
            for fragment in required_fragments:
                self.assertIn(fragment, source, f"{relative}: missing {fragment}")
            for fragment in forbidden_fragments.get(service_path, []):
                self.assertNotIn(fragment, source, f"{relative}: remote contract drift must not be silently dropped by {fragment}")

    def test_portal_mutation_services_validate_sdk_path_ids(self) -> None:
        guarded_services = {
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-channel" / "src" / "channelService.ts": [
                "requiredSafePathSegment(id, 'channelId')",
                "requiredSafePathSegment(id, 'providerSecretId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-announcement" / "src" / "announcementService.ts": [
                "requiredSafePathSegment(id, 'announcementId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-group" / "src" / "groupService.ts": [
                "requiredSafePathSegment(id, 'groupId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-model" / "src" / "modelService.ts": [
                "requiredSafePathSegment(id, 'modelId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-user" / "src" / "userService.ts": [
                "requiredSafePathSegment(keyId, 'apiKeyId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-ratelimit" / "src" / "ratelimitService.ts": [
                "requiredSafePathSegment(id, 'firewallRuleId')",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-routing" / "src" / "routingService.ts": [
                "requiredSafePathSegment(channelId, 'channelId')",
            ],
        }
        forbidden_fragments = {
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-channel" / "src" / "channelService.ts": [
                ".channel.deleteChannel(id)",
                ".channel.test(\n      id,",
                "toUpdateChannelRequest(id, updates)",
                "toUpdateProviderSecretRequest(id, updates)",
                ".providerSecrets.deleteProviderSecret(id)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-announcement" / "src" / "announcementService.ts": [
                ".announcements.updateAnnouncement(\n      id,",
                ".announcements.deleteAnnouncement(id)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-group" / "src" / "groupService.ts": [
                ".accessGroups.updateGroup(\n      id,",
                ".accessGroups.deleteGroup(id)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-model" / "src" / "modelService.ts": [
                ".model.deleteModel(id)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-user" / "src" / "userService.ts": [
                ".apikey.deleteApiKey(keyId)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-ratelimit" / "src" / "ratelimitService.ts": [
                ".firewall.remove(id)",
            ],
            PORTAL_PACKAGES / "sdkwork-claw-router-console-routing" / "src" / "routingService.ts": [
                "router.updateChannel(requiredText(channelId, 'channelId')",
                "router.deleteChannel(requiredText(channelId, 'channelId'))",
                "router.setChannelStatus(requiredText(channelId, 'channelId')",
                "const normalizedChannelId = requiredText(channelId, 'channelId')",
            ],
        }

        for service_path, required_fragments in guarded_services.items():
            relative = service_path.relative_to(ROOT).as_posix()
            source = service_path.read_text(encoding="utf-8", errors="ignore")
            self.assertIn("sdkwork-claw-router-commons/runtime", source, relative)
            self.assertIn("requiredSafePathSegment", source, relative)
            for fragment in required_fragments:
                self.assertIn(fragment, source, f"{relative}: missing {fragment}")
            for fragment in forbidden_fragments.get(service_path, []):
                self.assertNotIn(fragment, source, f"{relative}: unsafe SDK path id pass-through remains: {fragment}")

    def test_portal_sdk_request_boundary_is_shared_not_locally_reimplemented(self) -> None:
        runtime_entrypoint = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-commons"
            / "src"
            / "runtime.ts"
        )
        boundary = (
            PORTAL_PACKAGES
            / "sdkwork-claw-router-commons"
            / "src"
            / "sdk-request-boundary.ts"
        )
        guarded_services = [
            PORTAL_PACKAGES / "sdkwork-claw-router-app-center" / "src" / "services" / "appService.ts",
            PORTAL_PACKAGES / "sdkwork-claw-router-skills-hub" / "src" / "services" / "skillService.ts",
            PORTAL_PACKAGES / "sdkwork-claw-router-console-usage" / "src" / "usageService.ts",
            PORTAL_PACKAGES / "sdkwork-claw-router-admin-record" / "src" / "recordService.ts",
        ]

        self.assertTrue(boundary.exists(), "Commons must own reusable SDK request boundary primitives.")
        self.assertIn("export * from './sdk-request-boundary.ts';", runtime_entrypoint.read_text(encoding="utf-8"))

        for service_path in guarded_services:
            relative = service_path.relative_to(ROOT).as_posix()
            source = service_path.read_text(encoding="utf-8", errors="ignore")
            self.assertIn("sdkwork-claw-router-commons/runtime", source, relative)
            for forbidden in (
                "function optionalBoundedPositiveInteger",
                "function optionalPositiveInteger",
                "function optionalInteger",
                "function requiredSafePathSegment",
                "function pruneUndefined",
                "SAFE_PATH_SEGMENT_PATTERN =",
            ):
                self.assertNotIn(forbidden, source, f"{relative} must import shared SDK request boundary primitive instead of reimplementing {forbidden}")

    def test_portal_and_generated_sdk_do_not_reintroduce_legacy_operation_signatures(self) -> None:
        removed_portal_tokens = [
            "AdminChannelListRequest",
            "TestChannelRequest",
            "FetchChannelsRequest",
            "FetchUsersRequest",
            "FetchApiKeysMapRequest",
            "FetchCouponsRequest",
            "FetchRedemptionRecordsRequest",
            "FetchRechargeRecordsRequest",
            "FetchModelsRequest",
            "EnableSkillPackageRequest",
            "DisableSkillPackageRequest",
            "EnableSkillRequest",
            "DisableSkillRequest",
            "PublishSkillRequest",
            "OfflineSkillRequest",
            "emptyTestChannelRequest",
            "emptyEnableSkillPackageRequest",
            "emptyDisableSkillPackageRequest",
            "emptyEnableSkillRequest",
            "emptyDisableSkillRequest",
            "emptyPublishSkillRequest",
            "emptyOfflineSkillRequest",
        ]
        portal_violations: list[str] = []

        for source in self._portal_sources():
            relative = source.relative_to(ROOT).as_posix()
            content = source.read_text(encoding="utf-8", errors="ignore")
            for token in removed_portal_tokens:
                if token in content:
                    portal_violations.append(f"{relative}: contains removed SDK surface {token}")

        self.assertEqual(
            [],
            portal_violations,
            "Portal production source must use the latest generated SDK signatures and must not carry removed empty request DTO helpers.",
        )

        stale_api_files = [
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "access-groups.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "announcements.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "coupon-batches.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "coupon-codes.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "firewall.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "rate-limits.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "users.ts",
        ]
        existing_stale_api_files = [path.relative_to(ROOT).as_posix() for path in stale_api_files if path.exists()]
        self.assertEqual(
            [],
            existing_stale_api_files,
            "Generated backend SDK must keep the current operation grouping instead of stale split API files.",
        )

        sdk_api_violations: list[str] = []
        legacy_header_signature = re.compile(
            r"\basync\s+[A-Za-z0-9_]+\([^)]*headers\?:\s*Record<string,\s*string>",
            re.DOTALL,
        )
        legacy_number_path_id = re.compile(r"\basync\s+[A-Za-z0-9_]+\([^)]*:\s*string\s*\|\s*number", re.DOTALL)

        for sdk_name in ["clawrouter-app-sdk", "clawrouter-backend-sdk"]:
            api_dir = ROOT / "sdks" / sdk_name / "src" / "api"
            for source in sorted(api_dir.glob("*.ts")):
                if source.name in {"base.ts", "index.ts", "paths.ts"}:
                    continue
                relative = source.relative_to(ROOT).as_posix()
                content = source.read_text(encoding="utf-8", errors="ignore")
                if legacy_header_signature.search(content):
                    sdk_api_violations.append(f"{relative}: public operation method accepts raw headers")
                if legacy_number_path_id.search(content):
                    sdk_api_violations.append(f"{relative}: public operation method accepts string | number path id")

        self.assertEqual(
            [],
            sdk_api_violations,
            "Generated SDK operation APIs must expose named request-id/idempotency parameters and string path ids, not old raw headers or string|number path ids.",
        )

    def test_portal_root_does_not_ship_ai_studio_starter_or_one_off_rewrite_scripts(self) -> None:
        forbidden_files = [
            PORTAL_ROOT / "fix_inputs.mjs",
            PORTAL_ROOT / "migrate.cjs",
            PORTAL_ROOT / "modify_admin.mjs",
            PORTAL_ROOT / "modify_console.mjs",
            PORTAL_ROOT / "package-lock.json",
            PORTAL_ROOT / "replace.mjs",
            PORTAL_ROOT / "update_files.cjs",
        ]
        existing = [path.relative_to(ROOT).as_posix() for path in forbidden_files if path.exists()]

        self.assertEqual(
            [],
            existing,
            "Portal root must not ship one-off rewrite scripts or npm lockfiles; use pnpm and keep business behavior in source, SDK, and Rust APIs.",
        )

        checked_docs = [
            PORTAL_ROOT / "README.md",
            PORTAL_ROOT / "index.html",
            PORTAL_ROOT / "vite.config.ts",
        ]
        forbidden_markers = [
            "AI Studio",
            "ai.studio",
            "GHBanner",
            "GEMINI_API_KEY",
            "Gemini-backed tools",
            "My Google AI Studio App",
        ]
        violations: list[str] = []
        for path in checked_docs:
            content = path.read_text(encoding="utf-8", errors="ignore")
            relative = path.relative_to(ROOT).as_posix()
            for marker in forbidden_markers:
                if marker in content:
                    violations.append(f"{relative}: contains {marker}")

        self.assertEqual(
            [],
            violations,
            "Portal root docs and HTML metadata must describe the Claw Router product, not starter templates.",
        )

        package_json = json.loads((PORTAL_ROOT / "package.json").read_text(encoding="utf-8"))
        self.assertEqual("sdkwork-claw-router-portal", package_json.get("name"))
        self.assertNotIn("@google/genai", package_json.get("dependencies", {}))

    def test_portal_workspace_runtime_dependencies_are_root_managed(self) -> None:
        singleton_runtime_dependencies = {
            "react",
            "react-dom",
            "react-router-dom",
            "react-i18next",
            "lucide-react",
            "motion",
        }
        boundary_runtime_dependencies = {
            "@sdkwork/clawrouter-app-sdk",
            "@sdkwork/clawrouter-backend-sdk",
            "@sdkwork/clawrouter-open-sdk",
        }
        root_managed_runtime_dependencies = singleton_runtime_dependencies | boundary_runtime_dependencies
        sdk_boundary_package = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/package.json"
        root_package = json.loads((PORTAL_ROOT / "package.json").read_text(encoding="utf-8"))
        root_dependencies = root_package.get("dependencies", {})

        for dependency_name in root_managed_runtime_dependencies:
            self.assertIn(
                dependency_name,
                root_dependencies,
                f"Portal root package.json must own runtime dependency {dependency_name}.",
            )

        violations: list[str] = []
        for package_path in sorted(PORTAL_PACKAGES.glob("*/package.json")):
            package = json.loads(package_path.read_text(encoding="utf-8"))
            relative = package_path.relative_to(ROOT).as_posix()
            for section_name in ("dependencies", "devDependencies", "optionalDependencies"):
                dependencies = package.get(section_name, {})
                for dependency_name in sorted(singleton_runtime_dependencies & set(dependencies)):
                    violations.append(f"{relative}: {section_name}.{dependency_name}")
                if relative == sdk_boundary_package and section_name == "dependencies":
                    for dependency_name in boundary_runtime_dependencies:
                        self.assertIn(
                            dependency_name,
                            dependencies,
                            f"Portal commons runtime boundary must depend on {dependency_name}.",
                        )
                    continue
                for dependency_name in sorted(boundary_runtime_dependencies & set(dependencies)):
                    violations.append(f"{relative}: {section_name}.{dependency_name}")

        self.assertEqual(
            [],
            violations,
            "Portal workspace packages must not declare singleton runtime dependencies; only the commons runtime boundary may own generated SDK package dependencies.",
        )

    def test_portal_index_html_uses_single_vite_entry_without_runtime_dependency_scripts(self) -> None:
        html = (PORTAL_ROOT / "index.html").read_text(encoding="utf-8", errors="ignore")

        self.assertEqual(1, html.count('<script type="module" src="/src/main.tsx"></script>'))
        for forbidden in [
            "react.development.js",
            "react-dom",
            "unpkg.com",
            "esm.sh",
            "cdn.jsdelivr",
            "cdnjs.cloudflare.com",
            "runtime-env.js",
        ]:
            self.assertNotIn(forbidden, html)

    def test_portal_global_scrollbars_follow_theme_tokens(self) -> None:
        stylesheet = PORTAL_ROOT / "src" / "index.css"
        css = stylesheet.read_text(encoding="utf-8", errors="ignore")

        for selector in (
            "html",
            "body",
            ".custom-scrollbar",
            ".dark .custom-scrollbar",
        ):
            self.assertIn(selector, css, f"Portal scrollbars must define {selector}.")

        for required in (
            "scrollbar-gutter: stable",
            "--scrollbar-thumb",
            "--scrollbar-thumb-hover",
            "--scrollbar-track",
            "--color-lobster-500",
            "--color-lobster-400",
            "scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track)",
            ".custom-scrollbar::-webkit-scrollbar",
        ):
            self.assertIn(required, css, f"Portal scrollbar stylesheet is missing {required}.")

        for legacy in (
            "scrollbar-color: rgba(0, 0, 0, 0.2) transparent",
            "scrollbar-color: rgba(255, 255, 255, 0.2) transparent",
            "background-color: rgba(0, 0, 0, 0.2)",
            "background-color: rgba(255, 255, 255, 0.2)",
        ):
            self.assertNotIn(legacy, css, f"Portal scrollbar styling must use theme colors, not {legacy}.")

    def _portal_sources(self) -> list[Path]:
        sources: list[Path] = []
        for directory, dirnames, filenames in os.walk(PORTAL_PACKAGES):
            dirnames[:] = [
                dirname
                for dirname in dirnames
                if dirname not in {"node_modules", "dist", ".turbo"}
            ]
            for filename in filenames:
                source = Path(directory) / filename
                if source.name.endswith((".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx")):
                    continue
                if source.suffix in {".ts", ".tsx"}:
                    sources.append(source)
        return sorted(sources)


if __name__ == "__main__":
    unittest.main()
