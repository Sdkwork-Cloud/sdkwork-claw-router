import json
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
PORTAL_ROOT = ROOT / "apps" / "sdkwork-claw-router-portal"
AGENTS_PACKAGE = PORTAL_ROOT / "packages" / "sdkwork-claw-router-console-agents"


class ConsoleAgentsRuntimeStandardTest(unittest.TestCase):
    def test_console_agents_route_is_registered_with_navigation_and_sdk_contract(self) -> None:
        app = (PORTAL_ROOT / "src" / "App.tsx").read_text(encoding="utf-8")
        console_layout = (
            PORTAL_ROOT
            / "packages"
            / "sdkwork-claw-router-console-core"
            / "src"
            / "ConsoleLayout.tsx"
        ).read_text(encoding="utf-8")
        portal_package = json.loads((PORTAL_ROOT / "package.json").read_text(encoding="utf-8"))
        route_classification = yaml.safe_load(
            (ROOT / "docs" / "schema-registry" / "frontend-route-classification.yaml").read_text(
                encoding="utf-8"
            )
        )
        agent_service = (AGENTS_PACKAGE / "src" / "agentService.ts").read_text(encoding="utf-8")

        routes = {
            entry["route"]: entry
            for entry in route_classification["routes"]
            if isinstance(entry, dict) and isinstance(entry.get("route"), str)
        }

        self.assertTrue((AGENTS_PACKAGE / "package.json").exists())
        self.assertIn('"sdkwork-claw-router-console-agents": "workspace:*"', json.dumps(portal_package))
        self.assertIn("const AgentsView = lazyRoute(() => import('sdkwork-claw-router-console-agents'), 'AgentsView');", app)
        self.assertIn('path="agents" element={<AgentsView />} />', app)
        self.assertIn("Bot", console_layout)
        self.assertIn("path: '/console/agents'", console_layout)

        self.assertIn("/console/agents", routes)
        route = routes["/console/agents"]
        self.assertEqual("sdkwork-claw-router-console-agents", route["package"])
        self.assertEqual("customer-console", route["owner"])
        self.assertEqual("console", route["route_scope"])
        self.assertEqual("sdk_backed_business_runtime", route["delivery_kind"])
        self.assertEqual("app", route["api_surface"])
        self.assertIn(
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-agents/src/agentService.ts",
            route["evidence"],
        )

        self.assertIn("getClawRouterAppSdkClient().agents.agentDefinitions", agent_service)
        self.assertIn("appAgentsSdk().list", agent_service)
        self.assertIn("appAgentsSdk().retrieve", agent_service)
        self.assertIn("appAgentsSdk().create", agent_service)
        self.assertNotIn("fetch(", agent_service)
        self.assertNotIn("axios", agent_service)

    def test_console_agents_visible_copy_is_localized_for_console(self) -> None:
        view = (AGENTS_PACKAGE / "src" / "AgentsView.tsx").read_text(encoding="utf-8")
        service = (AGENTS_PACKAGE / "src" / "agentService.ts").read_text(encoding="utf-8")

        self.assertIn("useTranslation", view)
        self.assertIn("const { t } = useTranslation();", view)
        self.assertIn("智能体管理", view)
        self.assertIn("创建智能体", view)

        for visible_literal in [
            ">Agent management<",
            'placeholder="Search agents"',
            ">Refresh<",
            'title="Loading agents..."',
            'title="Agents could not be loaded"',
            'title="No agents found"',
            'title="No agent selected"',
            ">Create agent<",
            'label="System prompt"',
            'label="Execution mode"',
            ">Not configured<",
        ]:
            with self.subTest(visible_literal=visible_literal):
                self.assertNotIn(visible_literal, view)

        for phrase in ["Failed to load agents", "Failed to create agent"]:
            with self.subTest(phrase=phrase):
                self.assertNotIn(phrase, service)

    def test_console_agents_detail_panel_uses_retrieve_endpoint(self) -> None:
        view = (AGENTS_PACKAGE / "src" / "AgentsView.tsx").read_text(encoding="utf-8")
        service = (AGENTS_PACKAGE / "src" / "agentService.ts").read_text(encoding="utf-8")

        self.assertIn("AgentService.retrieveAgent(agentId)", view)
        self.assertIn("void loadAgentDetail(selectedAgentId", view)
        self.assertIn("detailLoading", view)
        self.assertIn("detailError", view)
        self.assertIn("console.agents.states.detailLoading", view)
        self.assertIn("console.agents.states.detailLoadError", view)
        self.assertIn("onRetryDetail={() => selectedAgentId ? void loadAgentDetail(selectedAgentId) : undefined}", view)
        self.assertIn("onRetry={() => void onRetryDetail()}", view)

        self.assertNotIn("const selectedAgent = useMemo", view)

        self.assertIn("static async retrieveAgent", service)
        self.assertIn("appAgentsSdk().retrieve", service)

    def test_console_agents_create_uses_standard_idempotency_contract(self) -> None:
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "api"
            / "agents.ts"
        ).read_text(encoding="utf-8")
        service = (AGENTS_PACKAGE / "src" / "agentService.ts").read_text(encoding="utf-8")
        backend = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_agents.rs"
        ).read_text(encoding="utf-8")

        create_contract = contract.split("operation_id: agentDefinitions.create", 1)[1].split(
            "operation_id: agentDefinitions.retrieve", 1
        )[0]
        create_operation = openapi.split('"operationId": "agentDefinitions.create"', 1)[1].split(
            '"operationId": "agentDefinitions.retrieve"', 1
        )[0]

        self.assertIn("idempotency_required: true", create_contract)
        self.assertIn('"name": "Idempotency-Key"', create_operation)
        self.assertIn('"required": true', create_operation)
        self.assertIn('"name": "X-Request-Id"', create_operation)

        self.assertIn("export interface AgentsAgentDefinitionsCreateParams", sdk)
        self.assertIn("idempotencyKey: string;", sdk)
        self.assertIn("xRequestId?: string;", sdk)
        self.assertIn("create(body: AgentCreateRequest, params: AgentsAgentDefinitionsCreateParams)", sdk)
        self.assertIn("'Idempotency-Key': { value: params.idempotencyKey", sdk)
        self.assertIn("'X-Request-Id': { value: params.xRequestId", sdk)

        self.assertIn("createRequestToken", service)
        self.assertIn("from 'sdkwork-claw-router-commons/runtime'", service)
        self.assertNotIn("function createRequestToken", service)
        self.assertIn("const idempotencyKey = createRequestToken('create-agent');", service)
        self.assertIn("const requestId = createRequestToken('request');", service)
        self.assertIn("{ idempotencyKey, xRequestId: requestId }", service)

        self.assertIn("IDEMPOTENCY_KEY_HEADER", backend)
        self.assertIn("normalize_idempotency_key", backend)
        self.assertIn("Idempotency-Key header is required", backend)
        self.assertIn("validate_request_token(value, \"Idempotency-Key\")", backend)
        self.assertNotIn(".map(str::trim)\n        .filter(|value| !value.is_empty())", backend)

        sqlite_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "sqlite"
            / "app_agent_registry_store.rs"
        ).read_text(encoding="utf-8")
        postgres_store = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "src"
            / "infrastructure"
            / "sql"
            / "postgres"
            / "app_agent_registry_store.rs"
        ).read_text(encoding="utf-8")
        for store in [sqlite_store, postgres_store]:
            with self.subTest(store="agent_registry_store"):
                self.assertIn("idempotent_agent_result", store)
                self.assertIn("item_matches_command_payload", store)
                self.assertIn("idempotency key already exists with different agent payload", store)


if __name__ == "__main__":
    unittest.main()
