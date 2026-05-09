import json
import re
import tempfile
import unittest
from pathlib import Path

from tools.clawrouter_gateway_openapi_generator import ClawRouterGatewayOpenApiGenerator


class ClawRouterGatewayOpenApiGeneratorTest(unittest.TestCase):
    def test_generates_gateway_standard_openapi_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            spec = ClawRouterGatewayOpenApiGenerator(root=root).generate()

            self.assertEqual("3.0.0", spec["openapi"])
            self.assertEqual("Claw Router Open API", spec["info"]["title"])
            self.assertEqual("/v1", spec["x-api-prefix"])
            self.assertNotIn("x-provider-passthrough", spec)

            for path in [
                "/v1/models",
                "/v1/models/{model}",
                "/v1/completions",
                "/v1/moderations",
                "/v1/chat/completions",
                "/v1/responses",
                "/v1/responses/input_tokens",
                "/v1/responses/compact",
                "/v1/responses/{response_id}/cancel",
                "/v1/responses/{response_id}/input_items",
                "/v1/embeddings",
                "/v1/images/generations",
                "/v1/videos",
                "/v1/videos/characters",
                "/v1/videos/characters/{character_id}",
                "/v1/videos/edits",
                "/v1/videos/extensions",
                "/v1/videos/{video_id}",
                "/v1/videos/{video_id}/content",
                "/v1/audio/speech",
                "/v1/audio/voices",
                "/v1/audio/voice_consents",
                "/v1/audio/voice_consents/{consent_id}",
                "/v1/files",
                "/v1/vector_stores",
                "/v1/vector_stores/{vector_store_id}/search",
                "/v1/vector_stores/{vector_store_id}/files",
                "/v1/vector_stores/{vector_store_id}/file_batches",
                "/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel",
                "/v1/assistants",
                "/v1/threads",
                "/v1/threads/runs",
                "/v1/threads/{thread_id}/messages/{message_id}",
                "/v1/threads/{thread_id}/runs/{run_id}/steps",
                "/v1/batches",
                "/v1/batches/{batch_id}/cancel",
                "/v1/fine_tuning/jobs",
                "/v1/fine_tuning/jobs/{fine_tuning_job_id}/events",
                "/v1/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints",
                "/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions",
                "/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}",
                "/v1/conversations",
                "/v1/conversations/{conversation_id}",
                "/v1/conversations/{conversation_id}/items",
                "/v1/conversations/{conversation_id}/items/{item_id}",
                "/v1/containers",
                "/v1/containers/{container_id}",
                "/v1/containers/{container_id}/files",
                "/v1/containers/{container_id}/files/{file_id}",
                "/v1/containers/{container_id}/files/{file_id}/content",
                "/v1/evals",
                "/v1/evals/{eval_id}",
                "/v1/evals/{eval_id}/runs",
                "/v1/evals/{eval_id}/runs/{run_id}",
                "/v1/evals/{eval_id}/runs/{run_id}/output_items",
                "/v1/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}",
                "/v1/fine_tuning/alpha/graders/run",
                "/v1/fine_tuning/alpha/graders/validate",
                "/v1/skills/{skill_id}/content",
                "/v1/skills/{skill_id}/versions/{version}/content",
                "/v1/organization/costs",
                "/v1/organization/usage/completions",
                "/v1/organization/usage/embeddings",
                "/v1/organization/usage/moderations",
                "/v1/organization/usage/images",
                "/v1/organization/usage/audio_speeches",
                "/v1/organization/usage/audio_transcriptions",
                "/v1/organization/usage/vector_stores",
                "/v1/organization/usage/code_interpreter_sessions",
                "/v1/organization/audit_logs",
                "/v1/organization/admin_api_keys",
                "/v1/organization/admin_api_keys/{key_id}",
                "/v1/organization/invites",
                "/v1/organization/invites/{invite_id}",
                "/v1/organization/users",
                "/v1/organization/users/{user_id}",
                "/v1/organization/users/{user_id}/roles",
                "/v1/organization/users/{user_id}/roles/{role_id}",
                "/v1/organization/groups",
                "/v1/organization/groups/{group_id}",
                "/v1/organization/groups/{group_id}/users",
                "/v1/organization/groups/{group_id}/users/{user_id}",
                "/v1/organization/groups/{group_id}/roles",
                "/v1/organization/groups/{group_id}/roles/{role_id}",
                "/v1/organization/roles",
                "/v1/organization/roles/{role_id}",
                "/v1/organization/certificates",
                "/v1/organization/certificates/{certificate_id}",
                "/v1/organization/certificates/activate",
                "/v1/organization/certificates/deactivate",
                "/v1/organization/projects",
                "/v1/organization/projects/{project_id}",
                "/v1/organization/projects/{project_id}/archive",
                "/v1/organization/projects/{project_id}/users",
                "/v1/organization/projects/{project_id}/users/{user_id}",
                "/v1/organization/projects/{project_id}/service_accounts",
                "/v1/organization/projects/{project_id}/service_accounts/{service_account_id}",
                "/v1/organization/projects/{project_id}/api_keys",
                "/v1/organization/projects/{project_id}/api_keys/{key_id}",
                "/v1/organization/projects/{project_id}/rate_limits",
                "/v1/organization/projects/{project_id}/rate_limits/{rate_limit_id}",
                "/v1/organization/projects/{project_id}/groups",
                "/v1/organization/projects/{project_id}/groups/{group_id}",
                "/v1/organization/projects/{project_id}/certificates",
                "/v1/organization/projects/{project_id}/certificates/activate",
                "/v1/organization/projects/{project_id}/certificates/deactivate",
                "/v1/projects/{project_id}/roles",
                "/v1/projects/{project_id}/roles/{role_id}",
                "/v1/projects/{project_id}/users/{user_id}/roles",
                "/v1/projects/{project_id}/users/{user_id}/roles/{role_id}",
                "/v1/projects/{project_id}/groups/{group_id}/roles",
                "/v1/projects/{project_id}/groups/{group_id}/roles/{role_id}",
                "/v1/uploads",
                "/v1/realtime/client_secrets",
                "/v1/realtime/calls",
                "/v1/realtime/calls/{call_id}/accept",
                "/v1/realtime/calls/{call_id}/hangup",
                "/v1/realtime/calls/{call_id}/refer",
                "/v1/realtime/calls/{call_id}/reject",
                "/v1/realtime/sessions",
                "/v1/realtime/translations",
                "/google/v1beta/models/{model}:generateContent",
                "/google/v1beta/models/{model}:streamGenerateContent",
                "/google/v1beta/models/{model}:embedContent",
                "/google/v1beta/models/{model}:batchEmbedContents",
                "/google/v1beta/models/{model}:countTokens",
                "/anthropic/v1/messages",
                "/anthropic/v1/messages/count_tokens",
                "/volcengine/api/v3/contents/generations/tasks",
                "/suno/v1/music/generations",
                "/midjourney/v1/images/generations",
                "/kling/v1/videos/generations",
                "/vidu/ent/v2/text2video",
                "/vidu/ent/v2/img2video",
                "/vidu/ent/v2/reference2video",
                "/vidu/ent/v2/start-end2video",
                "/vidu/ent/v2/reference2image",
                "/vidu/ent/v2/tasks/{task_id}/creations",
                "/nano-banana/v1/images/generations",
            ]:
                self.assertIn(path, spec["paths"])

            self.assertEqual(
                "deleteModel",
                spec["paths"]["/v1/models/{model}"]["delete"]["operationId"],
            )

            operation = spec["paths"]["/google/v1beta/models/{model}:generateContent"]["post"]
            self.assertNotIn("x-provider", operation)
            self.assertNotIn("x-passthrough", operation)
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiErrorEnvelope"},
                operation["responses"]["501"]["content"]["application/json"]["schema"],
            )
            self.assertNotIn("/google/{path}", spec["paths"])
            self.assertNotIn("/vidu/{path}", spec["paths"])

    def test_documents_standard_list_pagination_parameters(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            for path, method in [
                ("/v1/chat/completions", "get"),
                ("/v1/chat/completions/{completion_id}/messages", "get"),
                ("/v1/responses/{response_id}/input_items", "get"),
                ("/v1/files", "get"),
                ("/v1/audio/voice_consents", "get"),
                ("/v1/videos", "get"),
                ("/v1/vector_stores", "get"),
                ("/v1/vector_stores/{vector_store_id}/files", "get"),
                ("/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/files", "get"),
                ("/v1/assistants", "get"),
                ("/v1/threads/{thread_id}/messages", "get"),
                ("/v1/threads/{thread_id}/runs", "get"),
                ("/v1/threads/{thread_id}/runs/{run_id}/steps", "get"),
                ("/v1/batches", "get"),
                ("/v1/fine_tuning/jobs", "get"),
                ("/v1/fine_tuning/jobs/{fine_tuning_job_id}/events", "get"),
                ("/v1/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints", "get"),
                ("/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions", "get"),
                ("/v1/conversations", "get"),
                ("/v1/conversations/{conversation_id}/items", "get"),
                ("/v1/containers", "get"),
                ("/v1/containers/{container_id}/files", "get"),
                ("/v1/evals", "get"),
                ("/v1/evals/{eval_id}/runs", "get"),
                ("/v1/evals/{eval_id}/runs/{run_id}/output_items", "get"),
                ("/v1/organization/admin_api_keys", "get"),
                ("/v1/organization/invites", "get"),
                ("/v1/organization/users", "get"),
                ("/v1/organization/users/{user_id}/roles", "get"),
                ("/v1/organization/groups", "get"),
                ("/v1/organization/groups/{group_id}/roles", "get"),
                ("/v1/organization/roles", "get"),
                ("/v1/organization/certificates", "get"),
                ("/v1/organization/projects", "get"),
                ("/v1/organization/projects/{project_id}/users", "get"),
                ("/v1/organization/projects/{project_id}/service_accounts", "get"),
                ("/v1/organization/projects/{project_id}/api_keys", "get"),
                ("/v1/organization/projects/{project_id}/rate_limits", "get"),
                ("/v1/organization/projects/{project_id}/groups", "get"),
                ("/v1/organization/projects/{project_id}/certificates", "get"),
                ("/v1/projects/{project_id}/roles", "get"),
                ("/v1/projects/{project_id}/users/{user_id}/roles", "get"),
                ("/v1/projects/{project_id}/groups/{group_id}/roles", "get"),
            ]:
                operation = spec["paths"][path][method]
                parameter_names = {parameter["name"] for parameter in operation["parameters"]}
                self.assertTrue(
                    {"limit", "order", "after", "before"}.issubset(parameter_names),
                    f"{method.upper()} {path} must declare OpenAI-compatible list pagination parameters",
                )

    def test_documents_stored_chat_completion_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            chat_collection = spec["paths"]["/v1/chat/completions"]
            self.assertIn("post", chat_collection)
            self.assertIn("get", chat_collection)
            self.assertEqual(
                "listChatCompletions",
                chat_collection["get"]["operationId"],
            )
            chat_collection_query_names = {
                parameter["name"]
                for parameter in chat_collection["get"]["parameters"]
                if parameter["in"] == "query"
            }
            self.assertTrue(
                {"limit", "order", "after", "before", "model", "metadata"}.issubset(
                    chat_collection_query_names
                )
            )

            chat_item = spec["paths"]["/v1/chat/completions/{completion_id}"]
            self.assertEqual({"get", "post", "delete"}, set(chat_item.keys()))
            self.assertEqual(
                "retrieveChatCompletion",
                chat_item["get"]["operationId"],
            )
            self.assertEqual(
                "modifyChatCompletion",
                chat_item["post"]["operationId"],
            )
            self.assertEqual(
                "deleteChatCompletion",
                chat_item["delete"]["operationId"],
            )

            messages = spec["paths"]["/v1/chat/completions/{completion_id}/messages"]["get"]
            self.assertEqual("listChatCompletionMessages", messages["operationId"])
            path_parameter_names = {
                parameter["name"]
                for parameter in messages["parameters"]
                if parameter["in"] == "path"
            }
            self.assertEqual({"completion_id"}, path_parameter_names)

    def test_documents_response_include_query_parameter(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            for path, method in [
                ("/v1/responses/{response_id}", "get"),
                ("/v1/responses/{response_id}/input_items", "get"),
            ]:
                query_parameters = {
                    parameter["name"]: parameter
                    for parameter in spec["paths"][path][method]["parameters"]
                    if parameter["in"] == "query"
                }
                self.assertIn("include[]", query_parameters, f"{method.upper()} {path}")
                self.assertEqual(
                    "array",
                    query_parameters["include[]"]["schema"]["type"],
                    f"{method.upper()} {path}",
                )

    def test_documents_conversation_request_and_response_shapes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            schemas = spec["components"]["schemas"]
            for schema_name in [
                "OpenAiConversationCreateRequest",
                "OpenAiConversationUpdateRequest",
                "OpenAiConversation",
                "OpenAiConversationList",
                "OpenAiConversationItemCreateRequest",
                "OpenAiConversationItem",
                "OpenAiConversationItemList",
            ]:
                self.assertIn(schema_name, schemas)

            list_operation = spec["paths"]["/v1/conversations"]["get"]
            create_operation = spec["paths"]["/v1/conversations"]["post"]
            retrieve_operation = spec["paths"]["/v1/conversations/{conversation_id}"]["get"]
            create_item_operation = spec["paths"]["/v1/conversations/{conversation_id}/items"]["post"]

            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversationList"},
                list_operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversationCreateRequest"},
                create_operation["requestBody"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversation"},
                create_operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversation"},
                retrieve_operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversationItemCreateRequest"},
                create_item_operation["requestBody"]["content"]["application/json"]["schema"],
            )
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiConversationItem"},
                create_item_operation["responses"]["200"]["content"]["application/json"]["schema"],
            )
            self.assertIn("data", schemas["OpenAiConversationList"]["properties"])
            self.assertIn("items", schemas["OpenAiConversationCreateRequest"]["properties"])

    def test_documents_multipart_and_binary_passthrough_request_bodies(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            expected_multipart_refs = {
                ("/v1/files", "post"): "OpenAiFileUploadRequest",
                ("/v1/images/edits", "post"): "OpenAiImageEditMultipartRequest",
                ("/v1/images/variations", "post"): "OpenAiImageVariationMultipartRequest",
                ("/v1/audio/transcriptions", "post"): "OpenAiAudioTranscriptionMultipartRequest",
                ("/v1/audio/translations", "post"): "OpenAiAudioTranslationMultipartRequest",
                ("/v1/audio/voices", "post"): "ProviderMultipartRequest",
                ("/v1/audio/voice_consents", "post"): "OpenAiVoiceConsentMultipartRequest",
                ("/v1/videos/characters", "post"): "ProviderMultipartRequest",
                ("/v1/uploads/{upload_id}/parts", "post"): "OpenAiUploadPartMultipartRequest",
            }
            for (path, method), schema_name in expected_multipart_refs.items():
                content = spec["paths"][path][method]["requestBody"]["content"]
                self.assertIn("multipart/form-data", content, f"{method.upper()} {path}")
                self.assertEqual(
                    {"$ref": f"#/components/schemas/{schema_name}"},
                    content["multipart/form-data"]["schema"],
                )

            google_upload = spec["paths"]["/google/v1beta/files"]["post"]["requestBody"]["content"]
            self.assertEqual(
                {"$ref": "#/components/schemas/ProviderMultipartRequest"},
                google_upload["multipart/form-data"]["schema"],
            )

    def test_documents_current_openai_platform_surface_extensions(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            expected_methods = {
                ("/v1/responses/input_tokens", "post"): "countResponseInputTokens",
                ("/v1/responses/compact", "post"): "compactResponse",
                ("/v1/audio/voices", "post"): "createVoice",
                ("/v1/audio/voice_consents", "get"): "listVoiceConsents",
                ("/v1/audio/voice_consents/{consent_id}", "post"): "updateVoiceConsent",
                ("/v1/audio/voice_consents/{consent_id}", "delete"): "deleteVoiceConsent",
                ("/v1/videos/characters", "post"): "createVideoCharacter",
                ("/v1/videos/characters/{character_id}", "get"): "retrieveVideoCharacter",
                ("/v1/videos/edits", "post"): "editVideo",
                ("/v1/videos/extensions", "post"): "extendVideo",
                ("/v1/evals/{eval_id}/runs/{run_id}", "post"): "cancelEvalRun",
                ("/v1/evals/{eval_id}/runs/{run_id}", "delete"): "deleteEvalRun",
                ("/v1/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}", "get"): "retrieveEvalRunOutputItem",
                ("/v1/batches/{batch_id}/cancel", "post"): "cancelBatch",
                ("/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel", "post"): "cancelVectorStoreFileBatch",
                ("/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions", "get"): "listFineTuningCheckpointPermissions",
                ("/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions", "post"): "createFineTuningCheckpointPermission",
                ("/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}", "delete"): "deleteFineTuningCheckpointPermission",
                ("/v1/fine_tuning/alpha/graders/run", "post"): "runFineTuningGrader",
                ("/v1/fine_tuning/alpha/graders/validate", "post"): "validateFineTuningGrader",
                ("/v1/realtime/client_secrets", "post"): "createRealtimeClientSecret",
                ("/v1/realtime/calls", "post"): "createRealtimeCall",
                ("/v1/realtime/calls/{call_id}/accept", "post"): "acceptRealtimeCall",
                ("/v1/realtime/calls/{call_id}/hangup", "post"): "hangupRealtimeCall",
                ("/v1/realtime/calls/{call_id}/refer", "post"): "referRealtimeCall",
                ("/v1/realtime/calls/{call_id}/reject", "post"): "rejectRealtimeCall",
                ("/v1/realtime/translations", "post"): "createRealtimeTranslationSession",
                ("/v1/skills/{skill_id}/content", "get"): "retrieveSkillContent",
                ("/v1/skills/{skill_id}/versions/{version}", "delete"): "deleteSkillVersion",
                ("/v1/skills/{skill_id}/versions/{version}/content", "get"): "retrieveSkillVersionContent",
                ("/v1/vector_stores/{vector_store_id}/files/{file_id}", "post"): "modifyVectorStoreFile",
            }
            for (path, method), operation_id in expected_methods.items():
                self.assertIn(path, spec["paths"], path)
                self.assertIn(method, spec["paths"][path], f"{method.upper()} {path}")
                self.assertEqual(operation_id, spec["paths"][path][method]["operationId"])

            self.assertNotIn("post", spec["paths"]["/v1/batches/{batch_id}"])
            self.assertNotIn(
                "post",
                spec["paths"]["/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}"],
            )
            self.assertNotIn("/v1/uploads/{upload_id}", spec["paths"])
            self.assertNotIn(
                "/v1/fine_tuning/checkpoints/{checkpoint_id}/permissions",
                spec["paths"],
            )
            self.assertNotIn(
                "/v1/fine_tuning/checkpoints/{checkpoint_id}/permissions/{permission_id}",
                spec["paths"],
            )

            consent_path_parameters = {
                parameter["name"]
                for parameter in spec["paths"]["/v1/audio/voice_consents/{consent_id}"]["get"]["parameters"]
                if parameter["in"] == "path"
            }
            self.assertEqual({"consent_id"}, consent_path_parameters)

            checkpoint_permission_query_parameters = {
                parameter["name"]
                for parameter in spec["paths"]["/v1/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions"]["get"]["parameters"]
                if parameter["in"] == "query"
            }
            self.assertIn("project_id", checkpoint_permission_query_parameters)

    def test_documents_openai_administration_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            expected_methods = {
                ("/v1/organization/costs", "get"): "getOrganizationCosts",
                ("/v1/organization/usage/completions", "get"): "getOrganizationCompletionsUsage",
                ("/v1/organization/usage/images", "get"): "getOrganizationImagesUsage",
                ("/v1/organization/audit_logs", "get"): "listOrganizationAuditLogs",
                ("/v1/organization/admin_api_keys", "get"): "listOrganizationAdminApiKeys",
                ("/v1/organization/admin_api_keys", "post"): "createOrganizationAdminApiKey",
                ("/v1/organization/admin_api_keys/{key_id}", "get"): "retrieveOrganizationAdminApiKey",
                ("/v1/organization/admin_api_keys/{key_id}", "delete"): "deleteOrganizationAdminApiKey",
                ("/v1/organization/invites", "post"): "createOrganizationInvite",
                ("/v1/organization/invites/{invite_id}", "delete"): "deleteOrganizationInvite",
                ("/v1/organization/users/{user_id}", "post"): "modifyOrganizationUser",
                ("/v1/organization/users/{user_id}/roles", "get"): "listOrganizationUserRoles",
                ("/v1/organization/users/{user_id}/roles", "post"): "createOrganizationUserRole",
                ("/v1/organization/users/{user_id}/roles/{role_id}", "delete"): "deleteOrganizationUserRole",
                ("/v1/organization/groups/{group_id}/roles", "get"): "listOrganizationGroupRoles",
                ("/v1/organization/groups/{group_id}/roles", "post"): "createOrganizationGroupRole",
                ("/v1/organization/groups/{group_id}/roles/{role_id}", "delete"): "deleteOrganizationGroupRole",
                ("/v1/organization/projects/{project_id}/archive", "post"): "archiveOrganizationProject",
                ("/v1/organization/projects/{project_id}/api_keys/{key_id}", "get"): "retrieveProjectApiKey",
                ("/v1/organization/projects/{project_id}/api_keys/{key_id}", "delete"): "deleteProjectApiKey",
                ("/v1/organization/projects/{project_id}/rate_limits/{rate_limit_id}", "post"): "modifyProjectRateLimit",
                ("/v1/organization/certificates/activate", "post"): "activateOrganizationCertificates",
                ("/v1/organization/projects/{project_id}/certificates/deactivate", "post"): "deactivateProjectCertificates",
                ("/v1/projects/{project_id}/roles", "post"): "createProjectRole",
                ("/v1/projects/{project_id}/users/{user_id}/roles/{role_id}", "delete"): "deleteProjectUserRole",
                ("/v1/projects/{project_id}/groups/{group_id}/roles", "post"): "createProjectGroupRole",
            }
            for (path, method), operation_id in expected_methods.items():
                self.assertIn(path, spec["paths"], path)
                self.assertIn(method, spec["paths"][path], f"{method.upper()} {path}")
                self.assertEqual(operation_id, spec["paths"][path][method]["operationId"])

            costs_query_names = {
                parameter["name"]
                for parameter in spec["paths"]["/v1/organization/costs"]["get"]["parameters"]
                if parameter["in"] == "query"
            }
            self.assertTrue(
                {"start_time", "end_time", "project_ids", "api_key_ids", "group_by", "limit", "page"}.issubset(costs_query_names)
            )

            project_archive_parameters = {
                parameter["name"]
                for parameter in spec["paths"]["/v1/organization/projects/{project_id}/archive"]["post"]["parameters"]
                if parameter["in"] == "path"
            }
            self.assertEqual({"project_id"}, project_archive_parameters)

            self.assertNotIn(
                "/v1/organization/projects/{project_id}/api_keys/{api_key_id}",
                spec["paths"],
            )
            project_api_key_parameters = {
                parameter["name"]
                for parameter in spec["paths"]["/v1/organization/projects/{project_id}/api_keys/{key_id}"]["get"]["parameters"]
                if parameter["in"] == "path"
            }
            self.assertEqual({"project_id", "key_id"}, project_api_key_parameters)

    def test_documents_realtime_call_sdp_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            operation = spec["paths"]["/v1/realtime/calls"]["post"]
            self.assertEqual("createRealtimeCall", operation["operationId"])
            request_content = operation["requestBody"]["content"]
            self.assertIn("multipart/form-data", request_content)
            self.assertEqual(
                {"$ref": "#/components/schemas/OpenAiRealtimeCallMultipartRequest"},
                request_content["multipart/form-data"]["schema"],
            )
            self.assertIn("application/json", request_content)
            response_content = operation["responses"]["201"]["content"]
            self.assertEqual(
                {"$ref": "#/components/schemas/SdpResponse"},
                response_content["application/sdp"]["schema"],
            )

    def test_documents_provider_native_reference_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            for path in [
                "/google/v1beta/files",
                "/google/v1beta/cachedContents",
                "/google/v1beta/models/{model}:streamGenerateContent",
                "/google/v1beta/models/{model}:embedContent",
                "/google/v1beta/models/{model}:batchEmbedContents",
                "/google/v1beta/models/{model}:countTokens",
                "/anthropic/v1/messages/count_tokens",
                "/anthropic/v1/messages/batches",
                "/anthropic/v1/files",
                "/anthropic/v1/files/{file_id}/content",
                "/suno/v1/music/generations/{task_id}",
                "/midjourney/v1/images/generations/{task_id}",
                "/kling/v1/videos/generations/{task_id}",
                "/vidu/ent/v2/tasks/{task_id}/creations",
                "/nano-banana/v1/images/generations/{task_id}",
            ]:
                self.assertIn(path, spec["paths"])

            anthropic_files = spec["paths"]["/anthropic/v1/files"]["post"]
            self.assertNotIn("x-provider", anthropic_files)
            self.assertNotIn("x-passthrough", anthropic_files)
            self.assertIn("multipart/form-data", anthropic_files["requestBody"]["content"])

    def test_public_openapi_exposes_only_declared_provider_native_operations(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            for provider in self._provider_prefixes():
                path = f"/{provider}/{{path}}"
                self.assertNotIn(
                    path,
                    spec["paths"],
                    f"{provider} public OpenAPI must not expose arbitrary generic passthrough paths",
                )

            provider_tags = {
                operation["tags"][0]
                for path, path_item in spec["paths"].items()
                if path.startswith("/") and path.split("/", 2)[1] in self._provider_prefixes()
                for method, operation in path_item.items()
                if not method.startswith("x-")
            }
            self.assertNotIn("Provider Passthrough", provider_tags)
            self.assertIn("Videos/vidu", provider_tags)
            self.assertIn("Images/vidu", provider_tags)

    def test_documents_vidu_official_native_api_shapes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            expected_operations = {
                ("/vidu/ent/v2/text2video", "post"): ("Videos/vidu", "viduCreateTextToVideo", "ViduTextToVideoRequest", "ViduVideoGenerationTask"),
                ("/vidu/ent/v2/img2video", "post"): ("Videos/vidu", "viduCreateImageToVideo", "ViduImageToVideoRequest", "ViduVideoGenerationTask"),
                ("/vidu/ent/v2/reference2video", "post"): ("Videos/vidu", "viduCreateReferenceToVideo", "ViduReferenceToVideoRequest", "ViduVideoGenerationTask"),
                ("/vidu/ent/v2/start-end2video", "post"): ("Videos/vidu", "viduCreateStartEndToVideo", "ViduStartEndToVideoRequest", "ViduVideoGenerationTask"),
                ("/vidu/ent/v2/reference2image", "post"): ("Images/vidu", "viduCreateReferenceToImage", "ViduReferenceToImageRequest", "ViduImageGenerationTask"),
                ("/vidu/ent/v2/tasks/{task_id}/creations", "get"): ("Videos/vidu", "viduGetTaskCreations", None, "ViduTaskCreationsResponse"),
            }
            for (path, method), (tag, operation_id, request_schema, response_schema) in expected_operations.items():
                operation = spec["paths"][path][method]
                self.assertEqual([tag], operation["tags"], f"{method.upper()} {path}")
                self.assertEqual(operation_id, operation["operationId"], f"{method.upper()} {path}")
                self.assertNotIn("x-provider", operation, f"{method.upper()} {path}")
                self.assertNotIn("x-passthrough", operation, f"{method.upper()} {path}")
                success_schema = operation["responses"]["200"]["content"]["application/json"]["schema"]
                self.assertEqual({"$ref": f"#/components/schemas/{response_schema}"}, success_schema)
                if request_schema is None:
                    self.assertNotIn("requestBody", operation)
                else:
                    request_body_schema = operation["requestBody"]["content"]["application/json"]["schema"]
                    self.assertEqual({"$ref": f"#/components/schemas/{request_schema}"}, request_body_schema)

            self.assertNotIn("/vidu/v1/videos/generations", spec["paths"])
            self.assertNotIn("/vidu/v1/videos/generations/{task_id}", spec["paths"])

            text_request = spec["components"]["schemas"]["ViduTextToVideoRequest"]
            self.assertEqual(["model", "prompt"], text_request["required"])
            self.assertIn("callback_url", text_request["properties"])
            self.assertIn("payload", text_request["properties"])
            task_response = spec["components"]["schemas"]["ViduVideoGenerationTask"]
            self.assertTrue({"task_id", "state", "model", "created_at"}.issubset(task_response["properties"]))
            creations_response = spec["components"]["schemas"]["ViduTaskCreationsResponse"]
            self.assertIn("creations", creations_response["properties"])

    def test_public_vendor_operations_do_not_expose_passthrough_contracts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            serialized = json.dumps(spec, ensure_ascii=False).lower()
            self.assertNotIn("passthrough", serialized)
            self.assertNotIn("x-passthrough", serialized)
            self.assertNotIn("x-provider-passthrough", serialized)
            self.assertNotIn("native", serialized)

            for path, path_item in spec["paths"].items():
                if path.startswith("/v1/"):
                    continue
                provider_prefix = path.split("/", 2)[1] if path.startswith("/") else ""
                if provider_prefix not in self._provider_prefixes():
                    continue
                for method, operation in path_item.items():
                    if method.startswith("x-"):
                        continue
                    self.assertEqual(
                        [{"bearerAuth": []}],
                        operation["security"],
                        f"{method.upper()} {path} must require Claw Router API key auth",
                    )
                    self.assertNotIn("x-provider", operation, f"{method.upper()} {path}")
                    self.assertNotIn("x-passthrough", operation, f"{method.upper()} {path}")

    def test_every_operation_has_complete_documentation_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            operation_ids: list[str] = []
            for path, path_item in spec["paths"].items():
                path_parameters = {
                    match.lstrip("*")
                    for match in re.findall(r"\{([^}]+)\}", path)
                }
                for method, operation in path_item.items():
                    if method.startswith("x-"):
                        continue
                    operation_ids.append(operation["operationId"])
                    self.assertTrue(operation["summary"], f"{method.upper()} {path} summary")
                    self.assertTrue(operation["description"], f"{method.upper()} {path} description")
                    self.assertIn("security", operation, f"{method.upper()} {path} security")
                    self.assertTrue(
                        any(status.startswith("2") for status in operation["responses"]),
                        f"{method.upper()} {path} must document a 2xx success response",
                    )
                    self.assertIn("401", operation["responses"], f"{method.upper()} {path} 401")
                    self.assertIn("501", operation["responses"], f"{method.upper()} {path} 501")

                    declared_path_parameters = {
                        parameter["name"]
                        for parameter in operation.get("parameters", [])
                        if parameter.get("in") == "path"
                    }
                    self.assertEqual(
                        path_parameters,
                        declared_path_parameters,
                        f"{method.upper()} {path} must document every path parameter",
                    )

            self.assertEqual(
                len(operation_ids),
                len(set(operation_ids)),
                "operationId values must be globally unique",
            )

    def test_schema_properties_have_descriptions_for_reference_tables(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            for schema_name, schema in spec["components"]["schemas"].items():
                for property_name, property_schema in schema.get("properties", {}).items():
                    if "$ref" in property_schema:
                        continue
                    self.assertTrue(
                        property_schema.get("description"),
                        f"{schema_name}.{property_name} must describe the API reference field",
                    )

    def test_product_openai_routes_document_typed_request_and_response_schemas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            spec = ClawRouterGatewayOpenApiGenerator(root=Path(tmp)).generate()

            expected_refs = {
                ("/v1/chat/completions", "post"): (
                    "OpenAiChatCompletionRequest",
                    "OpenAiChatCompletion",
                ),
                ("/v1/responses", "post"): (
                    "OpenAiResponsesRequest",
                    "OpenAiResponse",
                ),
                ("/v1/embeddings", "post"): (
                    "OpenAiEmbeddingsRequest",
                    "OpenAiEmbeddingList",
                ),
            }

            for (path, method), (request_schema, response_schema) in expected_refs.items():
                operation = spec["paths"][path][method]
                request_ref = operation["requestBody"]["content"]["application/json"]["schema"]["$ref"]
                response_ref = operation["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
                self.assertEqual(
                    f"#/components/schemas/{request_schema}",
                    request_ref,
                    f"{method.upper()} {path} request must use the Rust contract schema",
                )
                self.assertEqual(
                    f"#/components/schemas/{response_schema}",
                    response_ref,
                    f"{method.upper()} {path} response must use the Rust contract schema",
                )
                self.assertNotEqual(
                    "#/components/schemas/JsonObject",
                    response_ref,
                    f"{method.upper()} {path} must not document a generic response object",
                )

            component_names = spec["components"]["schemas"].keys()
            for schema_name in [
                "OpenAiChatCompletion",
                "OpenAiChatCompletionChoice",
                "OpenAiChatMessage",
                "OpenAiChatImageUrl",
                "OpenAiChatInputAudio",
                "OpenAiChatFile",
                "OpenAiToolChoice",
                "OpenAiResponseFormat",
                "OpenAiJsonSchema",
                "OpenAiTokenUsage",
                "OpenAiResponse",
                "OpenAiResponseOutputItem",
                "OpenAiResponseInputContentPart",
                "OpenAiTextConfig",
                "OpenAiReasoningConfig",
                "OpenAiAnnotation",
                "OpenAiResponseUsage",
                "OpenAiEmbeddingList",
                "OpenAiEmbedding",
                "OpenAiEmbeddingUsage",
            ]:
                self.assertIn(schema_name, component_names)

            schemas = spec["components"]["schemas"]
            self.assertEqual(
                "#/components/schemas/OpenAiChatImageUrl",
                schemas["OpenAiChatContentPart"]["properties"]["image_url"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiChatInputAudio",
                schemas["OpenAiChatContentPart"]["properties"]["input_audio"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiChatFile",
                schemas["OpenAiChatContentPart"]["properties"]["file"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiResponseFormat",
                schemas["OpenAiChatCompletionRequest"]["properties"]["response_format"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiToolChoice",
                schemas["OpenAiChatCompletionRequest"]["properties"]["tool_choice"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiResponseInputContentPart",
                schemas["OpenAiResponseInputItem"]["properties"]["content"]["oneOf"][1]["items"]["$ref"],
            )
            response_input_branches = schemas["OpenAiResponsesRequest"]["properties"]["input"]["oneOf"]
            self.assertEqual(
                [
                    {"type": "string"},
                    {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/OpenAiResponseInputItem"},
                    },
                ],
                response_input_branches,
                "Responses.input must not expose an untyped object branch in the API reference",
            )
            self.assertEqual(
                "#/components/schemas/OpenAiTextConfig",
                schemas["OpenAiResponsesRequest"]["properties"]["text"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiReasoningConfig",
                schemas["OpenAiResponsesRequest"]["properties"]["reasoning"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiAnnotation",
                schemas["OpenAiResponseOutputContent"]["properties"]["annotations"]["items"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiResponseInputTokensDetails",
                schemas["OpenAiResponseUsage"]["properties"]["input_tokens_details"]["$ref"],
            )
            self.assertEqual(
                "#/components/schemas/OpenAiJsonSchemaAdditionalProperties",
                schemas["OpenAiJsonSchema"]["properties"]["additionalProperties"]["$ref"],
            )
            for schema_name, field_name in [
                ("OpenAiChatCompletionRequest", "service_tier"),
                ("OpenAiResponsesRequest", "service_tier"),
                ("OpenAiResponsesRequest", "truncation"),
                ("OpenAiReasoningConfig", "effort"),
                ("OpenAiReasoningConfig", "summary"),
                ("OpenAiResponse", "status"),
                ("OpenAiIncompleteDetails", "reason"),
                ("OpenAiResponseOutputItem", "type"),
                ("OpenAiResponseOutputContent", "type"),
                ("OpenAiAnnotation", "type"),
            ]:
                self.assertIn(
                    "enum",
                    schemas[schema_name]["properties"][field_name],
                    f"{schema_name}.{field_name} must document the standard enum values",
                )
            self.assertNotIn(
                "additional_properties",
                schemas["OpenAiJsonSchema"]["properties"],
                "OpenAPI schema must use the official JSON Schema additionalProperties field name",
            )

    def test_public_openapi_schema_quality_for_reference_rendering(self) -> None:
        public_spec = json.loads(
            Path("apps/sdkwork-claw-router-portal/public/openapi.json").read_text(encoding="utf-8")
        )
        provider_prefixes = self._provider_prefixes()

        for path, path_item in public_spec["paths"].items():
            self.assertNotIn("/v1/v1", path)
            provider = path.split("/", 2)[1] if path.startswith("/") and len(path.split("/")) > 1 else ""
            for method, operation in path_item.items():
                if method.startswith("x-"):
                    continue
                success_responses = [
                    response
                    for status, response in operation["responses"].items()
                    if status.startswith("2")
                ]
                self.assertTrue(success_responses, f"{method.upper()} {path} must document a 2xx response")
                for response in success_responses:
                    self.assertTrue(response.get("content"), f"{method.upper()} {path} success content")
                    for content_type, media_type in response.get("content", {}).items():
                        self.assertIn("schema", media_type, f"{method.upper()} {path} {content_type} schema")
                if provider in provider_prefixes:
                    self.assertIn("/", operation["tags"][0], f"{method.upper()} {path} provider tag")
                    serialized = json.dumps(operation, ensure_ascii=False).lower()
                    self.assertNotIn("passthrough", serialized)
                    self.assertNotIn("native", serialized)

        for schema_name, schema in public_spec["components"]["schemas"].items():
            for property_name, property_schema in schema.get("properties", {}).items():
                if "$ref" in property_schema:
                    continue
                self.assertTrue(
                    property_schema.get("description"),
                    f"{schema_name}.{property_name} must describe the API reference field",
                )

    def test_writes_and_checks_gateway_openapi_spec(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            generator = ClawRouterGatewayOpenApiGenerator(root=root)

            output = generator.write()

            self.assertEqual(
                root / "apps" / "sdkwork-claw-router-portal" / "public" / "openapi.json",
                output,
            )
            payload = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual("Claw Router Open API", payload["info"]["title"])
            self.assertTrue(generator.check().ok)

            output.write_text("{}\n", encoding="utf-8")
            result = generator.check()
            self.assertFalse(result.ok)
            self.assertIn(f"Claw Router gateway OpenAPI spec is stale: {output}", result.messages)

    def _provider_prefixes(self) -> set[str]:
        return {
            "google",
            "anthropic",
            "volcengine",
            "suno",
            "midjourney",
            "kling",
            "vidu",
            "nano-banana",
        }


if __name__ == "__main__":
    unittest.main()
