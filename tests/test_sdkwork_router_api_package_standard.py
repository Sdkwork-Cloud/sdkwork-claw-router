import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPECS_ROOT = ROOT.parent / "sdkwork-specs"


class SdkworkRouterApiPackageStandardTest(unittest.TestCase):
    def test_root_specs_use_router_route_package_naming(self) -> None:
        spec_files = [
            "README.md",
            "NAMING_SPEC.md",
            "API_SPEC.md",
            "WEB_BACKEND_SPEC.md",
            "RUST_CODE_SPEC.md",
            "SDK_SPEC.md",
            "SDK_WORKSPACE_GENERATION_SPEC.md",
            "APPLICATION_SPEC.md",
            "APP_SDK_INTEGRATION_SPEC.md",
            "COMPONENT_SPEC.md",
            "TEST_SPEC.md",
        ]

        for spec_file in spec_files:
            source = (SPECS_ROOT / spec_file).read_text(encoding="utf-8")
            with self.subTest(spec=spec_file):
                self.assertIn("sdkwork-router-", source)
                self.assertNotIn("sdkwork-routes-", source)

    def test_router_api_packages_are_declared_as_workspace_route_crates(self) -> None:
        cargo_toml = (ROOT / "Cargo.toml").read_text(encoding="utf-8")
        expected_packages = [
            "sdkwork-router-llm-api",
            "sdkwork-router-payment-api",
            "sdkwork-router-image-api",
            "sdkwork-router-video-api",
            "sdkwork-router-audio-api",
            "sdkwork-router-iaas-api",
            "sdkwork-router-paas-api",
            "sdkwork-router-app-api",
            "sdkwork-router-backend-api",
        ]

        for package_name in expected_packages:
            with self.subTest(package=package_name):
                package_root = ROOT / "packages" / package_name
                cargo_manifest = package_root / "Cargo.toml"
                self.assertTrue(cargo_manifest.exists(), f"{package_name} must be a Rust package")
                self.assertIn(f'"packages/{package_name}"', cargo_toml)
                self.assertIn(f'name = "{package_name}"', cargo_manifest.read_text(encoding="utf-8"))
                self.assertTrue((package_root / "src" / "lib.rs").exists())
                self.assertTrue((package_root / "src" / "manifest.rs").exists())


if __name__ == "__main__":
    unittest.main()
