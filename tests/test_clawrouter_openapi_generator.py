import json
import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.clawrouter_openapi_generator import ClawRouterOpenApiGenerator


class ClawRouterOpenApiGeneratorTest(unittest.TestCase):
    def write_manifest(self, root: Path) -> Path:
        manifest = root / "generated" / "api" / "api-contract-manifest.json"
        manifest.parent.mkdir(parents=True, exist_ok=True)
        manifest.write_text(
            json.dumps(
                {
                    "schema": {"version": "0.1.0"},
                    "sdk_boundaries": {
                        "app": {
                            "api_prefix": "/app/v3/api",
                            "sdk_client": "SdkworkAppClient",
                            "sdk_family": "app",
                        },
                        "backend": {
                            "api_prefix": "/backend/v3/api",
                            "sdk_client": "SdkworkBackendClient",
                            "sdk_family": "backend",
                        },
                    },
                    "operations": [
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/app/store/categories",
                            "operation": "getCategories",
                            "tag": "app",
                            "kind": "read",
                            "module": "app-center",
                            "path_params": [],
                            "source": "apps/portal/appService.ts",
                            "read_sources": ["plus_app"],
                            "write_tables": [],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/skills/categories",
                            "operation": "getCategories",
                            "tag": "skills",
                            "kind": "read",
                            "module": "skills-hub",
                            "path_params": [],
                            "source": "apps/portal/skillService.ts",
                            "read_sources": ["agent_skill"],
                            "write_tables": [],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/model-vendors",
                            "operation": "fetchModelVendors",
                            "tag": "models",
                            "kind": "read",
                            "module": "models",
                            "path_params": [],
                            "source": "apps/portal/modelService.ts",
                            "read_sources": ["ai_model_vendor"],
                            "write_tables": [],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/model-vendors/{vendorCode}",
                            "operation": "getModelVendor",
                            "tag": "models",
                            "kind": "read",
                            "module": "models",
                            "path_params": ["vendorCode"],
                            "source": "apps/portal/modelService.ts",
                            "read_sources": ["ai_model_vendor"],
                            "write_tables": [],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/model-vendors",
                            "operation": "fetchModelVendorsForRankings",
                            "tag": "models",
                            "kind": "read",
                            "module": "rankings",
                            "path_params": [],
                            "source": "apps/portal/rankingService.ts",
                            "read_sources": ["ai_model_vendor", "ai_model"],
                            "write_tables": [],
                            "openapi_exposed": False,
                        },
                        {
                            "api_surface": "app",
                            "api_method": "POST",
                            "api_path": "/app/v3/api/coupons/redeem",
                            "operation": "redeemCoupon",
                            "tag": "coupons",
                            "kind": "action",
                            "module": "billing",
                            "path_params": [],
                            "source": "apps/portal/couponService.ts",
                            "read_sources": ["plus_coupon"],
                            "write_tables": ["plus_coupon_use"],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/coupons/my",
                            "operation": "fetchRedeemHistory",
                            "tag": "coupons",
                            "kind": "read",
                            "module": "billing",
                            "path_params": [],
                            "source": "apps/portal/billingService.ts",
                            "read_sources": ["plus_user_coupon", "plus_coupon"],
                            "write_tables": [],
                            "response_schema": {
                                "name": "BillingRedeemHistoryResponse",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "name": "BillingRedeemHistoryItem",
                                        "required": ["id", "code", "amount", "date", "status"],
                                        "properties": {
                                            "id": {"type": "integer", "format": "int64"},
                                            "code": {"type": "string"},
                                            "amount": {"type": "string", "pattern": "^\\d+(?:\\.\\d{2})$"},
                                            "date": {"type": "string"},
                                            "status": {"type": "string", "enum": ["success", "pending", "failed"]},
                                        },
                                    },
                                },
                            },
                        },
                        {
                            "api_surface": "app",
                            "api_method": "POST",
                            "api_path": "/app/v3/api/router/api-keys",
                            "operation": "createKey",
                            "tag": "router",
                            "kind": "create",
                            "module": "console-api-keys",
                            "path_params": [],
                            "source": "apps/portal/apiKeyService.ts",
                            "idempotency_required": True,
                            "read_sources": ["iam_gateway_api_key_group"],
                            "write_tables": ["iam_gateway_api_key", "ops_audit_log"],
                            "request_schema": {
                                "name": "CreateApiKeyRequest",
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["name", "group"],
                                    "properties": {
                                        "name": {"type": "string", "maxLength": 128},
                                        "group": {"type": "string", "maxLength": 64},
                                    },
                                },
                            },
                            "response_schema": {
                                "name": "CreateApiKeyResponse",
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["item", "rawKey"],
                                    "properties": {
                                        "item": {"type": "object", "additionalProperties": True},
                                        "rawKey": {"type": "string", "minLength": 1},
                                    },
                                },
                            },
                        },
                        {
                            "api_surface": "backend",
                            "api_method": "PATCH",
                            "api_path": "/backend/v3/api/router/announcements/{announcementId}",
                            "operation": "updateAnnouncement",
                            "tag": "announcements",
                            "kind": "update",
                            "module": "admin-announcement",
                            "path_params": ["announcementId"],
                            "source": "apps/portal/announcementService.ts",
                            "read_sources": ["content_announcement"],
                            "write_tables": ["content_announcement"],
                        },
                        {
                            "api_surface": "openai_v1",
                            "api_method": "POST",
                            "api_path": "/v1/chat/completions",
                            "operation": "createChatCompletion",
                            "tag": "chat",
                            "kind": "action",
                            "module": "playground",
                            "path_params": [],
                            "source": "apps/portal/playgroundService.ts",
                            "read_sources": ["ai_model"],
                            "write_tables": ["ai_usage_fact"],
                        },
                    ],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        return manifest

    def write_schema_components(self, root: Path) -> Path:
        components = root / "generated" / "openapi" / "schema-components.yaml"
        components.parent.mkdir(parents=True, exist_ok=True)
        components.write_text(
            textwrap.dedent(
                """
                components:
                  schemas:
                    AiModelVendorRecord:
                      type: object
                      x-table: ai_model_vendor
                      properties:
                        vendor_code:
                          type: string
                          maxLength: 64
                        enabled:
                          type: boolean
                      required:
                        - vendor_code
                        - enabled
                """
            ).strip()
            + "\n",
            encoding="utf-8",
        )
        return components

    def test_generates_surface_specific_openapi_specs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            generator = ClawRouterOpenApiGenerator(root=root)
            app_spec = generator.generate("app")
            backend_spec = generator.generate("backend")

            self.assertEqual("3.0.3", app_spec["openapi"])
            self.assertEqual("SDKWork Claw Router App API", app_spec["info"]["title"])
            self.assertEqual("SdkworkAppClient", app_spec["x-sdk-client"])
            self.assertEqual("http://localhost:18082", app_spec["servers"][0]["url"])
            self.assertIn("/app/v3/api/coupons/redeem", app_spec["paths"])
            self.assertNotIn("/backend/v3/api/router/announcements/{announcementId}", app_spec["paths"])
            self.assertNotIn("/v1/chat/completions", app_spec["paths"])

            self.assertEqual("SDKWork Claw Router Backend API", backend_spec["info"]["title"])
            self.assertEqual("SdkworkBackendClient", backend_spec["x-sdk-client"])
            self.assertEqual("http://localhost:18081", backend_spec["servers"][0]["url"])
            self.assertIn("/backend/v3/api/router/announcements/{announcementId}", backend_spec["paths"])
            self.assertNotIn("/app/v3/api/coupons/redeem", backend_spec["paths"])

    def test_emits_path_parameters_request_body_and_query_marker(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            backend_spec = ClawRouterOpenApiGenerator(root=root).generate("backend")
            operation = backend_spec["paths"]["/backend/v3/api/router/announcements/{announcementId}"]["patch"]

            self.assertEqual("updateAnnouncement", operation["operationId"])
            self.assertEqual("announcementId", operation["parameters"][0]["name"])
            self.assertEqual("path", operation["parameters"][0]["in"])
            self.assertTrue(operation["parameters"][0]["required"])
            self.assertEqual(
                {"$ref": "#/components/schemas/OperationRequest"},
                operation["requestBody"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/PlusApiResult"},
                operation["responses"]["200"]["content"]["application/json"]["schema"],
            )

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            query_operation = app_spec["paths"]["/app/v3/api/app/store/categories"]["get"]
            self.assertIn({"name": "pageNo", "in": "query", "required": False, "schema": {"type": "integer", "format": "int32"}}, query_operation["parameters"])

    def test_operation_payload_schemas_drive_request_and_response_components(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/router/api-keys"]["post"]
            schemas = app_spec["components"]["schemas"]

            self.assertEqual(
                {"$ref": "#/components/schemas/CreateApiKeyRequest"},
                operation["requestBody"]["content"]["application/json"]["schema"],
            )
            self.assertTrue(operation["requestBody"]["required"])
            self.assertEqual(
                {"$ref": "#/components/schemas/CreateKeyResult"},
                operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(["name", "group"], schemas["CreateApiKeyRequest"]["required"])
            self.assertEqual(128, schemas["CreateApiKeyRequest"]["properties"]["name"]["maxLength"])
            self.assertEqual(
                {"$ref": "#/components/schemas/CreateApiKeyResponse"},
                schemas["CreateKeyResult"]["properties"]["data"],
            )
            self.assertEqual(["item", "rawKey"], schemas["CreateApiKeyResponse"]["required"])

    def test_array_response_schema_drives_result_data_component(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/coupons/my"]["get"]
            schemas = app_spec["components"]["schemas"]

            self.assertEqual(
                {"$ref": "#/components/schemas/FetchRedeemHistoryResult"},
                operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/BillingRedeemHistoryResponse"},
                schemas["FetchRedeemHistoryResult"]["properties"]["data"],
            )
            self.assertEqual("array", schemas["BillingRedeemHistoryResponse"]["type"])
            self.assertEqual(
                {"$ref": "#/components/schemas/BillingRedeemHistoryItem"},
                schemas["BillingRedeemHistoryResponse"]["items"],
            )
            self.assertEqual(
                ["id", "code", "amount", "date", "status"],
                schemas["BillingRedeemHistoryItem"]["required"],
            )

    def test_merges_schema_components_into_final_openapi_specs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)
            self.write_schema_components(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")

            schema = app_spec["components"]["schemas"]["AiModelVendorRecord"]
            self.assertEqual(["vendor_code", "enabled"], schema["required"])
            self.assertEqual(64, schema["properties"]["vendor_code"]["maxLength"])
            self.assertIn("OperationRequest", app_spec["components"]["schemas"])

    def test_get_single_read_source_uses_record_response_wrapper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)
            self.write_schema_components(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/model-vendors"]["get"]

            self.assertEqual(
                {"$ref": "#/components/schemas/FetchModelVendorsResult"},
                operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            result_schema = app_spec["components"]["schemas"]["FetchModelVendorsResult"]
            self.assertEqual(
                {
                    "type": "array",
                    "items": {"$ref": "#/components/schemas/AiModelVendorRecord"},
                },
                result_schema["properties"]["data"],
            )
            self.assertEqual(["code"], result_schema["required"])

    def test_get_single_read_source_with_path_param_uses_record_response_wrapper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)
            self.write_schema_components(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/model-vendors/{vendorCode}"]["get"]

            self.assertEqual(
                {"$ref": "#/components/schemas/GetModelVendorResult"},
                operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            result_schema = app_spec["components"]["schemas"]["GetModelVendorResult"]
            self.assertEqual(
                {"$ref": "#/components/schemas/AiModelVendorRecord"},
                result_schema["properties"]["data"],
            )

    def test_duplicate_operation_ids_are_made_unique_per_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation_ids = [
                method_spec["operationId"]
                for path_spec in app_spec["paths"].values()
                for method_spec in path_spec.values()
            ]

            self.assertEqual(len(operation_ids), len(set(operation_ids)))
            self.assertIn("appGetCategories", operation_ids)
            self.assertIn("skillsGetCategories", operation_ids)

    def test_skips_non_exposed_frontend_derived_operations(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/model-vendors"]["get"]

            self.assertEqual("fetchModelVendors", operation["operationId"])
            self.assertNotIn("FetchModelVendorsForRankingsResult", app_spec["components"]["schemas"])

    def test_generates_friendly_summary_and_contract_description(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)

            app_spec = ClawRouterOpenApiGenerator(root=root).generate("app")
            operation = app_spec["paths"]["/app/v3/api/model-vendors"]["get"]

            self.assertEqual("List model vendors", operation["summary"])
            self.assertNotEqual(operation["operationId"], operation["summary"])
            self.assertNotIn("Manifest operation", operation["description"])
            self.assertIn("List model vendors.", operation["description"])
            self.assertIn("Reads ai_model_vendor.", operation["description"])

    def test_writes_and_checks_specs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_manifest(root)
            generator = ClawRouterOpenApiGenerator(root=root)

            outputs = generator.write()

            self.assertEqual(
                {
                    "app": root / "generated" / "openapi" / "clawrouter-app-openapi.json",
                    "backend": root / "generated" / "openapi" / "clawrouter-backend-openapi.json",
                },
                outputs,
            )
            self.assertTrue(generator.check().ok)

            outputs["app"].write_text("{}\n", encoding="utf-8")
            result = generator.check()
            self.assertFalse(result.ok)
            self.assertIn(f"clawrouter app OpenAPI spec is stale: {outputs['app']}", result.messages)


if __name__ == "__main__":
    unittest.main()
