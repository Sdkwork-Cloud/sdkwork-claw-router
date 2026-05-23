import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function readWorkspaceFile(relativePath: string): string {
  return readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
}

test("chat playground does not render a duplicate header inside the conversation area", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatPage.tsx");

  assert.doesNotMatch(source, /playground\.chat\.title/);
  assert.doesNotMatch(source, /playground\.chat\.subtitle/);
  assert.doesNotMatch(source, /absolute\s+inset-x-0\s+top-0\s+z-10/);
});

test("chat message list starts below the page chrome without reserving space for an inner header", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatMessageList.tsx");

  assert.doesNotMatch(source, /pt-24/);
  assert.match(source, /px-4 pt-6 md:px-8/);
});

test("chat playground persists conversations through the app Chat SDK instead of provider completions", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/chatService.ts");
  const operationsSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/appRuntimeApiOperations.ts");

  assert.match(source, /from '\.\.\/\.\.\/appRuntimeApiOperations\.ts'/);
  assert.match(source, /listChatConversations/);
  assert.match(source, /listChatMessages/);
  assert.match(source, /createChatConversation/);
  assert.match(source, /createChatTurn/);
  assert.match(source, /createRuntimeInvocation/);
  assert.match(source, /completeRuntimeInvocation/);
  assert.match(source, /completeChatTurnResponse/);
  assert.doesNotMatch(source, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(source, /getClawRouterAiSdkClient/);
  assert.doesNotMatch(source, /chat\.completions/);
  assert.doesNotMatch(source, /client\.chat\./);
  assert.doesNotMatch(source, /client\.runtime\./);
  assert.match(operationsSource, /getClawRouterAppSdkClient/);
  assert.match(operationsSource, /client\.chat\.conversations\.list/);
  assert.match(operationsSource, /client\.chat\.conversationMessages\.list/);
  assert.match(operationsSource, /client\.chat\.turns\.create/);
  assert.match(operationsSource, /client\.chat\.turnResponses\.create/);
  assert.match(operationsSource, /client\.runtime\.invocations\.create/);
});

test("chat playground consumes standard runtime SSE events for streaming interaction", () => {
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/chatService.ts");
  const operationsSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/appRuntimeApiOperations.ts");
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatPage.tsx");
  const runtimeStreamSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/runtimeStream.ts");
  const commonsRuntimeSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/runtime.ts");

  assert.match(serviceSource, /streamRuntimeEvents\(runtimeInvocation\.id\)/);
  assert.match(operationsSource, /streamRuntimeInvocationEvents/);
  assert.match(runtimeStreamSource, /sdkwork-claw-router-commons\/runtime/);
  assert.match(commonsRuntimeSource, /\.http\.streamJson/);
  assert.match(commonsRuntimeSource, /\/runtime\/invocations\/\$\{encodeURIComponent\(invocationId\)\}\/events\/stream/);
  assert.match(commonsRuntimeSource, /readRuntimePayloadTextDelta/);
  assert.match(commonsRuntimeSource, /isRuntimeTextDeltaEvent/);
  assert.match(commonsRuntimeSource, /eventType\.endsWith\('\.delta'\)/);
  assert.match(commonsRuntimeSource, /choices/);
  assert.match(commonsRuntimeSource, /outputText/);
  assert.match(serviceSource, /onDelta\?:/);
  assert.match(serviceSource, /readRuntimeTextDelta/);
  assert.match(pageSource, /onDelta:/);
  assert.match(pageSource, /status:\s*'responding'/);
});

test("runtime SSE event type comes directly from the generated app SDK contract", () => {
  const commonsRuntimeSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/runtime.ts");
  const runtimeEventItemSource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/runtime-event-item.ts");

  assert.match(runtimeEventItemSource, /payloadJson: Record<string, JsonValue>;/);
  assert.match(commonsRuntimeSource, /export type RuntimeStreamEvent = RuntimeEventItem;/);
  assert.doesNotMatch(commonsRuntimeSource, /RuntimeEventItem\s*&/);
  assert.doesNotMatch(commonsRuntimeSource, /payloadJson\?:/);
  assert.match(commonsRuntimeSource, /readRuntimePayloadTextDelta\(event\.payloadJson\)/);
});

test("chat playground keeps failed SSE turns visible instead of rolling back the conversation", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatPage.tsx");

  assert.doesNotMatch(pageSource, /setMessages\(priorMessages\)/);
  assert.match(pageSource, /message\.id === pendingAssistant\.id/);
  assert.match(pageSource, /status:\s*'failed'/);
  assert.match(pageSource, /streamedAssistantContent \|\| errorMessage/);
  assert.match(pageSource, /item\.content \|\| streamedAssistantContent \|\| errorMessage/);
});

test("chat playground closes failed SSE runs with both Runtime and Chat turn terminal records", () => {
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/chatService.ts");
  const operationsSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/appRuntimeApiOperations.ts");

  assert.match(serviceSource, /async function failTurnResponse/);
  assert.match(serviceSource, /await failRuntimeInvocation\(runtimeInvocation\.id, failure\)/);
  assert.match(serviceSource, /await failTurnResponse\(\{/);
  assert.match(serviceSource, /completeRuntimeInvocationOperation/);
  assert.match(serviceSource, /completeChatTurnResponse/);
  assert.doesNotMatch(serviceSource, /client\.chat\.turnResponses\.create/);
  assert.match(operationsSource, /client\.chat\.turnResponses\.create/);
  assert.match(serviceSource, /status:\s*'failed'/);
  assert.match(serviceSource, /runtimeInvocationId:\s*invocation\.id/);
  assert.match(serviceSource, /errorCode:\s*failure\.errorCode/);
  assert.match(serviceSource, /idempotencyPrefix:\s*'chat-turn-response-failed'/);
});

test("chat message bubble renders streamed assistant deltas while still responding", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatMessageBubble.tsx");

  assert.doesNotMatch(source, /const blocks = isPending \? \[\] : splitMessageBlocks\(message\.content\)/);
  assert.match(source, /const showTypingIndicator = isPending && message\.content\.trim\(\)\.length === 0;/);
  assert.match(source, /const blocks = splitMessageBlocks\(message\.content\);/);
  assert.match(source, /showTypingIndicator \?/);
});

test("playground SSE runtime errors are translated before display", () => {
  const playgroundSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");

  assert.match(playgroundSource, /error\.message\.startsWith\('playground\.'\)/);
  assert.match(playgroundSource, /t\(error\.message\)/);
  assert.match(i18nSource, /"playground\.agent\.errors\.runtimeUnavailable"/);
  assert.match(i18nSource, /"playground\.chat\.errors\.runtimeUnavailable"/);
});

test("agent playground uses standard Agent and Runtime SDK resources with SSE interaction", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundGenerationService.ts");
  const operationsSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/appRuntimeApiOperations.ts");
  const facadeSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundService.ts");
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const itemSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/ChatHistoryItem.tsx");
  const runtimeStreamSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/runtimeStream.ts");
  const commonsRuntimeSource = readPortalFile("./packages/sdkwork-claw-router-commons/src/runtime.ts");

  assert.match(source, /from '\.\/appRuntimeApiOperations\.ts'/);
  assert.match(source, /listAgentDefinitions/);
  assert.match(source, /createAgentDefinition/);
  assert.match(source, /createAgentSession/);
  assert.match(source, /createAgentRun/);
  assert.match(source, /createAgentRunStep/);
  assert.match(source, /createRuntimeInvocation/);
  assert.match(source, /streamRuntimeEvents/);
  assert.match(source, /completeRuntimeInvocation/);
  assert.match(source, /completeAgentRunStep/);
  assert.match(source, /completeAgentRun/);
  assert.doesNotMatch(source, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(source, /ai\.generation\.agent\.runs\.create/);
  assert.doesNotMatch(source, /client\.agents\./);
  assert.doesNotMatch(source, /client\.runtime\./);
  assert.match(facadeSource, /from '@sdkwork\/generation-pc-react\/generation-service'/);
  assert.match(facadeSource, /createSdkworkGenerationService/);
  assert.match(facadeSource, /includeSampleRuns:\s*false/);
  assert.doesNotMatch(facadeSource, /await import\('@sdkwork\/generation-pc-react'\)/);
  assert.doesNotMatch(facadeSource, /loadSdkworkGenerationServiceFactory/);
  assert.doesNotMatch(facadeSource, /createFallbackSdkworkGenerationService/);
  assert.doesNotMatch(facadeSource, /runs\.length === 0 && workspace\.runs\.length > 0/);
  assert.match(operationsSource, /client\.agents\.agentDefinitions\.list/);
  assert.match(operationsSource, /client\.agents\.agentSessions\.create/);
  assert.match(operationsSource, /client\.agents\.agentRuns\.create/);
  assert.match(operationsSource, /client\.agents\.agentRunSteps\.create/);
  assert.match(operationsSource, /client\.agents\.agentRunSteps\.submit/);
  assert.match(operationsSource, /client\.runtime\.invocations\.create/);
  assert.match(operationsSource, /streamRuntimeInvocationEvents/);
  assert.match(runtimeStreamSource, /sdkwork-claw-router-commons\/runtime/);
  assert.match(commonsRuntimeSource, /\.http\.streamJson/);
  assert.match(commonsRuntimeSource, /\/runtime\/invocations\/\$\{encodeURIComponent\(invocationId\)\}\/events\/stream/);
  assert.match(source, /onDelta\?\.\(textDelta\)/);
  assert.match(facadeSource, /runPlaygroundGeneration\(input\)/);
  assert.match(pageSource, /onDelta:\s*\(delta\)/);
  assert.match(pageSource, /outputText:\s*`\$\{item\.outputText \|\| ''\}\$\{delta\}`/);
  assert.match(itemSource, /item\.outputText/);
});

test("playground generation orchestration is reusable across agent and modality panels", () => {
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundService.ts");
  const generationServiceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundGenerationService.ts");
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");

  assert.match(serviceSource, /runPlaygroundGeneration/);
  assert.match(generationServiceSource, /export async function runPlaygroundGeneration/);
  assert.match(generationServiceSource, /streamRuntimeEvents/);
  assert.match(generationServiceSource, /readRuntimeTextDelta/);
  assert.match(generationServiceSource, /payloadJson/);
  assert.match(generationServiceSource, /media_generation/);
  assert.match(generationServiceSource, /appRuntimeApiOperations/);
  assert.doesNotMatch(generationServiceSource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(generationServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(generationServiceSource, /new EventSource/);
  assert.doesNotMatch(generationServiceSource, /axios/);
  assert.match(pageSource, /PlaygroundService\.runAgentGeneration/);
  assert.doesNotMatch(pageSource, /runPlaygroundGeneration/);
  assert.doesNotMatch(pageSource, /playgroundGenerationService/);
  assert.match(pageSource, /onArtifact:\s*\(artifact\)/);
  assert.match(pageSource, /appendSdkworkGenerationArtifactToHistoryItem/);
});

test("chat playground reloads conversation state when the selected API key changes", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatPage.tsx");

  assert.match(pageSource, /const chatStoreScope = selectedApiKeyId \|\| CHAT_LOCAL_SESSION_SCOPE;/);
  assert.match(pageSource, /loadStoredChatMessages\(chatStoreScope, selectedSessionId\)/);
  assert.match(pageSource, /mergeChatSessions\(chatStoreScope, \[\], \{\}\)/);
  assert.match(pageSource, /mergeChatSessions\(chatStoreScope, items, localConversation\.messagesBySessionId\)/);
  assert.match(pageSource, /saveStoredChatConversation\(chatStoreScope, sessionsRef\.current, next\)/);
  assert.match(pageSource, /\[clearNewChatDraft, resetActiveConversationView, selectedApiKeyId, t\]/);
});

test("asset view maps history items from real history fields", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/AssetView.tsx");

  assert.doesNotMatch(source, /item\.(thumbnail|previewUrl|duration|timestamp|size)\b/);
  assert.match(source, /item\.images/);
  assert.match(source, /item\.videos/);
  assert.match(source, /item\.url/);
  assert.match(source, /item\.durationSeconds/);
  assert.match(source, /item\.createdAt/);
  assert.match(source, /item\.updatedAt/);
  assert.match(source, /item\.id/);
  assert.match(source, /agentHistory\.find\(\(item\) => item\.id === asset\.id\)/);
});

test("asset gallery applies the chosen sort order before rendering", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/AssetGalleryView.tsx");

  assert.match(source, /const sortedAssets = useMemo\(/);
  assert.match(source, /sortBy === 'date'/);
  assert.match(source, /sortBy === 'name'/);
  assert.match(source, /\.sort\(/);
  assert.doesNotMatch(source, /onClick=\{\(\) => \{\}\}/);
});

test("asset gallery hides unavailable batch actions instead of rendering dead controls", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/AssetGalleryView.tsx");

  assert.match(source, /\{onDelete && \(/);
  assert.match(source, /\{onExport && \(/);
  assert.doesNotMatch(source, /onDelete\?\./);
  assert.doesNotMatch(source, /onExport\?\./);
});

test("generation mode popups reuse appbase popup and mode config primitives", () => {
  const imageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/ImageGenerationModePopup.tsx");
  const videoSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/VideoGenerationModePopup.tsx");
  const baseSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/GenerationModePopupBase.tsx");

  assert.match(baseSource, /@sdkwork\/generation-pc-react\/react/);
  assert.doesNotMatch(baseSource, /useState/);
  assert.doesNotMatch(baseSource, /document\.addEventListener/);
  assert.doesNotMatch(baseSource, /function ConfigSectionRenderer/);
  assert.match(imageSource, /SdkworkGenerationImageModeConfig/);
  assert.match(imageSource, /DEFAULT_SDKWORK_GENERATION_IMAGE_MODE_CONFIG/);
  assert.match(videoSource, /SdkworkGenerationVideoModeConfig/);
  assert.match(videoSource, /DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG/);
  assert.doesNotMatch(imageSource, /as ImageGenerationConfig/);
  assert.doesNotMatch(videoSource, /as VideoGenerationConfig/);
});

test("asset generation panel serializes appbase asset config for runtime payloads", () => {
  const panelSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/AssetGenerationPanel.tsx");
  const typeSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundTypes.ts");

  assert.match(panelSource, /@sdkwork\/generation-pc-react\/react/);
  assert.match(panelSource, /createDefaultSdkworkGenerationAssetConfig/);
  assert.match(panelSource, /reconcileSdkworkGenerationAssetConfig/);
  assert.match(panelSource, /serializeSdkworkGenerationAssetConfig\(config, modality\)/);
  assert.match(panelSource, /updateSdkworkGenerationImageModeConfig/);
  assert.match(panelSource, /updateSdkworkGenerationVideoModeConfig/);
  assert.doesNotMatch(panelSource, /videoGenerationConfig/);
  assert.doesNotMatch(panelSource, /imageGenerationConfig/);
  assert.doesNotMatch(panelSource, /function createGenerationConfig/);
  assert.match(typeSource, /SdkworkGenerationSerializedAssetConfig/);
});

test("playground generation DTOs alias appbase history and artifact primitives", () => {
  const typeSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundTypes.ts");

  assert.match(typeSource, /SdkworkGenerationArtifact/);
  assert.match(typeSource, /SdkworkGenerationHistoryItem/);
  assert.match(typeSource, /SdkworkGenerationMedia/);
  assert.match(typeSource, /SdkworkGenerationModelBucket/);
  assert.match(typeSource, /export type PlaygroundGenerationArtifact = SdkworkGenerationArtifact/);
  assert.match(typeSource, /export type PlaygroundHistoryItem = SdkworkGenerationHistoryItem/);
  assert.match(typeSource, /export type PlaygroundMedia = SdkworkGenerationMedia/);
  assert.match(typeSource, /export type PlaygroundModelBucket = SdkworkGenerationModelBucket/);
  assert.doesNotMatch(typeSource, /export interface PlaygroundGenerationArtifact/);
  assert.doesNotMatch(typeSource, /export interface PlaygroundHistoryItem/);
  assert.doesNotMatch(typeSource, /export type PlaygroundMedia = string \|/);
  assert.doesNotMatch(typeSource, /export type PlaygroundModelBucket = 'llms'/);
});

test("asset generation panel delegates planning and credit estimation to appbase", () => {
  const panelSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/AssetGenerationPanel.tsx");
  const appbaseSource = readWorkspaceFile("../sdkwork-appbase/packages/pc-react/content/sdkwork-generation-pc-react/src/generation-asset-config.ts");

  assert.match(panelSource, /estimateSdkworkGenerationCredits/);
  assert.match(panelSource, /findFirstSdkworkGenerationModelForModality/);
  assert.match(panelSource, /findSdkworkGenerationModelById/);
  assert.match(panelSource, /getSdkworkGenerationDurationOptions/);
  assert.doesNotMatch(panelSource, /function estimatePlaygroundGenerationCredits/);
  assert.doesNotMatch(panelSource, /function selectReferencePrice/);
  assert.doesNotMatch(panelSource, /function estimateMeterQuantity/);
  assert.doesNotMatch(panelSource, /function metersForModality/);
  assert.doesNotMatch(panelSource, /function durationOptionsForModality/);
  assert.match(appbaseSource, /export function estimateSdkworkGenerationCredits/);
  assert.match(appbaseSource, /export function getSdkworkGenerationDurationOptions/);
});

test("playground model bucket routing reuses appbase asset modality mapping", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const inputSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/GenerationChatInput.tsx");

  assert.match(pageSource, /getSdkworkGenerationModelBucket/);
  assert.match(inputSource, /getSdkworkGenerationModelBucket/);
  assert.doesNotMatch(pageSource, /case 'image':\s*return 'images'/);
  assert.doesNotMatch(pageSource, /case 'video':\s*return 'videos'/);
  assert.doesNotMatch(pageSource, /case 'audio':\s*return 'audios'/);
  assert.doesNotMatch(inputSource, /case 'image':\s*return 'images'/);
  assert.doesNotMatch(inputSource, /case 'video':\s*return 'videos'/);
  assert.doesNotMatch(inputSource, /case 'audio':\s*return 'audios'/);
});

test("agent generation input sends appbase default config for selected asset modalities", () => {
  const inputSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/GenerationChatInput.tsx");
  const agentViewSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/AgentView.tsx");

  assert.match(inputSource, /@sdkwork\/generation-pc-react\/react/);
  assert.match(inputSource, /createDefaultSdkworkGenerationAssetConfig/);
  assert.match(inputSource, /serializeSdkworkGenerationAssetConfig/);
  assert.match(inputSource, /isPlaygroundGenerationTargetType\(selectedModality\)/);
  assert.match(inputSource, /const generationConfig = isPlaygroundGenerationTargetType\(selectedModality\)/);
  assert.match(inputSource, /serializeSdkworkGenerationAssetConfig\(/);
  assert.match(inputSource, /generationConfig,/);
  assert.doesNotMatch(inputSource, /playground\.parameters/);
  assert.doesNotMatch(inputSource, /<Type\b/);
  assert.match(agentViewSource, /PlaygroundGenerationSubmitInput/);
});

test("playground regeneration preserves appbase generation config from history items", () => {
  const typeSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundTypes.ts");
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const generationServiceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundGenerationService.ts");

  assert.match(typeSource, /generationConfig\?: PlaygroundGenerationConfig;/);
  assert.match(pageSource, /@sdkwork\/generation-pc-react\/react/);
  assert.match(pageSource, /restoreSdkworkGenerationSerializedConfigFromHistoryItem/);
  assert.match(pageSource, /createSdkworkGenerationPendingHistoryItem\(\{[\s\S]*generationConfig,/);
  assert.match(pageSource, /generationConfig,\s*referenceImages,/);
  assert.match(pageSource, /generationConfig:\s*readRegenerationGenerationConfig\(previewItem\)/);
  assert.doesNotMatch(pageSource, /const generationConfig: PlaygroundGenerationConfig = \{\}/);
  assert.match(generationServiceSource, /generationConfig,\s*model,/);
  assert.match(generationServiceSource, /generationConfig:\s*generationConfig/);
});

test("playground history and preview mapping reuse appbase generation history helpers", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const historyMapperSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/historyMapper.ts");
  const generationServiceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundGenerationService.ts");
  const appbaseSource = readWorkspaceFile("../sdkwork-appbase/packages/pc-react/content/sdkwork-generation-pc-react/src/generation-history.ts");

  assert.match(pageSource, /appendSdkworkGenerationArtifactToHistoryItem/);
  assert.match(pageSource, /createSdkworkGenerationPendingHistoryItem/);
  assert.match(pageSource, /getSdkworkGenerationPreviewKind/);
  assert.match(pageSource, /mapSdkworkGenerationHistoryTypeToModality/);
  assert.match(pageSource, /restoreSdkworkGenerationSerializedConfigFromHistoryItem/);
  assert.doesNotMatch(pageSource, /function appendArtifactToHistoryItem/);
  assert.doesNotMatch(pageSource, /function createPendingGenerationHistoryItem/);
  assert.doesNotMatch(pageSource, /function generationTargetFromHistoryType/);
  assert.doesNotMatch(pageSource, /function getPreviewKind/);

  assert.match(historyMapperSource, /normalizeSdkworkGenerationHistoryType/);
  assert.doesNotMatch(historyMapperSource, /function readHistoryType/);

  assert.match(generationServiceSource, /mapSdkworkGenerationArtifactsToHistoryMedia/);
  assert.match(generationServiceSource, /mapSdkworkGenerationModalityToHistoryType/);
  assert.doesNotMatch(generationServiceSource, /function mapArtifactsToHistoryMedia/);
  assert.doesNotMatch(generationServiceSource, /function mapHistoryType/);

  assert.match(appbaseSource, /export function appendSdkworkGenerationArtifactToHistoryItem/);
  assert.match(appbaseSource, /export function restoreSdkworkGenerationSerializedConfigFromHistoryItem/);
});

test("playground asset history views reuse appbase history media helpers", () => {
  const assetViewSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/AssetView.tsx");
  const sharedHistorySource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/views/SharedHistoryView.tsx");
  const chatHistorySource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/ChatHistoryItem.tsx");
  const messageItemsSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/MessageItems.tsx");

  assert.match(assetViewSource, /isSdkworkGenerationImageHistoryType/);
  assert.match(assetViewSource, /readSdkworkGenerationMediaUrl/);
  assert.match(assetViewSource, /readSdkworkGenerationMediaThumb/);
  assert.doesNotMatch(assetViewSource, /function readMediaUrl/);
  assert.doesNotMatch(assetViewSource, /function readMediaThumb/);
  assert.doesNotMatch(assetViewSource, /item\.type === 'image' \|\| item\.type === 'images'/);

  assert.match(sharedHistorySource, /isSdkworkGenerationImageHistoryType/);
  assert.doesNotMatch(sharedHistorySource, /item\.type === 'images' \|\| item\.type === 'image'/);

  assert.match(chatHistorySource, /getSdkworkGenerationPreviewKind/);
  assert.doesNotMatch(chatHistorySource, /item\.type === 'images' \|\| item\.type === 'image'/);

  assert.match(messageItemsSource, /readSdkworkGenerationMediaThumb/);
  assert.doesNotMatch(messageItemsSource, /typeof vid === 'string' \? vid : vid\.thumb \|\| vid\.url/);
});

test("app OpenAPI and SDK expose AgentRunStep terminal submit", () => {
  const openapi = JSON.parse(readWorkspaceFile("generated/openapi/clawrouter-app-openapi.json"));
  const agentSdkSource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/agents.ts");

  assert(openapi.paths["/app/v3/api/agents/runs/{runId}/steps/{stepId}/complete"]);
  assert.equal(
    openapi.paths["/app/v3/api/agents/runs/{runId}/steps/{stepId}/complete"].post.operationId,
    "agentRunSteps.submit",
  );
  assert.match(agentSdkSource, /async submit\(runId: string, stepId: string, body: AgentRunStepCompleteRequest/);
  assert.match(agentSdkSource, /post<AgentRunStepsSubmitResult>\(appApiPath\(`\/agents\/runs\/\$\{serializePathParameter\(runId,/);
});

test("generation history contract preserves runtime output text after reload", () => {
  const openapi = JSON.parse(readWorkspaceFile("generated/openapi/clawrouter-app-openapi.json"));
  const generationHistoryItemSource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/generation-history-item.ts");
  const historyMapperSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/historyMapper.ts");

  assert.equal(openapi.components.schemas.GenerationHistoryItem.properties.outputText.type, "string");
  assert(openapi.components.schemas.GenerationHistoryItem.properties.type.enum.includes("text"));
  assert.match(generationHistoryItemSource, /outputText\?: string;/);
  assert.match(generationHistoryItemSource, /'text'/);
  assert.match(historyMapperSource, /item\.outputText \?\? item\.outputMessage/);
  assert.match(historyMapperSource, /const itemType = normalizePlaygroundHistoryType\(item\.type\)/);
  assert.match(historyMapperSource, /return normalizeSdkworkGenerationHistoryType\(value\)/);
});

test("agent generation keeps text-only output on agent history instead of pretending it is image media", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/pages/Playground.tsx");
  const typeSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundTypes.ts");
  const itemSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/ChatHistoryItem.tsx");
  const generationServiceSource = readPortalFile("./packages/sdkwork-claw-router-playground/src/playgroundGenerationService.ts");
  const appbaseHistorySource = readWorkspaceFile("../sdkwork-appbase/packages/pc-react/content/sdkwork-generation-pc-react/src/generation-history.ts");

  assert.match(typeSource, /export type PlaygroundHistoryItem = SdkworkGenerationHistoryItem/);
  assert.match(appbaseHistorySource, /export type SdkworkGenerationHistoryType =/);
  assert.match(appbaseHistorySource, /\| "text"/);
  assert.match(appbaseHistorySource, /\| "image"/);
  assert.match(appbaseHistorySource, /\| "images"/);
  assert.match(appbaseHistorySource, /\| "video"/);
  assert.match(appbaseHistorySource, /\| "music"/);
  assert.match(appbaseHistorySource, /\| "audio"/);
  assert.match(appbaseHistorySource, /\| "sfx"/);
  assert.match(pageSource, /mapSdkworkGenerationHistoryTypeToModality\(previewItem\.type\) \?\? 'agent'/);
  assert.match(pageSource, /const isText = previewItem\?\.type === 'text'/);
  assert.match(pageSource, /previewKind === 'text'/);
  assert.match(itemSource, /const previewKind = getSdkworkGenerationPreviewKind\(item\.type\)/);
  assert.match(itemSource, /const isText = previewKind === 'text'/);
  assert.match(itemSource, /playground\.input\.type\.agent/);
  assert.match(itemSource, /!\(isText\) && \(/);
  assert.match(generationServiceSource, /return artifacts\[0\]\?\.modality;/);
  assert.match(generationServiceSource, /type:\s*mapSdkworkGenerationModalityToHistoryType\(targetType\)/);
});

test("app OpenAPI exposes product Chat Memory Runtime routes without legacy ai prefix", () => {
  const openapi = JSON.parse(readWorkspaceFile("generated/openapi/clawrouter-app-openapi.json"));
  const paths = Object.keys(openapi.paths ?? {});

  assert(paths.includes("/app/v3/api/chat/conversations"));
  assert(paths.includes("/app/v3/api/chat/conversations/{conversationId}/turns"));
  assert(paths.includes("/app/v3/api/chat/conversations/{conversationId}/turns/{turnId}/response"));
  assert(paths.includes("/app/v3/api/memory/spaces"));
  assert(paths.includes("/app/v3/api/memory/spaces/{spaceId}/entries"));
  assert(paths.includes("/app/v3/api/runtime/invocations"));
  assert(paths.includes("/app/v3/api/runtime/invocations/{invocationId}/complete"));
  assert(paths.includes("/app/v3/api/runtime/invocations/{invocationId}/events"));
  assert(paths.includes("/app/v3/api/runtime/invocations/{invocationId}/events/stream"));
  assert(paths.includes("/app/v3/api/runtime/invocations/{invocationId}/artifacts"));

  assert(!paths.some((path) => path.startsWith("/app/v3/api/ai/chat")));
  assert(!paths.some((path) => path.startsWith("/app/v3/api/ai/memory")));
  assert(!paths.some((path) => path.startsWith("/app/v3/api/ai/runtime")));
});

test("app SDK sends JSON bodies for product Memory and Runtime mutations", () => {
  const memorySource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/memory.ts");
  const runtimeSource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/runtime.ts");
  const runtimeEventItemSource = readWorkspaceFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/types/runtime-event-item.ts");
  const openapi = JSON.parse(readWorkspaceFile("generated/openapi/clawrouter-app-openapi.json"));

  assert.match(memorySource, /async create\(body: MemorySpaceCreateRequest, params: MemorySpacesCreateParams\)/);
  assert.match(memorySource, /post<SpacesCreateResult>\(appApiPath\(`\/memory\/spaces`\), body, undefined, requestHeaders, 'application\/json'\)/);
  assert.match(memorySource, /async create\(spaceId: string, body: MemoryEntryCreateRequest, params: MemoryEntriesCreateParams\)/);
  assert.match(memorySource, /post<EntriesCreateResult>\(appApiPath\(`\/memory\/spaces\/\$\{serializePathParameter\(spaceId,/);
  assert.match(runtimeSource, /async create\(body: RuntimeInvocationCreateRequest, params: RuntimeInvocationsCreateParams\)/);
  assert.match(runtimeSource, /post<InvocationsCreateResult>\(appApiPath\(`\/runtime\/invocations`\), body, undefined, requestHeaders, 'application\/json'\)/);
  assert.match(runtimeSource, /async submit\(invocationId: string, body: RuntimeInvocationCompleteRequest, params: RuntimeInvocationsSubmitParams\)/);
  assert.match(runtimeSource, /post<InvocationsSubmitResult>\(appApiPath\(`\/runtime\/invocations\/\$\{serializePathParameter\(invocationId,/);
  assert.match(runtimeSource, /async create\(invocationId: string, body: RuntimeEventCreateRequest, params: RuntimeInvocationEventsCreateParams\)/);
  assert.match(runtimeSource, /async create\(invocationId: string, body: RuntimeArtifactCreateRequest, params: RuntimeArtifactsCreateParams\)/);
  assert.equal(openapi.components.schemas.RuntimeEventItem.properties.payloadJson.type, "object");
  assert.match(runtimeEventItemSource, /payloadJson: Record<string, JsonValue>;/);
});
