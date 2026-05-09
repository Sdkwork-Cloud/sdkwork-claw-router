import json
import hashlib
import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.clawrouter_skill_guardian import ClawRouterSkillGuardian


class ClawRouterSkillGuardianTest(unittest.TestCase):
    def write_skill(self, root: Path, name: str, body: str) -> None:
        skill = root / ".agents" / "skills" / name / "SKILL.md"
        skill.parent.mkdir(parents=True, exist_ok=True)
        skill.write_text(textwrap.dedent(body).strip() + "\n", encoding="utf-8")

    def test_accepts_required_sdk_integration_skills(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_valid_skill_seed_bundle(root)
            self.write_skill(
                root,
                "clawrouter-app-sdk-integration",
                """
                ---
                name: clawrouter-app-sdk-integration
                description: Use @sdkwork/clawrouter-app-sdk for /app/v3/api integration.
                ---
                Use @sdkwork/clawrouter-app-sdk.
                Keep /app/v3/api paths aligned.
                Never use raw fetch or axios for remote business endpoints.
                Never hand-edit generated SDK output.
                Regenerate with sdkwork-sdk-generator from generated/openapi/clawrouter-app-openapi.json.
                Do not change apps/sdkwork-claw-router-portal UI visuals.
                """,
            )
            self.write_skill(
                root,
                "clawrouter-backend-sdk-integration",
                """
                ---
                name: clawrouter-backend-sdk-integration
                description: Use @sdkwork/clawrouter-backend-sdk for /backend/v3/api integration.
                ---
                Use @sdkwork/clawrouter-backend-sdk.
                Keep /backend/v3/api paths aligned.
                Never use raw fetch or axios for remote business endpoints.
                Never hand-edit generated SDK output.
                Regenerate with sdkwork-sdk-generator from generated/openapi/clawrouter-backend-openapi.json.
                Do not change apps/sdkwork-claw-router-portal UI visuals.
                """,
            )
            self.write_skill(
                root,
                "clawrouter-sdk-generation",
                """
                ---
                name: clawrouter-sdk-generation
                description: Regenerate @sdkwork/clawrouter-app-sdk and @sdkwork/clawrouter-backend-sdk.
                ---
                Generate @sdkwork/clawrouter-app-sdk and @sdkwork/clawrouter-backend-sdk.
                Read generated/api/api-contract-manifest.json.
                Write generated/openapi/clawrouter-app-openapi.json.
                Write generated/openapi/clawrouter-backend-openapi.json.
                Write apps/sdkwork-claw-router-portal/public/openapi.json with tools.clawrouter_gateway_openapi_generator.
                Run sdkwork-sdk-generator.
                Never hand-edit generated SDK output.
                """,
            )

            result = ClawRouterSkillGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_missing_or_incomplete_skills(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_skill(
                root,
                "clawrouter-app-sdk-integration",
                """
                ---
                name: clawrouter-app-sdk-integration
                description: incomplete
                ---
                Use @sdkwork/clawrouter-app-sdk.
                """,
            )

            result = ClawRouterSkillGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("skill is missing: clawrouter-backend-sdk-integration", result.messages)
            self.assertIn("skill is missing: clawrouter-sdk-generation", result.messages)
            self.assertIn("skill clawrouter-app-sdk-integration must mention /app/v3/api", result.messages)
            self.assertIn("skill clawrouter-app-sdk-integration must mention sdkwork-sdk-generator", result.messages)

    def test_reports_skill_seed_bundle_drift(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_required_skills(root)
            skills_root = root / "data" / "skills"
            skills_root.mkdir(parents=True, exist_ok=True)
            (skills_root / "install-manifest.json").write_text(
                json.dumps({
                    "catalogCode": "sdkwork-agent-skills",
                    "schemaVersion": "agent-skills-seed.v1",
                    "source": "bundled",
                }),
                encoding="utf-8",
            )
            (skills_root / "categories.json").write_text(
                json.dumps([{"id": 1901, "uuid": "cat", "code": "agent-productivity"}]),
                encoding="utf-8",
            )
            (skills_root / "packages.json").write_text(
                json.dumps([{"id": 7101, "uuid": "pkg", "packageKey": "agent-productivity-suite", "categoryId": 1901}]),
                encoding="utf-8",
            )
            (skills_root / "skills.json").write_text(
                json.dumps([
                    {
                        "id": 8101,
                        "uuid": "skill-prompt-optimizer",
                        "skillKey": "prompt-optimizer",
                        "name": "Prompt Optimizer",
                        "categoryId": 1901,
                        "packageId": 7101,
                        "manifestUrl": "data/skills/manifests/prompt-optimizer.json",
                        "version": "1.0.0",
                        "runtime": "builtin",
                        "entrypoint": "sdkwork.skills.prompt_optimizer",
                        "capabilities": ["prompt.analysis"],
                        "configSchema": {"type": "object"},
                        "defaultConfig": {},
                    }
                ]),
                encoding="utf-8",
            )
            (skills_root / "assets.json").write_text(
                json.dumps([{"uuid": "asset", "targetType": 35, "targetId": 8101}]),
                encoding="utf-8",
            )
            (skills_root / "artifacts.json").write_text(
                json.dumps([
                    {
                        "uuid": "artifact",
                        "targetType": 35,
                        "targetId": 8101,
                        "artifactRef": "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
                        "artifactUrl": "data/skills/artifacts/prompt-optimizer-1.0.0.json",
                        "version": "1.0.0",
                        "runtime": "builtin",
                    }
                ]),
                encoding="utf-8",
            )

            result = ClawRouterSkillGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "skill seed artifactUrl must exist: data/skills/artifacts/prompt-optimizer-1.0.0.json",
                result.messages,
            )
            self.assertIn(
                "skill seed manifestUrl must exist: data/skills/manifests/prompt-optimizer.json",
                result.messages,
            )

    def test_reports_manifest_artifact_metadata_drift(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_required_skills(root)
            self.write_valid_skill_seed_bundle(root)
            manifest_path = root / "data" / "skills" / "manifests" / "prompt-optimizer.json"
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            manifest["artifacts"][0]["checksumHash"] = "sha256:" + "0" * 64
            manifest["artifacts"][0]["artifactSizeBytes"] = 1
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            result = ClawRouterSkillGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("skill seed manifest artifact metadata mismatch for prompt-optimizer", result.messages)

    def test_reports_marketplace_seed_standard_drift(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_required_skills(root)
            self.write_valid_skill_seed_bundle(root)
            skills_root = root / "data" / "skills"
            packages_path = skills_root / "packages.json"
            packages = json.loads(packages_path.read_text(encoding="utf-8"))
            packages[0]["enabled"] = False
            packages_path.write_text(json.dumps(packages), encoding="utf-8")
            skills_path = skills_root / "skills.json"
            skills = json.loads(skills_path.read_text(encoding="utf-8"))
            skills[0]["marketStatus"] = "DRAFT"
            skills_path.write_text(json.dumps(skills), encoding="utf-8")
            manifest_path = skills_root / "manifests" / "prompt-optimizer.json"
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            manifest["schemaVersion"] = "draft"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            result = ClawRouterSkillGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("skill seed package agent-productivity-suite must be enabled", result.messages)
            self.assertIn("skill seed skill prompt-optimizer must be published public approved and enabled", result.messages)
            self.assertIn(
                "skill seed manifest schemaVersion must be agent-skill-manifest.v1 for prompt-optimizer",
                result.messages,
            )

    def write_valid_skill_seed_bundle(self, root: Path) -> None:
        skills_root = root / "data" / "skills"
        manifests_root = skills_root / "manifests"
        artifacts_root = skills_root / "artifacts"
        manifests_root.mkdir(parents=True, exist_ok=True)
        artifacts_root.mkdir(parents=True, exist_ok=True)
        (skills_root / "install-manifest.json").write_text(
            json.dumps({
                "catalogCode": "sdkwork-agent-skills",
                "schemaVersion": "agent-skills-seed.v1",
                "source": "bundled",
            }),
            encoding="utf-8",
        )
        (skills_root / "categories.json").write_text(
            json.dumps([{"id": 1901, "uuid": "cat", "code": "agent-productivity"}]),
            encoding="utf-8",
        )
        (skills_root / "packages.json").write_text(
            json.dumps([
                {
                    "id": 7101,
                    "uuid": "pkg",
                    "packageKey": "agent-productivity-suite",
                    "categoryId": 1901,
                    "enabled": True,
                }
            ]),
            encoding="utf-8",
        )
        (skills_root / "skills.json").write_text(
            json.dumps([
                {
                    "id": 8101,
                    "uuid": "skill-prompt-optimizer",
                    "skillKey": "prompt-optimizer",
                    "name": "Prompt Optimizer",
                    "categoryId": 1901,
                    "packageId": 7101,
                    "manifestUrl": "data/skills/manifests/prompt-optimizer.json",
                    "version": "1.0.0",
                    "versionName": "1.0.0",
                    "runtime": "builtin",
                    "entrypoint": "sdkwork.skills.prompt_optimizer",
                    "marketStatus": "PUBLISHED",
                    "visibility": "PUBLIC",
                    "reviewStatus": "APPROVED",
                    "builtin": True,
                    "isBuiltin": True,
                    "enabled": True,
                    "capabilities": ["prompt.analysis"],
                    "configSchema": {"type": "object"},
                    "defaultConfig": {},
                }
            ]),
            encoding="utf-8",
        )
        (skills_root / "assets.json").write_text(
            json.dumps([{"uuid": "asset", "targetType": 35, "targetId": 8101}]),
            encoding="utf-8",
        )
        artifact_payload = {
            "artifactRef": "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
            "version": "1.0.0",
            "runtime": "builtin",
            "skill": {"id": 8101},
            "instructions": ["Improve the prompt."],
            "inputSchema": {"type": "object"},
            "outputSchema": {"type": "object"},
        }
        checksum_hash = artifact_payload_checksum(artifact_payload)
        artifact_payload["checksumHash"] = checksum_hash
        artifact_payload_text = json.dumps(artifact_payload)
        artifact_size_bytes = len(artifact_payload_text.encode("utf-8"))
        (skills_root / "artifacts.json").write_text(
            json.dumps([
                {
                    "uuid": "artifact",
                    "targetType": 35,
                    "targetId": 8101,
                    "artifactRef": "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
                    "artifactUrl": "data/skills/artifacts/prompt-optimizer-1.0.0.json",
                    "version": "1.0.0",
                    "runtime": "builtin",
                    "checksumHash": checksum_hash,
                    "artifactSizeBytes": artifact_size_bytes,
                }
            ]),
            encoding="utf-8",
        )
        (manifests_root / "prompt-optimizer.json").write_text(
            json.dumps({
                "schemaVersion": "agent-skill-manifest.v1",
                "id": 8101,
                "uuid": "skill-prompt-optimizer",
                "skillKey": "prompt-optimizer",
                "name": "Prompt Optimizer",
                "version": "1.0.0",
                "runtime": "builtin",
                "entrypoint": "sdkwork.skills.prompt_optimizer",
                "capabilities": ["prompt.analysis"],
                "configSchema": {"type": "object"},
                "defaultConfig": {},
                "artifacts": [
                    {
                        "artifactRef": "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
                        "artifactUrl": "data/skills/artifacts/prompt-optimizer-1.0.0.json",
                        "version": "1.0.0",
                        "runtime": "builtin",
                        "checksumHash": checksum_hash,
                        "artifactSizeBytes": artifact_size_bytes,
                    }
                ],
            }),
            encoding="utf-8",
        )
        (artifacts_root / "prompt-optimizer-1.0.0.json").write_text(artifact_payload_text, encoding="utf-8")

    def write_required_skills(self, root: Path) -> None:
        self.write_skill(
            root,
            "clawrouter-app-sdk-integration",
            """
            ---
            name: clawrouter-app-sdk-integration
            description: Use @sdkwork/clawrouter-app-sdk for /app/v3/api integration.
            ---
            Use @sdkwork/clawrouter-app-sdk.
            Keep /app/v3/api paths aligned.
            Never use raw fetch or axios for remote business endpoints.
            Never hand-edit generated SDK output.
            Regenerate with sdkwork-sdk-generator from generated/openapi/clawrouter-app-openapi.json.
            Do not change apps/sdkwork-claw-router-portal UI visuals.
            """,
        )
        self.write_skill(
            root,
            "clawrouter-backend-sdk-integration",
            """
            ---
            name: clawrouter-backend-sdk-integration
            description: Use @sdkwork/clawrouter-backend-sdk for /backend/v3/api integration.
            ---
            Use @sdkwork/clawrouter-backend-sdk.
            Keep /backend/v3/api paths aligned.
            Never use raw fetch or axios for remote business endpoints.
            Never hand-edit generated SDK output.
            Regenerate with sdkwork-sdk-generator from generated/openapi/clawrouter-backend-openapi.json.
            Do not change apps/sdkwork-claw-router-portal UI visuals.
            """,
        )
        self.write_skill(
            root,
            "clawrouter-sdk-generation",
            """
            ---
            name: clawrouter-sdk-generation
            description: Regenerate @sdkwork/clawrouter-app-sdk and @sdkwork/clawrouter-backend-sdk.
            ---
            Generate @sdkwork/clawrouter-app-sdk and @sdkwork/clawrouter-backend-sdk.
            Read generated/api/api-contract-manifest.json.
            Write generated/openapi/clawrouter-app-openapi.json.
            Write generated/openapi/clawrouter-backend-openapi.json.
            Write apps/sdkwork-claw-router-portal/public/openapi.json with tools.clawrouter_gateway_openapi_generator.
            Run sdkwork-sdk-generator.
            Never hand-edit generated SDK output.
            """,
        )

def artifact_payload_checksum(payload: dict) -> str:
    canonical = dict(payload)
    canonical.pop("checksumHash", None)
    encoded = json.dumps(canonical, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


if __name__ == "__main__":
    unittest.main()
