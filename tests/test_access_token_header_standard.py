import unittest
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AccessTokenHeaderStandardTest(unittest.TestCase):
    def test_runtime_contracts_and_generated_artifacts_use_access_token_header(self) -> None:
        required_access_token_paths = [
            ROOT.parents[1] / "specs" / "API_SPEC.md",
            ROOT.parents[1] / "specs" / "CONFIG_SPEC.md",
            ROOT.parents[1] / "specs" / "IAM_SPEC.md",
            ROOT / "specs" / "API_SPEC.md",
            ROOT / "tools" / "clawrouter_openapi_generator.py",
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml",
            ROOT / "generated" / "api" / "api-contract-manifest.json",
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json",
            ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json",
            ROOT / "sdks" / "clawrouter-app-sdk" / "openapi" / "clawrouter-app-sdk.openapi.json",
            ROOT / "sdks" / "clawrouter-app-sdk" / "openapi" / "clawrouter-app-sdk.sdkgen.json",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "openapi" / "clawrouter-backend-sdk.openapi.json",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "openapi" / "clawrouter-backend-sdk.sdkgen.json",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "http" / "client.ts",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "dist" / "index.js",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "dist" / "index.cjs",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "dist" / "types" / "iam-session-response.d.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "http" / "client.ts",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "dist" / "index.js",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "dist" / "index.cjs",
            ROOT / "sdks" / "clawrouter-open-sdk" / "clawrouter-open-sdk-typescript" / "src" / "http" / "client.ts",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "README.md",
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "README.md",
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "types" / "iam-session-response.ts",
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-api-reference"
            / "src"
            / "playgroundRequest.ts",
        ]

        for path in required_access_token_paths:
            with self.subTest(path=path.relative_to(ROOT.parents[1]).as_posix()):
                source = path.read_text(encoding="utf-8")
                self.assertIn("Sdkwork-Access-Token", source)
                self.assertIsNone(
                    re.search(r"(?<!Sdkwork-)Access-Token", source),
                    f"{path} must not contain legacy bare Access-Token",
                )
                if path.name in {
                    "clawrouter_openapi_generator.py",
                    "clawrouter-app-openapi.json",
                    "clawrouter-backend-openapi.json",
                    "clawrouter-app-sdk.openapi.json",
                    "clawrouter-app-sdk.sdkgen.json",
                    "clawrouter-backend-sdk.openapi.json",
                    "clawrouter-backend-sdk.sdkgen.json",
                }:
                    self.assertIn('"name": "Sdkwork-Access-Token"', source)
                    self.assertNotIn('"name": "Access-Token"', source)
                if path.name == "playgroundRequest.ts":
                    self.assertIn("'sdkwork-access-token'", source)
                    self.assertIn("headers['Sdkwork-Access-Token'] = input.accessToken.trim();", source)
                    self.assertNotIn("headers['Access-Token'] = input.accessToken.trim();", source)

    def test_audit_rejects_non_standard_sdkwork_access_token_header(self) -> None:
        audit_source = (ROOT / "tools" / "clawrouter_openapi_contract_audit.py").read_text(
            encoding="utf-8"
        )

        self.assertIn('access_token.get("name") != "Sdkwork-Access-Token"', audit_source)
        self.assertIn('access_token.get("name") == "Access-Token"', audit_source)
        self.assertIn("must not declare legacy Access-Token", audit_source)

    def test_generated_transport_sdks_do_not_emit_legacy_access_token_header(self) -> None:
        sdk_families = [
            "clawrouter-app-sdk",
            "clawrouter-backend-sdk",
            "clawrouter-open-sdk",
        ]
        text_suffixes = {
            ".cs",
            ".dart",
            ".go",
            ".gradle",
            ".java",
            ".json",
            ".kt",
            ".kts",
            ".md",
            ".py",
            ".rs",
            ".swift",
            ".toml",
            ".ts",
            ".xml",
            ".yaml",
            ".yml",
        }

        checked_paths: list[Path] = []
        for sdk_family in sdk_families:
            sdk_root = ROOT / "sdks" / sdk_family
            generated_roots = sorted(sdk_root.glob(f"{sdk_family}-*/generated/server-openapi"))
            self.assertGreater(
                len(generated_roots),
                0,
                f"{sdk_family} must include generated transport SDK artifacts",
            )
            for generated_root in generated_roots:
                for path in sorted(generated_root.rglob("*")):
                    if not path.is_file():
                        continue
                    if any(part in {".sdkwork", "node_modules", "target", "dist", "build"} for part in path.parts):
                        continue
                    if path.name not in {"LICENSE", "Package.swift"} and path.suffix not in text_suffixes:
                        continue
                    source = path.read_text(encoding="utf-8")
                    checked_paths.append(path)
                    self.assertIsNone(
                        re.search(r"(?<!Sdkwork-)Access-Token", source),
                        f"{path.relative_to(ROOT.parents[1]).as_posix()} must not contain legacy bare Access-Token",
                    )

        self.assertGreater(len(checked_paths), 0)

    def test_generated_sdk_barrels_export_api_parameter_contracts(self) -> None:
        backend_api_barrel = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "dist"
            / "api"
            / "index.d.ts"
        ).read_text(encoding="utf-8")
        app_api_barrel = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "dist"
            / "api"
            / "index.d.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("export * from './integration'", backend_api_barrel)
        self.assertIn("export * from './platform'", backend_api_barrel)
        self.assertIn("export * from './billing'", app_api_barrel)


if __name__ == "__main__":
    unittest.main()
