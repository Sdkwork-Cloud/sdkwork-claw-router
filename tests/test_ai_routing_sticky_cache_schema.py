from pathlib import Path
import unittest

from tools.schema_registry_loader import load_schema_registry


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
GENERATED_SCHEMA_PATH = ROOT / "generated" / "schema" / "postgres" / "schema.sql"


def _registry_tables() -> dict[str, dict]:
    registry = load_schema_registry(REGISTRY_PATH)
    return {table["table"]: table for table in registry["tables"]}


class AiRoutingStickyCacheSchemaTest(unittest.TestCase):
    def test_ai_routing_sticky_cache_tables_are_registered(self) -> None:
        tables = _registry_tables()
        expected = {
            "ai_resource_route_profile",
            "ai_provider_object_route",
            "ai_route_idempotency",
            "ai_config_version",
            "ai_config_change_event",
        }
        self.assertTrue(expected.issubset(tables))

        route_profile = tables["ai_resource_route_profile"]
        self.assertIs(route_profile["system_of_record"], True)
        for column in [
            "resource_id",
            "resource_code",
            "route_strategy",
            "failure_strategy",
            "selection_strategy",
            "model_requirement",
            "request_extractors",
            "response_bindings",
        ]:
            self.assertIn(column, route_profile["columns"])

        object_route = tables["ai_provider_object_route"]
        self.assertIs(object_route["system_of_record"], True)
        self.assertIn("object_key_hash", object_route["columns"])
        self.assertIn("expires_at", object_route["columns"])
        self.assertTrue(
            any(index["name"] == "idx_ai_provider_object_route_fast" for index in object_route["indexes"])
        )

    def test_ai_routing_sticky_cache_tables_are_in_generated_postgres_schema(self) -> None:
        schema = GENERATED_SCHEMA_PATH.read_text(encoding="utf-8")
        for table in [
            "ai_resource_route_profile",
            "ai_provider_object_route",
            "ai_route_idempotency",
            "ai_config_version",
            "ai_config_change_event",
        ]:
            self.assertIn(f"CREATE TABLE IF NOT EXISTS {table}", schema)
            self.assertIn(f"uk_{table}_uuid", schema)

        self.assertIn("idx_ai_provider_object_route_fast", schema)
        self.assertIn("idx_ai_config_change_event_pending", schema)


if __name__ == "__main__":
    unittest.main()
