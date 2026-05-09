import json
import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.clawrouter_openapi_generator import ClawRouterOpenApiGenerator
from tools.clawrouter_openapi_precision_audit import ClawRouterOpenApiPrecisionAudit


class ClawRouterOpenApiPrecisionAuditTest(unittest.TestCase):
    def write_manifest(self, root: Path) -> None:
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
                            "api_path": "/app/v3/api/model-vendors",
                            "operation": "fetchModelVendors",
                            "tag": "models",
                            "kind": "read",
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
                            "path_params": [],
                            "source": "apps/portal/rankingService.ts",
                            "read_sources": ["ai_model_vendor", "ai_model"],
                            "write_tables": [],
                            "openapi_exposed": False,
                        },
                        {
                            "api_surface": "app",
                            "api_method": "GET",
                            "api_path": "/app/v3/api/dashboard",
                            "operation": "fetchDashboard",
                            "tag": "dashboard",
                            "kind": "read",
                            "path_params": [],
                            "source": "apps/portal/dashboardService.ts",
                            "read_sources": ["ai_model_vendor", "ai_request_trace"],
                            "write_tables": [],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "POST",
                            "api_path": "/app/v3/api/model-vendors",
                            "operation": "createModelVendor",
                            "tag": "models",
                            "kind": "create",
                            "path_params": [],
                            "source": "apps/portal/modelService.ts",
                            "read_sources": ["ai_model_vendor"],
                            "write_tables": ["ai_model_vendor"],
                        },
                        {
                            "api_surface": "app",
                            "api_method": "POST",
                            "api_path": "/app/v3/api/router/api-keys",
                            "operation": "createKey",
                            "tag": "router",
                            "kind": "create",
                            "path_params": [],
                            "source": "apps/portal/apiKeyService.ts",
                            "read_sources": ["iam_gateway_api_key_group"],
                            "write_tables": ["iam_gateway_api_key", "ops_audit_log"],
                            "response_schema": {
                                "name": "CreateApiKeyResponse",
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["rawKey"],
                                    "properties": {
                                        "rawKey": {"type": "string"},
                                    },
                                },
                            },
                        },
                    ],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    def write_schema_components(self, root: Path) -> None:
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
                    AiRequestTraceRecord:
                      type: object
                      x-table: ai_request_trace
                      properties:
                        trace_id:
                          type: string
                    IamGatewayApiKeyGroupRecord:
                      type: object
                      x-table: iam_gateway_api_key_group
                      properties:
                        code:
                          type: string
                """
            ).strip()
            + "\n",
            encoding="utf-8",
        )

    def write_generated_openapi(self, root: Path) -> None:
        self.write_manifest(root)
        self.write_schema_components(root)
        ClawRouterOpenApiGenerator(root=root).write()

    def read_app_spec(self, root: Path) -> dict:
        return json.loads((root / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(encoding="utf-8"))

    def write_app_spec(self, root: Path, spec: dict) -> None:
        (root / "generated" / "openapi" / "clawrouter-app-openapi.json").write_text(
            json.dumps(spec, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )

    def test_accepts_generated_precise_get_responses(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_generated_openapi(root)

            result = ClawRouterOpenApiPrecisionAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_explicit_response_schema_for_non_get_operation(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_generated_openapi(root)
            spec = self.read_app_spec(root)

            self.assertEqual(
                {"$ref": "#/components/schemas/CreateKeyResult"},
                spec["paths"]["/app/v3/api/router/api-keys"]["post"]["responses"]["200"]["content"]["application/json"]["schema"],
            )

            result = ClawRouterOpenApiPrecisionAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_rejects_precise_wrapper_for_non_get_operation(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_generated_openapi(root)
            spec = self.read_app_spec(root)
            spec["components"]["schemas"]["CreateModelVendorResult"] = {
                "type": "object",
                "additionalProperties": False,
                "required": ["code"],
                "x-operation-id": "createModelVendor",
                "properties": {
                    "code": {"type": "string"},
                    "data": {"$ref": "#/components/schemas/AiModelVendorRecord"},
                },
            }
            spec["paths"]["/app/v3/api/model-vendors"]["post"]["responses"]["200"]["content"]["application/json"]["schema"] = {
                "$ref": "#/components/schemas/CreateModelVendorResult"
            }
            self.write_app_spec(root, spec)

            result = ClawRouterOpenApiPrecisionAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "app createModelVendor must use PlusApiResult because precise responses require GET, one read source, and an existing record schema",
                result.messages,
            )

    def test_rejects_array_data_for_path_parameter_get_record_response(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_generated_openapi(root)
            spec = self.read_app_spec(root)
            result_schema = spec["components"]["schemas"]["GetModelVendorResult"]
            result_schema["properties"]["data"] = {
                "type": "array",
                "items": {"$ref": "#/components/schemas/AiModelVendorRecord"},
            }
            self.write_app_spec(root, spec)

            result = ClawRouterOpenApiPrecisionAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "app getModelVendor data schema must be {'$ref': '#/components/schemas/AiModelVendorRecord'}",
                result.messages,
            )

    def test_rejects_public_model_catalog_private_pricing_schema_regression(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_generated_openapi(root)
            spec = self.read_app_spec(root)
            schemas = spec["components"]["schemas"]
            schemas["AppModelCatalogItem"] = {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "model": {"type": "string"},
                    "lowestUpstreamCostUnitPrice": {"type": "string", "nullable": True},
                    "priceAvailability": {"$ref": "#/components/schemas/AppModelCatalogPriceAvailability"},
                },
            }
            schemas["AppModelCatalogPriceAvailability"] = {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "status": {"type": "string", "enum": ["available", "unavailable"]},
                    "customerUnitPrice": {"type": "string"},
                    "grossMarginPerUnit": {"type": "string", "nullable": True},
                    "pricingPlanCode": {"type": "string"},
                    "groupCode": {"type": "string"},
                },
            }
            self.write_app_spec(root, spec)

            result = ClawRouterOpenApiPrecisionAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "app AppModelCatalogPriceAvailability.status enum must be ['reference', 'unavailable']",
                result.messages,
            )
            self.assertIn(
                "app AppModelCatalogItem must not expose public private pricing field lowestUpstreamCostUnitPrice",
                result.messages,
            )
            self.assertIn(
                "app AppModelCatalogPriceAvailability must not expose public private pricing field customerUnitPrice",
                result.messages,
            )
            self.assertIn(
                "app AppModelCatalogPriceAvailability must not expose public private pricing field grossMarginPerUnit",
                result.messages,
            )
            self.assertIn(
                "app AppModelCatalogPriceAvailability must not expose public private pricing field pricingPlanCode",
                result.messages,
            )
            self.assertIn(
                "app AppModelCatalogPriceAvailability must not expose public private pricing field groupCode",
                result.messages,
            )


if __name__ == "__main__":
    unittest.main()
