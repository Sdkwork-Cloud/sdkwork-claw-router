from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ClawRouterGatewayOpenApiCheckResult:
    ok: bool
    messages: list[str]


class ClawRouterGatewayOpenApiGenerator:
    """Generate the Claw Router gateway OpenAPI document for /v1 and vendor APIs."""

    OUTPUT = Path("apps") / "sdkwork-claw-router-portal" / "public" / "openapi.json"

    def __init__(self, root: Path, output_path: Path | None = None) -> None:
        self.root = Path(root).resolve()
        self.output_path = (
            Path(output_path).resolve()
            if output_path is not None
            else self.root / self.OUTPUT
        )

    def generate(self) -> dict[str, Any]:
        return {
            "openapi": "3.0.0",
            "info": {
                "title": "Claw Router Open API",
                "version": "1.0.0",
                "description": (
                    "Claw Router Open API exposes OpenAI-compatible /v1 APIs and "
                    "provider-specific APIs for OpenAI, Google Gemini, "
                    "Anthropic Claude, Volcengine Ark, Suno, Midjourney, Kling, "
                    "Vidu, and Nano Banana compatible media providers."
                ),
            },
            "servers": [
                {"url": "https://api.sdkwork.com", "description": "Production edge gateway"},
                {"url": "http://127.0.0.1:3900", "description": "Local unified edge gateway"},
            ],
            "security": [{"bearerAuth": []}],
            "tags": self._tags(),
            "paths": self._paths(),
            "components": self._components(),
            "x-api-prefix": "/v1",
            "x-router-product": "sdkwork-claw-router",
        }

    def render_json(self) -> str:
        return json.dumps(self.generate(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"

    def write(self) -> Path:
        self.output_path.parent.mkdir(parents=True, exist_ok=True)
        self.output_path.write_text(self.render_json(), encoding="utf-8", newline="\n")
        return self.output_path

    def check(self) -> ClawRouterGatewayOpenApiCheckResult:
        if not self.output_path.exists():
            return ClawRouterGatewayOpenApiCheckResult(
                ok=False,
                messages=[f"Claw Router gateway OpenAPI spec is missing: {self.output_path}"],
            )
        actual = self.output_path.read_text(encoding="utf-8")
        expected = self.render_json()
        if actual != expected:
            return ClawRouterGatewayOpenApiCheckResult(
                ok=False,
                messages=[f"Claw Router gateway OpenAPI spec is stale: {self.output_path}"],
            )
        return ClawRouterGatewayOpenApiCheckResult(ok=True, messages=[])

    def _tags(self) -> list[dict[str, str]]:
        return [
            {"name": "Responses", "description": "OpenAI-compatible stateful multimodal response API."},
            {"name": "Conversations", "description": "OpenAI-compatible conversation state and item APIs."},
            {"name": "Chat", "description": "OpenAI-compatible chat completions API."},
            {"name": "Completions", "description": "OpenAI-compatible legacy text completions API."},
            {"name": "Embeddings", "description": "OpenAI-compatible text and multimodal embedding API."},
            {"name": "Models", "description": "List and inspect Claw Router model catalog entries exposed through /v1."},
            {"name": "Images", "description": "OpenAI-compatible image generation, edit, and variation APIs."},
            {"name": "Videos", "description": "OpenAI-compatible video generation, remix, listing, and content APIs."},
            {"name": "Audio", "description": "OpenAI-compatible speech, transcription, and translation APIs."},
            {"name": "Files", "description": "OpenAI-compatible files and file content APIs."},
            {"name": "Vector Stores", "description": "OpenAI-compatible vector store and vector store file APIs."},
            {"name": "Assistants", "description": "OpenAI-compatible assistants, threads, messages, and runs APIs."},
            {"name": "Batches", "description": "OpenAI-compatible batch processing API."},
            {"name": "Fine Tuning", "description": "OpenAI-compatible fine-tuning job APIs."},
            {"name": "Evals", "description": "OpenAI-compatible eval, run, and output item APIs."},
            {"name": "Containers", "description": "OpenAI-compatible container and container file APIs."},
            {"name": "Skills", "description": "OpenAI-compatible skill and skill version APIs."},
            {"name": "Administration", "description": "OpenAI-compatible organization, project, usage, cost, and access management APIs."},
            {"name": "Moderations", "description": "OpenAI-compatible moderation API."},
            {"name": "Uploads", "description": "OpenAI-compatible multipart upload APIs."},
            {"name": "Realtime", "description": "OpenAI-compatible realtime session bootstrap APIs."},
            {"name": "Images/vidu", "description": "Vidu image generation APIs exposed through Claw Router vendor routing."},
            {"name": "Videos/vidu", "description": "Vidu video generation APIs exposed through Claw Router vendor routing."},
            {"name": "Images/midjourney", "description": "Midjourney-compatible image APIs exposed through Claw Router vendor routing."},
            {"name": "Images/nano-banana", "description": "Nano Banana compatible image APIs exposed through Claw Router vendor routing."},
            {"name": "Videos/kling", "description": "Kling-compatible video APIs exposed through Claw Router vendor routing."},
            {"name": "Audio/suno", "description": "Suno-compatible music APIs exposed through Claw Router vendor routing."},
            {"name": "Responses/google", "description": "Google Gemini model APIs exposed through Claw Router vendor routing."},
            {"name": "Embeddings/google", "description": "Google Gemini embedding APIs exposed through Claw Router vendor routing."},
            {"name": "Files/google", "description": "Google Gemini file APIs exposed through Claw Router vendor routing."},
            {"name": "Files/anthropic", "description": "Anthropic file APIs exposed through Claw Router vendor routing."},
            {"name": "Chat/anthropic", "description": "Anthropic message APIs exposed through Claw Router vendor routing."},
            {"name": "Batches/anthropic", "description": "Anthropic message batch APIs exposed through Claw Router vendor routing."},
            {"name": "Videos/volcengine", "description": "Volcengine Ark content generation APIs exposed through Claw Router vendor routing."},
        ]

    def _paths(self) -> dict[str, Any]:
        paths: dict[str, Any] = {}
        paths["/v1/models"] = {"get": self._operation("Models", "listModels", "List models", "Lists Claw Router models available to the caller.", None, "OpenAiModelList")}
        paths["/v1/models/{model}"] = {
            "get": self._operation("Models", "retrieveModel", "Retrieve model", "Retrieves one model from the Claw Router catalog.", None, "OpenAiModel", parameters=[self._path_param("model", "Model identifier or catalog key.")]),
            "delete": self._operation("Models", "deleteModel", "Delete fine-tuned model", "Deletes a fine-tuned model through the configured OpenAI-compatible upstream when supported.", None, "DeleteResult", parameters=[self._path_param("model", "Fine-tuned model identifier.")]),
        }
        paths["/v1/completions"] = {"post": self._operation("Completions", "createCompletion", "Create completion", "Creates a legacy text completion through an OpenAI-compatible request.", "JsonObject", "JsonObject")}
        paths["/v1/moderations"] = {"post": self._operation("Moderations", "createModeration", "Create moderation", "Classifies text or multimodal input through an OpenAI-compatible moderation request.", "JsonObject", "JsonObject")}
        paths["/v1/responses"] = {"post": self._operation("Responses", "createResponse", "Create response", "Creates a model response through an OpenAI-compatible Responses API request.", "OpenAiResponsesRequest", "OpenAiResponse")}
        paths["/v1/responses/input_tokens"] = {"post": self._operation("Responses", "countResponseInputTokens", "Count response input tokens", "Counts input tokens for a Responses API request when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths["/v1/responses/compact"] = {"post": self._operation("Responses", "compactResponse", "Compact response", "Compacts response input or conversation state when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths["/v1/responses/{response_id}"] = {
            "get": self._operation("Responses", "retrieveResponse", "Retrieve response", "Retrieves a stored response when the selected upstream supports response retrieval.", None, "JsonObject", parameters=[self._path_param("response_id", "Response identifier."), self._include_query_param()]),
            "delete": self._operation("Responses", "deleteResponse", "Delete response", "Deletes a stored response when the selected upstream supports response deletion.", None, "DeleteResult", parameters=[self._path_param("response_id", "Response identifier.")]),
        }
        paths["/v1/responses/{response_id}/cancel"] = {"post": self._operation("Responses", "cancelResponse", "Cancel response", "Cancels an in-progress response when the selected upstream supports cancellation.", None, "JsonObject", parameters=[self._path_param("response_id", "Response identifier.")])}
        paths["/v1/responses/{response_id}/input_items"] = {"get": self._operation("Responses", "listResponseInputItems", "List response input items", "Lists input items for a stored response when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("response_id", "Response identifier."), *self._list_pagination_params(), self._include_query_param()])}
        paths["/v1/chat/completions"] = {
            "get": self._operation("Chat", "listChatCompletions", "List stored chat completions", "Lists stored chat completions when the selected upstream supports stored chat completion retrieval.", None, "JsonObject", parameters=[*self._list_pagination_params(), self._query_param("model", "Filter stored chat completions by model id."), self._query_param("metadata", "Filter stored chat completions by metadata key-value query supported by the selected upstream.")]),
            "post": self._operation("Chat", "createChatCompletion", "Create chat completion", "Creates a chat completion through an OpenAI-compatible chat request.", "OpenAiChatCompletionRequest", "OpenAiChatCompletion"),
        }
        paths["/v1/chat/completions/{completion_id}"] = {
            "get": self._operation("Chat", "retrieveChatCompletion", "Retrieve stored chat completion", "Retrieves a stored chat completion when the selected upstream supports retrieval.", None, "JsonObject", parameters=[self._path_param("completion_id", "Stored chat completion identifier.")]),
            "post": self._operation("Chat", "modifyChatCompletion", "Modify stored chat completion", "Modifies stored chat completion metadata when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("completion_id", "Stored chat completion identifier.")]),
            "delete": self._operation("Chat", "deleteChatCompletion", "Delete stored chat completion", "Deletes a stored chat completion when supported by the selected upstream.", None, "DeleteResult", parameters=[self._path_param("completion_id", "Stored chat completion identifier.")]),
        }
        paths["/v1/chat/completions/{completion_id}/messages"] = {"get": self._operation("Chat", "listChatCompletionMessages", "List stored chat completion messages", "Lists messages for a stored chat completion when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("completion_id", "Stored chat completion identifier."), *self._list_pagination_params()])}
        paths["/v1/embeddings"] = {"post": self._operation("Embeddings", "createEmbedding", "Create embeddings", "Creates embeddings through an OpenAI-compatible embeddings request.", "OpenAiEmbeddingsRequest", "OpenAiEmbeddingList")}
        paths["/v1/images/generations"] = {"post": self._operation("Images", "createImage", "Create image", "Creates images through an OpenAI-compatible image generation request.", "OpenAiImageGenerationRequest", "JsonObject")}
        paths["/v1/images/edits"] = {"post": self._operation("Images", "createImageEdit", "Create image edit", "Edits images through an OpenAI-compatible image edit request. Multipart payloads are forwarded when provider relays are configured.", "OpenAiImageEditRequest", "JsonObject", multipart_schema="OpenAiImageEditMultipartRequest")}
        paths["/v1/images/variations"] = {"post": self._operation("Images", "createImageVariation", "Create image variation", "Creates image variations through an OpenAI-compatible image variation request.", "OpenAiImageVariationRequest", "JsonObject", multipart_schema="OpenAiImageVariationMultipartRequest")}
        paths["/v1/videos"] = {
            "get": self._operation("Videos", "listVideos", "List videos", "Lists generated videos when supported by the selected upstream.", None, "JsonObject", parameters=self._list_pagination_params()),
            "post": self._operation("Videos", "createVideo", "Create video", "Creates a video generation task through an OpenAI-compatible video request.", "JsonObject", "JsonObject"),
        }
        paths["/v1/videos/characters"] = {"post": self._operation("Videos", "createVideoCharacter", "Create video character", "Creates a reusable video character when supported by the selected upstream.", "JsonObject", "JsonObject", multipart_schema="ProviderMultipartRequest")}
        paths["/v1/videos/characters/{character_id}"] = {"get": self._operation("Videos", "retrieveVideoCharacter", "Retrieve video character", "Retrieves video character metadata.", None, "JsonObject", parameters=[self._path_param("character_id", "Video character identifier.")])}
        paths["/v1/videos/edits"] = {"post": self._operation("Videos", "editVideo", "Edit video", "Creates a video edit request when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths["/v1/videos/extensions"] = {"post": self._operation("Videos", "extendVideo", "Extend video", "Creates a video extension request when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths["/v1/videos/{video_id}"] = {
            "get": self._operation("Videos", "retrieveVideo", "Retrieve video", "Retrieves video metadata.", None, "JsonObject", parameters=[self._path_param("video_id", "Video identifier.")]),
            "delete": self._operation("Videos", "deleteVideo", "Delete video", "Deletes a video.", None, "DeleteResult", parameters=[self._path_param("video_id", "Video identifier.")]),
        }
        paths["/v1/videos/{video_id}/content"] = {"get": self._operation("Videos", "retrieveVideoContent", "Retrieve video content", "Retrieves generated video bytes.", None, "BinaryResponse", parameters=[self._path_param("video_id", "Video identifier.")])}
        paths["/v1/videos/{video_id}/remix"] = {"post": self._operation("Videos", "remixVideo", "Remix video", "Creates a video remix request when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("video_id", "Video identifier.")])}
        paths["/v1/audio/speech"] = {"post": self._operation("Audio", "createSpeech", "Create speech", "Creates speech audio through an OpenAI-compatible text-to-speech request.", "JsonObject", "BinaryResponse")}
        paths["/v1/audio/voices"] = {
            "get": self._operation("Audio", "listVoices", "List voices", "Lists available text-to-speech voices when supported by the selected upstream.", None, "JsonObject", parameters=self._list_pagination_params()),
            "post": self._operation("Audio", "createVoice", "Create voice", "Creates a voice when supported by the selected upstream.", "JsonObject", "JsonObject", multipart_schema="ProviderMultipartRequest"),
        }
        paths["/v1/audio/voices/{voice_id}"] = {"get": self._operation("Audio", "retrieveVoice", "Retrieve voice", "Retrieves voice metadata when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("voice_id", "Voice identifier.")])}
        paths["/v1/audio/voice_consents"] = {
            "get": self._operation("Audio", "listVoiceConsents", "List voice consents", "Lists voice consent records when supported by the selected upstream.", None, "JsonObject", parameters=self._list_pagination_params()),
            "post": self._operation("Audio", "createVoiceConsent", "Create voice consent", "Creates a voice consent record when supported by the selected upstream.", "JsonObject", "JsonObject", multipart_schema="OpenAiVoiceConsentMultipartRequest"),
        }
        paths["/v1/audio/voice_consents/{consent_id}"] = {
            "get": self._operation("Audio", "retrieveVoiceConsent", "Retrieve voice consent", "Retrieves a voice consent record when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("consent_id", "Voice consent identifier.")]),
            "post": self._operation("Audio", "updateVoiceConsent", "Update voice consent", "Updates a voice consent record when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("consent_id", "Voice consent identifier.")]),
            "delete": self._operation("Audio", "deleteVoiceConsent", "Delete voice consent", "Deletes a voice consent record when supported by the selected upstream.", None, "DeleteResult", parameters=[self._path_param("consent_id", "Voice consent identifier.")]),
        }
        paths["/v1/audio/transcriptions"] = {"post": self._operation("Audio", "createTranscription", "Create transcription", "Transcribes audio through an OpenAI-compatible transcription request.", "OpenAiAudioTranscriptionRequest", "JsonObject", multipart_schema="OpenAiAudioTranscriptionMultipartRequest")}
        paths["/v1/audio/translations"] = {"post": self._operation("Audio", "createTranslation", "Create translation", "Translates audio through an OpenAI-compatible translation request.", "OpenAiAudioTranslationRequest", "JsonObject", multipart_schema="OpenAiAudioTranslationMultipartRequest")}
        paths["/v1/files"] = {
            "get": self._operation("Files", "listFiles", "List files", "Lists files available to the caller.", None, "JsonObject", parameters=self._list_pagination_params()),
            "post": self._operation("Files", "uploadFile", "Upload file", "Uploads a file for OpenAI-compatible file-backed APIs.", None, "JsonObject", multipart_schema="OpenAiFileUploadRequest"),
        }
        paths["/v1/files/{file_id}"] = {
            "get": self._operation("Files", "retrieveFile", "Retrieve file", "Retrieves file metadata.", None, "JsonObject", parameters=[self._path_param("file_id", "File identifier.")]),
            "delete": self._operation("Files", "deleteFile", "Delete file", "Deletes a file.", None, "DeleteResult", parameters=[self._path_param("file_id", "File identifier.")]),
        }
        paths["/v1/files/{file_id}/content"] = {"get": self._operation("Files", "retrieveFileContent", "Retrieve file content", "Retrieves file bytes.", None, "BinaryResponse", parameters=[self._path_param("file_id", "File identifier.")])}
        paths["/v1/vector_stores"] = {"get": self._operation("Vector Stores", "listVectorStores", "List vector stores", "Lists vector stores.", None, "JsonObject", parameters=self._list_pagination_params()), "post": self._operation("Vector Stores", "createVectorStore", "Create vector store", "Creates a vector store.", "JsonObject", "JsonObject")}
        paths["/v1/vector_stores/{vector_store_id}"] = {"get": self._operation("Vector Stores", "retrieveVectorStore", "Retrieve vector store", "Retrieves a vector store.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier.")]), "post": self._operation("Vector Stores", "modifyVectorStore", "Modify vector store", "Modifies a vector store.", "JsonObject", "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier.")]), "delete": self._operation("Vector Stores", "deleteVectorStore", "Delete vector store", "Deletes a vector store.", None, "DeleteResult", parameters=[self._path_param("vector_store_id", "Vector store identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/search"] = {"post": self._operation("Vector Stores", "searchVectorStore", "Search vector store", "Searches a vector store through an OpenAI-compatible vector search request.", "JsonObject", "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/files"] = {"get": self._operation("Vector Stores", "listVectorStoreFiles", "List vector store files", "Lists files in a vector store.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), *self._list_pagination_params()]), "post": self._operation("Vector Stores", "createVectorStoreFile", "Create vector store file", "Adds a file to a vector store.", "JsonObject", "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/files/{file_id}"] = {"get": self._operation("Vector Stores", "retrieveVectorStoreFile", "Retrieve vector store file", "Retrieves a vector store file.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("file_id", "File identifier.")]), "post": self._operation("Vector Stores", "modifyVectorStoreFile", "Modify vector store file", "Modifies vector store file attributes when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("file_id", "File identifier.")]), "delete": self._operation("Vector Stores", "deleteVectorStoreFile", "Delete vector store file", "Deletes a vector store file.", None, "DeleteResult", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("file_id", "File identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/file_batches"] = {"post": self._operation("Vector Stores", "createVectorStoreFileBatch", "Create vector store file batch", "Creates a vector store file batch.", "JsonObject", "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}"] = {"get": self._operation("Vector Stores", "retrieveVectorStoreFileBatch", "Retrieve vector store file batch", "Retrieves a vector store file batch.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("batch_id", "Batch identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel"] = {"post": self._operation("Vector Stores", "cancelVectorStoreFileBatch", "Cancel vector store file batch", "Cancels a vector store file batch.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("batch_id", "Batch identifier.")])}
        paths["/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/files"] = {"get": self._operation("Vector Stores", "listVectorStoreFileBatchFiles", "List vector store file batch files", "Lists files in a vector store file batch.", None, "JsonObject", parameters=[self._path_param("vector_store_id", "Vector store identifier."), self._path_param("batch_id", "Batch identifier."), *self._list_pagination_params()])}
        paths["/v1/assistants"] = {"get": self._operation("Assistants", "listAssistants", "List assistants", "Lists assistants.", None, "JsonObject", parameters=self._list_pagination_params()), "post": self._operation("Assistants", "createAssistant", "Create assistant", "Creates an assistant.", "JsonObject", "JsonObject")}
        paths["/v1/assistants/{assistant_id}"] = {"get": self._operation("Assistants", "retrieveAssistant", "Retrieve assistant", "Retrieves an assistant.", None, "JsonObject", parameters=[self._path_param("assistant_id", "Assistant identifier.")]), "post": self._operation("Assistants", "modifyAssistant", "Modify assistant", "Modifies an assistant.", "JsonObject", "JsonObject", parameters=[self._path_param("assistant_id", "Assistant identifier.")]), "delete": self._operation("Assistants", "deleteAssistant", "Delete assistant", "Deletes an assistant.", None, "DeleteResult", parameters=[self._path_param("assistant_id", "Assistant identifier.")])}
        paths["/v1/threads"] = {"post": self._operation("Assistants", "createThread", "Create thread", "Creates a thread.", "JsonObject", "JsonObject")}
        paths["/v1/threads/runs"] = {"post": self._operation("Assistants", "createThreadAndRun", "Create thread and run", "Creates a thread and starts a run in one OpenAI-compatible request.", "JsonObject", "JsonObject")}
        paths["/v1/threads/{thread_id}"] = {"get": self._operation("Assistants", "retrieveThread", "Retrieve thread", "Retrieves a thread.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier.")]), "post": self._operation("Assistants", "modifyThread", "Modify thread", "Modifies a thread.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier.")]), "delete": self._operation("Assistants", "deleteThread", "Delete thread", "Deletes a thread.", None, "DeleteResult", parameters=[self._path_param("thread_id", "Thread identifier.")])}
        paths["/v1/threads/{thread_id}/messages"] = {"get": self._operation("Assistants", "listMessages", "List thread messages", "Lists messages in a thread.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), *self._list_pagination_params()]), "post": self._operation("Assistants", "createMessage", "Create thread message", "Creates a message in a thread.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier.")])}
        paths["/v1/threads/{thread_id}/messages/{message_id}"] = {"get": self._operation("Assistants", "retrieveMessage", "Retrieve thread message", "Retrieves a thread message.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("message_id", "Message identifier.")]), "post": self._operation("Assistants", "modifyMessage", "Modify thread message", "Modifies a thread message.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("message_id", "Message identifier.")]), "delete": self._operation("Assistants", "deleteMessage", "Delete thread message", "Deletes a thread message when supported by the selected upstream.", None, "DeleteResult", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("message_id", "Message identifier.")])}
        paths["/v1/threads/{thread_id}/runs"] = {"get": self._operation("Assistants", "listRuns", "List thread runs", "Lists runs in a thread.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), *self._list_pagination_params()]), "post": self._operation("Assistants", "createRun", "Create thread run", "Creates a run for a thread.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier.")])}
        paths["/v1/threads/{thread_id}/runs/{run_id}"] = {"get": self._operation("Assistants", "retrieveRun", "Retrieve thread run", "Retrieves a thread run.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier.")]), "post": self._operation("Assistants", "modifyRun", "Modify thread run", "Modifies a thread run.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier.")])}
        paths["/v1/threads/{thread_id}/runs/{run_id}/cancel"] = {"post": self._operation("Assistants", "cancelRun", "Cancel thread run", "Cancels a thread run.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier.")])}
        paths["/v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs"] = {"post": self._operation("Assistants", "submitRunToolOutputs", "Submit run tool outputs", "Submits tool outputs for a thread run.", "JsonObject", "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier.")])}
        paths["/v1/threads/{thread_id}/runs/{run_id}/steps"] = {"get": self._operation("Assistants", "listRunSteps", "List run steps", "Lists run steps.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier."), *self._list_pagination_params()])}
        paths["/v1/threads/{thread_id}/runs/{run_id}/steps/{step_id}"] = {"get": self._operation("Assistants", "retrieveRunStep", "Retrieve run step", "Retrieves a run step.", None, "JsonObject", parameters=[self._path_param("thread_id", "Thread identifier."), self._path_param("run_id", "Run identifier."), self._path_param("step_id", "Run step identifier.")])}
        paths["/v1/batches"] = {"get": self._operation("Batches", "listBatches", "List batches", "Lists batch jobs.", None, "JsonObject", parameters=self._list_pagination_params()), "post": self._operation("Batches", "createBatch", "Create batch", "Creates a batch job.", "JsonObject", "JsonObject")}
        paths["/v1/batches/{batch_id}"] = {"get": self._operation("Batches", "retrieveBatch", "Retrieve batch", "Retrieves a batch job.", None, "JsonObject", parameters=[self._path_param("batch_id", "Batch identifier.")])}
        paths["/v1/batches/{batch_id}/cancel"] = {"post": self._operation("Batches", "cancelBatch", "Cancel batch", "Cancels a batch job.", None, "JsonObject", parameters=[self._path_param("batch_id", "Batch identifier.")])}
        paths["/v1/fine_tuning/jobs"] = {"get": self._operation("Fine Tuning", "listFineTuningJobs", "List fine-tuning jobs", "Lists fine-tuning jobs.", None, "JsonObject", parameters=self._list_pagination_params()), "post": self._operation("Fine Tuning", "createFineTuningJob", "Create fine-tuning job", "Creates a fine-tuning job.", "JsonObject", "JsonObject")}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}"] = {"get": self._operation("Fine Tuning", "retrieveFineTuningJob", "Retrieve fine-tuning job", "Retrieves a fine-tuning job.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier.")])}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}/cancel"] = {"post": self._operation("Fine Tuning", "cancelFineTuningJob", "Cancel fine-tuning job", "Cancels a fine-tuning job.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier.")])}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}/pause"] = {"post": self._operation("Fine Tuning", "pauseFineTuningJob", "Pause fine-tuning job", "Pauses a fine-tuning job when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier.")])}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}/resume"] = {"post": self._operation("Fine Tuning", "resumeFineTuningJob", "Resume fine-tuning job", "Resumes a fine-tuning job when supported by the selected upstream.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier.")])}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}/events"] = {"get": self._operation("Fine Tuning", "listFineTuningJobEvents", "List fine-tuning events", "Lists events for a fine-tuning job.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier."), *self._list_pagination_params()])}
        paths["/v1/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints"] = {"get": self._operation("Fine Tuning", "listFineTuningJobCheckpoints", "List fine-tuning checkpoints", "Lists checkpoints for a fine-tuning job.", None, "JsonObject", parameters=[self._path_param("fine_tuning_job_id", "Fine-tuning job identifier."), *self._list_pagination_params()])}
        checkpoint_param = self._path_param("fine_tuned_model_checkpoint", "Fine-tuned model checkpoint identifier.")
        paths["/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions"] = {
            "get": self._operation("Fine Tuning", "listFineTuningCheckpointPermissions", "List fine-tuning checkpoint permissions", "Lists permissions for a fine-tuning checkpoint.", None, "JsonObject", parameters=[checkpoint_param, *self._list_pagination_params(), self._query_param("project_id", "Project identifier for permission filtering.")]),
            "post": self._operation("Fine Tuning", "createFineTuningCheckpointPermission", "Create fine-tuning checkpoint permission", "Creates a permission for a fine-tuning checkpoint.", "JsonObject", "JsonObject", parameters=[checkpoint_param]),
        }
        paths["/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}"] = {"delete": self._operation("Fine Tuning", "deleteFineTuningCheckpointPermission", "Delete fine-tuning checkpoint permission", "Deletes a permission for a fine-tuning checkpoint.", None, "DeleteResult", parameters=[checkpoint_param, self._path_param("permission_id", "Fine-tuning checkpoint permission identifier.")])}
        paths["/v1/fine_tuning/alpha/graders/run"] = {"post": self._operation("Fine Tuning", "runFineTuningGrader", "Run fine-tuning grader", "Runs a fine-tuning grader against sample input when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths["/v1/fine_tuning/alpha/graders/validate"] = {"post": self._operation("Fine Tuning", "validateFineTuningGrader", "Validate fine-tuning grader", "Validates a fine-tuning grader definition when supported by the selected upstream.", "JsonObject", "JsonObject")}
        paths.update(self._conversation_paths())
        paths.update(self._container_paths())
        paths.update(self._eval_paths())
        paths.update(self._skill_paths())
        paths.update(self._administration_paths())
        paths["/v1/uploads"] = {"post": self._operation("Uploads", "createUpload", "Create upload", "Creates an upload for multipart file transfer.", "JsonObject", "JsonObject")}
        paths["/v1/uploads/{upload_id}/parts"] = {"post": self._operation("Uploads", "addUploadPartExplicit", "Add upload part", "Adds a binary part to an upload.", None, "JsonObject", parameters=[self._path_param("upload_id", "Upload identifier.")], multipart_schema="OpenAiUploadPartMultipartRequest")}
        paths["/v1/uploads/{upload_id}/complete"] = {"post": self._operation("Uploads", "completeUpload", "Complete upload", "Completes an upload.", "JsonObject", "JsonObject", parameters=[self._path_param("upload_id", "Upload identifier.")])}
        paths["/v1/uploads/{upload_id}/cancel"] = {"post": self._operation("Uploads", "cancelUpload", "Cancel upload", "Cancels an upload.", None, "JsonObject", parameters=[self._path_param("upload_id", "Upload identifier.")])}
        paths["/v1/realtime/client_secrets"] = {"post": self._operation("Realtime", "createRealtimeClientSecret", "Create realtime client secret", "Creates an ephemeral realtime client secret.", "JsonObject", "JsonObject")}
        paths["/v1/realtime/calls"] = {"post": self._operation("Realtime", "createRealtimeCall", "Create realtime call", "Creates or starts a realtime WebRTC call using an SDP offer and returns an SDP answer when supported by the selected upstream.", "JsonObject", "SdpResponse", multipart_schema="OpenAiRealtimeCallMultipartRequest", success_status="201", success_content_type="application/sdp")}
        paths["/v1/realtime/calls/{call_id}/accept"] = {"post": self._operation("Realtime", "acceptRealtimeCall", "Accept realtime call", "Accepts an inbound realtime call when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("call_id", "Realtime call identifier.")])}
        paths["/v1/realtime/calls/{call_id}/hangup"] = {"post": self._operation("Realtime", "hangupRealtimeCall", "Hang up realtime call", "Hangs up a realtime call when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("call_id", "Realtime call identifier.")])}
        paths["/v1/realtime/calls/{call_id}/refer"] = {"post": self._operation("Realtime", "referRealtimeCall", "Refer realtime call", "Refers or transfers a realtime call when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("call_id", "Realtime call identifier.")])}
        paths["/v1/realtime/calls/{call_id}/reject"] = {"post": self._operation("Realtime", "rejectRealtimeCall", "Reject realtime call", "Rejects an inbound realtime call when supported by the selected upstream.", "JsonObject", "JsonObject", parameters=[self._path_param("call_id", "Realtime call identifier.")])}
        paths["/v1/realtime/sessions"] = {"post": self._operation("Realtime", "createRealtimeSession", "Create realtime session", "Creates an ephemeral realtime session.", "JsonObject", "JsonObject")}
        paths["/v1/realtime/transcription_sessions"] = {"post": self._operation("Realtime", "createRealtimeTranscriptionSession", "Create realtime transcription session", "Creates an ephemeral realtime transcription session.", "JsonObject", "JsonObject")}
        paths["/v1/realtime/translations"] = {"post": self._operation("Realtime", "createRealtimeTranslationSession", "Create realtime translation session", "Creates an ephemeral realtime translation session.", "JsonObject", "JsonObject")}
        paths.update(self._provider_paths())
        return paths

    def _conversation_paths(self) -> dict[str, Any]:
        return {
            "/v1/conversations": {
                "get": self._operation("Conversations", "listConversations", "List conversations", "Lists conversations when supported by the selected upstream.", None, "OpenAiConversationList", parameters=self._list_pagination_params()),
                "post": self._operation("Conversations", "createConversation", "Create conversation", "Creates a conversation.", "OpenAiConversationCreateRequest", "OpenAiConversation"),
            },
            "/v1/conversations/{conversation_id}": {
                "get": self._operation("Conversations", "retrieveConversation", "Retrieve conversation", "Retrieves a conversation.", None, "OpenAiConversation", parameters=[self._path_param("conversation_id", "Conversation identifier.")]),
                "post": self._operation("Conversations", "modifyConversation", "Modify conversation", "Modifies a conversation.", "OpenAiConversationUpdateRequest", "OpenAiConversation", parameters=[self._path_param("conversation_id", "Conversation identifier.")]),
                "delete": self._operation("Conversations", "deleteConversation", "Delete conversation", "Deletes a conversation.", None, "DeleteResult", parameters=[self._path_param("conversation_id", "Conversation identifier.")]),
            },
            "/v1/conversations/{conversation_id}/items": {
                "get": self._operation("Conversations", "listConversationItems", "List conversation items", "Lists items in a conversation.", None, "OpenAiConversationItemList", parameters=[self._path_param("conversation_id", "Conversation identifier."), *self._list_pagination_params()]),
                "post": self._operation("Conversations", "createConversationItem", "Create conversation item", "Creates an item in a conversation.", "OpenAiConversationItemCreateRequest", "OpenAiConversationItem", parameters=[self._path_param("conversation_id", "Conversation identifier.")]),
            },
            "/v1/conversations/{conversation_id}/items/{item_id}": {
                "get": self._operation("Conversations", "retrieveConversationItem", "Retrieve conversation item", "Retrieves a conversation item.", None, "OpenAiConversationItem", parameters=[self._path_param("conversation_id", "Conversation identifier."), self._path_param("item_id", "Conversation item identifier.")]),
                "delete": self._operation("Conversations", "deleteConversationItem", "Delete conversation item", "Deletes a conversation item.", None, "DeleteResult", parameters=[self._path_param("conversation_id", "Conversation identifier."), self._path_param("item_id", "Conversation item identifier.")]),
            },
        }

    def _container_paths(self) -> dict[str, Any]:
        return {
            "/v1/containers": {
                "get": self._operation("Containers", "listContainers", "List containers", "Lists containers.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Containers", "createContainer", "Create container", "Creates a container for tool-backed execution.", "JsonObject", "JsonObject"),
            },
            "/v1/containers/{container_id}": {
                "get": self._operation("Containers", "retrieveContainer", "Retrieve container", "Retrieves a container.", None, "JsonObject", parameters=[self._path_param("container_id", "Container identifier.")]),
                "delete": self._operation("Containers", "deleteContainer", "Delete container", "Deletes a container.", None, "DeleteResult", parameters=[self._path_param("container_id", "Container identifier.")]),
            },
            "/v1/containers/{container_id}/files": {
                "get": self._operation("Containers", "listContainerFiles", "List container files", "Lists files in a container.", None, "JsonObject", parameters=[self._path_param("container_id", "Container identifier."), *self._list_pagination_params()]),
                "post": self._operation("Containers", "createContainerFile", "Create container file", "Creates or uploads a container file.", None, "JsonObject", parameters=[self._path_param("container_id", "Container identifier.")], multipart_schema="ProviderMultipartRequest"),
            },
            "/v1/containers/{container_id}/files/{file_id}": {
                "get": self._operation("Containers", "retrieveContainerFile", "Retrieve container file", "Retrieves container file metadata.", None, "JsonObject", parameters=[self._path_param("container_id", "Container identifier."), self._path_param("file_id", "Container file identifier.")]),
                "delete": self._operation("Containers", "deleteContainerFile", "Delete container file", "Deletes a container file.", None, "DeleteResult", parameters=[self._path_param("container_id", "Container identifier."), self._path_param("file_id", "Container file identifier.")]),
            },
            "/v1/containers/{container_id}/files/{file_id}/content": {"get": self._operation("Containers", "retrieveContainerFileContent", "Retrieve container file content", "Retrieves container file bytes.", None, "BinaryResponse", parameters=[self._path_param("container_id", "Container identifier."), self._path_param("file_id", "Container file identifier.")])},
        }

    def _eval_paths(self) -> dict[str, Any]:
        return {
            "/v1/evals": {
                "get": self._operation("Evals", "listEvals", "List evals", "Lists eval definitions.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Evals", "createEval", "Create eval", "Creates an eval definition.", "JsonObject", "JsonObject"),
            },
            "/v1/evals/{eval_id}": {
                "get": self._operation("Evals", "retrieveEval", "Retrieve eval", "Retrieves an eval definition.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier.")]),
                "post": self._operation("Evals", "modifyEval", "Modify eval", "Modifies an eval definition.", "JsonObject", "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier.")]),
                "delete": self._operation("Evals", "deleteEval", "Delete eval", "Deletes an eval definition.", None, "DeleteResult", parameters=[self._path_param("eval_id", "Eval identifier.")]),
            },
            "/v1/evals/{eval_id}/runs": {
                "get": self._operation("Evals", "listEvalRuns", "List eval runs", "Lists eval runs.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier."), *self._list_pagination_params()]),
                "post": self._operation("Evals", "createEvalRun", "Create eval run", "Creates an eval run.", "JsonObject", "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier.")]),
            },
            "/v1/evals/{eval_id}/runs/{run_id}": {
                "get": self._operation("Evals", "retrieveEvalRun", "Retrieve eval run", "Retrieves an eval run.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier."), self._path_param("run_id", "Eval run identifier.")]),
                "post": self._operation("Evals", "cancelEvalRun", "Cancel eval run", "Cancels an eval run.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier."), self._path_param("run_id", "Eval run identifier.")]),
                "delete": self._operation("Evals", "deleteEvalRun", "Delete eval run", "Deletes an eval run.", None, "DeleteResult", parameters=[self._path_param("eval_id", "Eval identifier."), self._path_param("run_id", "Eval run identifier.")]),
            },
            "/v1/evals/{eval_id}/runs/{run_id}/output_items": {"get": self._operation("Evals", "listEvalRunOutputItems", "List eval run output items", "Lists output items for an eval run.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier."), self._path_param("run_id", "Eval run identifier."), *self._list_pagination_params()])},
            "/v1/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}": {"get": self._operation("Evals", "retrieveEvalRunOutputItem", "Retrieve eval run output item", "Retrieves an output item for an eval run.", None, "JsonObject", parameters=[self._path_param("eval_id", "Eval identifier."), self._path_param("run_id", "Eval run identifier."), self._path_param("output_item_id", "Eval run output item identifier.")])},
        }

    def _skill_paths(self) -> dict[str, Any]:
        return {
            "/v1/skills": {
                "get": self._operation("Skills", "listSkills", "List skills", "Lists skills when supported by the selected upstream.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Skills", "createSkill", "Create skill", "Creates a skill when supported by the selected upstream.", None, "JsonObject", multipart_schema="ProviderMultipartRequest"),
            },
            "/v1/skills/{skill_id}": {
                "get": self._operation("Skills", "retrieveSkill", "Retrieve skill", "Retrieves a skill.", None, "JsonObject", parameters=[self._path_param("skill_id", "Skill identifier.")]),
                "post": self._operation("Skills", "modifySkill", "Modify skill", "Modifies a skill.", "JsonObject", "JsonObject", parameters=[self._path_param("skill_id", "Skill identifier.")]),
                "delete": self._operation("Skills", "deleteSkill", "Delete skill", "Deletes a skill.", None, "DeleteResult", parameters=[self._path_param("skill_id", "Skill identifier.")]),
            },
            "/v1/skills/{skill_id}/content": {"get": self._operation("Skills", "retrieveSkillContent", "Retrieve skill content", "Retrieves skill package content.", None, "BinaryResponse", parameters=[self._path_param("skill_id", "Skill identifier.")])},
            "/v1/skills/{skill_id}/versions": {
                "get": self._operation("Skills", "listSkillVersions", "List skill versions", "Lists skill versions.", None, "JsonObject", parameters=[self._path_param("skill_id", "Skill identifier."), *self._list_pagination_params()]),
                "post": self._operation("Skills", "createSkillVersion", "Create skill version", "Creates a skill version.", None, "JsonObject", parameters=[self._path_param("skill_id", "Skill identifier.")], multipart_schema="ProviderMultipartRequest"),
            },
            "/v1/skills/{skill_id}/versions/{version}": {
                "get": self._operation("Skills", "retrieveSkillVersion", "Retrieve skill version", "Retrieves a skill version.", None, "JsonObject", parameters=[self._path_param("skill_id", "Skill identifier."), self._path_param("version", "Skill version identifier.")]),
                "delete": self._operation("Skills", "deleteSkillVersion", "Delete skill version", "Deletes a skill version.", None, "DeleteResult", parameters=[self._path_param("skill_id", "Skill identifier."), self._path_param("version", "Skill version identifier.")]),
            },
            "/v1/skills/{skill_id}/versions/{version}/content": {"get": self._operation("Skills", "retrieveSkillVersionContent", "Retrieve skill version content", "Retrieves skill version package content.", None, "BinaryResponse", parameters=[self._path_param("skill_id", "Skill identifier."), self._path_param("version", "Skill version identifier.")])},
        }

    def _administration_paths(self) -> dict[str, Any]:
        usage_paths = {
            "/v1/organization/usage/completions": ("getOrganizationCompletionsUsage", "Get completions usage"),
            "/v1/organization/usage/embeddings": ("getOrganizationEmbeddingsUsage", "Get embeddings usage"),
            "/v1/organization/usage/moderations": ("getOrganizationModerationsUsage", "Get moderation usage"),
            "/v1/organization/usage/images": ("getOrganizationImagesUsage", "Get image usage"),
            "/v1/organization/usage/audio_speeches": ("getOrganizationAudioSpeechesUsage", "Get audio speech usage"),
            "/v1/organization/usage/audio_transcriptions": ("getOrganizationAudioTranscriptionsUsage", "Get audio transcription usage"),
            "/v1/organization/usage/vector_stores": ("getOrganizationVectorStoresUsage", "Get vector store usage"),
            "/v1/organization/usage/code_interpreter_sessions": ("getOrganizationCodeInterpreterSessionsUsage", "Get code interpreter session usage"),
        }
        paths: dict[str, Any] = {
            "/v1/organization/costs": {"get": self._operation("Administration", "getOrganizationCosts", "Get organization costs", "Retrieves organization cost buckets from the OpenAI-compatible administration API.", None, "JsonObject", parameters=self._organization_usage_query_params())},
            "/v1/organization/audit_logs": {"get": self._operation("Administration", "listOrganizationAuditLogs", "List organization audit logs", "Lists organization audit log events.", None, "JsonObject", parameters=self._organization_audit_query_params())},
            "/v1/organization/admin_api_keys": {
                "get": self._operation("Administration", "listOrganizationAdminApiKeys", "List organization admin API keys", "Lists organization admin API keys.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "createOrganizationAdminApiKey", "Create organization admin API key", "Creates an organization admin API key.", "JsonObject", "JsonObject"),
            },
            "/v1/organization/admin_api_keys/{key_id}": {
                "get": self._operation("Administration", "retrieveOrganizationAdminApiKey", "Retrieve organization admin API key", "Retrieves an organization admin API key.", None, "JsonObject", parameters=[self._path_param("key_id", "Admin API key identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationAdminApiKey", "Delete organization admin API key", "Deletes an organization admin API key.", None, "DeleteResult", parameters=[self._path_param("key_id", "Admin API key identifier.")]),
            },
            "/v1/organization/invites": {
                "get": self._operation("Administration", "listOrganizationInvites", "List organization invites", "Lists organization invites.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "createOrganizationInvite", "Create organization invite", "Creates an organization invite.", "JsonObject", "JsonObject"),
            },
            "/v1/organization/invites/{invite_id}": {
                "get": self._operation("Administration", "retrieveOrganizationInvite", "Retrieve organization invite", "Retrieves an organization invite.", None, "JsonObject", parameters=[self._path_param("invite_id", "Organization invite identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationInvite", "Delete organization invite", "Deletes an organization invite.", None, "DeleteResult", parameters=[self._path_param("invite_id", "Organization invite identifier.")]),
            },
            "/v1/organization/users": {"get": self._operation("Administration", "listOrganizationUsers", "List organization users", "Lists organization users.", None, "JsonObject", parameters=self._list_pagination_params())},
            "/v1/organization/users/{user_id}": {
                "get": self._operation("Administration", "retrieveOrganizationUser", "Retrieve organization user", "Retrieves an organization user.", None, "JsonObject", parameters=[self._path_param("user_id", "Organization user identifier.")]),
                "post": self._operation("Administration", "modifyOrganizationUser", "Modify organization user", "Modifies organization user attributes or role.", "JsonObject", "JsonObject", parameters=[self._path_param("user_id", "Organization user identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationUser", "Delete organization user", "Deletes or removes an organization user.", None, "DeleteResult", parameters=[self._path_param("user_id", "Organization user identifier.")]),
            },
            "/v1/organization/users/{user_id}/roles": {
                "get": self._operation("Administration", "listOrganizationUserRoles", "List organization user roles", "Lists roles assigned to an organization user.", None, "JsonObject", parameters=[self._path_param("user_id", "Organization user identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createOrganizationUserRole", "Create organization user role", "Assigns a role to an organization user.", "JsonObject", "JsonObject", parameters=[self._path_param("user_id", "Organization user identifier.")]),
            },
            "/v1/organization/users/{user_id}/roles/{role_id}": {"delete": self._operation("Administration", "deleteOrganizationUserRole", "Delete organization user role", "Removes a role from an organization user.", None, "DeleteResult", parameters=[self._path_param("user_id", "Organization user identifier."), self._path_param("role_id", "Organization role identifier.")])},
            "/v1/organization/groups": {
                "get": self._operation("Administration", "listOrganizationGroups", "List organization groups", "Lists organization groups.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "createOrganizationGroup", "Create organization group", "Creates an organization group.", "JsonObject", "JsonObject"),
            },
            "/v1/organization/groups/{group_id}": {
                "get": self._operation("Administration", "retrieveOrganizationGroup", "Retrieve organization group", "Retrieves an organization group.", None, "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier.")]),
                "post": self._operation("Administration", "modifyOrganizationGroup", "Modify organization group", "Modifies an organization group.", "JsonObject", "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationGroup", "Delete organization group", "Deletes an organization group.", None, "DeleteResult", parameters=[self._path_param("group_id", "Organization group identifier.")]),
            },
            "/v1/organization/groups/{group_id}/users": {
                "get": self._operation("Administration", "listOrganizationGroupUsers", "List organization group users", "Lists users in an organization group.", None, "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "addOrganizationGroupUser", "Add organization group user", "Adds a user to an organization group.", "JsonObject", "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier.")]),
            },
            "/v1/organization/groups/{group_id}/users/{user_id}": {"delete": self._operation("Administration", "deleteOrganizationGroupUser", "Delete organization group user", "Removes a user from an organization group.", None, "DeleteResult", parameters=[self._path_param("group_id", "Organization group identifier."), self._path_param("user_id", "Organization user identifier.")])},
            "/v1/organization/groups/{group_id}/roles": {
                "get": self._operation("Administration", "listOrganizationGroupRoles", "List organization group roles", "Lists roles assigned to an organization group.", None, "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createOrganizationGroupRole", "Create organization group role", "Assigns a role to an organization group.", "JsonObject", "JsonObject", parameters=[self._path_param("group_id", "Organization group identifier.")]),
            },
            "/v1/organization/groups/{group_id}/roles/{role_id}": {"delete": self._operation("Administration", "deleteOrganizationGroupRole", "Delete organization group role", "Removes a role from an organization group.", None, "DeleteResult", parameters=[self._path_param("group_id", "Organization group identifier."), self._path_param("role_id", "Organization role identifier.")])},
            "/v1/organization/roles": {
                "get": self._operation("Administration", "listOrganizationRoles", "List organization roles", "Lists organization roles.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "createOrganizationRole", "Create organization role", "Creates an organization role.", "JsonObject", "JsonObject"),
            },
            "/v1/organization/roles/{role_id}": {
                "get": self._operation("Administration", "retrieveOrganizationRole", "Retrieve organization role", "Retrieves an organization role.", None, "JsonObject", parameters=[self._path_param("role_id", "Organization role identifier.")]),
                "post": self._operation("Administration", "modifyOrganizationRole", "Modify organization role", "Modifies an organization role.", "JsonObject", "JsonObject", parameters=[self._path_param("role_id", "Organization role identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationRole", "Delete organization role", "Deletes an organization role.", None, "DeleteResult", parameters=[self._path_param("role_id", "Organization role identifier.")]),
            },
            "/v1/organization/certificates": {
                "get": self._operation("Administration", "listOrganizationCertificates", "List organization certificates", "Lists organization certificates.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "uploadOrganizationCertificate", "Upload organization certificate", "Uploads an organization certificate.", None, "JsonObject", multipart_schema="ProviderMultipartRequest"),
            },
            "/v1/organization/certificates/{certificate_id}": {
                "get": self._operation("Administration", "retrieveOrganizationCertificate", "Retrieve organization certificate", "Retrieves an organization certificate.", None, "JsonObject", parameters=[self._path_param("certificate_id", "Certificate identifier.")]),
                "delete": self._operation("Administration", "deleteOrganizationCertificate", "Delete organization certificate", "Deletes an organization certificate.", None, "DeleteResult", parameters=[self._path_param("certificate_id", "Certificate identifier.")]),
            },
            "/v1/organization/certificates/activate": {"post": self._operation("Administration", "activateOrganizationCertificates", "Activate organization certificates", "Activates one or more organization certificates.", "JsonObject", "JsonObject")},
            "/v1/organization/certificates/deactivate": {"post": self._operation("Administration", "deactivateOrganizationCertificates", "Deactivate organization certificates", "Deactivates one or more organization certificates.", "JsonObject", "JsonObject")},
        }
        for path, (operation_id, summary) in usage_paths.items():
            paths[path] = {"get": self._operation("Administration", operation_id, summary, "Retrieves organization usage buckets from the OpenAI-compatible administration API.", None, "JsonObject", parameters=self._organization_usage_query_params())}
        paths.update(self._project_administration_paths())
        return paths

    def _project_administration_paths(self) -> dict[str, Any]:
        return {
            "/v1/organization/projects": {
                "get": self._operation("Administration", "listOrganizationProjects", "List organization projects", "Lists organization projects.", None, "JsonObject", parameters=self._list_pagination_params()),
                "post": self._operation("Administration", "createOrganizationProject", "Create organization project", "Creates an organization project.", "JsonObject", "JsonObject"),
            },
            "/v1/organization/projects/{project_id}": {
                "get": self._operation("Administration", "retrieveOrganizationProject", "Retrieve organization project", "Retrieves an organization project.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
                "post": self._operation("Administration", "modifyOrganizationProject", "Modify organization project", "Modifies an organization project.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
            },
            "/v1/organization/projects/{project_id}/archive": {"post": self._operation("Administration", "archiveOrganizationProject", "Archive organization project", "Archives an organization project.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")])},
            "/v1/organization/projects/{project_id}/users": {
                "get": self._operation("Administration", "listProjectUsers", "List project users", "Lists users in a project.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectUser", "Create project user", "Adds a user to a project.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
            },
            "/v1/organization/projects/{project_id}/users/{user_id}": {
                "get": self._operation("Administration", "retrieveProjectUser", "Retrieve project user", "Retrieves a project user.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier.")]),
                "post": self._operation("Administration", "modifyProjectUser", "Modify project user", "Modifies a project user.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier.")]),
                "delete": self._operation("Administration", "deleteProjectUser", "Delete project user", "Removes a user from a project.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier.")]),
            },
            "/v1/organization/projects/{project_id}/service_accounts": {
                "get": self._operation("Administration", "listProjectServiceAccounts", "List project service accounts", "Lists project service accounts.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectServiceAccount", "Create project service account", "Creates a project service account.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
            },
            "/v1/organization/projects/{project_id}/service_accounts/{service_account_id}": {
                "get": self._operation("Administration", "retrieveProjectServiceAccount", "Retrieve project service account", "Retrieves a project service account.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("service_account_id", "Project service account identifier.")]),
                "delete": self._operation("Administration", "deleteProjectServiceAccount", "Delete project service account", "Deletes a project service account.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("service_account_id", "Project service account identifier.")]),
            },
            "/v1/organization/projects/{project_id}/api_keys": {"get": self._operation("Administration", "listProjectApiKeys", "List project API keys", "Lists project API keys.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()])},
            "/v1/organization/projects/{project_id}/api_keys/{key_id}": {
                "get": self._operation("Administration", "retrieveProjectApiKey", "Retrieve project API key", "Retrieves a project API key.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("key_id", "Project API key identifier.")]),
                "delete": self._operation("Administration", "deleteProjectApiKey", "Delete project API key", "Deletes a project API key.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("key_id", "Project API key identifier.")]),
            },
            "/v1/organization/projects/{project_id}/rate_limits": {"get": self._operation("Administration", "listProjectRateLimits", "List project rate limits", "Lists project rate limits.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()])},
            "/v1/organization/projects/{project_id}/rate_limits/{rate_limit_id}": {"post": self._operation("Administration", "modifyProjectRateLimit", "Modify project rate limit", "Modifies a project rate limit.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("rate_limit_id", "Project rate limit identifier.")])},
            "/v1/organization/projects/{project_id}/groups": {
                "get": self._operation("Administration", "listProjectGroups", "List project groups", "Lists project groups.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectGroup", "Create project group", "Adds a group to a project.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
            },
            "/v1/organization/projects/{project_id}/groups/{group_id}": {"delete": self._operation("Administration", "deleteProjectGroup", "Delete project group", "Removes a group from a project.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("group_id", "Project group identifier.")])},
            "/v1/organization/projects/{project_id}/certificates": {"get": self._operation("Administration", "listProjectCertificates", "List project certificates", "Lists project certificates.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()])},
            "/v1/organization/projects/{project_id}/certificates/activate": {"post": self._operation("Administration", "activateProjectCertificates", "Activate project certificates", "Activates one or more project certificates.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")])},
            "/v1/organization/projects/{project_id}/certificates/deactivate": {"post": self._operation("Administration", "deactivateProjectCertificates", "Deactivate project certificates", "Deactivates one or more project certificates.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")])},
            "/v1/projects/{project_id}/roles": {
                "get": self._operation("Administration", "listProjectRoles", "List project roles", "Lists project roles.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectRole", "Create project role", "Creates a project role.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier.")]),
            },
            "/v1/projects/{project_id}/roles/{role_id}": {
                "get": self._operation("Administration", "retrieveProjectRole", "Retrieve project role", "Retrieves a project role.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("role_id", "Project role identifier.")]),
                "post": self._operation("Administration", "modifyProjectRole", "Modify project role", "Modifies a project role.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("role_id", "Project role identifier.")]),
                "delete": self._operation("Administration", "deleteProjectRole", "Delete project role", "Deletes a project role.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("role_id", "Project role identifier.")]),
            },
            "/v1/projects/{project_id}/users/{user_id}/roles": {
                "get": self._operation("Administration", "listProjectUserRoles", "List project user roles", "Lists roles assigned to a project user.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectUserRole", "Create project user role", "Assigns a role to a project user.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier.")]),
            },
            "/v1/projects/{project_id}/users/{user_id}/roles/{role_id}": {"delete": self._operation("Administration", "deleteProjectUserRole", "Delete project user role", "Removes a role from a project user.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("user_id", "Project user identifier."), self._path_param("role_id", "Project role identifier.")])},
            "/v1/projects/{project_id}/groups/{group_id}/roles": {
                "get": self._operation("Administration", "listProjectGroupRoles", "List project group roles", "Lists roles assigned to a project group.", None, "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("group_id", "Project group identifier."), *self._list_pagination_params()]),
                "post": self._operation("Administration", "createProjectGroupRole", "Create project group role", "Assigns a role to a project group.", "JsonObject", "JsonObject", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("group_id", "Project group identifier.")]),
            },
            "/v1/projects/{project_id}/groups/{group_id}/roles/{role_id}": {"delete": self._operation("Administration", "deleteProjectGroupRole", "Delete project group role", "Removes a role from a project group.", None, "DeleteResult", parameters=[self._path_param("project_id", "Project identifier."), self._path_param("group_id", "Project group identifier."), self._path_param("role_id", "Project role identifier.")])},
        }

    def _provider_paths(self) -> dict[str, Any]:
        return {
            "/google/v1beta/models/{model}:generateContent": {"post": self._operation("Responses/google", "googleGenerateContent", "Google Gemini generate content", "Creates Google Gemini generateContent output using the configured Google provider account.", "JsonObject", "JsonObject", parameters=[self._path_param("model", "Gemini model identifier.")], provider="google")},
            "/google/v1beta/models/{model}:streamGenerateContent": {"post": self._operation("Responses/google", "googleStreamGenerateContent", "Google Gemini stream generate content", "Creates a streamed Google Gemini generateContent response using the configured Google provider account.", "JsonObject", "JsonObject", parameters=[self._path_param("model", "Gemini model identifier.")], provider="google")},
            "/google/v1beta/models/{model}:embedContent": {"post": self._operation("Embeddings/google", "googleEmbedContent", "Google Gemini embed content", "Creates a Google Gemini embedding using the configured Google provider account.", "JsonObject", "JsonObject", parameters=[self._path_param("model", "Gemini model identifier.")], provider="google")},
            "/google/v1beta/models/{model}:batchEmbedContents": {"post": self._operation("Embeddings/google", "googleBatchEmbedContents", "Google Gemini batch embed contents", "Creates Google Gemini batch embeddings using the configured Google provider account.", "JsonObject", "JsonObject", parameters=[self._path_param("model", "Gemini model identifier.")], provider="google")},
            "/google/v1beta/models/{model}:countTokens": {"post": self._operation("Responses/google", "googleCountTokens", "Google Gemini count tokens", "Counts Google Gemini input tokens using the configured Google provider account.", "JsonObject", "JsonObject", parameters=[self._path_param("model", "Gemini model identifier.")], provider="google")},
            "/google/v1beta/files": {
                "get": self._operation("Files/google", "googleListFiles", "Google Gemini list files", "Lists Google Gemini files using the configured Google provider account.", None, "JsonObject", provider="google"),
                "post": self._operation("Files/google", "googleUploadFile", "Google Gemini upload file", "Uploads a Google Gemini file using the configured Google provider account.", None, "JsonObject", provider="google", multipart_schema="ProviderMultipartRequest"),
            },
            "/google/v1beta/files/{file_id}": {"get": self._operation("Files/google", "googleRetrieveFile", "Google Gemini retrieve file", "Retrieves Google Gemini file metadata using the configured Google provider account.", None, "JsonObject", parameters=[self._path_param("file_id", "Gemini file identifier.")], provider="google"), "delete": self._operation("Files/google", "googleDeleteFile", "Google Gemini delete file", "Deletes a Google Gemini file using the configured Google provider account.", None, "JsonObject", parameters=[self._path_param("file_id", "Gemini file identifier.")], provider="google")},
            "/google/v1beta/cachedContents": {
                "get": self._operation("Responses/google", "googleListCachedContents", "Google Gemini list cached contents", "Lists Google Gemini cached contents using the configured Google provider account.", None, "JsonObject", provider="google"),
                "post": self._operation("Responses/google", "googleCreateCachedContent", "Google Gemini create cached content", "Creates Google Gemini cached content using the configured Google provider account.", "JsonObject", "JsonObject", provider="google"),
            },
            "/google/v1beta/cachedContents/{cached_content_id}": {"get": self._operation("Responses/google", "googleRetrieveCachedContent", "Google Gemini retrieve cached content", "Retrieves Google Gemini cached content using the configured Google provider account.", None, "JsonObject", parameters=[self._path_param("cached_content_id", "Gemini cached content identifier.")], provider="google"), "delete": self._operation("Responses/google", "googleDeleteCachedContent", "Google Gemini cached content", "Deletes Google Gemini cached content using the configured Google provider account.", None, "JsonObject", parameters=[self._path_param("cached_content_id", "Gemini cached content identifier.")], provider="google")},
            "/anthropic/v1/messages": {"post": self._operation("Chat/anthropic", "anthropicCreateMessage", "Anthropic Claude message", "Creates an Anthropic Messages API response using the configured Anthropic provider account.", "JsonObject", "JsonObject", provider="anthropic")},
            "/anthropic/v1/messages/count_tokens": {"post": self._operation("Chat/anthropic", "anthropicCountMessageTokens", "Anthropic count message tokens", "Counts Anthropic message tokens using the configured Anthropic provider account.", "JsonObject", "JsonObject", provider="anthropic")},
            "/anthropic/v1/messages/batches": {
                "get": self._operation("Batches/anthropic", "anthropicListMessageBatches", "Anthropic list message batches", "Lists Anthropic message batches using the configured Anthropic provider account.", None, "JsonObject", provider="anthropic"),
                "post": self._operation("Batches/anthropic", "anthropicCreateMessageBatch", "Anthropic create message batch", "Creates an Anthropic message batch using the configured Anthropic provider account.", "JsonObject", "JsonObject", provider="anthropic"),
            },
            "/anthropic/v1/messages/batches/{batch_id}": {"get": self._operation("Batches/anthropic", "anthropicRetrieveMessageBatch", "Anthropic retrieve message batch", "Retrieves an Anthropic message batch using the configured Anthropic provider account.", None, "JsonObject", parameters=[self._path_param("batch_id", "Anthropic message batch identifier.")], provider="anthropic"), "delete": self._operation("Batches/anthropic", "anthropicCancelMessageBatch", "Anthropic cancel message batch", "Cancels an Anthropic message batch using the configured Anthropic provider account.", None, "JsonObject", parameters=[self._path_param("batch_id", "Anthropic message batch identifier.")], provider="anthropic")},
            "/anthropic/v1/files": {
                "get": self._operation("Files/anthropic", "anthropicListFiles", "Anthropic list files", "Lists Anthropic files using the configured Anthropic provider account.", None, "JsonObject", provider="anthropic"),
                "post": self._operation("Files/anthropic", "anthropicUploadFile", "Anthropic upload file", "Uploads an Anthropic file using the configured Anthropic provider account.", None, "JsonObject", provider="anthropic", multipart_schema="ProviderMultipartRequest"),
            },
            "/anthropic/v1/files/{file_id}": {"get": self._operation("Files/anthropic", "anthropicRetrieveFile", "Anthropic retrieve file", "Retrieves an Anthropic file using the configured Anthropic provider account.", None, "JsonObject", parameters=[self._path_param("file_id", "Anthropic file identifier.")], provider="anthropic"), "delete": self._operation("Files/anthropic", "anthropicDeleteFile", "Anthropic delete file", "Deletes an Anthropic file using the configured Anthropic provider account.", None, "JsonObject", parameters=[self._path_param("file_id", "Anthropic file identifier.")], provider="anthropic")},
            "/anthropic/v1/files/{file_id}/content": {"get": self._operation("Files/anthropic", "anthropicRetrieveFileContent", "Anthropic retrieve file content", "Retrieves Anthropic file content using the configured Anthropic provider account.", None, "BinaryResponse", parameters=[self._path_param("file_id", "Anthropic file identifier.")], provider="anthropic")},
            "/volcengine/api/v3/contents/generations/tasks": {"post": self._operation("Videos/volcengine", "volcengineCreateContentGenerationTask", "Volcengine Ark content generation task", "Creates a Volcengine Ark image, video, or content generation task using the configured Volcengine provider account.", "JsonObject", "JsonObject", provider="volcengine")},
            "/volcengine/api/v3/contents/generations/tasks/{task_id}": {"get": self._operation("Videos/volcengine", "volcengineRetrieveContentGenerationTask", "Volcengine Ark retrieve content generation task", "Retrieves a Volcengine Ark task using the configured Volcengine provider account.", None, "JsonObject", parameters=[self._path_param("task_id", "Volcengine content generation task identifier.")], provider="volcengine")},
            "/suno/v1/music/generations": {"post": self._operation("Audio/suno", "sunoCreateMusicGeneration", "Suno music generation", "Creates a Suno-compatible music generation using the configured Suno provider account.", "JsonObject", "JsonObject", provider="suno")},
            "/suno/v1/music/generations/{task_id}": {"get": self._operation("Audio/suno", "sunoRetrieveMusicGeneration", "Suno retrieve music generation", "Retrieves a Suno-compatible music generation task using the configured Suno provider account.", None, "JsonObject", parameters=[self._path_param("task_id", "Suno task identifier.")], provider="suno")},
            "/midjourney/v1/images/generations": {"post": self._operation("Images/midjourney", "midjourneyCreateImageGeneration", "Midjourney image generation", "Creates a Midjourney-compatible image generation using the configured Midjourney provider account.", "JsonObject", "JsonObject", provider="midjourney")},
            "/midjourney/v1/images/generations/{task_id}": {"get": self._operation("Images/midjourney", "midjourneyRetrieveImageGeneration", "Midjourney retrieve image generation", "Retrieves a Midjourney-compatible image generation task using the configured Midjourney provider account.", None, "JsonObject", parameters=[self._path_param("task_id", "Midjourney task identifier.")], provider="midjourney")},
            "/kling/v1/videos/generations": {"post": self._operation("Videos/kling", "klingCreateVideoGeneration", "Kling video generation", "Creates a Kling-compatible video generation using the configured Kling provider account.", "JsonObject", "JsonObject", provider="kling")},
            "/kling/v1/videos/generations/{task_id}": {"get": self._operation("Videos/kling", "klingRetrieveVideoGeneration", "Kling retrieve video generation", "Retrieves a Kling-compatible video generation task using the configured Kling provider account.", None, "JsonObject", parameters=[self._path_param("task_id", "Kling task identifier.")], provider="kling")},
            "/vidu/ent/v2/text2video": {"post": self._operation("Videos/vidu", "viduCreateTextToVideo", "Vidu text to video", "Creates a Vidu text-to-video task using the configured Vidu provider account.", "ViduTextToVideoRequest", "ViduVideoGenerationTask", provider="vidu")},
            "/vidu/ent/v2/img2video": {"post": self._operation("Videos/vidu", "viduCreateImageToVideo", "Vidu image to video", "Creates a Vidu image-to-video task using the configured Vidu provider account.", "ViduImageToVideoRequest", "ViduVideoGenerationTask", provider="vidu")},
            "/vidu/ent/v2/reference2video": {"post": self._operation("Videos/vidu", "viduCreateReferenceToVideo", "Vidu reference to video", "Creates a Vidu reference-to-video task using the configured Vidu provider account.", "ViduReferenceToVideoRequest", "ViduVideoGenerationTask", provider="vidu")},
            "/vidu/ent/v2/start-end2video": {"post": self._operation("Videos/vidu", "viduCreateStartEndToVideo", "Vidu start-end to video", "Creates a Vidu start-end-frame video task using the configured Vidu provider account.", "ViduStartEndToVideoRequest", "ViduVideoGenerationTask", provider="vidu")},
            "/vidu/ent/v2/reference2image": {"post": self._operation("Images/vidu", "viduCreateReferenceToImage", "Vidu reference to image", "Creates Vidu reference-to-image outputs using the configured Vidu provider account.", "ViduReferenceToImageRequest", "ViduImageGenerationTask", provider="vidu")},
            "/vidu/ent/v2/tasks/{task_id}/creations": {"get": self._operation("Videos/vidu", "viduGetTaskCreations", "Vidu get task creations", "Retrieves Vidu task creations using the configured Vidu provider account.", None, "ViduTaskCreationsResponse", parameters=[self._path_param("task_id", "Vidu task identifier.")], provider="vidu")},
            "/nano-banana/v1/images/generations": {"post": self._operation("Images/nano-banana", "nanoBananaCreateImageGeneration", "Nano Banana image generation", "Creates a Nano Banana compatible image generation using the configured Nano Banana provider account.", "JsonObject", "JsonObject", provider="nano-banana")},
            "/nano-banana/v1/images/generations/{task_id}": {"get": self._operation("Images/nano-banana", "nanoBananaRetrieveImageGeneration", "Nano Banana retrieve image generation", "Retrieves a Nano Banana compatible image generation task using the configured Nano Banana provider account.", None, "JsonObject", parameters=[self._path_param("task_id", "Nano Banana task identifier.")], provider="nano-banana")},
        }

    def _operation(
        self,
        tag: str,
        operation_id: str,
        summary: str,
        description: str,
        request_schema: str | None,
        response_schema: str,
        parameters: list[dict[str, Any]] | None = None,
        provider: str | None = None,
        multipart_schema: str | None = None,
        binary_request: bool = False,
        success_status: str = "200",
        success_content_type: str | None = None,
    ) -> dict[str, Any]:
        operation: dict[str, Any] = {
            "tags": [tag],
            "operationId": operation_id,
            "summary": summary,
            "description": description,
            "parameters": parameters or [],
            "responses": self._responses(response_schema, success_status=success_status, success_content_type=success_content_type),
            "security": [{"bearerAuth": []}],
        }
        request_content: dict[str, Any] = {}
        if request_schema is not None:
            request_content["application/json"] = {
                "schema": {"$ref": f"#/components/schemas/{request_schema}"},
            }
        if multipart_schema is not None:
            request_content["multipart/form-data"] = {
                "schema": {"$ref": f"#/components/schemas/{multipart_schema}"},
            }
        if binary_request:
            request_content["application/octet-stream"] = {
                "schema": {"type": "string", "format": "binary"},
            }
        if request_content:
            operation["requestBody"] = {"required": True, "content": request_content}
        return operation

    def _responses(
        self,
        success_schema: str,
        success_status: str = "200",
        success_content_type: str | None = None,
    ) -> dict[str, Any]:
        success_content: dict[str, Any]
        if success_schema == "BinaryResponse":
            success_content = {"application/octet-stream": {"schema": {"type": "string", "format": "binary"}}}
        elif success_content_type is not None:
            success_content = {success_content_type: {"schema": {"$ref": f"#/components/schemas/{success_schema}"}}}
        else:
            success_content = {"application/json": {"schema": {"$ref": f"#/components/schemas/{success_schema}"}}}
        return {
            success_status: {"description": "Successful response from Claw Router or the selected upstream provider.", "content": success_content},
            "400": {"description": "Invalid request.", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OpenAiErrorEnvelope"}}}},
            "401": {"description": "Authentication failed.", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OpenAiErrorEnvelope"}}}},
            "404": {"description": "Resource or route target not found.", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OpenAiErrorEnvelope"}}}},
            "501": {"description": "Route is declared but no upstream provider account is configured.", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OpenAiErrorEnvelope"}}}},
            "502": {"description": "Upstream provider relay failed.", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OpenAiErrorEnvelope"}}}},
        }

    def _path_param(self, name: str, description: str) -> dict[str, Any]:
        return {"name": name, "in": "path", "required": True, "description": description, "schema": {"type": "string"}}

    def _query_param(
        self,
        name: str,
        description: str,
        schema: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        return {
            "name": name,
            "in": "query",
            "required": False,
            "description": description,
            "schema": schema or {"type": "string"},
        }

    def _list_pagination_params(self) -> list[dict[str, Any]]:
        return [
            self._query_param("limit", "Maximum number of objects to return.", {"type": "integer", "minimum": 1, "maximum": 100}),
            self._query_param("order", "Sort order by creation time.", {"type": "string", "enum": ["asc", "desc"]}),
            self._query_param("after", "Cursor for pagination after an object identifier."),
            self._query_param("before", "Cursor for pagination before an object identifier."),
        ]

    def _organization_usage_query_params(self) -> list[dict[str, Any]]:
        array_of_strings = {"type": "array", "items": {"type": "string"}}
        return [
            self._query_param("start_time", "Unix timestamp for the inclusive start of the reporting window.", {"type": "integer", "format": "int64"}),
            self._query_param("end_time", "Unix timestamp for the exclusive end of the reporting window.", {"type": "integer", "format": "int64"}),
            self._query_param("bucket_width", "Bucket width accepted by the selected upstream.", {"type": "string"}),
            self._query_param("project_ids", "Project identifiers to include.", array_of_strings),
            self._query_param("user_ids", "User identifiers to include.", array_of_strings),
            self._query_param("api_key_ids", "API key identifiers to include.", array_of_strings),
            self._query_param("models", "Model identifiers to include.", array_of_strings),
            self._query_param("group_by", "Fields to group usage or costs by.", array_of_strings),
            self._query_param("limit", "Maximum number of buckets to return.", {"type": "integer", "minimum": 1}),
            self._query_param("page", "Pagination cursor returned by the selected upstream."),
        ]

    def _organization_audit_query_params(self) -> list[dict[str, Any]]:
        return [
            self._query_param("effective_at[gte]", "Lower bound for audit event time.", {"type": "integer", "format": "int64"}),
            self._query_param("effective_at[lte]", "Upper bound for audit event time.", {"type": "integer", "format": "int64"}),
            self._query_param("project_ids[]", "Project identifiers to include.", {"type": "array", "items": {"type": "string"}}),
            self._query_param("event_types[]", "Audit event types to include.", {"type": "array", "items": {"type": "string"}}),
            self._query_param("actor_ids[]", "Actor identifiers to include.", {"type": "array", "items": {"type": "string"}}),
            self._query_param("actor_emails[]", "Actor email addresses to include.", {"type": "array", "items": {"type": "string"}}),
            self._query_param("resource_ids[]", "Resource identifiers to include.", {"type": "array", "items": {"type": "string"}}),
            self._query_param("limit", "Maximum number of audit log events to return.", {"type": "integer", "minimum": 1, "maximum": 100}),
            self._query_param("after", "Cursor for pagination after an audit event identifier."),
            self._query_param("before", "Cursor for pagination before an audit event identifier."),
        ]

    def _include_query_param(self) -> dict[str, Any]:
        return self._query_param(
            "include[]",
            "Additional response fields to include, passed through to the selected upstream.",
            {"type": "array", "items": {"type": "string"}},
        )

    def _components(self) -> dict[str, Any]:
        return {
            "securitySchemes": {
                "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "Claw Router API key"}
            },
            "schemas": {
                "JsonObject": {"type": "object", "additionalProperties": True, "description": "Provider-specific JSON payload accepted by Claw Router."},
                "DeleteResult": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["id", "object", "deleted"],
                    "properties": {
                        "id": {"type": "string", "description": "Identifier of the deleted resource."},
                        "object": {"type": "string", "description": "Deleted resource object type."},
                        "deleted": {"type": "boolean", "description": "Whether the resource was deleted."},
                    },
                },
                "OpenAiErrorEnvelope": {"type": "object", "additionalProperties": False, "required": ["error"], "properties": {"error": {"$ref": "#/components/schemas/OpenAiError"}}},
                "OpenAiError": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["message", "type", "code"],
                    "properties": {
                        "message": {"type": "string", "description": "Human-readable error message."},
                        "type": {"type": "string", "description": "OpenAI-compatible error type."},
                        "param": {"type": "string", "nullable": True, "description": "Request parameter related to the error when available."},
                        "code": {"type": "string", "description": "Machine-readable error code."},
                        "path": {"type": "string", "description": "Gateway path that produced the error when available."},
                    },
                },
                "OpenAiModelList": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["object", "data"],
                    "properties": {
                        "object": {"type": "string", "enum": ["list"], "description": "Object type, always list."},
                        "data": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiModel"}, "description": "Model objects available to the caller."},
                    },
                },
                "OpenAiModel": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "object", "owned_by"],
                    "properties": {
                        "id": {"type": "string", "description": "Model identifier or Claw Router catalog key."},
                        "object": {"type": "string", "enum": ["model"], "description": "Object type, always model."},
                        "created": {"type": "integer", "format": "int64", "description": "Unix timestamp in seconds when the model was created, when known."},
                        "owned_by": {"type": "string", "description": "Organization or provider that owns the model."},
                    },
                },
                "OpenAiChatCompletionRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["model", "messages"],
                    "properties": {
                        "model": {"type": "string", "description": "Model id or Claw Router catalog key routed to a provider account."},
                        "messages": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiChatMessage"}, "description": "Conversation messages in OpenAI-compatible chat format."},
                        "audio": {"$ref": "#/components/schemas/OpenAiChatAudioConfig"},
                        "frequency_penalty": {"type": "number", "minimum": -2, "maximum": 2, "description": "Penalty applied to repeated tokens."},
                        "function_call": {"$ref": "#/components/schemas/OpenAiFunctionCallChoice"},
                        "functions": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiFunctionDefinition"}, "description": "Legacy function definitions passed through for compatible upstreams."},
                        "logit_bias": {"type": "object", "additionalProperties": {"type": "number"}, "description": "Token bias map keyed by token id."},
                        "logprobs": {"type": "boolean", "description": "Whether to return token log probabilities when supported."},
                        "max_completion_tokens": {"type": "integer", "minimum": 1, "description": "Upper bound for generated completion tokens."},
                        "max_tokens": {"type": "integer", "minimum": 1, "description": "Legacy upper bound for generated tokens."},
                        "metadata": {"type": "object", "additionalProperties": True, "description": "Developer-defined metadata attached to the request."},
                        "modalities": {"type": "array", "items": {"type": "string"}, "description": "Requested output modalities, such as text or audio."},
                        "n": {"type": "integer", "minimum": 1, "description": "Number of chat completion choices to generate."},
                        "parallel_tool_calls": {"type": "boolean", "description": "Whether tool calls may be executed in parallel by compatible upstreams."},
                        "prediction": {"$ref": "#/components/schemas/OpenAiPredictionConfig"},
                        "presence_penalty": {"type": "number", "minimum": -2, "maximum": 2, "description": "Penalty applied to new topic tokens."},
                        "reasoning_effort": {"type": "string", "enum": ["minimal", "low", "medium", "high"], "description": "Reasoning effort hint for reasoning models."},
                        "response_format": {"$ref": "#/components/schemas/OpenAiResponseFormat"},
                        "seed": {"type": "integer", "format": "int64", "description": "Best-effort deterministic sampling seed."},
                        "service_tier": {"type": "string", "enum": ["auto", "default", "flex", "priority"], "description": "Requested upstream service tier when supported."},
                        "stop": {"oneOf": [{"type": "string"}, {"type": "array", "items": {"type": "string"}}], "description": "Stop sequence or list of stop sequences."},
                        "store": {"type": "boolean", "description": "Whether the upstream should store the chat completion when supported."},
                        "stream": {"type": "boolean", "default": False, "description": "Whether to stream chat completion chunks."},
                        "stream_options": {"$ref": "#/components/schemas/OpenAiStreamOptions"},
                        "temperature": {"type": "number", "minimum": 0, "maximum": 2, "description": "Sampling temperature."},
                        "tool_choice": {"$ref": "#/components/schemas/OpenAiToolChoice"},
                        "tools": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiTool"}, "description": "Tool definitions available to the model."},
                        "top_logprobs": {"type": "integer", "minimum": 0, "description": "Number of most likely tokens to return at each position."},
                        "top_p": {"type": "number", "minimum": 0, "maximum": 1, "description": "Nucleus sampling probability mass."},
                        "user": {"type": "string", "description": "End-user identifier forwarded to compatible upstreams."},
                    },
                },
                "OpenAiChatMessage": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["role"],
                    "properties": {
                        "role": {"type": "string", "enum": ["developer", "system", "user", "assistant", "tool", "function"], "description": "Message role, such as developer, system, user, assistant, tool, or function."},
                        "content": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiChatContentPart"}},
                                {"type": "null"},
                            ],
                            "description": "Message content as plain text, multimodal content parts, or null for tool call messages.",
                        },
                        "name": {"type": "string", "description": "Optional participant name for the message."},
                        "tool_call_id": {"type": "string", "description": "Tool call identifier that this tool message answers."},
                        "tool_calls": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiToolCall"}, "description": "Tool calls requested by an assistant message."},
                        "function_call": {"$ref": "#/components/schemas/OpenAiFunctionCall"},
                        "refusal": {"type": "string", "description": "Refusal text emitted by compatible upstreams."},
                    },
                },
                "OpenAiChatContentPart": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["text", "image_url", "input_audio", "file"], "description": "Content part type, such as text, image_url, input_audio, or file."},
                        "text": {"type": "string", "description": "Text content for text parts."},
                        "image_url": {"$ref": "#/components/schemas/OpenAiChatImageUrl"},
                        "input_audio": {"$ref": "#/components/schemas/OpenAiChatInputAudio"},
                        "file": {"$ref": "#/components/schemas/OpenAiChatFile"},
                    },
                },
                "OpenAiChatAudioConfig": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "voice": {"type": "string", "description": "Voice identifier for audio output."},
                        "format": {"type": "string", "description": "Audio output format requested from the upstream."},
                    },
                },
                "OpenAiPredictionConfig": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "description": "Prediction configuration type."},
                        "content": {"oneOf": [{"type": "string"}, {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiChatContentPart"}}], "description": "Static predicted content."},
                    },
                },
                "OpenAiResponseFormat": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["text", "json_object", "json_schema"], "description": "Requested response format type."},
                        "json_schema": {"$ref": "#/components/schemas/OpenAiJsonSchemaFormat"},
                    },
                },
                "OpenAiJsonSchemaFormat": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string", "description": "JSON schema response format name."},
                        "description": {"type": "string", "description": "Description of the JSON schema response format."},
                        "schema": {"$ref": "#/components/schemas/OpenAiJsonSchema"},
                        "strict": {"type": "boolean", "description": "Whether strict JSON schema adherence is requested."},
                    },
                },
                "OpenAiJsonSchema": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "type": {"type": "string", "description": "JSON schema type."},
                        "description": {"type": "string", "description": "JSON schema description."},
                        "properties": {"type": "object", "additionalProperties": {"$ref": "#/components/schemas/OpenAiJsonSchema"}, "description": "Object property schemas."},
                        "required": {"type": "array", "items": {"type": "string"}, "description": "Required object property names."},
                        "items": {"$ref": "#/components/schemas/OpenAiJsonSchema"},
                        "additionalProperties": {"$ref": "#/components/schemas/OpenAiJsonSchemaAdditionalProperties"},
                        "enum": {"type": "array", "items": {}, "description": "Allowed literal values."},
                    },
                },
                "OpenAiJsonSchemaAdditionalProperties": {
                    "oneOf": [
                        {"type": "boolean"},
                        {"$ref": "#/components/schemas/OpenAiJsonSchema"},
                    ],
                    "description": "Official JSON Schema additionalProperties value: false/true or a nested schema.",
                },
                "OpenAiChatImageUrl": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["url"],
                    "properties": {
                        "url": {"type": "string", "description": "Image URL or data URL."},
                        "detail": {"type": "string", "description": "Image detail preference, such as low, high, or auto."},
                    },
                },
                "OpenAiChatInputAudio": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["data", "format"],
                    "properties": {
                        "data": {"type": "string", "description": "Base64-encoded audio data."},
                        "format": {"type": "string", "description": "Input audio format."},
                    },
                },
                "OpenAiChatFile": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "file_id": {"type": "string", "description": "Uploaded file identifier."},
                        "filename": {"type": "string", "description": "Input filename when sending inline file data."},
                        "file_data": {"type": "string", "description": "Inline file data accepted by compatible upstreams."},
                    },
                },
                "OpenAiStreamOptions": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "include_usage": {"type": "boolean", "description": "Whether the final stream event should include token usage."},
                    },
                },
                "OpenAiTool": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["function"], "description": "Tool type, commonly function."},
                        "function": {"$ref": "#/components/schemas/OpenAiFunctionDefinition"},
                    },
                },
                "OpenAiToolChoice": {
                    "oneOf": [
                        {"type": "string", "enum": ["none", "auto", "required"]},
                        {"$ref": "#/components/schemas/OpenAiNamedToolChoice"},
                    ],
                    "description": "Controls which tool is called by the model.",
                },
                "OpenAiNamedToolChoice": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type", "function"],
                    "properties": {
                        "type": {"type": "string", "enum": ["function"], "description": "Tool type selected by name."},
                        "function": {"$ref": "#/components/schemas/OpenAiNamedToolChoiceFunction"},
                    },
                },
                "OpenAiNamedToolChoiceFunction": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string", "description": "Function name to force the model to call."},
                    },
                },
                "OpenAiFunctionCallChoice": {
                    "oneOf": [
                        {"type": "string", "enum": ["none", "auto"]},
                        {"$ref": "#/components/schemas/OpenAiNamedFunctionChoice"},
                    ],
                    "description": "Legacy function calling control.",
                },
                "OpenAiNamedFunctionChoice": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string", "description": "Function name to force the model to call."},
                    },
                },
                "OpenAiFunctionDefinition": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string", "description": "Function name visible to the model."},
                        "description": {"type": "string", "description": "Function description visible to the model."},
                        "parameters": {"$ref": "#/components/schemas/OpenAiJsonSchema"},
                        "strict": {"type": "boolean", "description": "Whether strict JSON Schema adherence is requested."},
                    },
                },
                "OpenAiToolCall": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "type"],
                    "properties": {
                        "id": {"type": "string", "description": "Tool call identifier."},
                        "type": {"type": "string", "enum": ["function"], "description": "Tool call type, commonly function."},
                        "function": {"$ref": "#/components/schemas/OpenAiFunctionCall"},
                    },
                },
                "OpenAiFunctionCall": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["name", "arguments"],
                    "properties": {
                        "name": {"type": "string", "description": "Function name selected by the model."},
                        "arguments": {"type": "string", "description": "JSON-serialized function arguments."},
                    },
                },
                "OpenAiChatCompletion": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "object", "created", "model", "choices"],
                    "properties": {
                        "id": {"type": "string", "description": "Chat completion identifier."},
                        "object": {"type": "string", "enum": ["chat.completion"], "description": "Object type, normally chat.completion."},
                        "created": {"type": "integer", "format": "int64", "description": "Unix timestamp in seconds when the completion was created."},
                        "model": {"type": "string", "description": "Model id used by the upstream response."},
                        "choices": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiChatCompletionChoice"}, "description": "Generated chat completion choices."},
                        "usage": {"$ref": "#/components/schemas/OpenAiTokenUsage"},
                        "request_id": {"type": "string", "description": "Upstream request identifier when returned."},
                        "service_tier": {"type": "string", "description": "Service tier used by the upstream when returned."},
                        "system_fingerprint": {"type": "string", "description": "Backend fingerprint for deterministic debugging when returned."},
                    },
                },
                "OpenAiChatCompletionChoice": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["index", "message"],
                    "properties": {
                        "index": {"type": "integer", "description": "Choice index in the response."},
                        "message": {"$ref": "#/components/schemas/OpenAiChatMessage"},
                        "finish_reason": {"type": "string", "description": "Reason generation finished, such as stop, length, content_filter, or tool_calls."},
                        "logprobs": {"$ref": "#/components/schemas/OpenAiChoiceLogprobs"},
                    },
                },
                "OpenAiTokenUsage": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["prompt_tokens", "completion_tokens", "total_tokens"],
                    "properties": {
                        "prompt_tokens": {"type": "integer", "description": "Number of input tokens billed for the request."},
                        "completion_tokens": {"type": "integer", "description": "Number of output tokens generated by the model."},
                        "total_tokens": {"type": "integer", "description": "Total input and output token count."},
                        "prompt_tokens_details": {"$ref": "#/components/schemas/OpenAiPromptTokensDetails"},
                        "completion_tokens_details": {"$ref": "#/components/schemas/OpenAiCompletionTokensDetails"},
                    },
                },
                "OpenAiPromptTokensDetails": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "cached_tokens": {"type": "integer", "description": "Number of input tokens served from cache."},
                        "audio_tokens": {"type": "integer", "description": "Number of input audio tokens."},
                    },
                },
                "OpenAiCompletionTokensDetails": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "reasoning_tokens": {"type": "integer", "description": "Number of reasoning tokens generated."},
                        "audio_tokens": {"type": "integer", "description": "Number of output audio tokens generated."},
                        "accepted_prediction_tokens": {"type": "integer", "description": "Prediction tokens accepted by the model."},
                        "rejected_prediction_tokens": {"type": "integer", "description": "Prediction tokens rejected by the model."},
                    },
                },
                "OpenAiChoiceLogprobs": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "content": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiTokenLogprob"}, "description": "Token log probabilities for generated content."},
                        "refusal": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiTokenLogprob"}, "description": "Token log probabilities for refusal content."},
                    },
                },
                "OpenAiTokenLogprob": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["token", "logprob"],
                    "properties": {
                        "token": {"type": "string", "description": "Token text."},
                        "logprob": {"type": "number", "description": "Token log probability."},
                        "bytes": {"type": "array", "items": {"type": "integer"}, "description": "UTF-8 bytes for the token when returned."},
                        "top_logprobs": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiTopLogprob"}, "description": "Most likely token options at this position."},
                    },
                },
                "OpenAiTopLogprob": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["token", "logprob"],
                    "properties": {
                        "token": {"type": "string", "description": "Candidate token text."},
                        "logprob": {"type": "number", "description": "Candidate token log probability."},
                        "bytes": {"type": "array", "items": {"type": "integer"}, "description": "UTF-8 bytes for the candidate token when returned."},
                    },
                },
                "OpenAiResponsesRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["model", "input"],
                    "properties": {
                        "model": {"type": "string", "description": "Model id or Claw Router catalog key routed to a provider account."},
                        "input": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiResponseInputItem"}},
                            ],
                            "description": "Text or structured multimodal input items for the Responses API.",
                        },
                        "background": {"type": "boolean", "description": "Whether the response may run in the background when supported."},
                        "conversation": {"oneOf": [{"type": "string"}, {"$ref": "#/components/schemas/OpenAiConversationReference"}], "description": "Conversation identifier or object for stateful response creation."},
                        "include": {"type": "array", "items": {"type": "string"}, "description": "Additional response fields to include."},
                        "instructions": {"type": "string", "description": "System or developer instructions for the response."},
                        "max_output_tokens": {"type": "integer", "minimum": 1, "description": "Maximum number of output tokens to generate."},
                        "max_tool_calls": {"type": "integer", "minimum": 1, "description": "Maximum number of tool calls the model may make."},
                        "metadata": {"type": "object", "additionalProperties": True, "description": "Developer-defined metadata attached to the response."},
                        "parallel_tool_calls": {"type": "boolean", "description": "Whether compatible upstreams may issue parallel tool calls."},
                        "previous_response_id": {"type": "string", "description": "Previous response identifier for chained responses."},
                        "prompt": {"$ref": "#/components/schemas/OpenAiPromptReference"},
                        "prompt_cache_key": {"type": "string", "description": "Application supplied cache key for prompt caching."},
                        "reasoning": {"$ref": "#/components/schemas/OpenAiReasoningConfig"},
                        "service_tier": {"type": "string", "enum": ["auto", "default", "flex", "priority"], "description": "Requested upstream service tier when supported."},
                        "store": {"type": "boolean", "description": "Whether the upstream should store the response."},
                        "stream": {"type": "boolean", "default": False, "description": "Whether to stream response events."},
                        "temperature": {"type": "number", "minimum": 0, "maximum": 2, "description": "Sampling temperature."},
                        "text": {"$ref": "#/components/schemas/OpenAiTextConfig"},
                        "tool_choice": {"$ref": "#/components/schemas/OpenAiToolChoice"},
                        "tools": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiTool"}, "description": "Tools available to the model."},
                        "top_logprobs": {"type": "integer", "minimum": 0, "description": "Number of likely token options to include when logprobs are requested."},
                        "top_p": {"type": "number", "minimum": 0, "maximum": 1, "description": "Nucleus sampling probability mass."},
                        "truncation": {"type": "string", "enum": ["auto", "disabled"], "description": "Input truncation strategy for long context requests."},
                        "user": {"type": "string", "description": "End-user identifier forwarded to compatible upstreams."},
                    },
                },
                "OpenAiConversationReference": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "id": {"type": "string", "description": "Conversation identifier."},
                    },
                },
                "OpenAiPromptReference": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "id": {"type": "string", "description": "Reusable prompt identifier."},
                        "version": {"type": "string", "description": "Reusable prompt version."},
                        "variables": {"type": "object", "additionalProperties": True, "description": "Prompt variables supplied by the caller."},
                    },
                },
                "OpenAiReasoningConfig": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "effort": {"type": "string", "enum": ["minimal", "low", "medium", "high"], "description": "Reasoning effort hint."},
                        "summary": {"type": "string", "enum": ["auto", "concise", "detailed"], "description": "Reasoning summary behavior when supported."},
                    },
                },
                "OpenAiTextConfig": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "format": {"$ref": "#/components/schemas/OpenAiResponseFormat"},
                    },
                },
                "OpenAiResponseInputItem": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "role": {"type": "string", "enum": ["developer", "system", "user", "assistant", "tool", "function"], "description": "Input item role, commonly user, assistant, developer, or system."},
                        "content": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiResponseInputContentPart"}},
                            ],
                            "description": "Input item content as text or typed input content parts.",
                        },
                        "type": {"type": "string", "description": "Input item type when using typed Responses API items."},
                        "id": {"type": "string", "description": "Input item identifier when referencing an existing item."},
                        "status": {"type": "string", "description": "Input item status when supplied by upstream state."},
                    },
                },
                "OpenAiResponseInputContentPart": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["input_text", "input_image", "input_file"], "description": "Responses API input content part type."},
                        "text": {"type": "string", "description": "Text for input_text parts."},
                        "image_url": {"type": "string", "description": "Image URL for input_image parts."},
                        "detail": {"type": "string", "description": "Image detail preference when supported."},
                        "file_id": {"type": "string", "description": "Uploaded file identifier for input_file parts."},
                        "filename": {"type": "string", "description": "Filename for inline file inputs."},
                        "file_data": {"type": "string", "description": "Inline file data for compatible upstreams."},
                    },
                },
                "OpenAiResponse": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "object", "model", "output"],
                    "properties": {
                        "id": {"type": "string", "description": "Response identifier."},
                        "object": {"type": "string", "enum": ["response"], "description": "Object type, normally response."},
                        "created_at": {"type": "integer", "format": "int64", "description": "Unix timestamp in seconds when the response was created."},
                        "status": {"type": "string", "enum": ["queued", "in_progress", "completed", "failed", "cancelled", "incomplete"], "description": "Response status."},
                        "model": {"type": "string", "description": "Model id used by the upstream response."},
                        "output": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiResponseOutputItem"}, "description": "Output items generated by the response."},
                        "output_text": {"type": "string", "description": "Convenience text output when returned by the upstream."},
                        "usage": {"$ref": "#/components/schemas/OpenAiResponseUsage"},
                        "error": {"$ref": "#/components/schemas/OpenAiResponseError"},
                        "incomplete_details": {"$ref": "#/components/schemas/OpenAiIncompleteDetails"},
                    },
                },
                "OpenAiResponseOutputItem": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "id": {"type": "string", "description": "Output item identifier."},
                        "type": {"type": "string", "enum": ["message", "function_call", "web_search_call", "file_search_call", "computer_call", "reasoning"], "description": "Output item type."},
                        "role": {"type": "string", "enum": ["developer", "system", "user", "assistant", "tool", "function"], "description": "Role for message output items."},
                        "status": {"type": "string", "description": "Status for the output item."},
                        "content": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiResponseOutputContent"}, "description": "Content parts for message output items."},
                    },
                },
                "OpenAiResponseOutputContent": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["output_text", "refusal"], "description": "Output content type."},
                        "text": {"type": "string", "description": "Text emitted by output_text content parts."},
                        "refusal": {"type": "string", "description": "Refusal text emitted by refusal content parts."},
                        "annotations": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiAnnotation"}, "description": "Annotations attached to the output text."},
                    },
                },
                "OpenAiResponseError": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "code": {"type": "string", "description": "Response error code."},
                        "message": {"type": "string", "description": "Human-readable response error message."},
                        "param": {"type": "string", "description": "Parameter related to the response error."},
                        "type": {"type": "string", "description": "Response error type."},
                    },
                },
                "OpenAiIncompleteDetails": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["reason"],
                    "properties": {
                        "reason": {"type": "string", "enum": ["max_output_tokens", "content_filter"], "description": "Reason the response is incomplete."},
                    },
                },
                "OpenAiAnnotation": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "enum": ["file_citation", "url_citation", "file_path"], "description": "Annotation type."},
                        "file_id": {"type": "string", "description": "Referenced file identifier when applicable."},
                        "filename": {"type": "string", "description": "Referenced filename when applicable."},
                        "index": {"type": "integer", "description": "Annotation index when returned by the upstream."},
                        "url": {"type": "string", "description": "Referenced URL when applicable."},
                        "title": {"type": "string", "description": "Referenced URL title when applicable."},
                        "start_index": {"type": "integer", "description": "Start character index for the annotation."},
                        "end_index": {"type": "integer", "description": "End character index for the annotation."},
                    },
                },
                "OpenAiResponseUsage": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["input_tokens", "output_tokens", "total_tokens"],
                    "properties": {
                        "input_tokens": {"type": "integer", "description": "Number of input tokens billed for the response."},
                        "output_tokens": {"type": "integer", "description": "Number of output tokens generated by the response."},
                        "total_tokens": {"type": "integer", "description": "Total input and output token count."},
                        "input_tokens_details": {"$ref": "#/components/schemas/OpenAiResponseInputTokensDetails"},
                        "output_tokens_details": {"$ref": "#/components/schemas/OpenAiResponseOutputTokensDetails"},
                    },
                },
                "OpenAiResponseInputTokensDetails": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "cached_tokens": {"type": "integer", "description": "Input tokens served from cache."},
                    },
                },
                "OpenAiResponseOutputTokensDetails": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "reasoning_tokens": {"type": "integer", "description": "Reasoning tokens generated by the response."},
                    },
                },
                "OpenAiEmbeddingsRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["model", "input"],
                    "properties": {
                        "model": {"type": "string", "description": "Embedding model id or Claw Router catalog key routed to a provider account."},
                        "input": {
                            "oneOf": [
                                {"type": "string"},
                                {"type": "array", "items": {"type": "string"}},
                                {"type": "array", "items": {"type": "integer"}},
                                {"type": "array", "items": {"type": "array", "items": {"type": "integer"}}},
                            ],
                            "description": "Input text, text array, token array, or token array batch to embed.",
                        },
                        "encoding_format": {"type": "string", "enum": ["float", "base64"], "description": "Format for returned embeddings."},
                        "dimensions": {"type": "integer", "minimum": 1, "description": "Requested embedding dimensionality when supported by the model."},
                        "user": {"type": "string", "description": "End-user identifier forwarded to compatible upstreams."},
                    },
                },
                "OpenAiEmbeddingList": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["object", "data", "usage"],
                    "properties": {
                        "object": {"type": "string", "enum": ["list"], "description": "Object type, always list."},
                        "data": {"type": "array", "items": {"$ref": "#/components/schemas/OpenAiEmbedding"}, "description": "Embedding vectors in input order."},
                        "model": {"type": "string", "description": "Embedding model used by the upstream response."},
                        "usage": {"$ref": "#/components/schemas/OpenAiEmbeddingUsage"},
                    },
                },
                "OpenAiEmbedding": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["object", "index", "embedding"],
                    "properties": {
                        "object": {"type": "string", "enum": ["embedding"], "description": "Object type, always embedding."},
                        "index": {"type": "integer", "description": "Index of the embedding in the input batch."},
                        "embedding": {
                            "oneOf": [
                                {"type": "array", "items": {"type": "number"}},
                                {"type": "string"},
                            ],
                            "description": "Embedding vector as floats, or base64-encoded vector when requested.",
                        },
                    },
                },
                "OpenAiEmbeddingUsage": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["prompt_tokens", "total_tokens"],
                    "properties": {
                        "prompt_tokens": {"type": "integer", "description": "Number of input tokens embedded."},
                        "total_tokens": {"type": "integer", "description": "Total token count for the embedding request."},
                    },
                },
                "OpenAiImageGenerationRequest": {"type": "object", "additionalProperties": True, "required": ["model", "prompt"], "properties": {"model": {"type": "string", "description": "Image model id or Claw Router catalog key."}, "prompt": {"type": "string", "description": "Text prompt describing the image to generate."}, "size": {"type": "string", "description": "Requested image size."}, "quality": {"type": "string", "description": "Requested image quality when supported."}, "response_format": {"type": "string", "description": "Desired response format, such as url or b64_json."}}},
                "OpenAiImageEditRequest": {"type": "object", "additionalProperties": True, "required": ["model", "prompt"], "properties": {"model": {"type": "string", "description": "Image edit model id or Claw Router catalog key."}, "prompt": {"type": "string", "description": "Text prompt describing the edit."}, "image": {"description": "Image input accepted as a URL, file id, or provider-specific JSON value."}, "mask": {"description": "Optional mask input."}}},
                "OpenAiImageEditMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["model", "prompt", "image"], "properties": {"model": {"type": "string", "description": "Image edit model id or Claw Router catalog key."}, "prompt": {"type": "string", "description": "Text prompt describing the edit."}, "image": {"type": "string", "format": "binary", "description": "Image file to edit."}, "mask": {"type": "string", "format": "binary", "description": "Optional mask file."}}},
                "OpenAiImageVariationRequest": {"type": "object", "additionalProperties": True, "required": ["model", "image"], "properties": {"model": {"type": "string", "description": "Image variation model id or Claw Router catalog key."}, "image": {"description": "Image input accepted as a URL, file id, or provider-specific JSON value."}, "size": {"type": "string", "description": "Requested image size."}}},
                "OpenAiImageVariationMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["model", "image"], "properties": {"model": {"type": "string", "description": "Image variation model id or Claw Router catalog key."}, "image": {"type": "string", "format": "binary", "description": "Source image file."}, "size": {"type": "string", "description": "Requested image size."}}},
                "OpenAiAudioTranscriptionRequest": {"type": "object", "additionalProperties": True, "required": ["model", "file"], "properties": {"model": {"type": "string", "description": "Transcription model id or Claw Router catalog key."}, "file": {"description": "Audio file URL, file id, or provider-specific JSON value."}, "language": {"type": "string", "description": "Optional source language hint."}, "prompt": {"type": "string", "description": "Optional text prompt to guide transcription."}, "response_format": {"type": "string", "description": "Desired transcription response format."}}},
                "OpenAiAudioTranscriptionMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["model", "file"], "properties": {"model": {"type": "string", "description": "Transcription model id or Claw Router catalog key."}, "file": {"type": "string", "format": "binary", "description": "Audio file to transcribe."}, "language": {"type": "string", "description": "Optional source language hint."}, "prompt": {"type": "string", "description": "Optional text prompt to guide transcription."}, "response_format": {"type": "string", "description": "Desired transcription response format."}}},
                "OpenAiAudioTranslationRequest": {"type": "object", "additionalProperties": True, "required": ["model", "file"], "properties": {"model": {"type": "string", "description": "Translation model id or Claw Router catalog key."}, "file": {"description": "Audio file URL, file id, or provider-specific JSON value."}, "prompt": {"type": "string", "description": "Optional text prompt to guide translation."}, "response_format": {"type": "string", "description": "Desired translation response format."}}},
                "OpenAiAudioTranslationMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["model", "file"], "properties": {"model": {"type": "string", "description": "Translation model id or Claw Router catalog key."}, "file": {"type": "string", "format": "binary", "description": "Audio file to translate."}, "prompt": {"type": "string", "description": "Optional text prompt to guide translation."}, "response_format": {"type": "string", "description": "Desired translation response format."}}},
                "OpenAiVoiceConsentMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["file"], "properties": {"file": {"type": "string", "format": "binary", "description": "Voice consent file."}, "name": {"type": "string", "description": "Human-readable voice consent name."}, "metadata": {"type": "object", "additionalProperties": True, "description": "Provider-specific metadata for the voice consent."}}},
                "OpenAiFileUploadRequest": {"type": "object", "additionalProperties": True, "required": ["file", "purpose"], "properties": {"file": {"type": "string", "format": "binary", "description": "File bytes to upload."}, "purpose": {"type": "string", "description": "OpenAI-compatible file purpose, such as assistants, batch, fine-tune, vision, or provider-specific values."}}},
                "OpenAiUploadPartMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["data"], "properties": {"data": {"type": "string", "format": "binary", "description": "Binary upload part data."}}},
                "OpenAiRealtimeCallMultipartRequest": {"type": "object", "additionalProperties": True, "required": ["sdp"], "properties": {"sdp": {"type": "string", "description": "WebRTC SDP offer."}, "session": {"type": "string", "description": "JSON-serialized realtime session configuration."}}},
                "SdpResponse": {"type": "string", "description": "WebRTC SDP answer returned as application/sdp."},
                "ProviderMultipartRequest": {"type": "object", "additionalProperties": True, "description": "Provider-specific multipart form fields and binary files."},
                "OpenAiConversationCreateRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "metadata": {
                            "type": "object",
                            "additionalProperties": {"type": "string"},
                            "description": "Developer-defined metadata attached to the conversation.",
                        },
                        "items": {
                            "type": "array",
                            "description": "Initial input items to add to the conversation.",
                            "items": {"$ref": "#/components/schemas/OpenAiConversationItemCreateRequest"},
                        },
                    },
                },
                "OpenAiConversationUpdateRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "metadata": {
                            "type": "object",
                            "additionalProperties": {"type": "string"},
                            "description": "Replacement metadata for the conversation.",
                        },
                    },
                },
                "OpenAiConversation": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "object", "created_at"],
                    "properties": {
                        "id": {"type": "string", "description": "Conversation identifier."},
                        "object": {"type": "string", "enum": ["conversation"], "description": "Object type, always conversation."},
                        "created_at": {"type": "integer", "format": "int64", "description": "Unix timestamp in seconds when the conversation was created."},
                        "metadata": {
                            "type": "object",
                            "additionalProperties": {"type": "string"},
                            "description": "Developer-defined metadata attached to the conversation.",
                        },
                    },
                },
                "OpenAiConversationList": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["object", "data"],
                    "properties": {
                        "object": {"type": "string", "enum": ["list"], "description": "Object type, always list."},
                        "data": {
                            "type": "array",
                            "items": {"$ref": "#/components/schemas/OpenAiConversation"},
                            "description": "Conversation objects in the requested page.",
                        },
                        "first_id": {"type": "string", "nullable": True, "description": "Identifier of the first object in the page."},
                        "last_id": {"type": "string", "nullable": True, "description": "Identifier of the last object in the page."},
                        "has_more": {"type": "boolean", "description": "Whether additional pages are available."},
                    },
                },
                "OpenAiConversationItemCreateRequest": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "description": "Conversation item type, such as message, reasoning, tool_call, or provider-specific item type."},
                        "role": {"type": "string", "description": "Message role when the item represents a message."},
                        "content": {
                            "type": "array",
                            "items": {"$ref": "#/components/schemas/OpenAiConversationContentPart"},
                            "description": "Text or multimodal content parts for the item.",
                        },
                        "metadata": {
                            "type": "object",
                            "additionalProperties": {"type": "string"},
                            "description": "Developer-defined metadata attached to the item.",
                        },
                    },
                },
                "OpenAiConversationItem": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["id", "object", "type"],
                    "properties": {
                        "id": {"type": "string", "description": "Conversation item identifier."},
                        "object": {"type": "string", "enum": ["conversation.item"], "description": "Object type, always conversation.item."},
                        "type": {"type": "string", "description": "Conversation item type."},
                        "role": {"type": "string", "description": "Message role when the item represents a message."},
                        "content": {
                            "type": "array",
                            "items": {"$ref": "#/components/schemas/OpenAiConversationContentPart"},
                            "description": "Text or multimodal content parts for the item.",
                        },
                        "status": {"type": "string", "description": "Provider item status when returned by the upstream."},
                        "created_at": {"type": "integer", "format": "int64", "description": "Unix timestamp in seconds when the item was created."},
                        "metadata": {
                            "type": "object",
                            "additionalProperties": {"type": "string"},
                            "description": "Developer-defined metadata attached to the item.",
                        },
                    },
                },
                "OpenAiConversationItemList": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["object", "data"],
                    "properties": {
                        "object": {"type": "string", "enum": ["list"], "description": "Object type, always list."},
                        "data": {
                            "type": "array",
                            "items": {"$ref": "#/components/schemas/OpenAiConversationItem"},
                            "description": "Conversation items in the requested page.",
                        },
                        "first_id": {"type": "string", "nullable": True, "description": "Identifier of the first object in the page."},
                        "last_id": {"type": "string", "nullable": True, "description": "Identifier of the last object in the page."},
                        "has_more": {"type": "boolean", "description": "Whether additional pages are available."},
                    },
                },
                "OpenAiConversationContentPart": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string", "description": "Content part type, such as input_text, output_text, input_image, or provider-specific type."},
                        "text": {"type": "string", "description": "Text content for text parts."},
                        "image_url": {"type": "string", "description": "Image URL for image parts when represented as a URL."},
                        "file_id": {"type": "string", "description": "Uploaded file identifier for file-backed content parts."},
                    },
                },
                "ViduTextToVideoRequest": {"type": "object", "additionalProperties": True, "required": ["model", "prompt"], "properties": self._vidu_video_request_properties()},
                "ViduImageToVideoRequest": {"type": "object", "additionalProperties": True, "required": ["model", "images"], "properties": {**self._vidu_video_request_properties(), "images": {"type": "array", "items": {"type": "string"}, "description": "Source image URLs or Vidu-supported image references."}}},
                "ViduReferenceToVideoRequest": {"type": "object", "additionalProperties": True, "required": ["model", "images"], "properties": {**self._vidu_video_request_properties(), "images": {"type": "array", "items": {"type": "string"}, "description": "Reference image URLs or Vidu-supported image references."}}},
                "ViduStartEndToVideoRequest": {"type": "object", "additionalProperties": True, "required": ["model", "images"], "properties": {**self._vidu_video_request_properties(), "images": {"type": "array", "items": {"type": "string"}, "description": "Start and end image URLs or Vidu-supported image references."}}},
                "ViduReferenceToImageRequest": {"type": "object", "additionalProperties": True, "required": ["model", "prompt", "images"], "properties": {**self._vidu_image_request_properties(), "images": {"type": "array", "items": {"type": "string"}, "description": "Reference image URLs or Vidu-supported image references."}}},
                "ViduVideoGenerationTask": {"type": "object", "additionalProperties": True, "properties": self._vidu_task_properties("video")},
                "ViduImageGenerationTask": {"type": "object", "additionalProperties": True, "properties": self._vidu_task_properties("image")},
                "ViduTaskCreationsResponse": {"type": "object", "additionalProperties": True, "properties": {**self._vidu_task_properties("creation"), "creations": {"type": "array", "items": {"type": "object", "additionalProperties": True}, "description": "Vidu creation records for the task."}}},
            },
        }

    def _vidu_video_request_properties(self) -> dict[str, Any]:
        return {
            "model": {"type": "string", "description": "Vidu model name accepted by the upstream account."},
            "prompt": {"type": "string", "description": "Text prompt sent to the Vidu API."},
            "duration": {"type": "integer", "description": "Requested video duration in seconds when supported by the selected Vidu model."},
            "aspect_ratio": {"type": "string", "description": "Requested output aspect ratio."},
            "resolution": {"type": "string", "description": "Requested output resolution when supported."},
            "movement_amplitude": {"type": "string", "description": "Vidu movement amplitude option when supported."},
            "seed": {"type": "integer", "format": "int64", "description": "Optional deterministic seed."},
            "callback_url": {"type": "string", "description": "Optional callback URL sent to Vidu."},
            "payload": {"type": "string", "description": "Optional provider callback payload sent to Vidu."},
        }

    def _vidu_image_request_properties(self) -> dict[str, Any]:
        return {
            "model": {"type": "string", "description": "Vidu image model name accepted by the upstream account."},
            "prompt": {"type": "string", "description": "Text prompt sent to the Vidu API."},
            "style": {"type": "string", "description": "Provider-specific image style option when supported."},
            "aspect_ratio": {"type": "string", "description": "Requested output aspect ratio."},
            "seed": {"type": "integer", "format": "int64", "description": "Optional deterministic seed."},
            "callback_url": {"type": "string", "description": "Optional callback URL sent to Vidu."},
            "payload": {"type": "string", "description": "Optional provider callback payload sent to Vidu."},
        }

    def _vidu_task_properties(self, object_name: str) -> dict[str, Any]:
        return {
            "task_id": {"type": "string", "description": f"Vidu {object_name} task identifier."},
            "state": {"type": "string", "description": "Vidu task state."},
            "model": {"type": "string", "description": "Vidu model used by the task."},
            "created_at": {"type": "string", "description": "Task creation timestamp."},
            "creations": {"type": "array", "items": {"type": "object", "additionalProperties": True}, "description": "Generated media records when included by Vidu."},
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Claw Router gateway OpenAPI spec.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--output", type=Path, default=None, help="Gateway OpenAPI output path")
    parser.add_argument("--check", action="store_true", help="validate generated gateway OpenAPI spec is current")
    args = parser.parse_args()

    generator = ClawRouterGatewayOpenApiGenerator(root=args.root, output_path=args.output)
    if args.check:
        result = generator.check()
        if result.ok:
            print("Claw Router gateway OpenAPI spec is current")
            return 0
        for message in result.messages:
            print(message)
        return 1

    output = generator.write()
    print(f"Wrote Claw Router gateway OpenAPI spec to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
