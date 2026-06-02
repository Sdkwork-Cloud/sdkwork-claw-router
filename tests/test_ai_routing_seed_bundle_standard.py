import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AI_ROUTING_ROOT = ROOT / "data" / "ai-routing"
ROUTE_TAXONOMY_SOURCE = (
    ROOT
    / "services"
    / "sdkwork-claw-product"
    / "src"
    / "application"
    / "ai_route_taxonomy.rs"
)
SNAPSHOT_QUERY_SOURCE = (
    ROOT
    / "services"
    / "sdkwork-claw-product"
    / "src"
    / "infrastructure"
    / "sql"
    / "queries"
    / "snapshot.rs"
)
SQLITE_QUERY_SOURCE = (
    ROOT
    / "services"
    / "sdkwork-claw-product"
    / "src"
    / "infrastructure"
    / "sql"
    / "sqlite"
    / "queries.rs"
)


class AiRoutingSeedBundleStandardTest(unittest.TestCase):
    def test_ai_routing_seed_bundle_is_split_and_references_route_taxonomy(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        self.assertEqual("sdkwork-ai-routing", manifest["catalogCode"])
        self.assertEqual("ai-routing-seed.v1", manifest["schemaVersion"])
        self.assertEqual("bundled", manifest["source"])

        sections = manifest["sections"]
        self.assertGreaterEqual(len(sections["resources"]), 3)
        self.assertGreaterEqual(len(sections["resourceGroups"]), 2)
        self.assertGreaterEqual(len(sections["channelEndpointTemplates"]), 2)

        resources = load_section_items("resources", sections["resources"])
        groups = load_section_items("resource-groups", sections["resourceGroups"])
        templates = load_section_items(
            "channel-endpoint-templates", sections["channelEndpointTemplates"]
        )

        route_keys, api_codes = route_taxonomy_codes()
        resource_codes = unique_values(
            (item["resourceCode"] for item in resources), "resourceCode"
        )
        group_codes = unique_values((item["groupCode"] for item in groups), "groupCode")
        template_codes = unique_values(
            (item["templateCode"] for item in templates), "templateCode"
        )

        self.assertIn("api.openai.responses", resource_codes)
        self.assertIn("api.openai.chat_completions", resource_codes)
        self.assertIn("api.openai.images.generations", resource_codes)
        self.assertIn("api.openai.audio.transcriptions", resource_codes)
        self.assertIn("api.openai.codex.responses", resource_codes)
        self.assertIn("api.anthropic.claude_code", resource_codes)
        self.assertIn("api.gemini.generate_content", resource_codes)
        self.assertIn("api.gemini.nano_banana.image_generation", resource_codes)
        self.assertIn("api.kling.text_to_video", resource_codes)
        self.assertIn("api.jimeng.image_generation", resource_codes)
        self.assertIn("api.volcengine.video_generation", resource_codes)
        self.assertIn("api.minimax.music_generation", resource_codes)
        self.assertIn("api.vidu.reference_to_image", resource_codes)
        self.assertIn("api.vidu.start_end_to_video", resource_codes)

        for resource in resources:
            with self.subTest(resource=resource.get("resourceCode")):
                self.assertRegex(
                    resource["resourceCode"],
                    r"^(vendor|modality|api|model|bundle)\.[a-z0-9_.-]+$",
                )
                self.assertIn(
                    resource["resourceType"],
                    {"vendor", "modality", "api_endpoint", "model_api", "bundle"},
                )
                if resource["resourceType"] == "api_endpoint":
                    self.assertIn(resource["apiCode"], api_codes | route_keys)
                    self.assertIn(resource["capability"], resource["capabilities"])
                if resource["resourceType"] == "model_api":
                    self.assertTrue(resource.get("catalogKey"))
                    self.assertTrue(resource.get("model"))

        for group in groups:
            with self.subTest(group=group.get("groupCode")):
                self.assertRegex(group["groupCode"], r"^[a-z0-9][a-z0-9_.-]*$")
                self.assertIn(group["selectionMode"], {"all", "any"})
                self.assertGreater(len(group["items"]), 0)
                for item in group["items"]:
                    self.assertIn(item["itemType"], {"resource", "group"})
                    if item["itemType"] == "resource":
                        self.assertIn(item["resourceCode"], resource_codes)
                    else:
                        self.assertIn(item["groupCode"], group_codes)

        for template in templates:
            with self.subTest(template=template.get("templateCode")):
                self.assertIn(template["templateCode"], template_codes)
                self.assertIn(template["apiCode"], api_codes | route_keys)
                self.assertTrue(template["pathTemplate"].startswith("/"))
                self.assertIn(template["method"], {"GET", "POST", "DELETE"})
                self.assertGreater(template["timeoutMs"], 0)
                self.assertIn(template["capability"], template["capabilities"])

    def test_official_and_relay_resource_groups_cover_vendor_native_api_codes(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        sections = manifest["sections"]
        resources = load_section_items("resources", sections["resources"])
        groups = load_section_items("resource-groups", sections["resourceGroups"])

        vendor_native_resource_codes = {
            item["resourceCode"]
            for item in resources
            if item["resourceType"] == "api_endpoint"
            and item.get("vendorCode")
            in {"gemini", "anthropic", "kling", "jimeng", "volcengine", "vidu"}
        }
        official_group_items = group_resource_codes(groups, "official")
        relay_group_items = group_resource_codes(groups, "relay")

        self.assertTrue(
            vendor_native_resource_codes <= official_group_items,
            "official provider groups must cover every vendor-native API endpoint resource",
        )
        for expected in {
            "api.kling.task_query",
            "api.jimeng.task_query",
            "api.volcengine.task_query",
        }:
            with self.subTest(expected=expected):
                self.assertIn(
                    expected,
                    relay_group_items,
                    "relay media groups must include task query endpoints used by async media providers",
                )

    def test_admin_api_groups_include_all_codex_api_resources(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        resources = load_section_items("resources", manifest["sections"]["resources"])
        admin_groups = read_json(
            AI_ROUTING_ROOT / "resource-groups" / "admin-api-groups.json"
        )["items"]

        codex_resource_codes = {
            item["resourceCode"]
            for item in resources
            if item["resourceType"] == "api_endpoint"
            and (
                item["resourceCode"].startswith("api.openai.codex.")
                or item["resourceCode"]
                in {"api.openai.containers", "api.openai.skills"}
            )
        }
        self.assertGreater(
            len(codex_resource_codes),
            0,
            "seed catalog must include Codex API endpoint resources",
        )

        codex_group = next(
            (
                group
                for group in admin_groups
                if group["groupCode"] == "api.openai.codex"
            ),
            None,
        )
        self.assertIsNotNone(codex_group, "admin API groups must expose OpenAI Codex API")
        self.assertEqual("OpenAI Codex API", codex_group["groupName"])
        self.assertNotIn("Response", codex_group["groupName"])
        self.assertNotIn("Responses", codex_group["description"])
        self.assertEqual(
            codex_resource_codes,
            {
                item["resourceCode"]
                for item in codex_group["items"]
                if item["itemType"] == "resource"
            },
            "OpenAI Codex API group must include every Codex-related API resource",
        )

    def test_ai_routing_seed_has_installer_hooks_for_sqlite_and_postgres(self) -> None:
        installer = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "installer.rs"
        ).read_text(encoding="utf-8")
        ai_seed = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "ai_routing_seed.rs"
        ).read_text(encoding="utf-8")

        for token in [
            "import_sqlite_ai_routing_seed",
            "import_postgres_ai_routing_seed",
            "sqlite_ai_routing_seed_complete",
            "postgres_ai_routing_seed_complete",
            "bundled_ai_routing_seed_payload",
        ]:
            with self.subTest(token=token):
                self.assertIn(token, installer)
                self.assertIn(token, ai_seed)
        self.assertIn("validate_bundle_kind", ai_seed)

    def test_every_api_endpoint_resource_has_endpoint_seed_and_template_metadata(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        sections = manifest["sections"]
        resources = load_section_items("resources", sections["resources"])
        templates = load_section_items(
            "channel-endpoint-templates", sections["channelEndpointTemplates"]
        )
        api_endpoint_resources = [
            item for item in resources if item["resourceType"] == "api_endpoint"
        ]
        resource_api_codes = unique_values(
            (item["apiCode"] for item in api_endpoint_resources), "api endpoint apiCode"
        )
        template_api_codes = unique_values(
            (item["apiCode"] for item in templates), "channel endpoint template apiCode"
        )
        self.assertEqual(
            resource_api_codes,
            template_api_codes,
            "channel endpoint template metadata must cover every bundled API endpoint resource",
        )

        ai_seed = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "ai_routing_seed.rs"
        ).read_text(encoding="utf-8")
        self.assertIn("endpoint_definitions(catalog)", ai_seed)
        self.assertIn("api_endpoint_resources(catalog)", ai_seed)
        self.assertRegex(
            ai_seed,
            r"fn expected_endpoint_codes\(catalog: &AiRoutingSeedCatalog\) -> BTreeSet<String>",
        )
        self.assertNotIn(
            "catalog\n        .channel_endpoint_templates\n        .iter()\n        .map(|item| item.api_code.clone())",
            ai_seed,
            "seed completeness must be based on API resources, not template-only coverage",
        )

    def test_api_endpoint_resources_are_classified_for_resource_pricing(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        resources = load_section_items("resources", manifest["sections"]["resources"])
        api_endpoint_resources = [
            item for item in resources if item["resourceType"] == "api_endpoint"
        ]
        self.assertGreater(len(api_endpoint_resources), 0)

        expected_categories = {
            "model",
            "image",
            "video",
            "audio",
            "music",
            "sfx",
            "api_resource",
        }
        modality_to_category = {
            "llm": "model",
            "embedding": "model",
            "image": "image",
            "video": "video",
            "audio": "audio",
            "music": "music",
            "sfx": "sfx",
            "network": "api_resource",
        }
        observed_categories = {
            modality_to_category[item["modalityCode"]]
            for item in api_endpoint_resources
        }
        self.assertTrue(
            observed_categories <= expected_categories,
            "API endpoint resources must map to supported pricing resource categories",
        )
        self.assertIn(
            "api_resource",
            observed_categories,
            "network and administrative APIs must be classified as per-call API resources",
        )

        ai_seed = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "ai_routing_seed.rs"
        ).read_text(encoding="utf-8")
        for token in [
            "fn resource_billing_category(item: &ResourceSeed) -> &'static str",
            '"resourceBillingCategory": resource_billing_category(item)',
            '"defaultBillingMeter": default_billing_meter_code(item)',
            '"api_request"',
        ]:
            self.assertIn(token, ai_seed)

    def test_resource_pricing_categories_have_standard_default_meters(self) -> None:
        ai_seed = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "ai_routing_seed.rs"
        ).read_text(encoding="utf-8")

        expected_meter_branches = {
            "image": "image_result",
            "video": "video_result",
            "audio": "audio_input_second",
            "music": "music_output_second",
            "sfx": "sfx_result",
            "network": "api_request",
            "embedding": "embedding_input_token",
        }
        for modality, meter_code in expected_meter_branches.items():
            self.assertIn(
                f'"{modality}" => "{meter_code}"',
                ai_seed,
                f"{modality} resources must default to the standard billing meter {meter_code}",
            )
        self.assertNotIn(
            '"sfx" => "sfx_output_second"',
            ai_seed,
            "sound-effect resources must not use a non-standard billing meter",
        )

    def test_resource_group_seed_items_use_non_null_unique_keys(self) -> None:
        ai_seed = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "ai_routing_seed.rs"
        ).read_text(encoding="utf-8")

        self.assertIn(
            "fn resource_item_code(item: &ResourceGroupItemSeed) -> &str",
            ai_seed,
        )
        self.assertIn(
            "fn child_group_item_code(item: &ResourceGroupItemSeed) -> &str",
            ai_seed,
        )
        self.assertNotIn(
            "fn resource_item_code(item: &ResourceGroupItemSeed) -> Option<&str>",
            ai_seed,
        )
        self.assertNotIn(
            "fn child_group_item_code(item: &ResourceGroupItemSeed) -> Option<&str>",
            ai_seed,
        )
        self.assertIn('unwrap_or("")', ai_seed)

    def test_sql_runtime_snapshot_recognizes_every_seeded_api_code(self) -> None:
        manifest = read_json(AI_ROUTING_ROOT / "install-manifest.json")
        resources = load_section_items("resources", manifest["sections"]["resources"])
        api_codes = sorted(
            {
                item["apiCode"]
                for item in resources
                if item["resourceType"] == "api_endpoint"
            }
        )
        query_sources = {
            "postgres": SNAPSHOT_QUERY_SOURCE.read_text(encoding="utf-8"),
            "sqlite": SQLITE_QUERY_SOURCE.read_text(encoding="utf-8"),
        }

        for api_code in api_codes:
            for runtime, snapshot_source in query_sources.items():
                with self.subTest(runtime=runtime, api_code=api_code):
                    self.assertIn(
                        api_code,
                        snapshot_source,
                        "runtime pricing snapshot must load channel endpoint and resource scopes for every seeded API code",
                    )


def load_section_items(folder: str, files: list[str]) -> list[dict]:
    items: list[dict] = []
    for file_name in files:
        path = AI_ROUTING_ROOT / folder / file_name
        unittest.TestCase().assertTrue(path.exists(), f"missing seed file: {path}")
        payload = read_json(path)
        unittest.TestCase().assertIsInstance(payload.get("items"), list)
        items.extend(payload["items"])
    return items


def route_taxonomy_codes() -> tuple[set[str], set[str]]:
    source = ROUTE_TAXONOMY_SOURCE.read_text(encoding="utf-8")
    route_keys = set(re.findall(r'"([a-z0-9_./-]+)"\s*,\s*"([a-z0-9_./-]+)"', source))
    flattened = {value for pair in route_keys for value in pair}
    explicit_route_keys = set(re.findall(r'route_key:\s*"([a-z0-9_./-]+)"', source))
    explicit_api_codes = set(re.findall(r'api_code:\s*"([a-z0-9_./-]+)"', source))
    route_keys = flattened | explicit_route_keys
    api_codes = flattened | explicit_api_codes
    return route_keys, api_codes


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def unique_values(values, label: str) -> set[str]:
    materialized = list(values)
    unittest.TestCase().assertEqual(
        len(materialized),
        len(set(materialized)),
        f"{label} values must be unique",
    )
    return set(materialized)


def group_resource_codes(groups: list[dict], group_type: str) -> set[str]:
    return {
        item["resourceCode"]
        for group in groups
        if group["groupType"] == group_type
        for item in group["items"]
        if item["itemType"] == "resource"
    }


if __name__ == "__main__":
    unittest.main()
