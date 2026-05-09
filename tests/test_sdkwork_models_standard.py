import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SDKWORK_MODELS = ROOT / "data" / "sdkwork-models"
RUST_INSTALLER_PATH = (
    ROOT
    / "services"
    / "sdkwork-claw-product"
    / "src"
    / "infrastructure"
    / "sql"
    / "installer.rs"
)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def load_json(path: Path) -> dict:
    return json.loads(read_text(path))


class SdkworkModelsStandardTest(unittest.TestCase):
    def test_standard_files_exist(self) -> None:
        required = [
            "README.md",
            "sdkwork-models.json",
            "package.json",
            "CHANGELOG.md",
            "LICENSE",
            "schemas/catalog.schema.json",
            "schemas/index.schema.json",
            "schemas/official-model-snapshot.schema.json",
            "schemas/official-verification-policy.schema.json",
            "schemas/vendor-sources.schema.json",
            "schemas/meter.schema.json",
            "schemas/vendor.schema.json",
            "schemas/family.schema.json",
            "schemas/model.schema.json",
            "schemas/pricing.schema.json",
            "schemas/ranking.schema.json",
            "schemas/provider-overlay.schema.json",
            "models/index.json",
            "models/meters.json",
            "models/vendors.json",
            "sources/vendor-sources.json",
            "sources/official-model-snapshots.json",
            "tools/catalog-lib.mjs",
            "tools/validate-catalog.mjs",
            "tools/build-index.mjs",
            "tools/catalog-audit.mjs",
            "tools/catalog-diff.mjs",
            "tools/freshness-report.mjs",
            "tools/release-catalog.mjs",
        ]
        for rel in required:
            with self.subTest(path=rel):
                self.assertTrue((SDKWORK_MODELS / rel).exists(), rel)

    def test_language_sdk_entrypoints_exist(self) -> None:
        expected = {
            "sdkwork-models-typescript": [
                "README.md",
                "package.json",
                "tsconfig.json",
                "src/index.ts",
            ],
            "sdkwork-models-python": [
                "README.md",
                "pyproject.toml",
                "sdkwork_models/__init__.py",
            ],
            "sdkwork-models-java": [
                "README.md",
                "pom.xml",
                "src/main/java/com/sdkwork/models/SdkworkModels.java",
            ],
            "sdkwork-models-rust": [
                "README.md",
                "Cargo.toml",
                "src/lib.rs",
            ],
            "sdkwork-models-flutter": [
                "README.md",
                "pubspec.yaml",
                "lib/sdkwork_models.dart",
            ],
        }
        for package, files in expected.items():
            for rel in files:
                path = SDKWORK_MODELS / package / rel
                with self.subTest(path=f"{package}/{rel}"):
                    self.assertTrue(path.exists(), str(path))

    def test_language_sdk_docs_use_vendor_region_catalog_key_contract(self) -> None:
        readmes = [
            SDKWORK_MODELS / "README.md",
            SDKWORK_MODELS / "sdkwork-models-typescript" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-python" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-java" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-rust" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-flutter" / "README.md",
        ]
        forbidden = [
            "loadVendorCatalog(pathOrUrl, vendorCode)",
            "load_vendor_catalog(path_or_url, vendor_code)",
            "findModel(catalog, modelId)",
            "find_model(catalog, model_id)",
            "getModelPrices(catalog, modelId)",
            "get_model_prices(catalog, model_id)",
            "listModelsByVendor",
            "models/openai/models",
            "models/<vendorCode>/models",
            "vendorCode/modelId",
            "minimax_cn",
            "deepseek_cn",
            "moonshot_cn",
            "alibaba_cn",
            "vendorGroupCode",
        ]
        required = [
            "regionCode",
            "vendorCode/regionCode/modelId",
        ]
        for readme in readmes:
            source = read_text(readme)
            with self.subTest(path=readme.relative_to(SDKWORK_MODELS).as_posix()):
                for token in forbidden:
                    self.assertNotIn(token, source)
                for token in required:
                    self.assertIn(token, source)

    def test_language_sdk_docs_publish_complete_query_api_contract(self) -> None:
        readmes = [
            SDKWORK_MODELS / "README.md",
            SDKWORK_MODELS / "sdkwork-models-typescript" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-python" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-java" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-rust" / "README.md",
            SDKWORK_MODELS / "sdkwork-models-flutter" / "README.md",
        ]
        common_tokens = [
            "vendorCode",
            "regionCode",
            "familyCode",
            "capability",
            "inputModality",
            "outputModality",
            "releaseStage",
            "shelfState",
            "routingState",
            "apiFormat",
        ]
        language_tokens = {
            "README.md": ["listMeters(catalog)", "findMeter(catalog, meterCode)"],
            "sdkwork-models-typescript/README.md": ["listMeters(catalog)", "findMeter(catalog, meterCode)", "listAvailableModels(catalog)"],
            "sdkwork-models-python/README.md": ["list_meters(catalog)", "find_meter(catalog, meter_code)", "list_available_models(catalog)"],
            "sdkwork-models-java/README.md": [
                "SdkworkModels.listModels(ModelCatalog catalog, Map<String, String> filter)",
                "SdkworkModels.listAvailableModels(ModelCatalog catalog)",
                "SdkworkModels.listMeters(ModelCatalog catalog)",
                "SdkworkModels.findMeter(ModelCatalog catalog, String meterCode)",
            ],
            "sdkwork-models-rust/README.md": ["list_meters(&catalog)", "find_meter(&catalog, meter_code)", "list_available_models(&catalog"],
            "sdkwork-models-flutter/README.md": ["listMeters(catalog)", "findMeter(catalog, meterCode)", "listAvailableModels(catalog)"],
        }
        for readme in readmes:
            rel = readme.relative_to(SDKWORK_MODELS).as_posix()
            source = read_text(readme)
            with self.subTest(path=rel):
                for token in common_tokens + language_tokens[rel]:
                    self.assertIn(token, source)

    def test_docs_publish_official_verification_policy_release_gate_contract(self) -> None:
        docs = [
            SDKWORK_MODELS / "README.md",
            SDKWORK_MODELS / "RELEASE.md",
            SDKWORK_MODELS / "releases" / "README.md",
            ROOT / "docs" / "32-sdkwork-models-standard.md",
            ROOT / "docs" / "33-sdkwork-models-install-flow.md",
            ROOT / "README.md",
        ]
        tokens = [
            "sources/official-verification-policy.json",
            "schemas/official-verification-policy.schema.json",
            "requiredVerifiedVendorRegions",
            "official_verified",
            "release gate",
        ]
        for doc in docs:
            source = read_text(doc)
            with self.subTest(path=doc.relative_to(ROOT).as_posix()):
                for token in tokens:
                    self.assertIn(token, source)

    def test_catalog_manifest_and_index_versions_match(self) -> None:
        manifest = load_json(SDKWORK_MODELS / "sdkwork-models.json")
        index = load_json(SDKWORK_MODELS / "models" / "index.json")
        self.assertEqual("sdkwork-models", manifest.get("name"))
        self.assertEqual(manifest.get("catalogVersion"), index.get("catalogVersion"))
        self.assertRegex(manifest.get("schemaVersion", ""), r"^\d+\.\d+\.\d+$")
        self.assertRegex(manifest.get("catalogVersion", ""), r"^\d{4}\.\d{2}\.\d{2}\.\d+$")

    def test_catalog_index_declares_remote_loadable_vendor_files(self) -> None:
        index = load_json(SDKWORK_MODELS / "models" / "index.json")
        for vendor in index.get("vendors", []):
            with self.subTest(vendor=f"{vendor.get('vendorCode')}/{vendor.get('regionCode')}"):
                model_files = vendor.get("modelFiles")
                pricing_files = vendor.get("pricingFiles")
                self.assertIsInstance(model_files, list)
                self.assertIsInstance(pricing_files, list)
                self.assertEqual(vendor.get("modelCount"), len(model_files))
                self.assertEqual(vendor.get("pricingFileCount"), len(pricing_files))
                for rel_path in [vendor.get("path"), vendor.get("familiesPath"), vendor.get("rankingsPath"), *model_files, *pricing_files]:
                    self.assertIsInstance(rel_path, str)
                    self.assertTrue((SDKWORK_MODELS / "models" / rel_path).is_file(), rel_path)

    def test_catalog_index_schema_defines_file_level_remote_manifest_contract(self) -> None:
        schema = load_json(SDKWORK_MODELS / "schemas" / "index.schema.json")
        required = schema.get("required", [])
        self.assertIn("vendors", required)
        vendor_schema = schema.get("$defs", {}).get("vendorRegionIndex", {})
        vendor_required = vendor_schema.get("required", [])
        for field in [
            "vendorCode",
            "regionCode",
            "catalogKeyPrefix",
            "path",
            "familiesPath",
            "modelsPath",
            "modelFiles",
            "pricingPath",
            "pricingFiles",
            "rankingsPath",
            "sha256",
        ]:
            with self.subTest(field=field):
                self.assertIn(field, vendor_required)
        self.assertEqual(
            "^[a-z0-9_]+/[a-z0-9_]+/models/[^/]+\\.json$",
            vendor_schema["properties"]["modelFiles"]["items"]["pattern"],
        )
        self.assertEqual(
            "^[a-z0-9_]+/[a-z0-9_]+/pricing/[^/]+\\.json$",
            vendor_schema["properties"]["pricingFiles"]["items"]["pattern"],
        )

    def test_official_snapshot_schema_defines_source_evidence_contract(self) -> None:
        schema = load_json(SDKWORK_MODELS / "schemas" / "official-model-snapshot.schema.json")
        required = schema.get("required", [])
        for field in ["schemaVersion", "catalogVersion", "observedAt", "vendors"]:
            with self.subTest(field=field):
                self.assertIn(field, required)

        vendor_schema = schema.get("$defs", {}).get("vendorSnapshot", {})
        vendor_required = vendor_schema.get("required", [])
        for field in ["vendorCode", "regionCode", "observedAt", "officialUrls", "models", "sourceSnapshotHash"]:
            with self.subTest(vendor_field=field):
                self.assertIn(field, vendor_required)

        self.assertEqual(
            "^[a-z0-9_]+$",
            vendor_schema["properties"]["vendorCode"]["pattern"],
        )
        self.assertEqual(
            "^[a-z0-9_]+$",
            vendor_schema["properties"]["regionCode"]["pattern"],
        )
        self.assertEqual(1, vendor_schema["properties"]["officialUrls"]["minItems"])
        self.assertEqual(1, vendor_schema["properties"]["models"]["minItems"])
        self.assertEqual(
            "^[a-f0-9]{64}$",
            vendor_schema["properties"]["sourceSnapshotHash"]["pattern"],
        )
        model_schema = schema.get("$defs", {}).get("modelSnapshot", {})
        self.assertIn("modelId", model_schema.get("required", []))

    def test_vendor_sources_schema_defines_update_source_contract(self) -> None:
        schema = load_json(SDKWORK_MODELS / "schemas" / "vendor-sources.schema.json")
        required = schema.get("required", [])
        for field in ["schemaVersion", "catalogVersion", "observedAt", "policy", "vendors"]:
            with self.subTest(field=field):
                self.assertIn(field, required)

        vendor_schema = schema.get("$defs", {}).get("vendorSource", {})
        vendor_required = vendor_schema.get("required", [])
        for field in [
            "vendorCode",
            "regionCode",
            "verificationStatus",
            "official",
            "lastCheckedAt",
            "requiredModels",
        ]:
            with self.subTest(vendor_field=field):
                self.assertIn(field, vendor_required)

        self.assertEqual(
            ["official_url_declared", "official_verified"],
            vendor_schema["properties"]["verificationStatus"]["enum"],
        )
        official_schema = schema.get("$defs", {}).get("officialSource", {})
        self.assertEqual(
            ["modelsUrl", "pricingUrl"],
            official_schema.get("required", []),
        )

    def test_official_verification_policy_schema_defines_release_gate_contract(self) -> None:
        schema = load_json(SDKWORK_MODELS / "schemas" / "official-verification-policy.schema.json")
        required = schema.get("required", [])
        for field in [
            "schemaVersion",
            "catalogVersion",
            "generatedAt",
            "policy",
            "requiredVerifiedVendorRegions",
        ]:
            with self.subTest(field=field):
                self.assertIn(field, required)

        policy_schema = schema.get("$defs", {}).get("policy", {})
        self.assertEqual(
            ["mode", "description"],
            policy_schema.get("required", []),
        )
        self.assertEqual(
            ["release_gate"],
            policy_schema["properties"]["mode"]["enum"],
        )

        vendor_region_schema = schema.get("$defs", {}).get("requiredVerifiedVendorRegion", {})
        vendor_region_required = vendor_region_schema.get("required", [])
        for field in ["vendorCode", "regionCode", "reason"]:
            with self.subTest(vendor_region_field=field):
                self.assertIn(field, vendor_region_required)
        self.assertEqual(
            "^[a-z0-9_]+$",
            vendor_region_schema["properties"]["vendorCode"]["pattern"],
        )
        self.assertEqual(
            "^[a-z0-9_]+$",
            vendor_region_schema["properties"]["regionCode"]["pattern"],
        )
        self.assertEqual(
            1,
            schema["properties"]["requiredVerifiedVendorRegions"]["minItems"],
        )

    def test_validator_reports_explicit_index_file_manifest_mismatch(self) -> None:
        import shutil
        import tempfile

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_root = Path(temp_dir) / "sdkwork-models"
            shutil.copytree(
                SDKWORK_MODELS,
                temp_root,
                ignore=shutil.ignore_patterns(
                    "sdkwork-models-typescript/dist",
                    "sdkwork-models-rust/target",
                    "sdkwork-models-java/target",
                    "target-codex",
                    "__pycache__",
                ),
            )
            index_path = temp_root / "models" / "index.json"
            index = load_json(index_path)
            target_vendor = next(vendor for vendor in index["vendors"] if vendor["modelFiles"])
            target_vendor["modelFiles"] = target_vendor["modelFiles"][:-1]
            target_vendor["modelCount"] = len(target_vendor["modelFiles"])
            index_path.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

            result = subprocess.run(
                [
                    "node",
                    "--input-type=module",
                    "-e",
                    "import { validateCatalog } from './tools/validate-catalog.mjs'; console.log(JSON.stringify(validateCatalog(process.cwd())));",
                ],
                cwd=temp_root,
                text=True,
                capture_output=True,
            )

        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        report = json.loads(result.stdout)
        issue_codes = {issue["code"] for issue in report["issues"]}
        self.assertIn("index.model_files.mismatch", issue_codes)

    def test_catalog_uses_vendor_region_directories(self) -> None:
        vendors = load_json(SDKWORK_MODELS / "models" / "vendors.json").get("vendors", [])
        self.assertGreaterEqual(len(vendors), 3)
        for vendor in vendors:
            vendor_code = vendor["vendorCode"]
            vendor_dir = SDKWORK_MODELS / "models" / vendor_code
            with self.subTest(vendor=vendor_code):
                self.assertTrue(vendor_dir.is_dir())
                self.assertFalse((vendor_dir / "vendor.json").exists())
                self.assertGreaterEqual(len(vendor.get("regions", [])), 1)
                for region in vendor["regions"]:
                    region_dir = vendor_dir / region["regionCode"]
                    self.assertTrue((region_dir / "vendor.json").exists())
                    self.assertTrue((region_dir / "families.json").exists())
                    self.assertTrue((region_dir / "models").is_dir())
                    self.assertTrue((region_dir / "pricing").is_dir())

    def test_vendor_standard_uses_unique_vendor_identity_with_regions(self) -> None:
        schema = load_json(SDKWORK_MODELS / "schemas" / "vendor.schema.json")
        self.assertIn("regionCode", schema.get("required", []))
        self.assertNotIn("vendorGroupCode", schema.get("required", []))

        vendors = load_json(SDKWORK_MODELS / "models" / "vendors.json").get("vendors", [])
        for vendor in vendors:
            with self.subTest(vendor=vendor["vendorCode"]):
                self.assertRegex(vendor.get("vendorCode", ""), r"^[a-z0-9_]+$")
                self.assertIn("regions", vendor)
                self.assertNotIn("qwen", vendor["vendorCode"])
                self.assertNotIn("kling", vendor["vendorCode"])
                self.assertNotIn("hunyuan", vendor["vendorCode"])
                self.assertNotIn("bigmodel", vendor["vendorCode"])
                self.assertNotRegex(vendor["vendorCode"], r"_(cn|global)$")

    def test_prices_are_decimal_strings(self) -> None:
        for pricing_path in sorted((SDKWORK_MODELS / "models").glob("*/*/pricing/*.json")):
            payload = load_json(pricing_path)
            for index, price in enumerate(payload.get("prices", [])):
                for field in ("unitSize", "unitPrice", "minimumQuantity"):
                    with self.subTest(path=pricing_path, index=index, field=field):
                        self.assertIsInstance(price.get(field), str)
                        self.assertRegex(price[field], r"^(0|[1-9][0-9]*)(\.[0-9]+)?$")
                self.assertTrue(price.get("source", {}).get("sourceUrl"))
                self.assertTrue(price.get("source", {}).get("observedAt"))
                self.assertTrue(price.get("effectiveFrom"))

    def test_enabled_or_listed_models_have_billable_pricing(self) -> None:
        for model_path in sorted((SDKWORK_MODELS / "models").glob("*/*/models/*.json")):
            model = load_json(model_path)
            must_have_pricing = (
                model.get("routingState") == "enabled"
                or model.get("shelfState") == "listed"
                or model.get("releaseStage") == "active"
            )
            if not must_have_pricing:
                continue

            pricing_path = model_path.parent.parent / "pricing" / model_path.name
            with self.subTest(model=model.get("catalogKey")):
                self.assertTrue(pricing_path.exists(), str(pricing_path))
                pricing = load_json(pricing_path)
                self.assertGreater(len(pricing.get("prices", [])), 0)

    def test_family_default_model_points_to_enabled_listed_priced_model(self) -> None:
        for families_path in sorted((SDKWORK_MODELS / "models").glob("*/*/families.json")):
            families = load_json(families_path)
            model_dir = families_path.parent / "models"
            pricing_dir = families_path.parent / "pricing"
            models = {
                path.stem: load_json(path)
                for path in sorted(model_dir.glob("*.json"))
            }
            for family in families.get("families", []):
                default_model = family.get("defaultModel")
                if not default_model:
                    continue
                with self.subTest(family=f"{families_path.parent.parent.name}/{families_path.parent.name}/{family.get('familyCode')}"):
                    self.assertIn(default_model, models)
                    model = models[default_model]
                    self.assertEqual("enabled", model.get("routingState"))
                    self.assertEqual("listed", model.get("shelfState"))
                    self.assertTrue((pricing_dir / f"{default_model}.json").exists())

    def test_validator_and_index_check_pass(self) -> None:
        for command in (
            ["node", "tools/build-index.mjs", "--check"],
            ["node", "tools/validate-catalog.mjs"],
            [
                "node",
                "tools/freshness-report.mjs",
                "--max-age-policy",
                "catalog-freshness-policy.json",
                "--as-of",
                "2026-05-08",
            ],
            ["node", "tools/catalog-audit.mjs", "--as-of", "2026-05-08"],
            ["node", "tools/release-catalog.mjs", "--check", "--as-of", "2026-05-08"],
        ):
            with self.subTest(command=" ".join(command)):
                result = subprocess.run(
                    command,
                    cwd=SDKWORK_MODELS,
                    text=True,
                    capture_output=True,
                )
                self.assertEqual(0, result.returncode, result.stdout + result.stderr)

    def test_installer_no_longer_owns_public_model_catalog_seed_arrays(self) -> None:
        source = read_text(RUST_INSTALLER_PATH)
        forbidden = [
            "OPENAI_ACTIVE_MODEL_SEEDS",
            "GLOBAL_MODEL_SEEDS",
            "global_model_catalog_seed_sql",
            "global_model_pricing_seed_sql",
            "global_model_ranking_seed_sql",
        ]
        for symbol in forbidden:
            with self.subTest(symbol=symbol):
                self.assertNotIn(symbol, source)
        self.assertIn("sdkwork_models", source)


if __name__ == "__main__":
    unittest.main()
