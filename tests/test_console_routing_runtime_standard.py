import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleRoutingRuntimeStandardTest(unittest.TestCase):
    def test_console_routing_channels_and_api_keys_are_typed_and_normalized(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        types = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "types.ts"
        ).read_text(encoding="utf-8")
        channels = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ChannelsTab.tsx"
        ).read_text(encoding="utf-8")
        routing_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "RoutingView.tsx"
        ).read_text(encoding="utf-8")
        api_keys = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ApiKeysTab.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("export type ChannelStatus = 'active' | 'disabled' | 'error';", types)
        self.assertIn("status: ChannelStatus;", types)
        self.assertNotIn("'Active' | 'Warning' | 'Error'", types)
        self.assertNotIn("MOCK_CHANNELS", types)

        self.assertIn("import type { Channel } from './types';", service)
        self.assertIn("export type RoutingApiKeyStatus = 'enabled' | 'disabled';", service)
        self.assertIn("export interface RoutingApiKey", service)
        self.assertIn("static async fetchChannels(): Promise<Channel[]>", service)
        self.assertIn("static async fetchApiKeys(): Promise<RoutingApiKey[]>", service)
        self.assertIn(".map(normalizeRoutingChannel)", service)
        self.assertIn(".map(normalizeRoutingApiKey)", service)
        self.assertIn("function readRoutingChannelStatus", service)
        self.assertIn("function readRoutingApiKeyStatus", service)
        self.assertNotIn("Promise<any[]>", service)
        self.assertNotIn("return readApiItems(result);", service)

        self.assertIn("useState<Channel[]>([])", channels)
        self.assertIn("useState<Channel | null>(null)", channels)
        self.assertIn("type ChannelVendorFilter", channels)
        self.assertIn("const channelVendorTabs", channels)
        self.assertIn("type CapabilityBadgeConfig", channels)
        self.assertNotIn("useState<any", channels)
        self.assertNotIn(": any", channels)
        self.assertNotIn("as any", channels)

        self.assertIn("type NavItemProps", routing_view)
        self.assertIn("type MetricCardProps", routing_view)
        self.assertNotIn(": any", routing_view)

        self.assertIn("useState<RoutingApiKey[]>([])", api_keys)
        self.assertIn("displayRoutingApiKeyStatus(k.status, t)", api_keys)
        self.assertIn("console.routing.status.active", api_keys)
        self.assertIn("console.routing.status.disabled", api_keys)
        self.assertNotIn("k.status === 'Active'", api_keys)
        self.assertNotIn("useState<any", api_keys)

    def test_console_routing_field_contract_tracks_channel_and_api_key_view_models(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn(
            "fields: [id, name, vendor, provider, providerCode, protocol, accessType, baseUrl, apiKey, models, capabilities, isMultimodal, timeoutMs, retryPolicy, retryPolicy.maxAttempts, retryPolicy.retryableStatusCodes, retryPolicy.backoffMs, weight, status, latency, rpm, balance, errors]",
            contract,
        )
        self.assertIn("interface: RoutingApiKey", contract)
        self.assertIn("fields: [id, name, displayKey, copyableKey, status, totalUsage, createdAt]", contract)

    def test_console_routing_strategy_uses_sdk_backed_strategy_snapshot(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        strategy = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "StrategyTab.tsx"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn("export type StrategyType = 'latency' | 'weighted' | 'cost';", service)
        self.assertIn("export interface MappingRule", service)
        self.assertNotIn("[key: string]: unknown", service)
        self.assertIn("export interface RoutingStrategySnapshot", service)
        self.assertIn("static async fetchStrategy(): Promise<RoutingStrategySnapshot>", service)
        self.assertIn("static async updateStrategy(snapshot: RoutingStrategySnapshot): Promise<void>", service)
        self.assertIn("getClawRouterAppSdkClient().ai.routing.strategy.list()", service)
        self.assertIn("mappingRules: snapshot.mappingRules.map(toUpdateMappingRuleRequest)", service)
        self.assertIn("getClawRouterAppSdkClient().ai.routing.strategy.update(request)", service)
        self.assertIn("normalizeRoutingStrategySnapshot", service)
        self.assertNotIn("router_strategy", strategy)
        self.assertNotIn("router_mapping_rules", strategy)
        self.assertNotIn("localStorage", strategy)
        self.assertIn("RoutingService.fetchStrategy()", strategy)
        self.assertIn("RoutingService.updateStrategy", strategy)
        self.assertNotIn(": any", strategy)
        self.assertIn("type StrategyOptionProps", strategy)
        self.assertIn("isValidMappingModelName", strategy)
        self.assertIn("hasDuplicateSourceModel", strategy)

        self.assertIn("operation: fetchStrategy", contract)
        self.assertIn("operation: updateStrategy", contract)
        self.assertIn("api_path: /app/v3/api/ai/routing/strategy", contract)
        self.assertIn("name: RoutingStrategySnapshot", contract)
        self.assertIn("name: UpdateRoutingStrategyRequest", contract)

    def test_console_routing_strategy_ui_has_retryable_business_states_without_console_only_errors(self) -> None:
        strategy = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "StrategyTab.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("BusinessStatePanel", strategy)
        self.assertIn("getStrategyErrorMessage", strategy)
        self.assertIn("loadingStrategy", strategy)
        self.assertIn("loadError", strategy)
        self.assertIn("saveError", strategy)
        self.assertIn("saveSuccess", strategy)
        self.assertIn("savingStrategy", strategy)
        self.assertIn("loadStrategy", strategy)
        self.assertIn("persistStrategy", strategy)
        self.assertIn("useCallback", strategy)
        self.assertIn("isActive: () => boolean", strategy)
        self.assertIn("return () =>", strategy)
        self.assertIn("await RoutingService.fetchStrategy()", strategy)
        self.assertIn("await RoutingService.updateStrategy", strategy)
        self.assertIn("setLoadError(getStrategyErrorMessage", strategy)
        self.assertIn("setSaveError(getStrategyErrorMessage", strategy)
        self.assertIn("onRetry={() => { void loadStrategy(); }}", strategy)
        self.assertIn("data-business-state={loadError ? 'error' : undefined}", strategy)
        self.assertNotIn("console.error", strategy)
        self.assertNotIn("RoutingService.fetchStrategy().then", strategy)

    def test_console_routing_strategy_rule_ids_are_deterministic_and_package_verified(self) -> None:
        package = json.loads(
            (
                ROOT
                / "apps"
                / "sdkwork-claw-router-portal"
                / "packages"
                / "sdkwork-claw-router-console-routing"
                / "package.json"
            ).read_text(encoding="utf-8")
        )
        strategy = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "StrategyTab.tsx"
        ).read_text(encoding="utf-8")
        strategy_rules = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "strategyRules.ts"
        ).read_text(encoding="utf-8")
        verifier = (ROOT / "scripts" / "verify-claw-router-product.mjs").read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertIn("createMappingRuleDraft", strategy)
        self.assertIn("from '../strategyRules'", strategy)
        self.assertNotIn("Date.now()", strategy)
        self.assertNotIn("Math.random()", strategy)
        self.assertIn("export function createMappingRuleDraft", strategy_rules)
        self.assertIn("nextMappingRuleId", strategy_rules)
        self.assertIn("GENERATED_RULE_ID_PATTERN", strategy_rules)
        self.assertNotIn("Date.now()", strategy_rules)
        self.assertNotIn("Math.random()", strategy_rules)
        self.assertIn("portal console routing runtime tests", verifier)
        self.assertIn("console-routing-runtime.test.ts", verifier)

    def test_console_routing_channel_commands_are_sdk_backed_and_not_local_state(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        channels = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ChannelsTab.tsx"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        for method in [
            "createChannel(input: RoutingChannelMutationInput): Promise<Channel>",
            "updateChannel(channelId: string, input: RoutingChannelUpdateInput): Promise<Channel>",
            "deleteChannel(channelId: string): Promise<boolean>",
            "setChannelStatus(channelId: string, status: ChannelStatus): Promise<Channel>",
            "testChannel(channelId: string): Promise<RoutingChannelTestResult>",
        ]:
            self.assertIn(method, service)

        for sdk_call in [
            "ai.routing.channels.create(",
            "ai.routing.channels.update(",
            "ai.routing.channels.delete(",
            "ai.routing.channels.status.update(",
            "ai.routing.channels.verify(",
        ]:
            self.assertIn(sdk_call, service)

        self.assertIn("type RoutingChannelMutationInput", service)
        self.assertIn("type RoutingChannelUpdateInput", service)
        self.assertIn("export interface RoutingChannelTestResult", service)
        self.assertIn("toCreateRoutingChannelRequest", service)
        self.assertIn("toUpdateRoutingChannelRequest", service)
        self.assertIn("isSecretRef", service)
        self.assertNotIn("crypto.randomUUID()", channels)
        self.assertNotIn("setChannels([copy, ...channels])", channels)
        self.assertNotIn("setChannels(channels.filter", channels)
        self.assertNotIn("setChannels(channels.map", channels)
        self.assertIn("await RoutingService.createChannel", channels)
        self.assertIn("await RoutingService.updateChannel", channels)
        self.assertIn("await RoutingService.deleteChannel", channels)
        self.assertIn("await RoutingService.setChannelStatus", channels)
        self.assertIn("await RoutingService.testChannel", channels)

        for operation in [
            "operation: createChannel",
            "operation: updateChannel",
            "operation: deleteChannel",
            "operation: setChannelStatus",
            "operation: testChannel",
        ]:
            self.assertIn(operation, contract)
        self.assertIn("api_path: /app/v3/api/ai/routing/channels/{channelId}", contract)
        self.assertIn("api_path: /app/v3/api/ai/routing/channels/{channelId}/status", contract)
        self.assertIn("api_path: /app/v3/api/ai/routing/channels/{channelId}/verify", contract)
        self.assertIn("name: CreateRoutingChannelRequest", contract)
        self.assertIn("name: UpdateRoutingChannelRequest", contract)
        self.assertIn("name: RoutingChannelMutationResponse", contract)
        self.assertIn("name: RoutingChannelTestResponse", contract)

    def test_console_routing_channel_mutations_use_pure_form_command_builders(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        form = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "channelForm.ts"
        )
        channels = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ChannelsTab.tsx"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn("export type RoutingChannelUpdateInput = {", service)
        self.assertNotIn("Partial<Omit<RoutingChannelMutationInput", service)
        self.assertTrue(form.exists())
        form_text = form.read_text(encoding="utf-8")
        self.assertIn("export type RoutingChannelFormValues", form_text)
        self.assertIn("createRoutingChannelInputFromForm", form_text)
        self.assertIn("createRoutingChannelUpdateInputFromForm", form_text)
        self.assertIn("normalizedTextArray", form_text)
        self.assertIn("formValidationError", form_text)
        self.assertIn("console.routing.validation.", form_text)
        self.assertNotIn("FormData", form_text)
        for hardcoded_form_error in [
            "protocol is required",
            "authType is required",
            "models must include at least one item",
            "Unsupported routing channel capability:",
            "retryPolicy.retryableStatusCodes is required when maxAttempts is greater than 1",
            "retryPolicy.retryableStatusCodes must contain integer HTTP statuses",
            "retryPolicy.retryableStatusCodes contains unsupported status:",
            "Unsupported routing channel status:",
            "Routing channel status is required",
        ]:
            self.assertNotIn(hardcoded_form_error, form_text)

        self.assertIn("createRoutingChannelInputFromForm", channels)
        self.assertIn("createRoutingChannelUpdateInputFromForm", channels)
        self.assertIn("type RoutingChannelFormValues", channels)
        self.assertIn("onAdd: (input: RoutingChannelFormValues) => Promise<void>", channels)
        self.assertIn("const input: RoutingChannelFormValues = {", channels)
        self.assertIn("RoutingService.updateChannel(editingChannel.id, createRoutingChannelUpdateInputFromForm(input))", channels)
        self.assertIn("RoutingService.createChannel(createRoutingChannelInputFromForm(input))", channels)
        self.assertNotIn("type ChannelFormInput = RoutingChannelMutationInput | RoutingChannelUpdateInput", channels)
        self.assertNotIn("input as RoutingChannelUpdateInput", channels)
        self.assertNotIn("input as RoutingChannelMutationInput", channels)
        self.assertNotIn("Partial<Omit<RoutingChannelMutationInput", channels)

        self.assertIn("interface: RoutingChannelUpdateInput", contract)
        self.assertIn("fields: [name, vendor, protocol, accessType, baseUrl, secretRef, models, capabilities, weight, status]", contract)

    def test_console_routing_channel_ui_has_guarded_commands_and_visible_failures(self) -> None:
        channels = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ChannelsTab.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("useCallback", channels)
        self.assertIn("getChannelErrorMessage", channels)
        self.assertIn("isActive: () => boolean", channels)
        self.assertIn("return () =>", channels)
        self.assertIn("await RoutingService.fetchChannels()", channels)
        self.assertIn("setLoadError(getChannelErrorMessage", channels)
        self.assertIn("onRetry={() => { void loadChannels(); }}", channels)
        self.assertIn("submittingChannel", channels)
        self.assertIn("submitError", channels)
        self.assertIn("setSubmitError(getChannelErrorMessage", channels)
        self.assertIn("disabled={submitting}", channels)
        self.assertIn("aria-busy={submitting}", channels)
        self.assertIn("commandChannelIds", channels)
        self.assertIn("beginChannelCommand", channels)
        self.assertIn("endChannelCommand", channels)
        self.assertIn("isChannelCommanding(c.id)", channels)
        self.assertIn("disabled={isChannelCommanding(c.id)}", channels)
        self.assertIn("void handleTestChannel(c);", channels)
        self.assertIn("void handleToggleChannelStatus(c);", channels)
        self.assertIn("void handleDeleteChannel(c);", channels)
        self.assertNotIn("console.error", channels)
        self.assertNotIn("onAdd({", channels)

    def test_console_routing_api_key_tab_is_read_only_until_command_contract_exists(self) -> None:
        api_keys = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ApiKeysTab.tsx"
        ).read_text(encoding="utf-8")
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn("RoutingService.fetchApiKeys()", api_keys)
        self.assertIn("CopyButton", api_keys)
        self.assertNotIn("readOnlyApiKeyActions", api_keys)
        self.assertNotIn("Read-only", api_keys)
        self.assertNotIn("read-only", api_keys)
        self.assertNotIn("command contract", api_keys)
        self.assertNotIn("<Plus", api_keys)
        self.assertNotIn("<Edit3", api_keys)
        self.assertNotIn("<Power", api_keys)
        self.assertNotIn("<RefreshCw", api_keys)
        self.assertNotIn("<Trash2", api_keys)
        self.assertNotIn("RoutingService.createApiKey", api_keys)
        self.assertNotIn("RoutingService.deleteApiKey", api_keys)
        self.assertNotIn("RoutingService.setApiKeyStatus", api_keys)
        self.assertNotIn("static async createApiKey", service)
        self.assertNotIn("static async deleteApiKey", service)
        self.assertNotIn("static async setApiKeyStatus", service)
        self.assertIn("operation: fetchApiKeys", contract)
        self.assertNotIn("operation: createRoutingApiKey", contract)
        self.assertNotIn("operation: deleteRoutingApiKey", contract)
        self.assertNotIn("operation: setRoutingApiKeyStatus", contract)

    def test_console_routing_product_states_are_localized(self) -> None:
        source_paths = [
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ApiKeysTab.tsx",
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "ChannelsTab.tsx",
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "StrategyTab.tsx",
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "RequestDataTab.tsx",
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "components"
            / "FallbackTab.tsx",
        ]
        combined = "\n".join(path.read_text(encoding="utf-8") for path in source_paths)
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-routing"
            / "src"
            / "routingService.ts"
        ).read_text(encoding="utf-8")
        i18n = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-i18n"
            / "src"
            / "index.ts"
        ).read_text(encoding="utf-8")

        for marker in [
            "console.routing.states.apiKeys.loading",
            "console.routing.states.apiKeys.loadErrorTitle",
            "console.routing.states.apiKeys.loadErrorFallback",
            "console.routing.states.apiKeys.emptyTitle",
            "console.routing.states.apiKeys.emptyDescription",
            "console.routing.states.channels.loading",
            "console.routing.states.channels.loadErrorTitle",
            "console.routing.states.channels.loadErrorFallback",
            "console.routing.states.channels.emptyTitle",
            "console.routing.states.channels.emptyNoDataDescription",
            "console.routing.states.channels.emptySearchDescription",
            "console.routing.states.strategy.loading",
            "console.routing.states.strategy.loadErrorTitle",
            "console.routing.states.strategy.loadErrorFallback",
            "console.routing.states.strategy.saveErrorFallback",
            "console.routing.states.strategy.saved",
            "console.routing.status.active",
            "console.routing.status.disabled",
            "console.routing.messages.channelSaveFailed",
            "console.routing.messages.channelTestPassed",
            "console.routing.messages.channelTestFailed",
            "console.routing.messages.channelDisabled",
            "console.routing.messages.channelEnabled",
            "console.routing.messages.channelStatusUpdateFailed",
            "console.routing.messages.channelDeleted",
            "console.routing.messages.channelDeleteFailed",
            "console.routing.table.timeoutDefault",
            "console.routing.table.retryCount",
            "console.routing.components.channelstab.baseUrl",
            "console.routing.components.channelstab.timeoutMs",
            "console.routing.components.channelstab.retryPolicy",
            "console.routing.components.channelstab.retryMaxAttempts",
            "console.routing.components.channelstab.retryHttpStatuses",
            "console.routing.components.channelstab.retryBackoffMs",
            "console.routing.components.requestdatatab.title",
            "console.routing.components.requestdatatab.description",
            "console.routing.components.requestdatatab.searchPlaceholder",
            "console.routing.components.requestdatatab.headers.request",
            "console.routing.components.requestdatatab.headers.model",
            "console.routing.components.requestdatatab.headers.channel",
            "console.routing.components.requestdatatab.headers.status",
            "console.routing.components.requestdatatab.headers.latency",
            "console.routing.components.requestdatatab.headers.tokens",
            "console.routing.components.requestdatatab.headers.details",
            "console.routing.components.requestdatatab.requestAudit",
            "console.routing.components.requestdatatab.responseAudit",
            "console.routing.components.fallbacktab.title",
            "console.routing.components.fallbacktab.description",
            "console.routing.components.fallbacktab.channelRetryTitle",
            "console.routing.components.fallbacktab.channelRetryDescription",
            "console.routing.components.fallbacktab.runtimeProtectionTitle",
            "console.routing.components.fallbacktab.runtimeProtectionDescription",
            "console.routing.components.fallbacktab.emptyPolicy",
            "console.routing.fields.authType",
            "console.routing.fields.protocol",
            "console.routing.fields.retryBackoffMs",
            "console.routing.fields.retryMaxAttempts",
            "console.routing.validation.authTypeRequired",
            "console.routing.validation.modelsRequired",
            "console.routing.validation.protocolRequired",
            "console.routing.validation.retryBackoffMsInteger",
            "console.routing.validation.retryBackoffMsRange",
            "console.routing.validation.retryMaxAttemptsInteger",
            "console.routing.validation.retryMaxAttemptsPositiveInteger",
            "console.routing.validation.retryMaxAttemptsRange",
            "console.routing.validation.retryStatusesInteger",
            "console.routing.validation.retryStatusesRequiredForRetries",
            "console.routing.validation.retryStatusUnsupported",
            "console.routing.validation.statusRequired",
            "console.routing.validation.statusUnsupported",
            "console.routing.validation.timeoutMsInteger",
            "console.routing.validation.timeoutMsRange",
            "console.routing.validation.unsupportedCapability",
            "console.routing.validation.weightInteger",
            "console.routing.validation.weightPositiveInteger",
            "console.routing.validation.weightRange",
        ]:
            self.assertIn(marker, combined + service + i18n)
            self.assertGreaterEqual(i18n.count(f'"{marker}"'), 2)

        for hardcoded_copy in [
            "Loading routing API keys...",
            "Routing API keys could not be loaded",
            "No routing API keys yet",
            "No routing API keys are available yet.",
            "Failed to load routing API keys",
            "Loading routing channels...",
            "Routing channels could not be loaded",
            "No routing channels found",
            "Create a routing channel to start sending model traffic through the gateway.",
            "Failed to load routing channels",
            "Channel save failed",
            "Channel test passed",
            "Channel test failed",
            "Channel disabled",
            "Channel enabled",
            "Channel deleted",
            "Loading routing strategy...",
            "Routing strategy could not be loaded",
            "Routing strategy saved.",
            "Failed to load routing strategy.",
            "Failed to save routing strategy.",
            "Request data audit",
            "Search request id or trace id...",
            "Request Audit",
            "Response Audit",
            "Base URL <",
            "Timeout ms",
            "Retry policy",
            "Max attempts",
            "HTTP statuses",
            "Backoff ms",
            "Fallback & Circuit Breaker",
            "Channel-level timeout and retry controls are configured on each routing channel.",
            "Channel-level retry",
            "Configure max attempts, retryable HTTP statuses, backoff, and provider timeout from the channel add/edit dialog.",
            "Runtime protection",
            "Health checks and channel status controls are active today. Global circuit-breaker controls will appear here when they are available.",
            "No global fallback policy is available yet.",
            "return status === 'enabled' ? 'Active' : 'Disabled';",
        ]:
            self.assertNotIn(hardcoded_copy, combined)
            self.assertNotIn(hardcoded_copy, service)

    def test_console_routing_backend_read_models_reject_invalid_capabilities_json(self) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_channel_command_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_channel_command_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            with self.subTest(store=relative_path):
                self.assertIn("invalid routing channel capabilities json from database row", store)
                self.assertNotIn("serde_json::from_str(value).unwrap_or_default()", store)

    def test_console_routing_backend_read_models_reject_missing_channel_status_codes(
        self,
    ) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_channel_command_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_channel_command_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative_path):
                self.assertNotIn("COALESCE(c.status, 1) AS status", store)
                self.assertNotIn("COALESCE(c.health_status, 1) AS health_status", store)
                self.assertNotIn(
                    'status: status_label( integer_cell(&row, "status"), '
                    'integer_cell(&row, "health_status"), errors, )',
                    compact_store,
                )
                self.assertIn('required_integer_cell(&row, "status")?', compact_store)
                self.assertIn('required_integer_cell(&row, "health_status")?', compact_store)
                self.assertIn("missing routing channel {column} from database row", store)
                self.assertIn("invalid routing channel status from database row", store)
                self.assertIn("invalid routing channel health_status from database row", store)

    def test_console_routing_channel_read_models_reject_missing_protocol_and_access_type(
        self,
    ) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_channel_command_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_channel_command_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative_path):
                self.assertNotIn("COALESCE(c.protocol, 1) AS protocol", store)
                self.assertNotIn("COALESCE(c.access_type, 1) AS access_type", store)
                self.assertIn("c.protocol AS protocol", store)
                self.assertIn("c.access_type AS access_type", store)
                self.assertIn(
                    'protocol: protocol_label(required_integer_cell(&row, "protocol")?)?',
                    compact_store,
                )
                self.assertIn(
                    'access_type: access_type_label(required_integer_cell(&row, "access_type")?)?',
                    compact_store,
                )
                self.assertIn(
                    "fn protocol_label(value: i64) -> DomainResult<String>",
                    compact_store,
                )
                self.assertIn(
                    "fn access_type_label(value: i64) -> DomainResult<String>",
                    compact_store,
                )
                self.assertIn("missing routing channel {column} from database row", store)
                self.assertIn("invalid routing channel protocol from database row", store)
                self.assertIn("invalid routing channel access_type from database row", store)

    def test_console_routing_backend_api_key_statuses_fail_closed(self) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative_path):
                self.assertIn("k.status AS api_key_status", store)
                self.assertIn(
                    "rows.into_iter().map(row_to_api_key).collect()",
                    compact_store,
                )
                self.assertIn(
                    'status: api_key_status_label(required_integer_cell(&row, "api_key_status")?)?',
                    compact_store,
                )
                self.assertIn("missing routing api key status from database row", store)
                self.assertIn("invalid routing api key status from database row", store)
                self.assertNotIn("COALESCE(k.status, 0) AS status", store)
                self.assertNotIn(
                    'status: api_key_status_label(integer_cell(&row, "status"))',
                    store,
                )

    def test_console_routing_backend_read_models_reject_missing_trace_status_and_latency(
        self,
    ) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative_path):
                self.assertNotIn("COALESCE(t.http_status, 0) AS http_status", store)
                self.assertNotIn("COALESCE(t.latency_ms, 0) AS latency_ms", store)
                self.assertIn("t.http_status AS http_status", store)
                self.assertIn("t.latency_ms AS latency_ms", store)
                self.assertNotIn(
                    'duration: duration_label(integer_cell(&row, "latency_ms"))',
                    compact_store,
                )
                self.assertIn(
                    'routing_trace_http_status(required_integer_cell(&row, "http_status")?)?',
                    compact_store,
                )
                self.assertIn(
                    'routing_trace_latency_ms(required_integer_cell(&row, "latency_ms")?)?',
                    compact_store,
                )
                self.assertIn("missing routing trace http_status from database row", store)
                self.assertIn("missing routing trace latency_ms from database row", store)
                self.assertIn("invalid routing trace http_status from database row", store)
                self.assertIn("invalid routing trace latency_ms from database row", store)

    def test_console_routing_usage_averages_only_recorded_latency_values(self) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_routing_read_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_routing_read_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            with self.subTest(store=relative_path):
                self.assertNotIn("AVG(COALESCE(latency_ms, 0))", store)
                self.assertNotIn("AVG(COALESCE(t.latency_ms, 0))", store)
                self.assertIn("AVG(latency_ms)", store)
                self.assertIn("AVG(t.latency_ms)", store)


if __name__ == "__main__":
    unittest.main()
