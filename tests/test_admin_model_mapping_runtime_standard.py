import unittest
from pathlib import Path

import yaml

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]
MODEL_SERVICE_SOURCE = (
    "apps/sdkwork-claw-router-portal/packages/"
    "sdkwork-claw-router-admin-model/src/modelService.ts"
)


class AdminModelMappingRuntimeStandardTest(unittest.TestCase):
    def test_model_mapping_schema_and_contract_follow_scope_priority_design(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        contract = yaml.safe_load(
            (ROOT / "docs/schema-registry/frontend-field-contracts.yaml").read_text(
                encoding="utf-8"
            )
        )
        table_items = []
        for registry_path in sorted((ROOT / "docs/schema-registry/tables").glob("*.yaml")):
            registry = yaml.safe_load(registry_path.read_text(encoding="utf-8"))
            table_items.extend(registry.get("tables", []))
        tables = {item["table"]: item for item in table_items}

        self.assertIn("ai_model_mapping_rule", tables)
        mapping_table = tables["ai_model_mapping_rule"]
        self.assertEqual("ai", mapping_table["domain"])
        self.assertIn("/admin/model/mappings", mapping_table["frontend_routes"])
        self.assertIn("backend", mapping_table["api_surfaces"])
        self.assertIn("worker", mapping_table["api_surfaces"])

        columns = mapping_table["columns"]
        for field_name in [
            "scope_type",
            "vendor_id",
            "vendor_code",
            "channel_id",
            "channel_code",
            "source_model",
            "source_catalog_key",
            "target_model",
            "target_catalog_key",
            "target_vendor_code",
            "target_provider_model",
            "target_provider_native_model",
            "mapping_mode",
            "match_type",
            "priority",
            "enabled",
            "effective_from",
            "effective_to",
            "description",
            "metadata",
        ]:
            self.assertIn(field_name, columns)

        index_names = {index["name"] for index in mapping_table["indexes"]}
        for index_name in [
            "idx_ai_model_mapping_rule_channel_lookup",
            "idx_ai_model_mapping_rule_vendor_lookup",
            "idx_ai_model_mapping_rule_global_lookup",
            "idx_ai_model_mapping_rule_target_model",
        ]:
            self.assertIn(index_name, index_names)

        expected_operation_paths = {
            f"{MODEL_SERVICE_SOURCE}#fetchModelMappings": "/backend/v3/api/ai/model_mappings",
            f"{MODEL_SERVICE_SOURCE}#createModelMapping": "/backend/v3/api/ai/model_mappings",
            f"{MODEL_SERVICE_SOURCE}#updateModelMapping": "/backend/v3/api/ai/model_mappings/{mappingId}",
            f"{MODEL_SERVICE_SOURCE}#deleteModelMapping": "/backend/v3/api/ai/model_mappings/{mappingId}",
            f"{MODEL_SERVICE_SOURCE}#resolveModelMapping": "/backend/v3/api/ai/model_mappings/resolve",
        }
        for operation_key, expected_path in expected_operation_paths.items():
            self.assertIn(operation_key, operations)
            self.assertEqual(expected_path, operations[operation_key]["api_path"])
            self.assertEqual("backend", operations[operation_key]["api_surface"])

        frontend_models = contract["frontend_models"]
        mapping_interfaces = {
            item["interface"]: item
            for item in frontend_models
            if item.get("source") == MODEL_SERVICE_SOURCE
            and item.get("route") == "/admin/model/mappings"
        }
        for interface_name in [
            "ModelMappingRule",
            "ModelMappingCreateInput",
            "ModelMappingUpdateInput",
            "ModelMappingResolveInput",
            "ModelMappingResolveResult",
        ]:
            self.assertIn(interface_name, mapping_interfaces)
            self.assertIn("ai_model_mapping_rule", mapping_interfaces[interface_name]["data_sources"])

    def test_model_mapping_design_plan_is_recorded(self) -> None:
        spec_path = ROOT / "docs/superpowers/specs/2026-06-02-admin-model-mapping-design.md"
        plan_path = ROOT / "docs/superpowers/plans/2026-06-02-admin-model-mapping.md"
        self.assertTrue(spec_path.exists())
        self.assertTrue(plan_path.exists())
        spec = spec_path.read_text(encoding="utf-8")
        plan = plan_path.read_text(encoding="utf-8")
        for text in [spec, plan]:
            self.assertIn("ai_model_mapping_rule", text)
            self.assertIn("channel > vendor > global", text)
            self.assertIn("/admin/model/mappings", text)


if __name__ == "__main__":
    unittest.main()
