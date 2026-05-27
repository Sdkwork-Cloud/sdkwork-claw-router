import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PORTAL_ROOT = ROOT / "apps" / "sdkwork-claw-router-portal"
AGENTS_PACKAGE = PORTAL_ROOT / "packages" / "sdkwork-claw-router-console-agents"


class ConsoleAgentsRuntimeStandardTest(unittest.TestCase):
    def test_local_console_agents_module_is_retired(self) -> None:
        app = (PORTAL_ROOT / "src" / "App.tsx").read_text(encoding="utf-8")
        console_layout = (
            PORTAL_ROOT
            / "packages"
            / "sdkwork-claw-router-console-core"
            / "src"
            / "ConsoleLayout.tsx"
        ).read_text(encoding="utf-8")
        portal_package = json.loads((PORTAL_ROOT / "package.json").read_text(encoding="utf-8"))
        console_routes = app.split("{/* Console Routes", 1)[1].split("{/* Admin Routes", 1)[0]

        self.assertFalse(AGENTS_PACKAGE.exists())
        self.assertNotIn("sdkwork-claw-router-console-agents", app)
        self.assertNotIn('path="agents"', console_routes)
        self.assertNotIn("/console/agents", console_layout)
        self.assertNotIn("console.menu.agents", console_layout)
        self.assertNotIn("console.menu.group.aiWorkspace", console_layout)
        self.assertNotIn("sdkwork-claw-router-console-agents", portal_package.get("dependencies", {}))

    def test_console_agents_retirement_is_reflected_in_schema_governance(self) -> None:
        schema_sources = [
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "index.yaml",
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts" / "routes" / "routes.yaml",
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml",
            ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml",
        ]

        for schema_source in schema_sources:
            source = schema_source.read_text(encoding="utf-8")
            with self.subTest(schema_source=schema_source.relative_to(ROOT).as_posix()):
                self.assertNotIn("/console/agents", source)
                self.assertNotIn("sdkwork-claw-router-console-agents", source)
                self.assertNotIn("console-agents.yaml", source)
