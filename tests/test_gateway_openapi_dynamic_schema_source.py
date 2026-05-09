from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class GatewayOpenApiDynamicSchemaSourceTest(unittest.TestCase):
    def test_rust_gateway_openapi_schema_is_generated_into_cargo_build_output(self) -> None:
        build_script = ROOT / "crates" / "sdkwork-claw-http" / "build.rs"
        contract_routes = ROOT / "crates" / "sdkwork-claw-http" / "src" / "contract_routes.rs"

        self.assertTrue(
            build_script.exists(),
            "sdkwork-claw-http must generate gateway OpenAPI during cargo build",
        )
        build_source = build_script.read_text(encoding="utf-8")
        self.assertIn("tools.clawrouter_gateway_openapi_generator", build_source)
        self.assertIn("gateway-openapi.json", build_source)
        self.assertIn("OUT_DIR", build_source)

        route_source = contract_routes.read_text(encoding="utf-8")
        self.assertNotIn("apps/sdkwork-claw-router-portal/public/openapi.json", route_source)
        self.assertIn('env!("OUT_DIR")', route_source)
        self.assertIn("gateway-openapi.json", route_source)


if __name__ == "__main__":
    unittest.main()
