from __future__ import annotations

import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
TABLE_REGISTRY = ROOT / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"


class AdminPromptMcpSchemaStandardTest(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = yaml.safe_load(TABLE_REGISTRY.read_text(encoding="utf-8"))
        self.tables = {
            item["table"]: item
            for item in self.registry.get("tables", [])
            if isinstance(item, dict) and isinstance(item.get("table"), str)
        }

    def test_prompt_and_mcp_use_vertical_tables_with_unified_category(self) -> None:
        for table in [
            "ai_prompt",
            "ai_prompt_version",
            "ai_prompt_binding",
            "ai_mcp_server",
            "ai_mcp_server_revision",
            "ai_mcp_tool",
            "ai_mcp_binding",
        ]:
            self.assertIn(table, self.tables)

        self.assertNotIn("ai_prompt_category", self.tables)
        self.assertNotIn("ai_mcp_category", self.tables)

        self.assertIn("category_id", self.tables["ai_prompt"]["columns"])
        self.assertIn("category_id", self.tables["ai_mcp_server"]["columns"])
        self.assertIn("plus_category", self.tables)

    def test_prompt_and_mcp_routes_are_admin_backend_surfaces(self) -> None:
        route_expectations = {
            "ai_prompt": "/admin/prompts",
            "ai_prompt_version": "/admin/prompts",
            "ai_prompt_binding": "/admin/prompts",
            "ai_mcp_server": "/admin/mcp",
            "ai_mcp_server_revision": "/admin/mcp",
            "ai_mcp_tool": "/admin/mcp",
            "ai_mcp_binding": "/admin/mcp",
        }

        for table, route in route_expectations.items():
            with self.subTest(table=table):
                contract = self.tables[table]
                self.assertIn(route, contract.get("frontend_routes", []))
                self.assertIn("backend", contract.get("api_surfaces", []))


if __name__ == "__main__":
    unittest.main()
