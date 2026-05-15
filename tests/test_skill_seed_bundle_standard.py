import hashlib
import json
import re
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
        skill_by_id = {item["id"]: item for item in skills}
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
                target_skill = skill_by_id[artifact["targetId"]]
                if target_skill.get("sourceType") == "COMMUNITY" and target_skill.get("provider") == "ClawHub":
                    self.assertRegex(
                        artifact["artifactRef"],
                        r"^clawhub://skills/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?@\d+\.\d+\.\d+(?:[-+][A-Za-z0-9._-]+)?$",
                    )
                    self.assertEqual("metadata", artifact["runtime"])
                else:
                    self.assertRegex(
                        artifact["artifactRef"],
                        r"^builtin://sdkwork\.skills\.[a-z0-9_]+@\d+\.\d+\.\d+$",
                    )
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
                if skill.get("sourceType") == "OFFICIAL":
                    self.assertEqual("SDKWork", skill.get("provider"))
                    self.assertTrue(skill["builtin"])
                    self.assertTrue(skill["isBuiltin"])
                    self.assertEqual("builtin", skill.get("runtime"))
                elif skill.get("sourceType") == "COMMUNITY" and skill.get("provider") == "ClawHub":
                    self.assertEqual("metadata", skill.get("runtime"))
                    self.assertFalse(skill["builtin"])
                    self.assertFalse(skill["isBuiltin"])
                    self.assertEqual("clawhub", skill.get("source", {}).get("vendor"))
                else:
                    self.fail(f"unsupported bundled skill sourceType: {skill.get('sourceType')}")
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

    def test_skill_seed_has_sdkwork_official_priority_and_clawhub_local_mirror_seed(self) -> None:
        categories = read_json(SKILLS_ROOT / "categories.json")
        packages = read_json(SKILLS_ROOT / "packages.json")
        skills = read_json(SKILLS_ROOT / "skills.json")

        self.assertGreater(len(categories), 0)
        self.assertGreater(len(skills), 0)
        self.assertEqual("sdkwork-official", categories[0]["code"])
        self.assertEqual("SDKWork Official", categories[0]["name"])
        self.assertTrue(categories[0]["visible"])
        self.assertEqual(1, categories[0]["status"])
        self.assertEqual(19, categories[0]["type"])

        visible_category_ids = {
            item["id"]
            for item in categories
            if item.get("visible") is True and item.get("status") == 1 and item.get("type") in {19, 20}
        }
        official_skill_keys = {
            item["skillKey"]
            for item in skills
            if item.get("sourceType") == "OFFICIAL"
            and item.get("provider") == "SDKWork"
            and item.get("featured") is True
            and item.get("categoryId") == categories[0]["id"]
            and item.get("categoryId") in visible_category_ids
            and item.get("marketStatus") == "PUBLISHED"
            and item.get("visibility") == "PUBLIC"
            and item.get("reviewStatus") == "APPROVED"
            and item.get("enabled") is True
        }
        self.assertGreaterEqual(
            len(official_skill_keys),
            3,
            "SDKWork Official must be a first-class non-empty featured category",
        )

        clawhub_category = next((item for item in categories if item.get("code") == "clawhub-community"), None)
        self.assertIsNotNone(clawhub_category, "ClawHub community category must be bundled from a local full mirror")
        self.assertTrue(clawhub_category["visible"])
        self.assertLess(categories[0]["sortWeight"], clawhub_category["sortWeight"])

        clawhub_package = next((item for item in packages if item.get("packageKey") == "clawhub-community-mirror"), None)
        self.assertIsNotNone(clawhub_package)
        self.assertEqual(clawhub_category["id"], clawhub_package["categoryId"])
        self.assertTrue(clawhub_package["enabled"])

        clawhub_skills = [
            item
            for item in skills
            if item.get("sourceType") == "COMMUNITY"
            and item.get("provider") == "ClawHub"
            and item.get("categoryId") == clawhub_category["id"]
            and item.get("packageId") == clawhub_package["id"]
        ]
        self.assertGreaterEqual(len(clawhub_skills), 3)
        for skill in clawhub_skills:
            with self.subTest(skill=skill["skillKey"]):
                self.assertTrue(skill["skillKey"].startswith("clawhub-"))
                self.assertEqual("PUBLISHED", skill["marketStatus"])
                self.assertEqual("PUBLIC", skill["visibility"])
                self.assertEqual("APPROVED", skill["reviewStatus"])
                self.assertTrue(skill["enabled"])
                self.assertFalse(skill["builtin"])
                self.assertFalse(skill["isBuiltin"])
                self.assertEqual("metadata", skill["runtime"])
                source = skill.get("source") or {}
                self.assertEqual("clawhub", source.get("vendor"))
                self.assertIsInstance(source.get("fetchedAt"), str)
                self.assertTrue(str(source.get("url", "")).startswith("https://clawhub.ai/skills/"))

        raw_index_path = SKILLS_ROOT / "clawhub" / "raw" / "index.json"
        normalized_manifest_path = SKILLS_ROOT / "clawhub" / "manifest.json"
        self.assertTrue(raw_index_path.exists(), "ClawHub raw mirror index must be bundled locally")
        self.assertTrue(normalized_manifest_path.exists(), "ClawHub normalized mirror manifest must be bundled locally")
        raw_index = read_json(raw_index_path)
        normalized_manifest = read_json(normalized_manifest_path)
        self.assertEqual("https://clawhub.ai/api/v1/skills", raw_index["source"]["listApi"])
        self.assertEqual("full-cursor-mirror", raw_index["mirrorMode"])
        self.assertGreaterEqual(raw_index["totalItems"], len(clawhub_skills))
        self.assertGreaterEqual(normalized_manifest["mirroredSkillCount"], len(clawhub_skills))
        expected_detail_slugs = raw_mirror_detail_slugs(raw_index)
        actual_seed_slugs = {skill["source"]["slug"] for skill in clawhub_skills}
        manifest_seed_slugs = {item["slug"] for item in normalized_manifest["seededSkills"]}
        self.assertEqual(
            len(expected_detail_slugs),
            len(actual_seed_slugs),
            "ClawHub skills seed must project every mirrored detail payload, not only a curated subset",
        )
        self.assertEqual(
            expected_detail_slugs,
            actual_seed_slugs,
            "ClawHub skills seed must import all locally mirrored detail slugs into startup seed data",
        )
        self.assertEqual(len(expected_detail_slugs), normalized_manifest["seededSkillCount"])
        self.assertEqual(
            actual_seed_slugs,
            manifest_seed_slugs,
        )

    def test_clawhub_mirror_script_is_documented_and_uses_public_list_api(self) -> None:
        script_path = ROOT / "scripts" / "mirror-clawhub-skills-seed.mjs"
        self.assertTrue(script_path.exists(), "ClawHub skill seed mirror script must exist")
        script = script_path.read_text(encoding="utf-8")
        self.assertIn("https://clawhub.ai/api/v1/skills", script)
        self.assertIn("nextCursor", script)
        self.assertIn("cursor", script)
        self.assertIn("data/skills/clawhub/raw/index.json", script)
        self.assertIn("data/skills/clawhub/raw/details", script)
        self.assertIn("full-cursor-mirror", script)
        self.assertIn("--fetch", script)
        self.assertIn("--max-items", script)
        self.assertIn("--page-size", script)
        self.assertIn("--from-mirror", script)
        self.assertIn("SDKWork Official", script)
        self.assertIn("--check", script)
        self.assertIn("clawhub://skills/", script)
        self.assertIn("builtin: false", script)
        self.assertIn("isBuiltin: false", script)
        self.assertIn("mirrorFileName", script)
        self.assertIn("checkpoint.json", script)
        self.assertIn("raw/errors", script)
        self.assertNotIn("/api/v1/search", script)
        self.assertNotIn("clawhub-mcp", script)

        package_json = read_json(ROOT / "package.json")
        self.assertEqual(
            "node scripts/mirror-clawhub-skills-seed.mjs --fetch",
            package_json["scripts"]["skills:seed:mirror-clawhub"],
        )
        self.assertEqual(
            "node scripts/mirror-clawhub-skills-seed.mjs --check",
            package_json["scripts"]["skills:seed:check"],
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


def raw_mirror_detail_slugs(raw_index: dict) -> set[str]:
    detail_slugs: set[str] = set()
    for item in raw_index.get("items", []):
        slug = normalize_slug(item.get("slug"))
        if not slug:
            continue
        detail_path = SKILLS_ROOT / "clawhub" / "raw" / "details" / mirror_file_name(slug)
        legacy_detail_path = SKILLS_ROOT / "clawhub" / "raw" / "details" / f"{slug}.json"
        if detail_path.exists():
            detail = read_json(detail_path)
        elif legacy_detail_path.exists():
            detail = read_json(legacy_detail_path)
        else:
            continue
        detail_slug = normalize_slug(detail.get("skill", {}).get("slug"))
        if detail_slug:
            detail_slugs.add(detail_slug)
    return detail_slugs


def mirror_file_name(slug: str) -> str:
    normalized = normalize_slug(slug)
    prefix = normalized[:80].rstrip("-") or "skill"
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16]
    return f"{prefix}-{digest}.json"


def normalize_slug(value) -> str:
    normalized = re.sub(r"[^a-z0-9-]+", "-", str(value or "").strip().lower())
    normalized = re.sub(r"^-+|-+$", "", normalized)
    return re.sub(r"-+", "-", normalized)


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
