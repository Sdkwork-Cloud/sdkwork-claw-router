import unittest
from pathlib import Path
import yaml


ROOT = Path(__file__).resolve().parents[1]
PLAYGROUND_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-playground"
    / "src"
)


class PlaygroundRuntimeStandardTest(unittest.TestCase):
    def test_playground_history_field_contract_targets_shared_type_source(self) -> None:
        contract_path = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        contract = yaml.safe_load(contract_path.read_text(encoding="utf-8"))

        playground_contracts = [
            entry
            for entry in contract["frontend_models"]
            if entry.get("route") == "/playground" and entry.get("interface") == "PlaygroundHistoryItem"
        ]

        self.assertEqual(1, len(playground_contracts))
        self.assertEqual(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundTypes.ts",
            playground_contracts[0]["source"],
        )

    def test_playground_history_and_preview_components_use_shared_types(self) -> None:
        type_source = (PLAYGROUND_ROOT / "playgroundTypes.ts").read_text(encoding="utf-8")
        service_source = (PLAYGROUND_ROOT / "playgroundService.ts").read_text(encoding="utf-8")
        page_source = (PLAYGROUND_ROOT / "pages" / "Playground.tsx").read_text(encoding="utf-8")

        self.assertIn("export interface PlaygroundHistoryItem", type_source)
        self.assertIn("export type PlaygroundPreviewSetter", type_source)
        self.assertIn("export interface PlaygroundModelOption", type_source)
        self.assertIn("export interface PlaygroundAssetViewProps", type_source)
        self.assertIn("export type { PlaygroundHistoryItem, PlaygroundMedia } from './playgroundTypes.ts'", service_source)
        self.assertIn("import type { PlaygroundHistoryItem, PlaygroundMedia, PlaygroundModelOption } from '../playgroundTypes'", page_source)
        self.assertIn("const modelOptions: Record<Modality, PlaygroundModelOption[]>", page_source)

        checked_sources = [
            PLAYGROUND_ROOT / "components" / "ChatHistoryItem.tsx",
            PLAYGROUND_ROOT / "components" / "MessageItems.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "AgentView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "SharedHistoryView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "ImageView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "VideoView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "MusicView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "AudioView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "SfxView.tsx",
        ]

        for source_path in checked_sources:
            source = source_path.read_text(encoding="utf-8")
            relative = source_path.relative_to(ROOT).as_posix()
            with self.subTest(source=relative):
                self.assertNotIn(": any", source)
                self.assertNotIn("as any", source)
                self.assertNotIn("unknown as", source)
                self.assertIn("Playground", source)

    def test_generation_input_uses_modality_names_without_mojibake(self) -> None:
        checked_sources = [
            PLAYGROUND_ROOT / "pages" / "Playground.tsx",
            PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "AgentView.tsx",
        ]

        combined_source = "\n".join(source.read_text(encoding="utf-8") for source in checked_sources)

        for legacy_name in [
            "selectedType",
            "setSelectedType",
            "showTypeMenu",
            "setShowTypeMenu",
            "getTypeIcon",
            "typeLabels",
        ]:
            with self.subTest(legacy_name=legacy_name):
                self.assertNotIn(legacy_name, combined_source)

        for canonical_name in [
            "selectedModality",
            "setSelectedModality",
            "showModalityMenu",
            "setShowModalityMenu",
            "getModalityIcon",
            "modalityLabels",
        ]:
            with self.subTest(canonical_name=canonical_name):
                self.assertIn(canonical_name, combined_source)

        for mojibake_token in ["鏅", "鐢", "鉁", "\ufffd"]:
            with self.subTest(mojibake_token=mojibake_token):
                self.assertNotIn(mojibake_token, combined_source)

        generation_input_source = (
            PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx"
        ).read_text(encoding="utf-8")
        agent_view_source = (
            PLAYGROUND_ROOT / "components" / "views" / "AgentView.tsx"
        ).read_text(encoding="utf-8")
        input_layout_source = generation_input_source + "\n" + agent_view_source

        self.assertIn('className="w-full max-w-[1280px] relative"', generation_input_source)
        self.assertIn(
            'className="w-full max-w-[1280px] pointer-events-auto px-4 md:px-12 relative z-10"',
            agent_view_source,
        )
        for forbidden_width in ["w-[800px]", "max-w-[800px]", "w-[960px]", "max-w-[960px]"]:
            with self.subTest(forbidden_width=forbidden_width):
                self.assertNotIn(forbidden_width, input_layout_source)

    def test_playground_history_rust_read_models_fail_closed_for_invalid_database_rows(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_playground_history_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_playground_history_read_store.rs",
        ]:
            store = (ROOT / relative).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            with self.subTest(store=relative):
                self.assertNotIn("filter_map(row_to_history_item)", store)
                self.assertNotIn("COALESCE(a.status, j.status, 0) AS status_code", store)
                self.assertNotIn("COALESCE(j.status, 0) AS status_code", store)
                self.assertNotIn("COALESCE(a.asset_type, j.modality, j.job_type, 0) AS item_kind", store)
                self.assertNotIn("COALESCE(j.modality, j.job_type, 0) AS item_kind", store)
                self.assertNotIn("COALESCE(j.modality, j.job_type)", store)

                self.assertIn("rows.into_iter().map(row_to_history_item).collect()", store)
                self.assertIn("a.status AS status_code", store)
                self.assertIn("j.status AS status_code", store)
                self.assertIn("a.asset_type AS item_kind", store)
                self.assertIn("j.modality AS item_kind", store)
                self.assertIn("j.modality IN (2, 3, 4, 5, 6)", store)
                self.assertIn(
                    'item_type_label(required_integer_cell(&row, "item_kind", "item kind")?)?',
                    compact_store,
                )
                self.assertIn(
                    'status_label(required_integer_cell(&row, "status_code", "status")?)?',
                    compact_store,
                )
                self.assertIn("missing playground history {source} from database row", store)
                self.assertIn("invalid playground history item kind from database row", store)
                self.assertIn("invalid playground history status from database row", store)


if __name__ == "__main__":
    unittest.main()
