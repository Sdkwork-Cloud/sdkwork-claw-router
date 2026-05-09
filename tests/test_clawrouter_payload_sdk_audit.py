import json
import tempfile
import unittest
from pathlib import Path

from tools.clawrouter_openapi_generator import ClawRouterOpenApiGenerator
from tools.clawrouter_payload_sdk_audit import ClawRouterPayloadSdkAudit


class ClawRouterPayloadSdkAuditTest(unittest.TestCase):
    def write_manifest(self, root: Path) -> None:
        manifest = root / "generated" / "api" / "api-contract-manifest.json"
        manifest.parent.mkdir(parents=True, exist_ok=True)
        manifest.write_text(
            json.dumps(
                {
                    "schema": {"version": "0.1.0"},
                    "sdk_boundaries": {
                        "app": {"api_prefix": "/app/v3/api", "sdk_client": "SdkworkAppClient", "sdk_family": "app"},
                        "backend": {
                            "api_prefix": "/backend/v3/api",
                            "sdk_client": "SdkworkBackendClient",
                            "sdk_family": "backend",
                        },
                    },
                    "operations": [
                        {
                            "api_surface": "app",
                            "api_method": "POST",
                            "api_path": "/app/v3/api/router/api-keys",
                            "operation": "createKey",
                            "tag": "router",
                            "kind": "create",
                            "path_params": [],
                            "source": "apps/portal/apiKeyService.ts",
                            "read_sources": ["iam_gateway_api_key_group"],
                            "write_tables": ["iam_gateway_api_key", "ops_audit_log"],
                            "request_schema": {
                                "name": "CreateApiKeyRequest",
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["name", "group"],
                                    "properties": {
                                        "name": {"type": "string"},
                                        "group": {"type": "string"},
                                    },
                                },
                            },
                            "response_schema": {
                                "name": "CreateApiKeyResponse",
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": False,
                                    "required": ["rawKey"],
                                    "properties": {
                                        "rawKey": {"type": "string"},
                                    },
                                },
                            },
                        }
                    ],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    def write_openapi(self, root: Path) -> None:
        self.write_manifest(root)
        ClawRouterOpenApiGenerator(root=root).write()

    def write_sdk(self, root: Path, *, generic_method: bool = False) -> None:
        base = root / "sdks" / "clawrouter-app-sdk"
        (base / "src" / "api").mkdir(parents=True, exist_ok=True)
        (base / "src" / "types").mkdir(parents=True, exist_ok=True)
        method = (
            "  async createKey(body?: OperationRequest): Promise<PlusApiResult> {\n"
            "    return this.client.post<PlusApiResult>(appApiPath(`/router/api-keys`), body, undefined, undefined, 'application/json');\n"
            "  }\n"
            if generic_method
            else "  async createKey(body: CreateApiKeyRequest, headers?: Record<string, string>): Promise<CreateKeyResult> {\n"
            "    return this.client.post<CreateKeyResult>(appApiPath(`/router/api-keys`), body, undefined, headers, 'application/json');\n"
            "  }\n"
        )
        (base / "src" / "api" / "router.ts").write_text(
            "import { appApiPath } from './paths';\n"
            "import type { HttpClient } from '../http/client';\n"
            "import type { CreateApiKeyRequest, CreateKeyResult, OperationRequest, PlusApiResult } from '../types';\n"
            "export class RouterApi {\n"
            "  constructor(private client: HttpClient) {}\n"
            f"{method}"
            "}\n",
            encoding="utf-8",
        )
        (base / "src" / "types" / "create-api-key-request.ts").write_text(
            "export interface CreateApiKeyRequest { name: string; group: string; }\n",
            encoding="utf-8",
        )
        (base / "src" / "types" / "create-api-key-response.ts").write_text(
            "export interface CreateApiKeyResponse { rawKey: string; }\n",
            encoding="utf-8",
        )
        (base / "src" / "types" / "create-key-result.ts").write_text(
            "import type { CreateApiKeyResponse } from './create-api-key-response';\n"
            "export interface CreateKeyResult { code: string; data?: CreateApiKeyResponse; }\n",
            encoding="utf-8",
        )
        (base / "src" / "types" / "index.ts").write_text(
            "export type { CreateApiKeyRequest } from './create-api-key-request';\n"
            "export type { CreateApiKeyResponse } from './create-api-key-response';\n"
            "export type { CreateKeyResult } from './create-key-result';\n",
            encoding="utf-8",
        )
        backend = root / "sdks" / "clawrouter-backend-sdk" / "src"
        (backend / "api").mkdir(parents=True, exist_ok=True)
        (backend / "types").mkdir(parents=True, exist_ok=True)

    def read_app_spec(self, root: Path) -> dict:
        return json.loads((root / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(encoding="utf-8"))

    def write_app_spec(self, root: Path, spec: dict) -> None:
        (root / "generated" / "openapi" / "clawrouter-app-openapi.json").write_text(
            json.dumps(spec, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )

    def test_accepts_payload_schema_openapi_and_sdk_closure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_openapi(root)
            self.write_sdk(root)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_top_level_array_response_type_alias(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "app",
                                "api_method": "GET",
                                "api_path": "/app/v3/api/coupons/my",
                                "operation": "fetchRedeemHistory",
                                "tag": "coupons",
                                "kind": "read",
                                "path_params": [],
                                "source": "apps/portal/billingService.ts",
                                "read_sources": ["plus_coupon", "plus_user_coupon"],
                                "write_tables": [],
                                "response_schema": {
                                    "name": "BillingRedeemHistoryResponse",
                                    "schema": {
                                        "type": "array",
                                        "items": {"$ref": "#/components/schemas/BillingRedeemHistoryItem"},
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            spec = self.read_app_spec(root)
            spec["components"]["schemas"]["BillingRedeemHistoryItem"] = {
                "type": "object",
                "additionalProperties": False,
                "required": ["id", "code"],
                "properties": {"id": {"type": "integer"}, "code": {"type": "string"}},
            }
            self.write_app_spec(root, spec)

            base = root / "sdks" / "clawrouter-app-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "coupons.ts").write_text(
                "import { appApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { FetchRedeemHistoryResult } from '../types';\n"
                "export class CouponsApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async fetchRedeemHistory(): Promise<FetchRedeemHistoryResult> {\n"
                "    return this.client.get<FetchRedeemHistoryResult>(appApiPath(`/coupons/my`));\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "billing-redeem-history-item.ts").write_text(
                "export interface BillingRedeemHistoryItem { id: number; code: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "billing-redeem-history-response.ts").write_text(
                "import type { BillingRedeemHistoryItem } from './billing-redeem-history-item';\n"
                "export type BillingRedeemHistoryResponse = BillingRedeemHistoryItem[];\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "fetch-redeem-history-result.ts").write_text(
                "import type { BillingRedeemHistoryResponse } from './billing-redeem-history-response';\n"
                "export interface FetchRedeemHistoryResult { code: string; data?: BillingRedeemHistoryResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { BillingRedeemHistoryItem } from './billing-redeem-history-item';\n"
                "export type { BillingRedeemHistoryResponse } from './billing-redeem-history-response';\n"
                "export type { FetchRedeemHistoryResult } from './fetch-redeem-history-result';\n",
                encoding="utf-8",
            )
            backend = root / "sdks" / "clawrouter-backend-sdk" / "src"
            (backend / "api").mkdir(parents=True, exist_ok=True)
            (backend / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_ignores_non_exposed_derived_frontend_operations(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "app",
                                "api_method": "GET",
                                "api_path": "/app/v3/api/router/models",
                                "operation": "fetchModels",
                                "tag": "router",
                                "kind": "read",
                                "path_params": [],
                                "source": "apps/portal/modelService.ts",
                                "read_sources": ["ai_model"],
                                "write_tables": [],
                            },
                            {
                                "api_surface": "app",
                                "api_method": "GET",
                                "api_path": "/app/v3/api/router/models",
                                "operation": "fetchModelVendors",
                                "tag": "router",
                                "kind": "read",
                                "path_params": [],
                                "source": "apps/portal/rankingService.ts",
                                "read_sources": ["ai_model_vendor", "ai_model"],
                                "write_tables": [],
                                "openapi_exposed": False,
                                "response_schema": {
                                    "name": "RankingVendorOptionsResponse",
                                    "schema": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "additionalProperties": False,
                                            "required": ["label", "code", "modelCount"],
                                            "properties": {
                                                "label": {"type": "string"},
                                                "code": {"type": "string"},
                                                "modelCount": {"type": "integer"},
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            backend = root / "sdks" / "clawrouter-backend-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)
            (backend / "api").mkdir(parents=True, exist_ok=True)
            (backend / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_generated_sdk_method_with_tag_suffix_removed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/channel",
                                "operation": "addChannel",
                                "tag": "channel",
                                "kind": "create",
                                "path_params": [],
                                "source": "apps/portal/channelService.tsx",
                                "read_sources": ["integration_channel"],
                                "write_tables": ["integration_channel"],
                                "request_schema": {
                                    "name": "AdminChannelCreateRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["name"],
                                        "properties": {"name": {"type": "string"}},
                                    },
                                },
                                "response_schema": {
                                    "name": "AdminChannelMutationResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["item"],
                                        "properties": {
                                            "item": {
                                                "type": "object",
                                                "additionalProperties": False,
                                                "required": ["id"],
                                                "properties": {
                                                    "id": {"type": "string"},
                                                    "name": {"type": "string"},
                                                },
                                            },
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "channel.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { AddChannelResult, AdminChannelCreateRequest } from '../types';\n"
                "export class ChannelApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async add(body: AdminChannelCreateRequest): Promise<AddChannelResult> {\n"
                "    return this.client.post<AddChannelResult>(backendApiPath(`/channel`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-create-request.ts").write_text(
                "export interface AdminChannelCreateRequest { name: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-mutation-response.ts").write_text(
                "export interface AdminChannelMutationResponse { item: { id: string; name?: string }; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "add-channel-result.ts").write_text(
                "import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n"
                "export interface AddChannelResult { code: string; data?: AdminChannelMutationResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AddChannelResult } from './add-channel-result';\n"
                "export type { AdminChannelCreateRequest } from './admin-channel-create-request';\n"
                "export type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_generated_sdk_method_with_plural_tag_suffix_removed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/provider-secrets",
                                "operation": "addProviderSecret",
                                "tag": "provider-secrets",
                                "kind": "create",
                                "path_params": [],
                                "source": "apps/portal/channelService.tsx",
                                "read_sources": ["integration_provider_account"],
                                "write_tables": ["integration_provider_account", "ops_audit_log"],
                                "request_schema": {
                                    "name": "AdminProviderSecretCreateRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["providerCode", "name", "secretRef"],
                                        "properties": {
                                            "providerCode": {"type": "string"},
                                            "name": {"type": "string"},
                                            "secretRef": {"type": "string"},
                                        },
                                    },
                                },
                                "response_schema": {
                                    "name": "AdminProviderSecretMutationResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["item"],
                                        "properties": {
                                            "item": {
                                                "name": "AdminProviderSecretItem",
                                                "type": "object",
                                                "additionalProperties": False,
                                                "required": ["id"],
                                                "properties": {"id": {"type": "string"}},
                                            },
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "provider-secret.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { AddProviderSecretResult, AdminProviderSecretCreateRequest } from '../types';\n"
                "export class ProviderSecretApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async add(body: AdminProviderSecretCreateRequest): Promise<AddProviderSecretResult> {\n"
                "    return this.client.post<AddProviderSecretResult>(backendApiPath(`/provider-secrets`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-provider-secret-item.ts").write_text(
                "export interface AdminProviderSecretItem { id: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-provider-secret-create-request.ts").write_text(
                "export interface AdminProviderSecretCreateRequest { providerCode: string; name: string; secretRef: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-provider-secret-mutation-response.ts").write_text(
                "import type { AdminProviderSecretItem } from './admin-provider-secret-item';\n"
                "export interface AdminProviderSecretMutationResponse { item: AdminProviderSecretItem; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "add-provider-secret-result.ts").write_text(
                "import type { AdminProviderSecretMutationResponse } from './admin-provider-secret-mutation-response';\n"
                "export interface AddProviderSecretResult { code: string; data?: AdminProviderSecretMutationResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AddProviderSecretResult } from './add-provider-secret-result';\n"
                "export type { AdminProviderSecretCreateRequest } from './admin-provider-secret-create-request';\n"
                "export type { AdminProviderSecretItem } from './admin-provider-secret-item';\n"
                "export type { AdminProviderSecretMutationResponse } from './admin-provider-secret-mutation-response';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_generated_sdk_method_with_singular_path_resource_suffix_removed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "app",
                                "api_method": "POST",
                                "api_path": "/app/v3/api/feeds/collect/{feedId}",
                                "operation": "collectForumFeed",
                                "tag": "feeds",
                                "kind": "action",
                                "path_params": ["feedId"],
                                "source": "apps/portal/forumService.ts",
                                "read_sources": ["plus_feeds", "plus_favorite"],
                                "write_tables": ["plus_feeds", "plus_favorite"],
                                "request_body_required": False,
                                "request_schema": {
                                    "name": "ForumCollectFeedRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "folderId": {"type": "integer", "format": "int64", "minimum": 1}
                                        },
                                    },
                                },
                                "response_schema": {
                                    "name": "ForumFeedItem",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["id"],
                                        "properties": {"id": {"type": "string"}},
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-app-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "feed.ts").write_text(
                "import { appApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { CollectForumFeedResult, ForumCollectFeedRequest } from '../types';\n"
                "export class FeedApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async collectForum(feedId: string | number, body?: ForumCollectFeedRequest): Promise<CollectForumFeedResult> {\n"
                "    return this.client.post<CollectForumFeedResult>(appApiPath(`/feeds/collect/${feedId}`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "forum-collect-feed-request.ts").write_text(
                "export interface ForumCollectFeedRequest { folderId?: number; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "forum-feed-item.ts").write_text(
                "export interface ForumFeedItem { id: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "collect-forum-feed-result.ts").write_text(
                "import type { ForumFeedItem } from './forum-feed-item';\n"
                "export interface CollectForumFeedResult { code: string; data?: ForumFeedItem; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { CollectForumFeedResult } from './collect-forum-feed-result';\n"
                "export type { ForumCollectFeedRequest } from './forum-collect-feed-request';\n"
                "export type { ForumFeedItem } from './forum-feed-item';\n",
                encoding="utf-8",
            )
            backend = root / "sdks" / "clawrouter-backend-sdk" / "src"
            (backend / "api").mkdir(parents=True, exist_ok=True)
            (backend / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_nested_router_backend_module_method_with_tag_suffix_removed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/router/firewall/rules",
                                "operation": "addFirewall",
                                "tag": "firewall",
                                "kind": "create",
                                "path_params": [],
                                "source": "apps/portal/ratelimitService.ts",
                                "read_sources": ["iam_gateway_risk_rule"],
                                "write_tables": ["iam_gateway_risk_rule", "ops_audit_log"],
                                "request_schema": {
                                    "name": "AdminFirewallRuleCreateRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["type", "value"],
                                        "properties": {
                                            "type": {"type": "string"},
                                            "value": {"type": "string"},
                                        },
                                    },
                                },
                                "response_schema": {
                                    "name": "AdminFirewallMutationResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["item"],
                                        "properties": {
                                            "item": {
                                                "name": "AdminFirewallItem",
                                                "type": "object",
                                                "additionalProperties": False,
                                                "required": ["id"],
                                                "properties": {"id": {"type": "string"}},
                                            },
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "firewall.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { AddFirewallResult, AdminFirewallRuleCreateRequest } from '../types';\n"
                "export class FirewallApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async add(body: AdminFirewallRuleCreateRequest): Promise<AddFirewallResult> {\n"
                "    return this.client.post<AddFirewallResult>(backendApiPath(`/router/firewall/rules`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-firewall-item.ts").write_text(
                "export interface AdminFirewallItem { id: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-firewall-mutation-response.ts").write_text(
                "import type { AdminFirewallItem } from './admin-firewall-item';\n"
                "export interface AdminFirewallMutationResponse { item: AdminFirewallItem; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-firewall-rule-create-request.ts").write_text(
                "export interface AdminFirewallRuleCreateRequest { type: string; value: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "add-firewall-result.ts").write_text(
                "import type { AdminFirewallMutationResponse } from './admin-firewall-mutation-response';\n"
                "export interface AddFirewallResult { code: string; data?: AdminFirewallMutationResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AddFirewallResult } from './add-firewall-result';\n"
                "export type { AdminFirewallItem } from './admin-firewall-item';\n"
                "export type { AdminFirewallMutationResponse } from './admin-firewall-mutation-response';\n"
                "export type { AdminFirewallRuleCreateRequest } from './admin-firewall-rule-create-request';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_rejects_sdk_method_that_ignores_explicit_payload_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_openapi(root)
            self.write_sdk(root, generic_method=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "app createKey SDK method must accept body: CreateApiKeyRequest",
                result.messages,
            )
            self.assertIn(
                "app createKey SDK method must return Promise<CreateKeyResult>",
                result.messages,
            )

    def test_rejects_openapi_operation_without_explicit_request_schema_ref(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_openapi(root)
            self.write_sdk(root)
            spec = self.read_app_spec(root)
            spec["paths"]["/app/v3/api/router/api-keys"]["post"]["requestBody"]["content"]["application/json"]["schema"] = {
                "$ref": "#/components/schemas/OperationRequest"
            }
            self.write_app_spec(root, spec)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "app createKey requestBody must reference #/components/schemas/CreateApiKeyRequest",
                result.messages,
            )

    def test_rejects_loose_response_item_object_without_required_stable_id(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/channel",
                                "operation": "addChannel",
                                "tag": "channel",
                                "kind": "create",
                                "path_params": [],
                                "source": "apps/portal/channelService.ts",
                                "read_sources": ["integration_channel"],
                                "write_tables": ["integration_channel"],
                                "request_schema": {
                                    "name": "AdminChannelCreateRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["name"],
                                        "properties": {"name": {"type": "string"}},
                                    },
                                },
                                "response_schema": {
                                    "name": "AdminChannelMutationResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["item"],
                                        "properties": {
                                            "item": {"type": "object", "additionalProperties": True},
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "channel.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { AddChannelResult, AdminChannelCreateRequest } from '../types';\n"
                "export class ChannelApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async add(body: AdminChannelCreateRequest): Promise<AddChannelResult> {\n"
                "    return this.client.post<AddChannelResult>(backendApiPath(`/channel`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-create-request.ts").write_text(
                "export interface AdminChannelCreateRequest { name: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-mutation-response.ts").write_text(
                "export interface AdminChannelMutationResponse { item: Record<string, unknown>; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "add-channel-result.ts").write_text(
                "import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n"
                "export interface AddChannelResult { code: string; data?: AdminChannelMutationResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AddChannelResult } from './add-channel-result';\n"
                "export type { AdminChannelCreateRequest } from './admin-channel-create-request';\n"
                "export type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "backend addChannel response schema AdminChannelMutationResponse.item must declare a closed object schema",
                result.messages,
            )
            self.assertIn(
                "backend addChannel response schema AdminChannelMutationResponse.item must require stable id",
                result.messages,
            )

    def test_rejects_sdk_response_type_that_keeps_closed_entity_as_record(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/channel",
                                "operation": "addChannel",
                                "tag": "channel",
                                "kind": "create",
                                "path_params": [],
                                "source": "apps/portal/channelService.ts",
                                "read_sources": ["integration_channel"],
                                "write_tables": ["integration_channel"],
                                "request_schema": {
                                    "name": "AdminChannelCreateRequest",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["name"],
                                        "properties": {"name": {"type": "string"}},
                                    },
                                },
                                "response_schema": {
                                    "name": "AdminChannelMutationResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["item"],
                                        "properties": {
                                            "item": {
                                                "name": "AdminChannelItem",
                                                "type": "object",
                                                "additionalProperties": False,
                                                "required": ["id"],
                                                "properties": {"id": {"type": "string"}},
                                            },
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "channel.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { AddChannelResult, AdminChannelCreateRequest } from '../types';\n"
                "export class ChannelApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async add(body: AdminChannelCreateRequest): Promise<AddChannelResult> {\n"
                "    return this.client.post<AddChannelResult>(backendApiPath(`/channel`), body, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-create-request.ts").write_text(
                "export interface AdminChannelCreateRequest { name: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-item.ts").write_text(
                "export interface AdminChannelItem { id: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-channel-mutation-response.ts").write_text(
                "export interface AdminChannelMutationResponse { item: Record<string, unknown>; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "add-channel-result.ts").write_text(
                "import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n"
                "export interface AddChannelResult { code: string; data?: AdminChannelMutationResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AddChannelResult } from './add-channel-result';\n"
                "export type { AdminChannelCreateRequest } from './admin-channel-create-request';\n"
                "export type { AdminChannelItem } from './admin-channel-item';\n"
                "export type { AdminChannelMutationResponse } from './admin-channel-mutation-response';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "backend addChannel SDK response type AdminChannelMutationResponse.item must use AdminChannelItem",
                result.messages,
            )

    def test_accepts_sdk_response_array_entity_type(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest = root / "generated" / "api" / "api-contract-manifest.json"
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(
                json.dumps(
                    {
                        "schema": {"version": "0.1.0"},
                        "sdk_boundaries": {
                            "app": {
                                "api_prefix": "/app/v3/api",
                                "sdk_client": "SdkworkAppClient",
                                "sdk_family": "app",
                            },
                            "backend": {
                                "api_prefix": "/backend/v3/api",
                                "sdk_client": "SdkworkBackendClient",
                                "sdk_family": "backend",
                            },
                        },
                        "operations": [
                            {
                                "api_surface": "backend",
                                "api_method": "POST",
                                "api_path": "/backend/v3/api/models/sync",
                                "operation": "syncVendorsAndModels",
                                "tag": "model",
                                "kind": "sync",
                                "path_params": [],
                                "source": "apps/portal/modelService.ts",
                                "read_sources": ["ai_model_vendor", "ai_model"],
                                "write_tables": ["ai_model_vendor", "ai_model"],
                                "response_schema": {
                                    "name": "AdminModelCatalogSyncResponse",
                                    "schema": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "required": ["synced", "vendors", "models"],
                                        "properties": {
                                            "synced": {"type": "boolean"},
                                            "vendors": {
                                                "type": "array",
                                                "items": {
                                                    "name": "AdminModelVendorItem",
                                                    "type": "object",
                                                    "additionalProperties": False,
                                                    "required": ["id"],
                                                    "properties": {"id": {"type": "string"}},
                                                },
                                            },
                                            "models": {
                                                "type": "array",
                                                "items": {
                                                    "name": "AdminAiModelItem",
                                                    "type": "object",
                                                    "additionalProperties": False,
                                                    "required": ["id", "vendorId"],
                                                    "properties": {
                                                        "id": {"type": "string"},
                                                        "vendorId": {"type": "string"},
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            }
                        ],
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            ClawRouterOpenApiGenerator(root=root).write()
            base = root / "sdks" / "clawrouter-backend-sdk"
            (base / "src" / "api").mkdir(parents=True, exist_ok=True)
            (base / "src" / "types").mkdir(parents=True, exist_ok=True)
            (base / "src" / "api" / "model.ts").write_text(
                "import { backendApiPath } from './paths';\n"
                "import type { HttpClient } from '../http/client';\n"
                "import type { SyncVendorsAndModelsResult } from '../types';\n"
                "export class ModelApi {\n"
                "  constructor(private client: HttpClient) {}\n"
                "  async syncVendorsAndModels(): Promise<SyncVendorsAndModelsResult> {\n"
                "    return this.client.post<SyncVendorsAndModelsResult>(backendApiPath(`/models/sync`), undefined, undefined, undefined, 'application/json');\n"
                "  }\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-ai-model-item.ts").write_text(
                "export interface AdminAiModelItem { id: string; vendorId: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-model-vendor-item.ts").write_text(
                "export interface AdminModelVendorItem { id: string; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "admin-model-catalog-sync-response.ts").write_text(
                "import type { AdminAiModelItem } from './admin-ai-model-item';\n"
                "import type { AdminModelVendorItem } from './admin-model-vendor-item';\n"
                "export interface AdminModelCatalogSyncResponse {\n"
                "  models: AdminAiModelItem[];\n"
                "  synced: boolean;\n"
                "  vendors: AdminModelVendorItem[];\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "sync-vendors-and-models-result.ts").write_text(
                "import type { AdminModelCatalogSyncResponse } from './admin-model-catalog-sync-response';\n"
                "export interface SyncVendorsAndModelsResult { code: string; data?: AdminModelCatalogSyncResponse; }\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "index.ts").write_text(
                "export type { AdminAiModelItem } from './admin-ai-model-item';\n"
                "export type { AdminModelCatalogSyncResponse } from './admin-model-catalog-sync-response';\n"
                "export type { AdminModelVendorItem } from './admin-model-vendor-item';\n"
                "export type { SyncVendorsAndModelsResult } from './sync-vendors-and-models-result';\n",
                encoding="utf-8",
            )
            app = root / "sdks" / "clawrouter-app-sdk" / "src"
            (app / "api").mkdir(parents=True, exist_ok=True)
            (app / "types").mkdir(parents=True, exist_ok=True)

            result = ClawRouterPayloadSdkAudit(root=root).run()

            self.assertTrue(result.ok, result.messages)


if __name__ == "__main__":
    unittest.main()
