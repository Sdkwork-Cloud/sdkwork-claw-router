import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


class ApiContractManifestGeneratorTest(unittest.TestCase):
    def write_contract(self, root: Path, content: str) -> Path:
        contract = root / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        contract.parent.mkdir(parents=True, exist_ok=True)
        contract.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return contract

    def test_generates_sdk_boundaries_and_operations_from_frontend_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts
                    operation: updateKey
                    kind: update
                    api_surface: app
                    api_method: PATCH
                    api_path: /app/v3/api/router/api-keys/{apiKeyId}
                    read_sources: [iam_gateway_api_key]
                    write_tables: [iam_gateway_api_key, ops_audit_log]
                  - route: /admin/model
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts
                    operation: syncModels
                    kind: sync
                    api_surface: backend
                    api_method: POST
                    api_path: /backend/v3/api/router/models/sync
                    read_sources: [ai_model]
                    write_tables: [ai_model, ai_model_pricing]
                  - route: /playground
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts
                    operation: createChatCompletion
                    kind: action
                    api_surface: openai_v1
                    api_method: POST
                    api_path: /v1/chat/completions
                    read_sources: [ai_model]
                    write_tables: [ai_request_trace, ai_usage_fact]
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["key"]: operation for operation in manifest["operations"]}

            self.assertEqual(3, manifest["summary"]["operation_count"])
            self.assertEqual({"app": 1, "backend": 1, "openai_v1": 1}, manifest["summary"]["api_surface_counts"])
            self.assertEqual("SdkworkAppClient", manifest["sdk_boundaries"]["app"]["sdk_client"])
            self.assertEqual("SdkworkBackendClient", manifest["sdk_boundaries"]["backend"]["sdk_client"])
            self.assertEqual("SdkworkAiClient", manifest["sdk_boundaries"]["openai_v1"]["sdk_client"])

            app_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts#updateKey"
            ]
            self.assertEqual("clawrouter-app-sdk", app_operation["sdk_family"])
            self.assertEqual("SdkworkAppClient", app_operation["sdk_client"])
            self.assertEqual("console-api-keys", app_operation["module"])
            self.assertEqual("iam", app_operation["tag"])
            self.assertEqual("iam", app_operation["sdk_domain"])
            self.assertEqual("apiKeys.update", app_operation["operation_id"])
            self.assertEqual(["apiKeyId"], app_operation["path_params"])
            self.assertEqual(["iam_gateway_api_key", "ops_audit_log"], app_operation["write_tables"])

            admin_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts#syncModels"
            ]
            self.assertEqual("clawrouter-backend-sdk", admin_operation["sdk_family"])
            self.assertEqual("admin", admin_operation["route_scope"])
            self.assertEqual("ai", admin_operation["tag"])
            self.assertEqual("intelligence", admin_operation["sdk_domain"])
            self.assertEqual("models.refresh", admin_operation["operation_id"])

            openai_operation = operations[
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts#createChatCompletion"
            ]
            self.assertEqual("clawrouter-open-sdk", openai_operation["sdk_family"])
            self.assertEqual("SdkworkAiClient", openai_operation["sdk_client"])
            self.assertEqual("chat", openai_operation["tag"])

    def test_operation_id_can_be_distinct_from_frontend_function_name(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /auth/login
                    source: apps/sdkwork-claw-router-portal/src/auth/clawRouterAuthController.ts
                    operation: login
                    operation_id: sessions.create
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/auth/sessions
                    sdk_domain: auth
                    read_sources: [iam_user, iam_credential, iam_session]
                    write_tables: [iam_session, iam_security_event, iam_audit_event]
                    request_schema:
                      name: IamSessionCreateRequest
                      properties:
                        grantType: { type: string }
                    response_schema:
                      name: IamSessionResponse
                      properties:
                        authToken: { type: string }
                        accessToken: { type: string }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual(
                "apps/sdkwork-claw-router-portal/src/auth/clawRouterAuthController.ts#login",
                operation["key"],
            )
            self.assertEqual("login", operation["operation"])
            self.assertEqual("sessions.create", operation["operation_id"])
            self.assertEqual("iam", operation["sdk_domain"])

    def test_open_platform_paths_compile_to_open_platform_sdk_namespace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /admin/open-platform
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-open-platform/src/index.tsx
                    operation: listOpenPlatformAccounts
                    operation_id: accounts.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/open_platform/accounts
                    sdk_domain: platform
                    read_sources: [open_platform_account]
                    query_parameters: []
                    response_schema:
                      name: OpenPlatformAccountListResponse
                      required: [items]
                      properties:
                        items:
                          type: array
                          items:
                            type: object
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("/backend/v3/api/open_platform/accounts", operation["api_path"])
            self.assertEqual("openPlatform", operation["tag"])
            self.assertEqual("platform", operation["sdk_domain"])
            self.assertEqual("accounts.list", operation["operation_id"])

    def test_messaging_paths_compile_to_messaging_sdk_namespace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /admin/messaging/templates
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-messaging/src/messagingService.ts
                    operation: listMessagingTemplates
                    operation_id: templates.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/messaging/templates
                    read_sources: [messaging_template, messaging_template_version, messaging_template_variant]
                    query_parameters: []
                    response_schema:
                      name: MessagingTemplateCollectionResponse
                      required: [items]
                      properties:
                        items:
                          type: array
                          items:
                            type: object
                  - route: /admin/messaging/diagnostics
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-messaging/src/messagingService.ts
                    operation: simulateMessagingRoute
                    operation_id: diagnostics.routeSimulation.create
                    kind: action
                    api_surface: backend
                    api_method: POST
                    api_path: /backend/v3/api/messaging/diagnostics/route_simulation
                    read_sources: [messaging_route_rule, messaging_route_rule_target]
                    request_schema:
                      name: MessagingRouteSimulationRequest
                      required: [sceneCode, channel]
                      properties:
                        sceneCode: { type: string }
                        channel: { type: string }
                    response_schema:
                      name: MessagingRouteSimulationResponse
                      required: [matched]
                      properties:
                        matched: { type: boolean }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["operation_id"]: operation for operation in manifest["operations"]}

            self.assertEqual("messaging", operations["templates.list"]["tag"])
            self.assertEqual("messaging", operations["templates.list"]["sdk_domain"])
            self.assertEqual("messaging", operations["diagnostics.routeSimulation.create"]["tag"])
            self.assertEqual("messaging", operations["diagnostics.routeSimulation.create"]["sdk_domain"])

    def test_storage_paths_compile_to_oss_sdk_namespace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /admin/storage
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-file-platform/src/storageService.ts
                    operation: fetchStorageProviders
                    operation_id: oss.providers.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/storage/providers
                    sdk_domain: oss
                    read_sources: [object_provider]
                    query_parameters: []
                    response_schema:
                      name: StorageProviderListResponse
                      required: [items]
                      properties:
                        items:
                          type: array
                          items:
                            type: object
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("/backend/v3/api/storage/providers", operation["api_path"])
            self.assertEqual("storage", operation["tag"])
            self.assertEqual("oss", operation["sdk_domain"])
            self.assertEqual("oss.providers.list", operation["operation_id"])

    def test_commerce_catalog_and_inventory_paths_generate_commerce_domain(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/commerce
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/commerce-runtime.ts
                    operation: listCatalogProducts
                    operation_id: catalog.products.list
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/catalog/products
                    read_sources: [commerce_product_spu, commerce_product_sku]
                    query_parameters: []
                    response_schema:
                      name: CatalogProductsResponse
                      properties:
                        items:
                          type: array
                  - route: /admin/commerce
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/commerce-runtime.ts
                    operation: listInventoryStocks
                    operation_id: inventory.stocks.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/inventory/stocks
                    read_sources: [commerce_inventory_stock]
                    query_parameters: []
                    response_schema:
                      name: InventoryStocksResponse
                      properties:
                        items:
                          type: array
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["operation_id"]: operation for operation in manifest["operations"]}

            self.assertEqual("commerce", operations["catalog.products.list"]["tag"])
            self.assertEqual("commerce", operations["catalog.products.list"]["sdk_domain"])
            self.assertEqual("commerce", operations["inventory.stocks.list"]["tag"])
            self.assertEqual("commerce", operations["inventory.stocks.list"]["sdk_domain"])

    def test_standard_commerce_paths_are_not_rewritten_under_billing(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /vip
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-vip/src/vipService.ts
                    operation: retrieveMembership
                    operation_id: memberships.current.retrieve
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/memberships/current
                    read_sources: [commerce_order, commerce_payment_attempt]
                    query_parameters: []
                    response_schema:
                      name: MembershipCurrentResponse
                      properties:
                        id: { type: string }
                  - route: /console/commerce
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/commerce-runtime.ts
                    operation: listWalletAccounts
                    operation_id: wallet.accounts.list
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/wallet/accounts
                    read_sources: [commerce_account]
                    query_parameters: []
                    response_schema:
                      name: WalletAccountsResponse
                      properties:
                        items:
                          type: array
                  - route: /admin/commerce
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/commerce-runtime.ts
                    operation: listPaymentAttempts
                    operation_id: payments.attempts.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/payments/attempts
                    read_sources: [commerce_payment_attempt]
                    query_parameters: []
                    response_schema:
                      name: PaymentAttemptsResponse
                      properties:
                        items:
                          type: array
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["operation_id"]: operation for operation in manifest["operations"]}

            self.assertEqual("/app/v3/api/memberships/current", operations["memberships.current.retrieve"]["api_path"])
            self.assertEqual("commerce", operations["memberships.current.retrieve"]["tag"])
            self.assertEqual("commerce", operations["memberships.current.retrieve"]["sdk_domain"])
            self.assertEqual("/app/v3/api/wallet/accounts", operations["wallet.accounts.list"]["api_path"])
            self.assertEqual("commerce", operations["wallet.accounts.list"]["tag"])
            self.assertEqual("commerce", operations["wallet.accounts.list"]["sdk_domain"])
            self.assertEqual("/backend/v3/api/payments/attempts", operations["payments.attempts.list"]["api_path"])
            self.assertEqual("commerce", operations["payments.attempts.list"]["tag"])
            self.assertEqual("commerce", operations["payments.attempts.list"]["sdk_domain"])
            self.assertNotIn("/billing/", str(manifest))

    def test_explicit_billing_paths_keep_single_billing_namespace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/commerce
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/commerce-runtime.ts
                    operation: fetchCheckoutStatus
                    operation_id: payments.checkout.retrieve
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/billing/payments/checkout/{orderNo}
                    read_sources: [commerce_order, commerce_payment_attempt]
                    query_parameters: []
                    response_schema:
                      name: CheckoutStatusResponse
                      properties:
                        orderNo: { type: string }
                  - route: /admin/payments
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-payments/src/paymentsService.ts
                    operation: fetchPaymentAttempts
                    operation_id: payments.attempts.list
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/billing/payments/attempts
                    read_sources: [commerce_payment_attempt]
                    query_parameters: []
                    response_schema:
                      name: PaymentAttemptsResponse
                      properties:
                        items:
                          type: array
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["operation_id"]: operation for operation in manifest["operations"]}

            self.assertEqual("/app/v3/api/billing/payments/checkout/{orderNo}", operations["payments.checkout.retrieve"]["api_path"])
            self.assertEqual("commerce", operations["payments.checkout.retrieve"]["tag"])
            self.assertEqual("commerce", operations["payments.checkout.retrieve"]["sdk_domain"])
            self.assertEqual("/backend/v3/api/billing/payments/attempts", operations["payments.attempts.list"]["api_path"])
            self.assertEqual("commerce", operations["payments.attempts.list"]["tag"])
            self.assertEqual("commerce", operations["payments.attempts.list"]["sdk_domain"])
            self.assertNotIn("/commerce/billing/", str(manifest))

    def test_preserves_multipart_file_targets_in_operation_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /courses
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/courseService.ts
                    operation: uploadCourseApplicationVideo
                    operation_id: applications.videos.create
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/courses/applications/videos
                    sdk_domain: course
                    read_sources: []
                    write_tables: []
                    file_targets: [course_application_video_uploads]
                    request_content_type: multipart/form-data
                    request_schema:
                      name: CourseApplicationVideoUploadRequest
                      type: object
                      required: [file]
                      properties:
                        file: { type: string, format: binary }
                    response_schema:
                      name: CourseApplicationVideoUploadResponse
                      type: object
                      required: [videoUrl]
                      properties:
                        videoUrl: { type: string }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("multipart/form-data", operation["request_content_type"])
            self.assertEqual([], operation["read_sources"])
            self.assertEqual([], operation["write_tables"])
            self.assertEqual(["course_application_video_uploads"], operation["file_targets"])

    def test_derives_standard_tag_domain_and_operation_id_from_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/iam/api_keys
                    read_sources: [ai_channel_group]
                    write_tables: [iam_gateway_api_key, ops_audit_log]
                    request_schema:
                      name: CreateApiKeyRequest
                      required: [name]
                      properties:
                        name: { type: string }
                    response_schema:
                      name: CreateApiKeyResponse
                      required: [item]
                      properties:
                        item:
                          type: object
                          additionalProperties: true
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("iam", operation["tag"])
            self.assertEqual("iam", operation["sdk_domain"])
            self.assertEqual("apiKeys.create", operation["operation_id"])

    def test_preserves_canonical_auth_tag_when_deriving_operation_id(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /auth/login
                    source: apps/sdkwork-claw-router-portal/src/auth/clawRouterAuthController.ts
                    operation: signIn
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/auth/sessions
                    read_sources: [iam_user, iam_credential, iam_session]
                    write_tables: [iam_session]
                    request_schema:
                      name: IamSessionCreateRequest
                      properties:
                        grantType: { type: string }
                    response_schema:
                      name: IamSessionResponse
                      properties:
                        authToken: { type: string }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("auth", operation["tag"])
            self.assertEqual("iam", operation["sdk_domain"])
            self.assertEqual("sessions.create", operation["operation_id"])

    def test_resource_level_paths_do_not_collapse_to_domain_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /courses
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/courseService.ts
                    operation: fetchCourses
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/courses
                    read_sources: [content_course]
                    query_parameters: []
                    response_schema:
                      name: CourseListResponse
                      type: object
                      properties:
                        items: { type: array, items: { type: object, additionalProperties: true } }
                  - route: /forum
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/forumService.ts
                    operation: fetchForumFeeds
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/forum/feeds
                    read_sources: [plus_feeds]
                    query_parameters: []
                    response_schema:
                      name: ForumFeedListResponse
                      type: object
                      properties:
                        items: { type: array, items: { type: object, additionalProperties: true } }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operations = {operation["operation"]: operation for operation in manifest["operations"]}

            self.assertEqual("/app/v3/api/courses", operations["fetchCourses"]["api_path"])
            self.assertEqual("courses.list", operations["fetchCourses"]["operation_id"])
            self.assertEqual("/app/v3/api/content/forum/feeds", operations["fetchForumFeeds"]["api_path"])
            self.assertEqual("forum.feeds.list", operations["fetchForumFeeds"]["operation_id"])

    def test_appbase_agent_registry_preserves_standard_top_level_agents_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/agents
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/agentService.ts
                    operation: listAgents
                    operation_id: agentDefinitions.list
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/agents
                    sdk_domain: agents
                    read_sources: [ai_agent, ai_agent_version]
                    query_parameters: []
                    response_schema:
                      name: AgentListResponse
                      type: object
                      required: [items]
                      properties:
                        items: { type: array, items: { type: object, additionalProperties: true } }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("/app/v3/api/agents", operation["api_path"])
            self.assertEqual("agents", operation["tag"])
            self.assertEqual("agents", operation["sdk_domain"])
            self.assertEqual("agentDefinitions.list", operation["operation_id"])

    def test_read_collection_action_uses_list_for_standard_collection_reads(self) -> None:
        generator = ApiContractManifestGenerator(root=Path(__file__).resolve().parents[1])

        self.assertEqual("list", generator._read_collection_action("POST"))
        self.assertEqual("list", generator._read_collection_action("post"))
        self.assertEqual("list", generator._read_collection_action("GET"))

    def test_read_collection_paths_strip_rpc_action_segments(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /admin/channel
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/channelService.ts
                    operation: fetchChannels
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/channel/list
                    read_sources: [ai_channel]
                    query_parameters: []
                    response_schema:
                      name: AdminChannelsResponse
                      type: object
                      properties:
                        items: { type: array, items: { type: object, additionalProperties: true } }
                  - route: /admin/channel
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/channelService.ts
                    operation: addChannel
                    kind: create
                    api_surface: backend
                    api_method: POST
                    api_path: /backend/v3/api/channel
                    read_sources: [ai_channel]
                    write_tables: [ai_channel]
                    request_schema:
                      name: AdminChannelCreateRequest
                      type: object
                      properties:
                        name: { type: string }
                    response_schema:
                      name: AdminChannelMutationResponse
                      type: object
                      properties:
                        item: { type: object, additionalProperties: true }
                  - route: /forum
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/forumService.ts
                    operation: searchForumFeeds
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/content/feeds/search
                    read_sources: [plus_feeds]
                    query_parameters:
                      - name: q
                        required: true
                        schema: { type: string, maxLength: 128 }
                    response_schema:
                      name: ForumFeedListResponse
                      type: object
                      properties:
                        items: { type: array, items: { type: object, additionalProperties: true } }
                """,
            )

            generator = ApiContractManifestGenerator(root=root, contract_path=contract)
            result = generator.validate()
            manifest = generator.generate()
            operations = {operation["operation"]: operation for operation in manifest["operations"]}

            self.assertTrue(result.ok, result.messages)
            self.assertEqual("/backend/v3/api/integration/channels", operations["fetchChannels"]["api_path"])
            self.assertEqual("channels.list", operations["fetchChannels"]["operation_id"])
            self.assertEqual("/backend/v3/api/integration/channels", operations["addChannel"]["api_path"])
            self.assertEqual("channels.create", operations["addChannel"]["operation_id"])
            self.assertEqual("/app/v3/api/content/feeds", operations["searchForumFeeds"]["api_path"])
            self.assertEqual("feeds.list", operations["searchForumFeeds"]["operation_id"])

    def test_project_backend_read_operations_use_get_collection_paths(self) -> None:
        root = Path(__file__).resolve().parents[1]
        manifest = ApiContractManifestGenerator(root=root).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        expected = {
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-channel/src/channelService.ts#fetchChannels": (
                "/backend/v3/api/integration/channels",
                "channels.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-channel/src/channelService.ts#fetchProviderSecrets": (
                "/backend/v3/api/integration/provider_secrets",
                "providerSecrets.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-marketing/src/marketingService.ts#fetchReferralStats": (
                "/backend/v3/api/system/marketing/referral_stats",
                "marketing.referralStats.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-model/src/modelService.ts#fetchModels": (
                "/backend/v3/api/ai/models",
                "models.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-record/src/recordService.ts#fetchLogs": (
                "/backend/v3/api/system/records",
                "records.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-skill/src/skillService.ts#fetchSkillPackages": (
                "/backend/v3/api/ecosystem/skills/package",
                "skills.package.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-skill/src/skillService.ts#fetchSkills": (
                "/backend/v3/api/ecosystem/skills",
                "skills.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts#fetchApiKeysMap": (
                "/backend/v3/api/iam/api_keys",
                "apiKeys.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts#fetchUsers": (
                "/backend/v3/api/iam/users",
                "users.list",
            ),
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-app-center/src/services/adminAppService.ts#fetchApps": (
                "/backend/v3/api/platform/apps",
                "apps.list",
            ),
        }

        for key, (api_path, operation_id) in expected.items():
            with self.subTest(key=key):
                self.assertIn(key, operations)
                self.assertEqual(api_path, operations[key]["api_path"])
                self.assertEqual(operation_id, operations[key]["operation_id"])

        for operation in manifest["operations"]:
            if operation["api_surface"] == "backend" and operation["kind"] == "read":
                with self.subTest(key=operation["key"]):
                    self.assertFalse(operation["api_path"].endswith("/list"), operation["api_path"])
                    self.assertNotIn("/search", operation["api_path"])

    def test_detail_path_and_inverse_actions_generate_distinct_operation_ids(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /courses/:courseId
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/courseService.ts
                    operation: fetchCourseDetail
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/courses/{courseId}
                    read_sources: [content_course]
                    query_parameters: []
                    response_schema:
                      name: CourseDetailResponse
                      type: object
                      properties:
                        id: { type: string }
                  - route: /forum
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/forumService.ts
                    operation: likeForumComment
                    kind: action
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/content/comments/{commentId}/likes
                    read_sources: [plus_comments]
                    write_tables: [content_reaction]
                    request_body_required: false
                    response_schema:
                      name: ForumBooleanResponse
                      type: boolean
                  - route: /forum
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/forumService.ts
                    operation: unlikeForumComment
                    kind: delete
                    api_surface: app
                    api_method: DELETE
                    api_path: /app/v3/api/content/comments/{commentId}/likes/current
                    read_sources: [plus_comments]
                    write_tables: [content_reaction]
                    request_body_required: false
                    response_schema:
                      name: ForumBooleanResponse
                      type: boolean
                """,
            )

            generator = ApiContractManifestGenerator(root=root, contract_path=contract)
            result = generator.validate()
            manifest = generator.generate()
            operations = {operation["operation"]: operation for operation in manifest["operations"]}

            self.assertTrue(result.ok, result.messages)
            self.assertEqual("courses.retrieve", operations["fetchCourseDetail"]["operation_id"])
            self.assertEqual("/app/v3/api/courses/{courseId}", operations["fetchCourseDetail"]["api_path"])
            self.assertEqual("comments.likes.create", operations["likeForumComment"]["operation_id"])
            self.assertEqual("/app/v3/api/content/comments/{commentId}/likes", operations["likeForumComment"]["api_path"])
            self.assertEqual("comments.likes.current.delete", operations["unlikeForumComment"]["operation_id"])
            self.assertEqual("/app/v3/api/content/comments/{commentId}/likes/current", operations["unlikeForumComment"]["api_path"])

    def test_project_contract_declares_console_api_key_create_operation(self) -> None:
        root = Path(__file__).resolve().parents[1]
        manifest = ApiContractManifestGenerator(root=root).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}
        operation = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts#createKey"
        )

        self.assertIsNotNone(operation)
        self.assertEqual("app", operation["api_surface"])
        self.assertEqual("POST", operation["api_method"])
        self.assertEqual("/app/v3/api/iam/api_keys", operation["api_path"])
        self.assertEqual("create", operation["kind"])
        self.assertEqual("SdkworkAppClient", operation["sdk_client"])
        self.assertEqual("iam", operation["tag"])
        self.assertEqual("iam", operation["sdk_domain"])
        self.assertEqual("apiKeys.create", operation["operation_id"])
        self.assertIn("iam_gateway_api_key", operation["write_tables"])
        self.assertIn("ops_audit_log", operation["write_tables"])
        self.assertEqual("CreateApiKeyRequest", operation["request_schema"]["name"])
        self.assertEqual(["name", "group"], operation["request_schema"]["schema"]["required"])
        self.assertEqual("CreateApiKeyResponse", operation["response_schema"]["name"])
        self.assertEqual(["item", "rawKey"], operation["response_schema"]["schema"]["required"])

    def test_project_contract_declares_precise_console_write_payloads(self) -> None:
        root = Path(__file__).resolve().parents[1]
        manifest = ApiContractManifestGenerator(root=root).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}

        submit_recharge = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-recharge/src/rechargeService.ts#submitRecharge"
        )
        update_settings = operations.get(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-settings/src/settingsService.ts#updateSettings"
        )

        self.assertIsNotNone(submit_recharge)
        self.assertEqual("console.rechargeOrders.create", submit_recharge["operation_id"])
        self.assertEqual("/app/v3/api/recharges/orders", submit_recharge["api_path"])
        self.assertEqual("POST", submit_recharge["api_method"])
        self.assertEqual("create", submit_recharge["kind"])
        self.assertEqual("app", submit_recharge["api_surface"])
        self.assertEqual("commerce", submit_recharge["sdk_domain"])
        self.assertFalse(submit_recharge["openapi_exposed"])
        self.assertIsNone(submit_recharge.get("request_schema"))
        self.assertIsNone(submit_recharge.get("response_schema"))
        self.assertEqual(
            ["commerce_recharge_package", "commerce_payment_method"],
            submit_recharge["read_sources"],
        )
        self.assertEqual(
            ["commerce_order", "commerce_order_item", "commerce_payment_intent", "ops_audit_log"],
            submit_recharge["write_tables"],
        )

        self.assertIsNotNone(update_settings)
        self.assertEqual("UpdateSettingsRequest", update_settings["request_schema"]["name"])
        self.assertEqual(
            ["language", "timezone", "webhookUrl", "notifications"],
            update_settings["request_schema"]["schema"]["required"],
        )
        self.assertEqual("UpdateSettingsResponse", update_settings["response_schema"]["name"])
        self.assertEqual(["success"], update_settings["response_schema"]["schema"]["required"])

    def test_preserves_operation_payload_schemas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [ai_channel_group]
                    write_tables: [iam_gateway_api_key, ops_audit_log]
                    request_schema:
                      name: CreateApiKeyRequest
                      required: [name, group]
                      properties:
                        name:
                          type: string
                          maxLength: 128
                        group:
                          type: string
                          maxLength: 64
                    response_schema:
                      name: CreateApiKeyResponse
                      required: [item, rawKey]
                      properties:
                        item:
                          type: object
                          additionalProperties: true
                        rawKey:
                          type: string
                          minLength: 1
                        failureReason:
                          type: [string, "null"]
                          maxLength: 1024
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("CreateApiKeyRequest", operation["request_schema"]["name"])
            self.assertEqual(["name", "group"], operation["request_schema"]["schema"]["required"])
            self.assertFalse(operation["request_schema"]["schema"]["additionalProperties"])
            self.assertEqual(128, operation["request_schema"]["schema"]["properties"]["name"]["maxLength"])
            self.assertEqual("CreateApiKeyResponse", operation["response_schema"]["name"])
            self.assertEqual(["item", "rawKey"], operation["response_schema"]["schema"]["required"])
            self.assertFalse(operation["response_schema"]["schema"]["additionalProperties"])
            failure_reason = operation["response_schema"]["schema"]["properties"]["failureReason"]
            self.assertEqual("string", failure_reason["type"])
            self.assertTrue(failure_reason["nullable"])
            self.assertEqual(1024, failure_reason["maxLength"])

    def test_preserves_array_response_payload_schemas(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            contract = self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/commerce
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/promotionService.ts
                    operation: appPromotionUserCouponsList
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/promotions/user_coupons
                    operation_id: promotions.userCoupons.wallet.list
                    read_sources: [promotion_user_coupon, promotion_coupon_stock]
                    response_schema:
                      name: PromotionUserCouponWalletListResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: PromotionCouponWalletItem
                        required: [couponNo, currencyCode, status]
                        properties:
                          couponNo: { type: string }
                          currencyCode: { type: string, minLength: 3, maxLength: 3 }
                          status: { type: string, enum: [available, locked, redeemed, expired, disabled, returned] }
                """,
            )

            manifest = ApiContractManifestGenerator(root=root, contract_path=contract).generate()
            operation = manifest["operations"][0]

            self.assertEqual("PromotionUserCouponWalletListResponse", operation["response_schema"]["name"])
            self.assertEqual("array", operation["response_schema"]["schema"]["type"])
            self.assertEqual(
                "PromotionCouponWalletItem",
                operation["response_schema"]["schema"]["items"]["name"],
            )
            self.assertNotIn("properties", operation["response_schema"]["schema"])

    def test_validate_rejects_duplicate_operation_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "duplicate api contract operation: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys",
                result.messages,
            )

    def test_validate_rejects_duplicate_openapi_path_method_per_surface(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model]
                    query_parameters: []
                    response_schema:
                      name: ModelListResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: ModelListItem
                        required: [id]
                        properties:
                          id: { type: string }
                  - route: /rankings
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts
                    operation: fetchModelVendors
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model_vendor]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "duplicate OpenAPI path/method on app GET /app/v3/api/ai/models: "
                "apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts#fetchModels and "
                "apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts#fetchModelVendors",
                result.messages,
            )

    def test_validate_allows_non_exposed_derived_operation_on_existing_openapi_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    read_sources: [ai_model]
                    query_parameters: []
                    response_schema:
                      name: ModelListResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: ModelListItem
                        required: [id]
                        properties:
                          id: { type: string }
                  - route: /rankings
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts
                    operation: fetchModelVendors
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    openapi_exposed: false
                    description: Derived frontend operation that reuses fetchModels and aggregates vendor filters client-side.
                    read_sources: [ai_model_vendor, ai_model]
                """,
            )

            generator = ApiContractManifestGenerator(root=root)
            result = generator.validate()
            manifest = generator.generate()
            operations = {operation["key"]: operation for operation in manifest["operations"]}

            self.assertTrue(result.ok, result.messages)
            self.assertFalse(
                operations[
                    "apps/sdkwork-claw-router-portal/packages/demo/src/rankingService.ts#fetchModelVendors"
                ]["openapi_exposed"]
            )

    def test_validate_rejects_non_boolean_openapi_exposed_flag(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /models
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts
                    operation: fetchModels
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/models
                    openapi_exposed: "disabled"
                    read_sources: [ai_model]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/modelService.ts#fetchModels openapi_exposed must be boolean",
                result.messages,
            )

    def test_validate_rejects_route_surface_mismatch_without_enforcing_url_prefix(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: backend
                    api_method: GET
                    api_path: /backend/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: createTrace
                    kind: action
                    api_surface: openai_v1
                    api_method: POST
                    api_path: /app/v3/api/router/traces
                    read_sources: [ai_request_trace]
                    write_tables: [ai_request_trace]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys route /console/api-keys must not use backend api_surface",
                result.messages,
            )
            self.assertNotIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#createTrace api_path must start with /v1",
                result.messages,
            )

    def test_validate_allows_sdk_surface_with_non_standard_url_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: createTrace
                    kind: action
                    api_surface: openai_v1
                    api_method: POST
                    api_path: /tenant-a/ai/traces
                    read_sources: [ai_request_trace]
                    write_tables: [ai_request_trace]
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertTrue(result.ok, result.messages)

    def test_validate_rejects_invalid_operation_payload_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [ai_channel_group]
                    write_tables: [iam_gateway_api_key]
                    request_schema:
                      name: create-api-key
                      properties: []
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts#createKey request_schema.name must be PascalCase",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/apiKeyService.ts#createKey request_schema.properties must be an object",
                result.messages,
            )

    def test_validate_requires_explicit_query_and_response_contracts_for_exposed_operations(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: createKey
                    kind: create
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [ai_channel_group]
                    write_tables: [iam_gateway_api_key]
                    request_schema:
                      name: CreateApiKeyRequest
                      required: [name]
                      properties:
                        name: { type: string }
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: testKey
                    kind: action
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/router/api-keys/{apiKeyId}/test
                    read_sources: [iam_gateway_api_key]
                    write_tables: [ops_audit_log]
                    response_schema:
                      name: NoData
                      schema:
                        $ref: '#/components/schemas/NoData'
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys GET operations must explicitly declare query_parameters, use [] when there are no query inputs",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchKeys must explicitly declare response_schema",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#createKey must explicitly declare response_schema",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#testKey POST operations without request_schema must explicitly set request_body_required: false",
                result.messages,
            )

    def test_validate_rejects_non_lower_snake_case_query_parameter_names(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/usage
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchLogs
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/ai/usage/logs
                    read_sources: [ai_request_trace]
                    query_parameters:
                      - name: pageSize
                        schema: { type: integer, minimum: 1, maximum: 200 }
                    response_schema:
                      name: UsageLogsResponse
                      required: [logs]
                      properties:
                        logs:
                          type: array
                          items:
                            type: object
                            additionalProperties: false
                            required: [id]
                            properties:
                              id: { type: string }
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[0].name must be lower_snake_case URL parameter",
                result.messages,
            )

    def test_validate_rejects_standard_query_parameter_aliases(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/usage
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchLogs
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/ai/usage/logs
                    read_sources: [ai_request_trace]
                    query_parameters:
                      - name: q
                        schema: { type: string, maxLength: 128 }
                      - name: keyword
                        schema: { type: string, maxLength: 128 }
                      - name: search_query
                        schema: { type: string, maxLength: 128 }
                      - name: search
                        schema: { type: string, maxLength: 128 }
                      - name: searchQuery
                        schema: { type: string, maxLength: 128 }
                      - name: size
                        schema: { type: integer, minimum: 1, maximum: 200 }
                    response_schema:
                      name: UsageLogsResponse
                      required: [logs]
                      properties:
                        logs:
                          type: array
                          items:
                            type: object
                            additionalProperties: false
                            required: [id]
                            properties:
                              id: { type: string }
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[1].name must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[2].name must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[3].name must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[4].name must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#fetchLogs query_parameters[5].name must use page_size for page size",
                result.messages,
            )

    def test_validate_rejects_request_schema_search_aliases_and_allows_q(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/usage
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: queryLogs
                    kind: action
                    api_surface: app
                    api_method: POST
                    api_path: /app/v3/api/ai/usage/logs
                    read_sources: [ai_request_trace]
                    request_schema:
                      name: UsageLogQueryRequest
                      type: object
                      additionalProperties: false
                      properties:
                        q: { type: string, maxLength: 128 }
                        keyword: { type: string, maxLength: 128 }
                        search_query: { type: string, maxLength: 128 }
                        search: { type: string, maxLength: 128 }
                        searchQuery: { type: string, maxLength: 128 }
                    response_schema:
                      name: UsageLogsResponse
                      required: [logs]
                      properties:
                        logs:
                          type: array
                          items:
                            type: object
                            additionalProperties: false
                            required: [id]
                            properties:
                              id: { type: string }
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertFalse(result.ok)
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#queryLogs request_schema.properties.keyword must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#queryLogs request_schema.properties.search_query must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#queryLogs request_schema.properties.search must use q for search text",
                result.messages,
            )
            self.assertIn(
                "api contract apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts#queryLogs request_schema.properties.searchQuery must use q for search text",
                result.messages,
            )
            self.assertFalse(any("request_schema.properties.q must use" in message for message in result.messages))

    def test_validate_allows_explicit_no_data_response_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: deleteKey
                    kind: delete
                    api_surface: app
                    api_method: DELETE
                    api_path: /app/v3/api/router/api-keys/{apiKeyId}
                    read_sources: [iam_gateway_api_key]
                    write_tables: [iam_gateway_api_key]
                    response_schema:
                      name: NoData
                      schema:
                        $ref: '#/components/schemas/NoData'
                """,
            )

            result = ApiContractManifestGenerator(root=root).validate()

            self.assertTrue(result.ok, result.messages)

    def test_writes_and_checks_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                    query_parameters: []
                    response_schema:
                      name: FetchKeysResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: FetchKeysItem
                        required: [id]
                        properties:
                          id: { type: string }
                """,
            )
            generator = ApiContractManifestGenerator(root=root)
            output = generator.write()

            self.assertTrue(output.exists())
            self.assertTrue(generator.check().ok)

    def test_check_reports_stale_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/api-keys
                    source: apps/sdkwork-claw-router-portal/packages/demo/src/demoService.ts
                    operation: fetchKeys
                    kind: read
                    api_surface: app
                    api_method: GET
                    api_path: /app/v3/api/router/api-keys
                    read_sources: [iam_gateway_api_key]
                    query_parameters: []
                    response_schema:
                      name: FetchKeysResponse
                      type: array
                      items:
                        type: object
                        additionalProperties: false
                        name: FetchKeysItem
                        required: [id]
                        properties:
                          id: { type: string }
                """,
            )
            output = root / "generated" / "api" / "api-contract-manifest.json"
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text("{}\n", encoding="utf-8")

            result = ApiContractManifestGenerator(root=root).check()

            self.assertFalse(result.ok)
            self.assertIn(f"api contract manifest is stale: {output}", result.messages)


if __name__ == "__main__":
    unittest.main()
