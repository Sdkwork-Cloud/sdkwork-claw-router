import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "data" / "skills"
SKILL_TARGET_TYPE = 35


class SkillSeedBundleStandardTest(unittest.TestCase):
    def test_skill_seed_bundle_has_closed_local_manifest_and_artifact_references(self) -> None:
        manifest = read_json(SKILLS_ROOT / "install-manifest.json")
        categories = read_json(SKILLS_ROOT / "categories.json")
        packages = read_json(SKILLS_ROOT / "packages.json")
        skills = read_json(SKILLS_ROOT / "skills.json")
        assets = read_json(SKILLS_ROOT / "assets.json")
        artifacts = read_json(SKILLS_ROOT / "artifacts.json")

        self.assertEqual("sdkwork-agent-skills", manifest.get("catalogCode"))
        self.assertEqual("agent-skills-seed.v1", manifest.get("schemaVersion"))
        self.assertEqual("bundled", manifest.get("source"))

        category_ids = unique_ids(categories, "category id")
        package_ids = unique_ids(packages, "package id")
        skill_ids = unique_ids(skills, "skill id")
        unique_values((item["skillKey"] for item in skills), "skillKey")
        unique_values((item["uuid"] for item in skills), "skill uuid")
        unique_values((item["uuid"] for item in artifacts), "artifact uuid")
        unique_values((item["uuid"] for item in assets), "asset uuid")

        for item in packages:
            with self.subTest(package=item.get("packageKey")):
                self.assertIn(item["categoryId"], category_ids)
                self.assertTrue(item["enabled"])
                self.assertRegex(item["packageKey"], r"^[a-z0-9][a-z0-9-]*[a-z0-9]$")

        artifacts_by_skill_id: dict[int, list[dict]] = {}
        for artifact in artifacts:
            with self.subTest(artifact=artifact.get("uuid")):
                self.assertEqual(SKILL_TARGET_TYPE, artifact["targetType"])
                self.assertIn(artifact["targetId"], skill_ids)
                self.assertRegex(artifact["artifactRef"], r"^builtin://sdkwork\.skills\.[a-z0-9_]+@\d+\.\d+\.\d+$")
                self.assertGreater(artifact["artifactSizeBytes"], 0)
                self.assertRegex(artifact["checksumHash"], r"^sha256:[0-9a-f]{64}$")
                self.assertIsInstance(artifact["frameworks"], list)
                self.assertGreater(len(artifact["frameworks"]), 0)
                artifact_path = local_seed_path(artifact["artifactUrl"])
                self.assertTrue(artifact_path.exists(), f"artifactUrl must exist: {artifact['artifactUrl']}")
                self.assertEqual(artifact["artifactSizeBytes"], artifact_path.stat().st_size)
                payload = read_json(artifact_path)
                self.assertEqual(artifact["checksumHash"], artifact_payload_checksum(payload))
                self.assertEqual(artifact["artifactRef"], payload.get("artifactRef"))
                self.assertEqual(artifact["version"], payload.get("version"))
                self.assertEqual(artifact["runtime"], payload.get("runtime"))
                self.assertEqual(artifact["checksumHash"], payload.get("checksumHash"))
                self.assertEqual(artifact["targetId"], payload.get("skill", {}).get("id"))
                self.assertIsInstance(payload.get("instructions"), list)
                self.assertGreater(len(payload["instructions"]), 0)
                self.assertIsInstance(payload.get("inputSchema"), dict)
                self.assertIsInstance(payload.get("outputSchema"), dict)
                artifacts_by_skill_id.setdefault(artifact["targetId"], []).append(artifact)

        assets_by_skill_id: dict[int, list[dict]] = {}
        for asset in assets:
            with self.subTest(asset=asset.get("uuid")):
                self.assertEqual(SKILL_TARGET_TYPE, asset["targetType"])
                self.assertIn(asset["targetId"], skill_ids)
                self.assertGreater(asset["width"], 0)
                self.assertGreater(asset["height"], 0)
                self.assertTrue(asset["assetUrl"].startswith("https://"))
                assets_by_skill_id.setdefault(asset["targetId"], []).append(asset)

        for skill in skills:
            with self.subTest(skill=skill.get("skillKey")):
                self.assertIn(skill["categoryId"], category_ids)
                self.assertIn(skill["packageId"], package_ids)
                self.assertTrue(skill["builtin"])
                self.assertTrue(skill["isBuiltin"])
                self.assertTrue(skill["enabled"])
                self.assertEqual("PUBLISHED", skill["marketStatus"])
                self.assertEqual("PUBLIC", skill["visibility"])
                self.assertEqual("APPROVED", skill["reviewStatus"])
                self.assertEqual(skill["version"], skill["versionName"])
                self.assertIn(skill["id"], artifacts_by_skill_id, "every skill needs at least one installable artifact")
                self.assertIn(skill["id"], assets_by_skill_id, "every skill needs at least one marketplace asset")

                manifest_path = local_seed_path(skill["manifestUrl"])
                self.assertTrue(manifest_path.exists(), f"manifestUrl must exist: {skill['manifestUrl']}")
                skill_manifest = read_json(manifest_path)
                self.assertEqual(skill["id"], skill_manifest.get("id"))
                self.assertEqual(skill["skillKey"], skill_manifest.get("skillKey"))
                self.assertEqual(skill["version"], skill_manifest.get("version"))
                self.assertEqual(skill["runtime"], skill_manifest.get("runtime"))
                self.assertEqual(skill["entrypoint"], skill_manifest.get("entrypoint"))
                self.assertEqual(skill["capabilities"], skill_manifest.get("capabilities"))
                self.assertEqual(skill["configSchema"], skill_manifest.get("configSchema"))
                self.assertEqual(skill["defaultConfig"], skill_manifest.get("defaultConfig"))
                expected_artifacts = [
                    {
                        "artifactRef": item["artifactRef"],
                        "artifactUrl": item["artifactUrl"],
                        "version": item["version"],
                        "runtime": item["runtime"],
                        "checksumHash": item["checksumHash"],
                        "artifactSizeBytes": item["artifactSizeBytes"],
                    }
                    for item in artifacts_by_skill_id[skill["id"]]
                ]
                actual_artifacts = [
                    {
                        "artifactRef": item["artifactRef"],
                        "artifactUrl": item["artifactUrl"],
                        "version": item["version"],
                        "runtime": item["runtime"],
                        "checksumHash": item["checksumHash"],
                        "artifactSizeBytes": item["artifactSizeBytes"],
                    }
                    for item in skill_manifest.get("artifacts", [])
                ]
                self.assertEqual(
                    sorted(expected_artifacts, key=lambda item: item["artifactRef"]),
                    sorted(actual_artifacts, key=lambda item: item["artifactRef"]),
                )

    def test_rust_installer_detects_skill_artifact_seed_metadata_drift(self) -> None:
        source = (ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql" / "skills_seed.rs").read_text(
            encoding="utf-8"
        )
        for function_name in (
            "sqlite_artifact_seed_standard_count",
            "postgres_artifact_seed_standard_count",
        ):
            with self.subTest(function=function_name):
                start = source.index(f"async fn {function_name}")
                end = source.index("\n}\n", start)
                function_source = source[start:end]
                for token in (
                    "artifact_ref",
                    "artifact_url",
                    "artifact_size_bytes",
                    "checksum_hash",
                    "status",
                    "deleted_at IS NULL",
                ):
                    self.assertIn(token, function_source)

    def test_sqlite_installer_regression_reads_skill_seed_assets_artifacts_and_installations(self) -> None:
        source_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "tests"
            / "sqlite_app_skills_installed_seed.rs"
        )
        self.assertTrue(
            source_path.exists(),
            "SQLite installer must keep a regression test for bundled skill seed read models.",
        )
        source = source_path.read_text(encoding="utf-8")
        for token in [
            "DatabaseInstaller::for_sqlite",
            "SqliteAppSkillsReadStore",
            "prompt-optimizer",
            "https://cdn.sdkwork.example/skills/prompt-optimizer/screenshot-1.png",
            "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
            "enable_skill",
            "load_user_skills",
            "runtime installation config must not persist skill store presentation metadata",
        ]:
            with self.subTest(token=token):
                self.assertIn(token, source)


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def local_seed_path(value: str) -> Path:
    self = unittest.TestCase()
    self.assertIsInstance(value, str)
    self.assertFalse(value.startswith(("http://", "https://")), f"seed reference must be local: {value}")
    normalized = value.replace("\\", "/")
    self.assertTrue(normalized.startswith("data/skills/"), f"seed reference must stay under data/skills: {value}")
    return ROOT / normalized


def unique_ids(items: list[dict], label: str) -> set[int]:
    values = [item.get("id") for item in items]
    unique_values(values, label)
    return set(values)


def unique_values(values, label: str) -> None:
    materialized = list(values)
    unittest.TestCase().assertEqual(
        len(materialized),
        len(set(materialized)),
        f"{label} values must be unique",
    )


def artifact_payload_checksum(payload: dict) -> str:
    canonical = dict(payload)
    canonical.pop("checksumHash", None)
    encoded = json.dumps(canonical, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


if __name__ == "__main__":
    unittest.main()
