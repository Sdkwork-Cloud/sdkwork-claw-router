import unittest
from pathlib import Path

import yaml

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]


class AdminSiteRuntimeStandardTest(unittest.TestCase):
    def test_admin_site_schema_and_contract_follow_confirmed_naming(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        contract = yaml.safe_load(
            (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
                encoding="utf-8"
            )
        )
        table_items = []
        for registry_path in sorted((ROOT / "docs" / "schema-registry" / "tables").glob("*.yaml")):
            registry = yaml.safe_load(registry_path.read_text(encoding="utf-8"))
            table_items.extend(registry.get("tables", []))
        effective_registry = (
            ROOT / "generated" / "schema" / "registry" / "sdkwork-claw-router.tables.effective.yaml"
        ).read_text(encoding="utf-8")

        source = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts"
        expected_operation_keys = [
            f"{source}#fetchSites",
            f"{source}#createSite",
            f"{source}#updateSite",
            f"{source}#deleteSite",
            f"{source}#fetchSiteModels",
            f"{source}#createSiteModel",
            f"{source}#replaceSiteModels",
            f"{source}#updateSiteModel",
            f"{source}#deleteSiteModel",
            f"{source}#fetchSiteChannels",
            f"{source}#testSiteConnection",
            f"{source}#healthCheckSite",
        ]
        for operation_key in expected_operation_keys:
            self.assertIn(operation_key, operations)

        self.assertEqual(
            "/backend/v3/api/sites",
            operations[f"{source}#fetchSites"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites",
            operations[f"{source}#createSite"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}",
            operations[f"{source}#updateSite"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}",
            operations[f"{source}#deleteSite"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/models",
            operations[f"{source}#fetchSiteModels"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/models",
            operations[f"{source}#createSiteModel"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/models",
            operations[f"{source}#replaceSiteModels"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/models/{siteModelId}",
            operations[f"{source}#updateSiteModel"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/models/{siteModelId}",
            operations[f"{source}#deleteSiteModel"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/channels",
            operations[f"{source}#fetchSiteChannels"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/test_connection",
            operations[f"{source}#testSiteConnection"]["api_path"],
        )
        self.assertEqual(
            "/backend/v3/api/sites/{siteId}/health_check",
            operations[f"{source}#healthCheckSite"]["api_path"],
        )

        serialized_operations = str(operations)
        self.assertNotIn("/backend/v3/api/integration/sites", serialized_operations)
        self.assertNotIn("/backend/v3/api/sites/{siteId}/services/{serviceId}/models", serialized_operations)
        self.assertNotIn("relay_stations", serialized_operations)
        self.assertNotIn("integration_site", serialized_operations)

        tables = {item["table"]: item for item in table_items}
        for table_name in ["ai_site", "ai_site_service", "ai_site_model"]:
            self.assertIn(table_name, tables)
            self.assertIn(table_name, effective_registry)

        ai_channel_columns = tables["ai_channel"]["columns"]
        for field_name in [
            "site_id",
            "site_service_id",
            "site_code",
            "site_service_code",
            "site_channel_role",
        ]:
            self.assertIn(field_name, ai_channel_columns)

        self.assertIn("site_service_id", tables["ai_site_model"]["columns"])
        self.assertIn("service_type", tables["ai_site_model"]["columns"])
        self.assertIn("credential_ref", tables["ai_site_service"]["columns"])
        self.assertIn("credential_hash", tables["ai_site_service"]["columns"])
        self.assertIn("masked_label", tables["ai_site_service"]["columns"])

        self.assertNotIn("api_key", str(tables["ai_site_service"]["columns"]).lower())
        self.assertNotIn("plaintext", str(tables["ai_site_service"]["columns"]).lower())
        self.assertFalse(tables["ai_site_service"]["security"]["stores_secret_plaintext"])

        frontend_models = contract["frontend_models"]
        model_routes = {
            item["interface"]: item["route"]
            for item in frontend_models
            if item.get("source") == source
            and item.get("interface")
            in {
                "SiteItem",
                "SiteCreateInput",
                "SiteUpdateInput",
                "SiteModelItem",
                "SiteModelCreateInput",
                "SiteModelUpdateInput",
                "SiteChannelItem",
                "SiteConnectionCheckResult",
            }
        }
        self.assertEqual(
            {
                "SiteItem": "/admin/model/sites",
                "SiteCreateInput": "/admin/model/sites",
                "SiteUpdateInput": "/admin/model/sites",
                "SiteModelItem": "/admin/model/sites",
                "SiteModelCreateInput": "/admin/model/sites",
                "SiteModelUpdateInput": "/admin/model/sites",
                "SiteChannelItem": "/admin/model/sites",
                "SiteConnectionCheckResult": "/admin/model/sites",
            },
            model_routes,
        )

    def test_admin_site_runtime_files_use_confirmed_route_markers(self) -> None:
        plan = (ROOT / "docs" / "superpowers" / "plans" / "2026-06-02-admin-model-sites.md").read_text(
            encoding="utf-8"
        )
        self.assertIn("/backend/v3/api/sites", plan)
        self.assertIn("ai_site", plan)
        self.assertIn("ai_site_service", plan)
        self.assertIn("ai_site_model", plan)


if __name__ == "__main__":
    unittest.main()
