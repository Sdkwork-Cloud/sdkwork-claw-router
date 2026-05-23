import json
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-admin-marketing"
)
SERVICE_PATH = PACKAGE_ROOT / "src" / "marketingService.ts"
VIEW_PATH = PACKAGE_ROOT / "src" / "index.tsx"
PACKAGE_JSON_PATH = PACKAGE_ROOT / "package.json"
BACKEND_SDK_SYSTEM_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "api"
    / "system.ts"
)
BACKEND_SDK_TYPES_INDEX_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "types"
    / "index.ts"
)
BACKEND_SDK_MARKETING_RESULT_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "types"
    / "marketing-referral-stats-list-result.ts"
)
BACKEND_SDK_REFERRAL_RESPONSE_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "types"
    / "admin-referral-stats-response.ts"
)


class AdminMarketingRuntimeStandardTest(unittest.TestCase):
    def test_admin_marketing_referral_stats_contract_uses_backend_surface(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        key = (
            "apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-admin-marketing/src/marketingService.ts#fetchReferralStats"
        )
        operation = operations[key]

        self.assertEqual("fetchReferralStats", operation["operation"])
        self.assertEqual("marketing.referralStats.list", operation["operation_id"])
        self.assertEqual("backend", operation["api_surface"])
        self.assertEqual("GET", operation["api_method"])
        self.assertEqual("/backend/v3/api/system/marketing/referral_stats", operation["api_path"])
        self.assertEqual("read", operation["kind"])
        self.assertEqual("AdminReferralStatsResponse", operation["response_schema"]["name"])

    def test_admin_marketing_frontend_and_backend_sdk_use_typed_referral_stats(self) -> None:
        package = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
        service = SERVICE_PATH.read_text(encoding="utf-8")
        view = VIEW_PATH.read_text(encoding="utf-8")
        sdk_system = BACKEND_SDK_SYSTEM_PATH.read_text(encoding="utf-8")
        sdk_types_index = BACKEND_SDK_TYPES_INDEX_PATH.read_text(encoding="utf-8")
        referral_list_result = BACKEND_SDK_MARKETING_RESULT_PATH.read_text(encoding="utf-8")
        referral_response = BACKEND_SDK_REFERRAL_RESPONSE_PATH.read_text(encoding="utf-8")

        self.assertEqual("module", package["type"])
        self.assertEqual("tsc --noEmit", package["scripts"]["typecheck"])

        self.assertIn("export interface ReferralStat", service)
        for token in [
            "id: string;",
            "inviter: string;",
            "total_invited: number;",
            "total_revenue: string;",
            "bonus_awarded: string;",
            "link: string;",
            "static async fetchReferralStats(): Promise<ReferralStat[]>",
            "getClawRouterBackendSdkClient().system.marketing.referralStats.list()",
            "readRequiredApiItems(result, 'Failed to fetch referral stats')",
            "normalizeReferralStat",
            "readRequiredString(item, 'id', 'Referral stat id is required')",
            "readRequiredString(item, 'inviter', 'Referral inviter is required')",
            "readRequiredNumber(item, 'total_invited', 'Referral invited total is required')",
            "readRequiredString(item, 'total_revenue', 'Referral revenue is required')",
            "readRequiredString(item, 'bonus_awarded', 'Referral bonus is required')",
            "readRequiredString(item, 'link', 'Referral link is required')",
        ]:
            self.assertIn(token, service)
        for retired_token in [
            "getClawRouterAppSdkClient()",
            "getClawRouterCommerceService()",
            "AdminCouponCreateRequest",
            "AdminCouponBatchGenerateRequest",
            "AdminPromoCodeStatusUpdateRequest",
            "generateBatch",
            "updatePromoCodeStatus",
            "BillingService",
            "console.billing",
        ]:
            self.assertNotIn(retired_token, service)

        self.assertIn("MarketingService.fetchReferralStats()", view)
        self.assertIn("useState<ReferralStat[]>([])", view)
        self.assertIn("loadReferralStats", view)
        self.assertIn("visibleStats", view)
        self.assertIn("BusinessStatePanel", view)
        self.assertIn("BusinessStateTableRow", view)
        self.assertIn("AdminTableShell", view)
        self.assertIn("CopyButton", view)
        self.assertIn("Search inviter or link", view)
        self.assertIn("Copy referral link", view)
        self.assertIn("Referral activity appears here after invited users create commercial activity.", view)
        for token in [
            "item.total_invited",
            "item.total_revenue",
            "item.bonus_awarded",
        ]:
            self.assertIn(token, view)
        for retired_token in [
            "AdminCouponCreateRequest",
            "AdminCouponBatchGenerateRequest",
            "AdminPromoCodeStatusUpdateRequest",
            "generateBatch",
            "updatePromoCodeStatus",
            "BillingService",
            "console.billing",
            "coupon.add",
            "promo code",
        ]:
            self.assertNotIn(retired_token, view)

        self.assertIn("public readonly referralStats: SystemMarketingReferralStatsApi;", sdk_system)
        self.assertIn("async list(): Promise<MarketingReferralStatsListResult>", sdk_system)
        self.assertIn("backendApiPath(`/system/marketing/referral_stats`)", sdk_system)
        self.assertIn("export type { MarketingReferralStatsListResult }", sdk_types_index)
        self.assertIn("export type { AdminReferralStatsResponse }", sdk_types_index)
        self.assertIn("export interface MarketingReferralStatsListResult", referral_list_result)
        self.assertIn("data?: AdminReferralStatsResponse;", referral_list_result)
        self.assertIn("export interface AdminReferralStatsResponse", referral_response)
        self.assertIn("items: AdminReferralStatItem[];", referral_response)


if __name__ == "__main__":
    unittest.main()
