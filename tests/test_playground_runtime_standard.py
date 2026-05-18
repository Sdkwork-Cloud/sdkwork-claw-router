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
        input_source = (PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx").read_text(encoding="utf-8")

        self.assertIn("export interface PlaygroundHistoryItem", type_source)
        self.assertIn("export type PlaygroundPreviewSetter", type_source)
        self.assertIn("export interface PlaygroundModelOption", type_source)
        self.assertIn("export interface PlaygroundAssetViewProps", type_source)
        self.assertIn("export type { PlaygroundHistoryItem, PlaygroundMedia", service_source)
        self.assertIn("import type { PlaygroundHistoryItem, PlaygroundMedia, PlaygroundModelBucket, PlaygroundModelGroup } from '../playgroundTypes'", page_source)
        self.assertIn("const MODEL_BUCKETS: PlaygroundModelBucket[]", service_source)
        self.assertIn("export type PlaygroundModelBucket = 'llms' | 'images' | 'videos' | 'audios' | 'music' | 'sfx'", type_source)
        self.assertIn("const MODEL_BUCKETS: PlaygroundModelBucket[] = ['llms', 'images', 'videos', 'audios', 'music', 'sfx']", service_source)
        self.assertIn("getClawRouterAppSdkClient().ai.models.list()", service_source)
        self.assertIn("return 'llms';", page_source)
        self.assertIn("return 'llms';", input_source)
        self.assertIn("return 'audios';", page_source)
        self.assertIn("return 'audios';", input_source)
        self.assertNotIn("'agents'", type_source)
        self.assertNotIn("agents:", type_source)
        self.assertNotIn("ai.playground.models", service_source)

    def test_playground_generation_runtime_uses_appbase_generation_service(self) -> None:
        portal_workspace_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "pnpm-workspace.yaml"
        ).read_text(encoding="utf-8")
        playground_package_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-playground"
            / "package.json"
        ).read_text(encoding="utf-8")
        service_source = (PLAYGROUND_ROOT / "playgroundService.ts").read_text(encoding="utf-8")

        self.assertIn('"@sdkwork/generation-pc-react": "workspace:*"', playground_package_source)
        self.assertIn("../../../sdkwork-appbase/packages/pc-react/content/sdkwork-generation-pc-react", portal_workspace_source)

        self.assertIn("createSdkworkGenerationService", service_source)
        self.assertIn("type SdkworkGenerationRun", service_source)
        self.assertIn("type SdkworkGenerationWorkspaceData", service_source)
        self.assertIn("getClawRouterAppSdkClient().ai.generation.list()", service_source)
        self.assertNotIn("ai.playground.history", service_source)
        self.assertIn("fetchGenerationWorkspace", service_source)

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

    def test_playground_generation_controls_are_product_ready_not_read_only_placeholders(self) -> None:
        checked_sources = [
            PLAYGROUND_ROOT / "pages" / "Playground.tsx",
            PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx",
            PLAYGROUND_ROOT / "components" / "AssetGenerationPanel.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "ImageView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "VideoView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "MusicView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "AudioView.tsx",
            PLAYGROUND_ROOT / "components" / "views" / "SfxView.tsx",
        ]
        combined_source = "\n".join(source.read_text(encoding="utf-8") for source in checked_sources)
        page_source = (PLAYGROUND_ROOT / "pages" / "Playground.tsx").read_text(encoding="utf-8")
        panel_source = (PLAYGROUND_ROOT / "components" / "AssetGenerationPanel.tsx").read_text(encoding="utf-8")
        generation_input_source = (PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx").read_text(encoding="utf-8")
        i18n_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-i18n"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        for forbidden in [
            "ReadOnlyPlayground",
            "readOnlyReason",
            "READ_ONLY_",
            "Playground generation and asset actions are temporarily unavailable.",
            "Playground 生成和资产操作暂不可用。",
        ]:
            with self.subTest(forbidden=forbidden):
                self.assertNotIn(forbidden, combined_source)
                self.assertNotIn(forbidden, i18n_source)

        self.assertNotIn("ReadOnlyPlaygroundControl", "\n".join(str(path) for path in PLAYGROUND_ROOT.rglob("*.tsx")))
        self.assertIn("export function AssetGenerationPanel", panel_source)
        self.assertIn("onSubmitGeneration({", panel_source)
        self.assertIn("selectedModality: modality", panel_source)
        self.assertIn("setAgentHistory((current) => [result.item", page_source)
        self.assertIn("void downloadPreviewAsset();", page_source)
        self.assertIn("void sharePreviewAsset();", page_source)
        self.assertIn("void regeneratePreviewAsset();", page_source)
        self.assertNotIn("title={t('playground.readOnlyReason')}", page_source)
        self.assertNotIn("title={title ?? t(PLAYGROUND_READ_ONLY_REASON_KEY)}", generation_input_source)

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

    def test_generation_input_reuses_shared_model_picker_and_keeps_toolbar_compact(self) -> None:
        generation_input_source = (
            PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx"
        ).read_text(encoding="utf-8")
        model_picker_source = (
            PLAYGROUND_ROOT / "components" / "PlaygroundModelPicker.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("PlaygroundModelPicker", generation_input_source)
        self.assertIn("createFallbackModel", generation_input_source)
        self.assertIn("bucket={selectedBucket}", generation_input_source)
        self.assertIn("menuPlacement=\"top\"", generation_input_source)
        self.assertIn("variant=\"flat\"", generation_input_source)
        self.assertIn("compact", generation_input_source)
        self.assertIn("min-h-[200px]", generation_input_source)
        self.assertNotIn("activeVendorCode", generation_input_source)
        self.assertNotIn("onMouseEnter", generation_input_source)
        self.assertNotIn("findModelById", generation_input_source)
        self.assertNotIn("firstModel(", generation_input_source)

        self.assertIn("variant?: 'default' | 'flat';", model_picker_source)
        self.assertNotIn("onMouseEnter", model_picker_source)
        self.assertIn("onClick={() => setActiveVendorCode(group.vendor.code)}", model_picker_source)

    def test_playground_chat_is_independent_module_under_agent(self) -> None:
        page_source = (PLAYGROUND_ROOT / "pages" / "Playground.tsx").read_text(encoding="utf-8")
        chat_page_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatPage.tsx"
        ).read_text(encoding="utf-8")
        simple_chat_input_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "SimpleChatInput.tsx"
        ).read_text(encoding="utf-8")
        chat_message_list_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatMessageList.tsx"
        ).read_text(encoding="utf-8")
        chat_message_bubble_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatMessageBubble.tsx"
        ).read_text(encoding="utf-8")
        chat_api_key_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatApiKeySwitcher.tsx"
        ).read_text(encoding="utf-8")
        chat_types_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "chatTypes.ts"
        ).read_text(encoding="utf-8")
        generation_input_source = (
            PLAYGROUND_ROOT / "components" / "GenerationChatInput.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("MessageSquare", page_source)
        self.assertIn("import { ChatPage } from '../components/chat/ChatPage';", page_source)
        self.assertIn("export type Modality = 'agent' | 'chat'", page_source)
        self.assertIn("setModality('chat')", page_source)
        self.assertIn("label={t('playground.modality.chat')}", page_source)
        self.assertLess(
            page_source.index("label={t('playground.modality.agent')}"),
            page_source.index("label={t('playground.modality.chat')}"),
        )
        self.assertIn("modality === 'chat'", page_source)
        self.assertIn("<ChatPage", page_source)

        self.assertIn("export function ChatPage", chat_page_source)
        self.assertIn("<ChatMessageList", chat_page_source)
        self.assertIn("<SimpleChatInput", chat_page_source)
        self.assertNotIn("<ChatApiKeySwitcher", chat_page_source)
        self.assertIn("PlaygroundService.fetchModelGroups()", chat_page_source)
        self.assertIn("ApiKeyService.fetchKeys()", chat_page_source)
        self.assertIn("setSelectedApiKeyId((current) => (", chat_page_source)
        self.assertIn("const enabledKeys = keys.filter((key) => key.status === 'enabled');", chat_page_source)
        self.assertIn("enabledKeys.some((key) => key.id === current) ? current : enabledKeys[0]?.id ?? ''", chat_page_source)
        self.assertNotIn("GenerationChatInput", chat_page_source)

        self.assertIn("import { SimpleChatInput } from './SimpleChatInput';", chat_page_source)
        self.assertIn("export function SimpleChatInput", simple_chat_input_source)
        self.assertIn("bucket=\"llms\"", simple_chat_input_source)
        self.assertIn("PlaygroundModelPicker", simple_chat_input_source)
        self.assertIn("w-full max-w-[128px]", simple_chat_input_source)
        self.assertIn("w-full max-w-[136px]", simple_chat_input_source)
        self.assertNotIn("max-w-[168px]", simple_chat_input_source)
        self.assertNotIn("max-w-[176px]", simple_chat_input_source)
        self.assertNotIn("max-w-[220px]", simple_chat_input_source)
        self.assertNotIn("max-w-[360px]", simple_chat_input_source)
        self.assertIn("flatComposer", simple_chat_input_source)
        self.assertNotIn("border border-white/10", simple_chat_input_source)
        self.assertNotIn("shadow-[0_24px_70px", simple_chat_input_source)
        self.assertNotIn("ring-1", simple_chat_input_source)
        self.assertIn("useLayoutEffect", simple_chat_input_source)
        self.assertIn("onCompositionStart", simple_chat_input_source)
        self.assertIn("onCompositionEnd", simple_chat_input_source)
        self.assertIn("textareaRef", simple_chat_input_source)
        self.assertIn("variant=\"flat\"", simple_chat_input_source)
        self.assertIn("<ChatApiKeySwitcher", simple_chat_input_source)
        self.assertIn("apiKeys={apiKeys}", simple_chat_input_source)
        self.assertNotIn("MessageSquare", simple_chat_input_source)
        self.assertNotIn("selectedVendorName", simple_chat_input_source)
        self.assertNotIn("playground.chat.vendor", simple_chat_input_source)
        self.assertNotIn("GenerationChatInput", simple_chat_input_source)

        self.assertIn("export function ChatMessageList", chat_message_list_source)
        self.assertIn("ChatMessageBubble", chat_message_list_source)
        self.assertIn("export function ChatMessageBubble", chat_message_bubble_source)
        self.assertIn("export interface ChatMessage", chat_types_source)
        self.assertIn("export interface SimpleChatInputSubmit", chat_types_source)

        self.assertIn("export function ChatApiKeySwitcher", chat_api_key_source)
        self.assertIn("showApiKeyMenu", chat_api_key_source)
        self.assertIn("setShowApiKeyMenu", chat_api_key_source)
        self.assertIn("selectedApiKey?.displayName", chat_api_key_source)
        self.assertIn("apiKey.displayName", chat_api_key_source)
        self.assertIn("whitespace-nowrap", chat_api_key_source)
        self.assertIn("max-w-[136px]", chat_api_key_source)
        self.assertIn("apiKeys.length === 0", chat_api_key_source)
        self.assertIn("disabled?: boolean", chat_api_key_source)
        self.assertIn("disabled:cursor-not-allowed", chat_api_key_source)
        self.assertIn("/console/api-keys", chat_api_key_source)
        self.assertIn("playground.chat.apiKey.empty", chat_api_key_source)
        self.assertNotIn("{apiKey.group}", chat_api_key_source)
        self.assertNotIn("apiKey.maskedKey", chat_api_key_source)
        self.assertNotIn("sm:w-[260px]", chat_api_key_source)
        self.assertNotIn("border border-white/5", chat_api_key_source)
        self.assertNotIn("<select", chat_api_key_source)
        self.assertNotIn("fetch(", chat_api_key_source)

        model_picker_source = (
            PLAYGROUND_ROOT / "components" / "PlaygroundModelPicker.tsx"
        ).read_text(encoding="utf-8")
        self.assertIn("variant?: 'default' | 'flat';", model_picker_source)
        self.assertNotIn("onMouseEnter", model_picker_source)
        self.assertIn("onClick={() => setActiveVendorCode(group.vendor.code)}", model_picker_source)

        self.assertNotIn("createLocalAssistantMessage", chat_page_source)
        self.assertNotIn("3<span", generation_input_source)
        self.assertNotIn("showRatioMenu", generation_input_source)
        self.assertNotIn("playground.input.ratio.hd", generation_input_source)
        self.assertNotIn("w-[72px] h-[96px]", generation_input_source)

    def test_playground_media_generation_uses_fixed_bottom_credit_action_bar(self) -> None:
        panel_source = (
            PLAYGROUND_ROOT / "components" / "AssetGenerationPanel.tsx"
        ).read_text(encoding="utf-8")
        page_source = (
            PLAYGROUND_ROOT / "pages" / "Playground.tsx"
        ).read_text(encoding="utf-8")
        type_source = (PLAYGROUND_ROOT / "playgroundTypes.ts").read_text(encoding="utf-8")
        service_source = (PLAYGROUND_ROOT / "playgroundService.ts").read_text(encoding="utf-8")
        i18n_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-i18n"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("export function AssetGenerationPanel", panel_source)
        self.assertIn("function GenerationBottomActionBar", panel_source)
        self.assertIn("function GenerationSubmitButton", panel_source)
        self.assertNotIn("sticky bottom-0", panel_source)
        self.assertIn("playground.generationCost.unavailable", panel_source)
        self.assertIn("playground.generationCost.points", panel_source)
        self.assertIn("estimatePlaygroundGenerationCredits", panel_source)
        self.assertNotIn("function GenerationActionBar", panel_source)
        self.assertIn("function ReferenceImageUploader", panel_source)
        self.assertIn("function ImageGenerationBottomControls", panel_source)
        self.assertIn("function GenerationPopover", panel_source)
        self.assertIn('accept="image/*"', panel_source)
        self.assertIn("referenceImageUrl", panel_source)
        self.assertIn("referenceImageName", panel_source)
        self.assertIn("readReferenceImageDataUrl", panel_source)
        self.assertIn("dataUrl: referenceImageDataUrl", panel_source)
        self.assertIn("URL.createObjectURL", panel_source)
        self.assertIn("URL.revokeObjectURL", panel_source)
        self.assertIn("aspectRatio", panel_source)
        self.assertIn("playground.referenceAssets", panel_source)
        self.assertIn("playground.action.ratio", panel_source)
        self.assertIn("playground.generationOutput.images", panel_source)
        self.assertIn("ImageGenerationBottomControls", panel_source)
        self.assertIn("config={config}", panel_source)
        self.assertIn("const outputLabel = generationOutputLabel", panel_source)
        self.assertIn("playground.generationOutput.images", panel_source)
        self.assertIn("playground.generationOutput.items", panel_source)
        self.assertIn("h-[64px]", panel_source)
        self.assertNotIn("-mb-4", panel_source)
        self.assertNotIn("min-h-4 flex-1", panel_source)
        self.assertIn("whitespace-nowrap", panel_source)
        self.assertIn("playground.generate", panel_source)
        self.assertIn("costLabel", panel_source)
        self.assertIn("outputLabel", panel_source)
        self.assertNotIn("t('playground.generationCost.estimated')", panel_source)
        self.assertNotIn("mb-3 flex min-w-0 items-start", panel_source)
        self.assertIn("findModelById(modelGroups, selectedModelId)", panel_source)
        self.assertIn("generationConfig: createGenerationConfig(config)", panel_source)
        self.assertIn("referenceImages:", panel_source)
        self.assertIn("targetType: inputModality", page_source)
        self.assertIn("generationConfig,", page_source)
        self.assertIn("referenceImages,", page_source)
        self.assertIn("targetType: input.targetType", service_source)
        self.assertIn("generationConfig: input.generationConfig", service_source)
        self.assertIn("referenceImages: input.referenceImages", service_source)
        self.assertIn("generationConfig?: PlaygroundGenerationConfig", type_source)
        self.assertIn("referenceImages?: PlaygroundReferenceImageInput[]", type_source)
        self.assertIn("dataUrl?: string", type_source)
        self.assertIn("url?: string", type_source)
        self.assertIn("assetId?: string", type_source)
        self.assertIn("targetType?: PlaygroundGenerationTargetType", type_source)
        self.assertIn("officialReferencePrices", type_source)
        self.assertIn("priceAvailability", type_source)
        self.assertIn("const officialReferencePrices = readReferencePrices(item, 'officialReferencePrices')", service_source)
        self.assertIn("officialReferencePrices,", service_source)
        self.assertIn("priceAvailability: readPriceAvailability(item, officialReferenceUnitPrice, officialReferencePrices)", service_source)

        for key in [
            "playground.generationCost.estimated",
            "playground.generationCost.unavailable",
            "playground.generationCost.reference",
            "playground.generationCost.settlement",
            "playground.referenceAssets",
            "playground.action.ratio",
            "playground.config.images",
            "playground.referenceImage.upload",
            "playground.referenceImage.remove",
            "playground.aspectRatio.square",
            "playground.aspectRatio.landscape",
            "playground.aspectRatio.portrait",
        ]:
            with self.subTest(key=key):
                self.assertEqual(
                    2,
                    i18n_source.count(f'"{key}"'),
                    f"{key} must be translated in both locales",
                )

        for relative in [
            "components/views/ImageView.tsx",
            "components/views/VideoView.tsx",
            "components/views/MusicView.tsx",
            "components/views/AudioView.tsx",
            "components/views/SfxView.tsx",
        ]:
            source = (PLAYGROUND_ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(source=relative):
                self.assertIn("<AssetGenerationPanel", source)
                self.assertIn("modelGroups={modelGroups}", source)
                self.assertIn("overflow-hidden", source)
                self.assertIn("shrink-0", source)
                self.assertNotIn("bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2", source)

    def test_playground_generation_request_contract_preserves_explicit_media_config(self) -> None:
        contract_source = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        openapi_source = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_request_source = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "generation-agent-run-create-request.ts"
        ).read_text(encoding="utf-8")
        api_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_generation_agent.rs"
        ).read_text(encoding="utf-8")
        port_source = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "app_generation_agent_run_store.rs"
        ).read_text(encoding="utf-8")
        sqlite_store_source = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "app_generation_agent_run_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store_source = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "app_generation_agent_run_store.rs"
        ).read_text(encoding="utf-8")
        runtime_source = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "app_generation_agent_runtime.rs"
        ).read_text(encoding="utf-8")

        sdk_generation_config_source = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "generation-agent-generation-config.ts"
        ).read_text(encoding="utf-8")
        sdk_reference_image_source = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "generation-agent-reference-image-input.ts"
        ).read_text(encoding="utf-8")

        for source in [
            contract_source,
            openapi_source,
            sdk_request_source + sdk_generation_config_source + sdk_reference_image_source,
        ]:
            with self.subTest(source="contract"):
                self.assertIn("targetType", source)
                self.assertIn("generationConfig", source)
                self.assertIn("referenceImages", source)
                self.assertIn("imageCount", source)
                self.assertIn("aspectRatio", source)
                self.assertIn("durationSeconds", source)
                self.assertIn("quality", source)
                self.assertIn("dataUrl", source)
                self.assertIn("url", source)
                self.assertIn("assetId", source)

        self.assertIn("target_type: Option<String>", api_source)
        self.assertIn("generation_config: Option<Value>", api_source)
        self.assertIn("reference_images: Option<Vec<AppGenerationReferenceImageRequest>>", api_source)
        self.assertIn("data_url: Option<String>", api_source)
        self.assertIn("url: Option<String>", api_source)
        self.assertIn("asset_id: Option<String>", api_source)
        self.assertIn("MAX_REFERENCE_IMAGE_DATA_URL_LEN", api_source)
        self.assertIn("normalize_target_type", api_source)
        self.assertNotIn("classify_generation_target_type(&prompt)", api_source)
        self.assertIn("pub generation_config: Value", port_source)
        self.assertIn("pub reference_images: Vec<AppGenerationReferenceImage>", port_source)
        self.assertIn("let metadata = metadata_json(&command)?", sqlite_store_source)
        self.assertIn("let metadata = metadata_json(&command)?", postgres_store_source)
        self.assertIn('"generationConfig": command.generation_config', runtime_source)
        self.assertIn('"referenceImages": command.reference_images', runtime_source)

    def test_playground_agent_history_time_filter_is_applied(self) -> None:
        page_source = (
            PLAYGROUND_ROOT / "pages" / "Playground.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("function isWithinTimeFilter", page_source)
        self.assertIn("result = result.filter((item) => isWithinTimeFilter(item, timeFilter))", page_source)
        self.assertIn("timeFilter", page_source[page_source.index("const filteredAgentHistory"):page_source.index("const updateSelectedModel")])

    def test_playground_chat_i18n_keys_are_translated(self) -> None:
        source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-i18n"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        for key in [
            "playground.chat.title",
            "playground.chat.subtitle",
            "playground.chat.emptyTitle",
            "playground.chat.emptyDescription",
            "playground.chat.input.placeholder",
            "playground.chat.input.send",
            "playground.chat.vendor",
            "playground.chat.model",
            "playground.chat.apiKey.loading",
            "playground.chat.apiKey.label",
            "playground.chat.apiKey.empty",
            "playground.chat.apiKey.create",
            "playground.chat.apiKey.loadFailed",
            "playground.chat.history",
            "playground.chat.newChat",
            "playground.chat.errors.missingApiKey",
            "playground.chat.errors.emptyResponse",
        ]:
            with self.subTest(key=key):
                self.assertEqual(
                    2,
                    source.count(f'"{key}"'),
                    f"{key} must be translated in both locales",
                )

    def test_playground_chat_loads_history_and_uses_open_sdk_runtime(self) -> None:
        chat_service_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "chatService.ts"
        ).read_text(encoding="utf-8")
        chat_page_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatPage.tsx"
        ).read_text(encoding="utf-8")
        chat_session_list_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatSessionList.tsx"
        ).read_text(encoding="utf-8")
        chat_storage_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "chatLocalStore.ts"
        ).read_text(encoding="utf-8")
        chat_types_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "chatTypes.ts"
        ).read_text(encoding="utf-8")
        commons_sdk_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "sdk-clients.ts"
        ).read_text(encoding="utf-8")
        commons_package_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "package.json"
        ).read_text(encoding="utf-8")
        portal_tsconfig_source = (
            ROOT / "apps" / "sdkwork-claw-router-portal" / "tsconfig.json"
        ).read_text(encoding="utf-8")

        self.assertIn("@sdkwork/clawrouter-open-sdk", commons_package_source)
        self.assertIn("@sdkwork/clawrouter-open-sdk", portal_tsconfig_source)
        self.assertIn("SdkworkAiClient", commons_sdk_source)
        self.assertIn("createClawRouterAiSdkClient", commons_sdk_source)
        self.assertIn("getClawRouterAiSdkClient", commons_sdk_source)
        self.assertIn("OPEN_API_PREFIX", commons_sdk_source)

        self.assertIn("export class ChatService", chat_service_source)
        self.assertIn("getClawRouterAiSdkClient({ apiKey: input.apiKey })", chat_service_source)
        self.assertIn("client.chat.completions.list", chat_service_source)
        self.assertIn("client.chat.completions.messages.list", chat_service_source)
        self.assertIn("client.chat.completions.create", chat_service_source)
        self.assertIn("store: true", chat_service_source)
        self.assertIn("metadata: {", chat_service_source)
        self.assertIn("sessionId: input.sessionId ?? ''", chat_service_source)
        self.assertIn("latestCompletionId: response.id", chat_service_source)
        self.assertIn("completionId:", chat_service_source)
        self.assertIn("toOpenChatHistory(input.messages)", chat_service_source)
        self.assertIn("const isLatestCompletion =", chat_service_source)
        self.assertIn("message.status === 'sent' || message.status === 'complete'", chat_service_source)
        self.assertNotIn("function readMessageId", chat_service_source)
        self.assertNotIn("fetch(", chat_service_source)
        self.assertNotIn("axios", chat_service_source)

        self.assertIn("export interface ChatSessionSummary", chat_types_source)
        self.assertIn("export interface ChatSendResult", chat_types_source)
        self.assertIn("copyableKey: ApiKey['copyableKey'];", chat_types_source)
        self.assertIn("groupName: ApiKey['groupName'];", chat_types_source)
        self.assertIn("apiKey: string", chat_types_source)
        self.assertIn("sessionId?: string", chat_types_source)

        self.assertIn("ChatService.fetchSessions", chat_page_source)
        self.assertIn("ChatService.fetchMessages", chat_page_source)
        self.assertIn("ChatService.sendMessage", chat_page_source)
        self.assertIn("loadStoredChatMessages", chat_page_source)
        self.assertIn("saveStoredChatConversation", chat_page_source)
        self.assertIn("mergeChatSessions", chat_page_source)
        self.assertIn("loading={loadingMessages}", chat_page_source)
        self.assertIn("loadingHistory={loadingSessions || loadingMessages}", chat_page_source)
        self.assertIn("<ChatSessionList", chat_page_source)
        self.assertIn("selectedSessionId", chat_page_source)
        self.assertIn("selectedChatModel", chat_page_source)
        self.assertIn("latestCompletionId", chat_page_source)
        self.assertIn("setSelectedSessionId(sessionId)", chat_page_source)
        self.assertIn("copyableKey: key.copyableKey", chat_page_source)
        self.assertIn("groupName: key.groupName", chat_page_source)
        self.assertIn("createChatUserMessage(input.prompt)", chat_page_source)
        self.assertIn("const handleSubmit = async (input: SimpleChatInputSubmit): Promise<boolean> =>", chat_page_source)
        self.assertIn("return true;", chat_page_source)
        self.assertIn("return false;", chat_page_source)
        self.assertIn("setMessages(priorMessages)", chat_page_source)
        self.assertIn("setMessageError(message)", chat_page_source)
        self.assertIn("selectedApiKeyIdRef", chat_page_source)
        self.assertIn("selectedApiKeySnapshot.id !== selectedApiKeyIdRef.current", chat_page_source)
        self.assertIn("const priorSessions = sessionsRef.current", chat_page_source)
        self.assertIn("const activeSessions = selectedApiKeySnapshot.id === selectedApiKeyIdRef.current", chat_page_source)
        self.assertIn("selectedSessionIdRef", chat_page_source)
        self.assertIn("selectedSessionIdSnapshot !== selectedSessionIdRef.current", chat_page_source)
        self.assertIn("isNewChatDraftRef", chat_page_source)
        self.assertIn("setIsNewChatDraft(true)", chat_page_source)
        self.assertIn("if (isNewChatDraftRef.current) {", chat_page_source)
        self.assertIn("return '';", chat_page_source)
        self.assertIn("setIsNewChatDraft(false)", chat_page_source)
        self.assertIn("setLoadingMessages(false)", chat_page_source)
        self.assertIn("setMessageError(null)", chat_page_source)
        self.assertIn("resetActiveConversationView()", chat_page_source)
        self.assertIn("resetActiveConversationView({ clearSessions: true })", chat_page_source)
        self.assertIn("if (apiKeyId === selectedApiKeyIdRef.current) {", chat_page_source)
        self.assertIn("disabled={submitting}", chat_page_source)
        self.assertNotIn("createLocalAssistantMessage", chat_page_source)

        self.assertIn("export function ChatSessionList", chat_session_list_source)
        self.assertIn("disabled?: boolean", chat_session_list_source)
        self.assertIn("disabled={disabled}", chat_session_list_source)
        self.assertIn("disabled={disabled || active}", chat_session_list_source)
        self.assertIn("playground.chat.newChat", chat_session_list_source)
        self.assertIn("playground.chat.history", chat_session_list_source)
        self.assertIn("sessions.map", chat_session_list_source)
        self.assertIn("CHAT_LOCAL_STORE_PREFIX", chat_storage_source)
        self.assertIn("export function loadStoredChatSessions", chat_storage_source)
        self.assertIn("export function loadStoredChatMessages", chat_storage_source)
        self.assertIn("export function saveStoredChatConversation", chat_storage_source)
        self.assertIn("export function mergeChatSessions", chat_storage_source)

    def test_playground_chat_controls_are_stable_and_polished(self) -> None:
        simple_chat_input_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "SimpleChatInput.tsx"
        ).read_text(encoding="utf-8")
        chat_api_key_source = (
            PLAYGROUND_ROOT / "components" / "chat" / "ChatApiKeySwitcher.tsx"
        ).read_text(encoding="utf-8")
        model_picker_source = (
            PLAYGROUND_ROOT / "components" / "PlaygroundModelPicker.tsx"
        ).read_text(encoding="utf-8")
        page_source = (
            PLAYGROUND_ROOT / "pages" / "Playground.tsx"
        ).read_text(encoding="utf-8")
        agent_view_source = (
            PLAYGROUND_ROOT / "components" / "views" / "AgentView.tsx"
        ).read_text(encoding="utf-8")
        api_key_service_source = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-api-keys"
            / "src"
            / "apiKeyService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("const realSelectedModel", simple_chat_input_source)
        self.assertIn("const hasRealModel = Boolean(realSelectedModel)", simple_chat_input_source)
        self.assertIn("const selectedApiKey = apiKeys.find((apiKey) => apiKey.id === selectedApiKeyId) || apiKeys[0]", simple_chat_input_source)
        self.assertIn("selectedApiKey?.copyableKey", simple_chat_input_source)
        self.assertIn("!loadingHistory", simple_chat_input_source)
        self.assertIn("const submitted = await onSubmit({", simple_chat_input_source)
        self.assertIn("if (submitted) {", simple_chat_input_source)
        self.assertIn("disabled={submitting}", simple_chat_input_source)
        self.assertIn("w-full max-w-[128px]", simple_chat_input_source)
        self.assertIn("w-full max-w-[136px]", simple_chat_input_source)
        self.assertNotIn("max-w-[168px]", simple_chat_input_source)
        self.assertNotIn("max-w-[176px]", simple_chat_input_source)
        self.assertNotIn("selectedModel.id && selectedApiKeyId", simple_chat_input_source)

        self.assertIn("usePopoverDismiss", chat_api_key_source)
        self.assertIn("apiKey.displayName", chat_api_key_source)
        self.assertIn("apiKey.groupName", chat_api_key_source)
        self.assertIn("disabled?: boolean", chat_api_key_source)
        self.assertNotIn("KeyRound", chat_api_key_source)
        self.assertNotIn("apiKey.maskedKey", chat_api_key_source)
        self.assertNotIn("{apiKey.group}", chat_api_key_source)
        self.assertIn("max-w-[136px]", chat_api_key_source)

        self.assertIn("usePopoverDismiss", model_picker_source)
        self.assertIn("disabled?: boolean", model_picker_source)
        self.assertNotIn("onMouseEnter", model_picker_source)
        self.assertIn("w-[392px]", model_picker_source)
        self.assertNotIn("w-[520px]", model_picker_source)

        self.assertIn("useEffect(() => {", page_source)
        self.assertIn("setShowModelMenu(false);", page_source)
        self.assertIn("}, [modality]);", page_source)
        self.assertIn("pb-[240px]", agent_view_source)

        self.assertNotIn("SdkAppApiKeyListResponse['groups']", api_key_service_source)
        self.assertNotIn("readRequiredApiItems(result, 'console.apiKeys.errors.loadGroupsFallback', ['groups'])", api_key_service_source)
        self.assertIn("readApiKeyDisplayName(id, name)", api_key_service_source)
        self.assertNotIn("isSecretLikeApiKeyName", api_key_service_source)

    def test_playground_history_rust_read_models_fail_closed_for_invalid_database_rows(self) -> None:
        for relative in [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_generation_history_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_generation_history_read_store.rs",
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
                self.assertIn("missing generation history {source} from database row", store)
                self.assertIn("invalid generation history item kind from database row", store)
                self.assertIn("invalid generation history status from database row", store)


if __name__ == "__main__":
    unittest.main()
