import json
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]


class AdminMarketingRuntimeStandardTest(unittest.TestCase):
    def test_admin_marketing_write_contracts_use_operation_specific_payloads(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts"

        add_coupon = operations[f"{source}#addCoupon"]
        generate_batch = operations[f"{source}#generateBatch"]
        update_promo_code_status = operations[f"{source}#updatePromoCodeStatus"]

        self.assertEqual("AdminCouponCreateRequest", add_coupon["request_schema"]["name"])
        self.assertEqual(["name", "type", "value"], add_coupon["request_schema"]["schema"]["required"])
        self.assertEqual("AdminCouponMutationResponse", add_coupon["response_schema"]["name"])
        self.assertTrue(add_coupon["request_id_header"])

        self.assertEqual("AdminCouponBatchGenerateRequest", generate_batch["request_schema"]["name"])
        self.assertEqual(
            ["couponId", "name", "count", "prefix"],
            generate_batch["request_schema"]["schema"]["required"],
        )
        self.assertEqual("AdminCouponBatchGenerateResponse", generate_batch["response_schema"]["name"])
        self.assertTrue(generate_batch["request_id_header"])

        self.assertEqual(
            "AdminPromoCodeStatusUpdateRequest",
            update_promo_code_status["request_schema"]["name"],
        )
        self.assertEqual(["status"], update_promo_code_status["request_schema"]["schema"]["required"])
        self.assertEqual(
            "AdminPromoCodeStatusUpdateResponse",
            update_promo_code_status["response_schema"]["name"],
        )
        self.assertTrue(update_promo_code_status["request_id_header"])

    def test_admin_marketing_frontend_and_backend_sdk_do_not_use_generic_write_payloads(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-marketing"
            / "src"
            / "marketingService.ts"
        ).read_text(encoding="utf-8")
        coupon_api = (ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "api" / "coupon.ts").read_text(
            encoding="utf-8"
        )
        coupon_batches_api = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "api" / "coupon-batches.ts"
        ).read_text(encoding="utf-8")
        coupon_codes_api = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "api" / "coupon-codes.ts"
        ).read_text(encoding="utf-8")
        type_exports = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "src" / "types" / "index.ts"
        ).read_text(encoding="utf-8")

        for token in [
            "AdminCouponCreateRequest",
            "AdminCouponBatchGenerateRequest",
            "AdminPromoCodeStatusUpdateRequest",
            "toCreateCouponRequest",
            "toGenerateBatchRequest",
            "toUpdatePromoCodeStatusRequest",
            "requestHeaders('admin-coupon-create')",
            "requestHeaders('admin-coupon-batch-generate')",
            "requestHeaders('admin-promo-code-status-update')",
        ]:
            self.assertIn(token, service)

        self.assertNotIn(".coupon.add(coupon)", service)
        self.assertNotIn("router.generateBatch(batch)", service)
        self.assertNotIn("router.updatePromoCodeStatus(id, { status })", service)
        self.assertNotIn("as unknown as Record<string, unknown>", service)

        self.assertIn(
            "async add(body: AdminCouponCreateRequest, headers?: Record<string, string>): Promise<AddCouponResult>",
            coupon_api,
        )
        self.assertNotIn("async add(body?: OperationRequest): Promise<PlusApiResult>", coupon_api)

        self.assertIn(
            "async generateBatch(body: AdminCouponBatchGenerateRequest, headers?: Record<string, string>): Promise<GenerateBatchResult>",
            coupon_batches_api,
        )
        self.assertIn(
            "async updatePromoCodeStatus(promoCodeId: string | number, body: AdminPromoCodeStatusUpdateRequest, headers?: Record<string, string>): Promise<UpdatePromoCodeStatusResult>",
            coupon_codes_api,
        )
        self.assertNotIn("async generateBatch(body?: OperationRequest): Promise<PlusApiResult>", coupon_batches_api)
        self.assertNotIn(
            "async updatePromoCodeStatus(promoCodeId: string | number, body?: OperationRequest): Promise<PlusApiResult>",
            coupon_codes_api,
        )

        for token in [
            "AdminCouponCreateRequest",
            "AdminCouponMutationResponse",
            "AdminCouponBatchGenerateRequest",
            "AdminCouponBatchGenerateResponse",
            "AdminPromoCodeStatusUpdateRequest",
            "AdminPromoCodeStatusUpdateResponse",
            "AddCouponResult",
            "GenerateBatchResult",
            "UpdatePromoCodeStatusResult",
        ]:
            self.assertIn(f"export type {{ {token} }}", type_exports)

    def test_admin_marketing_create_forms_use_dedicated_inputs(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-marketing"
        )
        package = json.loads((package_root / "package.json").read_text(encoding="utf-8"))
        service = (package_root / "src" / "marketingService.ts").read_text(encoding="utf-8")
        view = (package_root / "src" / "index.tsx").read_text(encoding="utf-8")
        form = (package_root / "src" / "marketingForm.ts").read_text(encoding="utf-8")
        verifier = (ROOT / "scripts" / "verify-claw-router-product.mjs").read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertIn("export type CouponCreateInput", service)
        self.assertIn("export type CouponBatchGenerateInput", service)
        self.assertIn("static async addCoupon(coupon: CouponCreateInput): Promise<Coupon>", service)
        self.assertIn(
            "static async generateBatch(batch: CouponBatchGenerateInput): Promise<{ batch: Batch; codes: PromoCode[] }>",
            service,
        )
        self.assertIn("function toCreateCouponRequest(coupon: CouponCreateInput)", service)
        self.assertIn("function toGenerateBatchRequest(batch: CouponBatchGenerateInput)", service)
        self.assertNotIn("Omit<Coupon", service)
        self.assertIn("createCouponInputFromForm", view)
        self.assertIn("createCouponBatchGenerateInputFromForm", view)
        self.assertIn("MarketingService.addCoupon(createCouponInputFromForm(formData))", view)
        self.assertIn(
            "MarketingService.generateBatch(createCouponBatchGenerateInputFromForm(formData, selectedCouponId))",
            view,
        )
        self.assertIn("export function createCouponInputFromForm", form)
        self.assertIn("export function createCouponBatchGenerateInputFromForm", form)
        self.assertNotIn("Date.now()", view)
        self.assertNotIn("Math.random()", view)
        self.assertNotIn("Date.now()", form)
        self.assertNotIn("Math.random()", form)
        self.assertIn("admin-marketing-runtime.test.ts", verifier)

    def test_admin_marketing_view_uses_typed_collection_props(self) -> None:
        view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-marketing"
            / "src"
            / "index.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("type CouponsViewProps", view)
        self.assertIn("type PromoCodesViewProps", view)
        self.assertIn("React.Dispatch<React.SetStateAction<Coupon[]>>", view)
        self.assertIn("React.Dispatch<React.SetStateAction<PromoCode[]>>", view)
        self.assertNotIn(": any", view)
        self.assertNotIn("as any", view)

    def test_admin_marketing_rust_stores_fail_closed_for_unknown_status_codes(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "admin_marketing_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "admin_marketing_store.rs",
        ]

        for store_path in store_paths:
            source = store_path.read_text(encoding="utf-8")
            relative = store_path.relative_to(ROOT).as_posix()

            for signature in [
                "fn coupon_status_label(status: i64) -> DomainResult<&'static str>",
                "fn promo_status_label(\n    status: i64,\n    user_id: Option<&str>,\n    used_at: Option<&str>,\n) -> DomainResult<&'static str>",
                "fn recharge_status_label(status: i64) -> DomainResult<&'static str>",
            ]:
                self.assertIn(signature, source, relative)

            for error_fragment in [
                "unsupported admin coupon status",
                "unsupported admin promo code status",
                "unsupported admin recharge status",
            ]:
                self.assertIn(error_fragment, source, relative)

            for required_reader in [
                'let status = recharge_status_label(integer_cell(row, "status"))?.to_owned();',
                'let status = coupon_status_label(required_integer_cell(row, "status", "coupon")?)?.to_owned();',
                'let status = required_integer_cell(row, "status", "promo code")?;',
            ]:
                self.assertIn(required_reader, source, relative)

            for forbidden in [
                "fn coupon_status_label(status: i64) -> &'static str",
                "fn promo_status_label(status: i64, user_id: Option<&str>, used_at: Option<&str>) -> &'static str",
                "fn recharge_status_label(status: i64) -> &'static str",
                '_ => "pending"',
                'status < 0',
                'if status == COUPON_STATUS_ACTIVE {\n        "active"\n    } else {\n        "inactive"',
            ]:
                self.assertNotIn(forbidden, source, relative)

    def test_admin_marketing_coupon_statuses_do_not_default_missing_database_values(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "admin_marketing_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "admin_marketing_store.rs",
        ]

        for store_path in store_paths:
            source = store_path.read_text(encoding="utf-8")
            compact_source = " ".join(source.split())
            relative = store_path.relative_to(ROOT).as_posix()

            with self.subTest(store=relative):
                self.assertIn("status AS status", source, relative)
                self.assertIn(
                    'coupon_status_label(required_integer_cell(row, "status", "coupon")?)?.to_owned();',
                    compact_source,
                    relative,
                )
                self.assertIn("missing admin marketing coupon status from database row", source, relative)

                for forbidden in [
                    "COALESCE(status, 0) AS status",
                    "AND COALESCE(status, 0) >= 0",
                    'coupon_status_label(integer_cell(row, "status"))?.to_owned();',
                ]:
                    self.assertNotIn(forbidden, source, relative)

    def test_admin_marketing_coupon_types_do_not_default_missing_database_values(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "admin_marketing_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "admin_marketing_store.rs",
        ]

        for store_path in store_paths:
            source = store_path.read_text(encoding="utf-8")
            compact_source = " ".join(source.split())
            relative = store_path.relative_to(ROOT).as_posix()

            with self.subTest(store=relative):
                self.assertIn("type AS type_code", source, relative)
                self.assertIn(
                    'coupon_type_label(required_integer_cell(row, "type_code", "coupon type")?)?.to_owned();',
                    compact_source,
                    relative,
                )
                self.assertIn("fn coupon_type_label(type_code: i64) -> DomainResult<&'static str>", source, relative)
                self.assertIn("missing admin marketing coupon type from database row", source, relative)
                self.assertIn("unsupported admin coupon type", source, relative)

                for forbidden in [
                    "COALESCE(type, 1) AS type_code",
                    "fn coupon_type_label(type_code: i64, discount: &str) -> &'static str",
                    "type_code == COUPON_TYPE_DISCOUNT || decimal_is_positive(discount)",
                    'let type_code = integer_cell(row, "type_code");',
                ]:
                    self.assertNotIn(forbidden, source, relative)

    def test_admin_marketing_promo_code_statuses_do_not_default_missing_database_values(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "admin_marketing_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "admin_marketing_store.rs",
        ]

        for store_path in store_paths:
            source = store_path.read_text(encoding="utf-8")
            compact_source = " ".join(source.split())
            relative = store_path.relative_to(ROOT).as_posix()

            with self.subTest(store=relative):
                self.assertIn("uc.status AS status", source, relative)
                self.assertIn("status AS status,", source, relative)
                self.assertIn(
                    'let status = required_integer_cell(row, "status", "promo code")?;',
                    compact_source,
                    relative,
                )
                self.assertIn(
                    'status: required_integer_cell(&row, "status", "promo code")?,',
                    compact_source,
                    relative,
                )
                self.assertIn("missing admin marketing promo code status from database row", source, relative)

                for forbidden in [
                    "COALESCE(status, 1) AS status",
                    "AND COALESCE(status, 1) > 0",
                    "AND COALESCE(uc.status, 1) > 0",
                ]:
                    self.assertNotIn(forbidden, source, relative)

    def test_admin_marketing_coupon_batch_statuses_do_not_default_missing_database_values(self) -> None:
        store_paths = [
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "admin_marketing_store.rs",
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "admin_marketing_store.rs",
        ]

        for store_path in store_paths:
            source = store_path.read_text(encoding="utf-8")
            relative = store_path.relative_to(ROOT).as_posix()

            with self.subTest(store=relative):
                self.assertIn("const BATCH_STATUS_ACTIVE: i64 = 1;", source, relative)
                self.assertIn("AND b.status = 1", source, relative)
                self.assertIn("AND exact_batch.status = 1", source, relative)
                self.assertIn("AND status = 1", source, relative)

                for forbidden in [
                    "COALESCE(b.status, 1) = 1",
                    "COALESCE(exact_batch.status, 1) = 1",
                    "COALESCE(status, 1) = 1",
                ]:
                    self.assertNotIn(forbidden, source, relative)


if __name__ == "__main__":
    unittest.main()
