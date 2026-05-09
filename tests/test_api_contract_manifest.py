import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


class ApiContractManifestGeneratorTest(unittest.TestCase):
    def write_contract(self, root: Path, content: str) -> Path:
        contract = root / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        contract.parent.mkdir(parents=True, exist_ok=True)
        contract.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return contract

    def test_generates_sdk_boundaries_and_operations_from_frontend_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts
                    operation: updateKey
                    kind: update
                    api_surface: app
                    api_method: PATCH
                    api_path: /app/v3/api/router/api-keys/{apiKeyId}
                    read_sources: [iam_gateway_api_key]
                    write_tables: [iam_gateway_api_key, ops_audit_log]
                  - route: /admin/model
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts
                    operation: syncModels
                    kind: sync
                    api_surface: backend
                    api_method: POST
                    api_path: /backend/v3/api/router/models/sync
                    read_sources: [ai_model]
                    write_tables: [ai_model, ai_model_pricing]
                  - route: /playground
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts
                    operation: createChatCompletion
                    kind: action
                    api_surface: openai_v1
                    api_method: POST
                    api_path: /v1/chat/completions
                    read_sources: [ai_model]
                    write_tables: [ai_request_trace, ai_usage_fact]
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["key"]: operation for operation in manifest["operations"]}

            self.assertEqual(3, manifest["summary"]["operation_count"])
            self.assertEqual({"app": 1, "backend": 1, "openai_v1": 1}, manifest["summary"]["api_surface_counts"])
            self.assertEqual("SdkworkAppClient", manifest["sdk_boundaries"]["app"]["sdk_client"])
            self.assertEqual("SdkworkBackendClient", manifest["sdk_boundaries"]["backend"]["sdk_client"])
            self.assertEqual("SdkworkAiClient", manifest["sdk_boundaries"]["openai_v1"]["sdk_client"])

            app_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts#updateKey"
            ]
            self.assertEqual("app", app_operation["sdk_family"])
            self.assertEqual("SdkworkAppClient", app_operation["sdk_client"])
            self.assertEqual("console-api-keys", app_operation["module"])
            self.assertEqual("router", app_operation["tag"])
            self.assertEqual(["apiKeyId"], app_operation["path_params"])
            self.assertEqual(["iam_gateway_api_key", "ops_audit_log"], app_operation["write_tables"])

            admin_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts#syncModels"
            ]
            self.assertEqual("backend", admin_operation["sdk_family"])
            self.assertEqual("admin", admin_operation["route_scope"])
            self.assertEqual("models", admin_operation["tag"])

            openai_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts#createChatCompletion"
            ]
            self.assertEqual("ai", openai_operation["sdk_family"])
            self.assertEqual("SdkworkAiClient", openai_operation["sdk_client"])
            self.assertEqual("chat", openai_operation["tag"])

    def test_project_contract_declares_console_api_key_create_operation(self) -> None:
        root = Path(__file__).resolve().parents[1]
        manifest = ApiContractManifestGenerator(root=root).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        operation = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts#createKey"
        )

        self.assertIsNotNone(operation)
        self.assertEqual("app", operation["api_surface"])
        self.assertEqual("POST", operation["api_method"])
        self.assertEqual("/app/v3/api/router/api-keys", operation["api_path"])
        self.assertEqual("create", operation["kind"])
        self.assertEqual("SdkworkAppClient", operation["sdk_client"])
        self.assertIn("iam_gateway_api_key", operation["write_tables"])
        self.assertIn("ops_audit_log", operation["write_tables"])
        self.assertEqual("CreateApiKeyRequest", operation["request_schema"]["name"])
        self.assertEqual(["name", "group"], operation["request_schema"]["schema"]["required"])
        self.assertEqual("CreateApiKeyResponse", operation["response_schema"]["name"])
        self.assertEqual(["item", "rawKey"], operation["response_schema"]["schema"]["required"])

    def test_project_contract_declares_precise_console_write_payloads(self) -> None:
        root = Path(__file__).resolve().parents[1]
        manifest = ApiContractManifestGenerator(root=root).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}

        submit_recharge = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts#submitRecharge"
        )
        update_settings = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-settings/src/settingsService.ts#updateSettings"
        )

        self.assertIsNotNone(submit_recharge)
        self.assertEqual("SubmitRechargeRequest", submit_recharge["request_schema"]["name"])
        self.assertEqual(["amount", "method"], submit_recharge["request_schema"]["schema"]["required"])
        self.assertEqual("SubmitRechargeResponse", submit_recharge["response_schema"]["name"])
        self.assertEqual(
            ["success", "orderNo", "amount", "points", "paymentMethod", "status"],
            submit_recharge["response_schema"]["schema"]["required"],
        )

        self.assertIsNotNone(update_settings)
        self.assertEqual("UpdateSettingsRequest", update_settings["request_schema"]["name"])
        self.assertEqual(
            ["language", "timezone", "webhookUrl", "notifications"],
            update_settings["request_schema"]["schema"]["required"],
        )
        self.assertEqual("UpdateSettingsResponse", update_settings["response_schema"]["name"])
        self.assertEqual(["success"], update_settings["response_schema"]["schema"]["required"])

    def test_preserves_operation_payload_schemas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key_group]
                    write_tables: [iam_gateway_api_key, ops_audit_log]
                    request_schema:
                      name: CreateApiKeyRequest
                      required: [name, group]
                      properties:
                        name:
                          type: string
                          maxLength: 128
                        group:
                          type: string
                          maxLength: 64
                    response_schema:
                      name: CreateApiKeyResponse
                      required: [item, rawKey]
                      properties:
                        item:
                          type: object
                          additionalProperties: true
                        rawKey:
                          type: string
                          minLength: 1
                        failureReason:
                          type: [string, "null"]
                          maxLength: 1024
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("CreateApiKeyRequest", operation["request_schema"]["name"])
            self.assertEqual(["name", "group"], operation["request_schema"]["schema"]["required"])
            self.assertFalse(operation["request_schema"]["schema"]["additionalProperties"])
            self.assertEqual(128, operation["request_schema"]["schema"]["properties"]["name"]["maxLength"])
            self.assertEqual("CreateApiKeyResponse", operation["response_schema"]["name"])
            self.assertEqual(["item", "rawKey"], operation["response_schema"]["schema"]["required"])
            self.assertFalse(operation["response_schema"]["schema"]["additionalProperties"])
            failure_reason = operation["response_schema"]["schema"]["properties"]["failureReason"]
            self.assertEqual("string", failure_reason["type"])
            self.assertTrue(failure_reason["nullable"])
            self.assertEqual(1024, failure_reason["maxLength"])

    def test_preserves_array_response_payload_schemas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/billing
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/billingService.ts
                    operation: fetchRedeemHistory
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/coupons/my
                    read_sources: [plus_user_coupon, plus_coupon]
                    response_schema:
                      name: BillingRedeemHistoryResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: BillingRedeemHistoryItem
                        required: [id, code, amount, date, status]
                        properties:
                          id: { type: integer, format: int64 }
                          code: { type: string }
                          amount: { type: string, pattern: '^\\d+(?:\\.\\d{2})$' }
                          date: { type: string }
                          status: { type: string, enum: [success, pending, failed] }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("BillingRedeemHistoryResponse", operation["response_schema"]["name"])
            self.assertEqual("array", operation["response_schema"]["schema"]["type"])
            self.assertEqual(
                "BillingRedeemHistoryItem",
                operation["response_schema"]["schema"]["items"]["name"],
            )
            self.assertNotIn("properties", operation["response_schema"]["schema"])

    def test_validate_rejects_duplicate_operation_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "duplicate api contract operation: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys",
                result.messages,
            )

    def test_validate_rejects_duplicate_openapi_path_method_per_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model]
                  - route: /rankings
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts
                    operation: fetchModelVendors
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model_vendor]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "duplicate OpenAPI path/method on app GET /app/v3/api/router/models: "
                "apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts#fetchModels and "
                "apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts#fetchModelVendors",
                result.messages,
            )

    def test_validate_allows_non_exposed_derived_operation_on_existing_openapi_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model]
                  - route: /rankings
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts
                    operation: fetchModelVendors
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    openapi_exposed: false
                    description: Derived frontend operation that reuses fetchModels and aggregates vendor filters client-side.
                    read_sources: [ai_model_vendor, ai_model]
                """,
            )

            generator = ApiContractManifestGenerator(root=root)
            result = generator.validate()
            manifest = generator.generate()
            operations = {operation["key"]: operation for operation in manifest["operations"]}

            self.assertTrue(result.ok, result.messages)
            self.assertFalse(
                operations[
                    "apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts#fetchModelVendors"
                ]["openapi_exposed"]
            )

    def test_validate_rejects_non_boolean_openapi_exposed_flag(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    openapi_exposed: "disabled"
                    read_sources: [ai_model]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts#fetchModels openapi_exposed must be boolean",
                result.messages,
            )

    def test_validate_rejects_unknown_surface_and_wrong_prefix(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: createTrace
                    kind: action
                    api_surface: openai_v1
                    api_method: POST
                    api_path: /app/v3/api/router/traces
                    read_sources: [ai_request_trace]
                    write_tables: [ai_request_trace]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys route /console/api-keys must not use backend api_surface",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#createTrace api_path must start with /v1",
                result.messages,
            )

    def test_validate_rejects_invalid_operation_payload_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key_group]
                    write_tables: [iam_gateway_api_key]
                    request_schema:
                      name: create-api-key
                      properties: []
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts#createKey request_schema.name must be PascalCase",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts#createKey request_schema.properties must be an object",
                result.messages,
            )

    def test_writes_and_checks_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                """,
            )
            generator = ApiContractManifestGenerator(root=root)
            output = generator.write()

            self.assertTrue(output.exists())
            self.assertTrue(generator.check().ok)

    def test_check_reports_stale_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                """,
            )
            output = root / "generated" / "api" / "api-contract-manifest.json"
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text("{}\n", encoding="utf-8")

            result = ApiContractManifestGenerator(root=root).check()

            self.assertFalse(result.ok)
            self.assertIn(f"api contract manifest is stale: {output}", result.messages)


if __name__ == "__main__":
    unittest.main()
