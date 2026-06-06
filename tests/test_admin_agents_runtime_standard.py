import json
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
BACKEND_OPENAPI_PATH = ROOT / "generated" / "openapi" / "clawrouter-backend-openapi.json"
BACKEND_AGENTS_API_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "api"
    / "agents.ts"
)
BACKEND_SDK_PATH = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
    / "sdk.ts"
)
PORTAL_PACKAGE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-clawrouter-pc"
    / "packages"
    / "sdkwork-clawrouter-pc-admin-agents"
)


class AdminAgentsRuntimeStandardTest(unittest.TestCase):
    def test_admin_agents_route_nav_and_service_use_backend_sdk(self) -> None:
        app = (ROOT / "apps/sdkwork-clawrouter-pc/src/App.tsx").read_text(encoding="utf-8")
        registry = (ROOT / "apps/sdkwork-clawrouter-pc/src/adminModuleRegistry.ts").read_text(
            encoding="utf-8"
        )
        service = (PORTAL_PACKAGE_ROOT / "src" / "agentService.ts").read_text(encoding="utf-8")
        package_json = json.loads((PORTAL_PACKAGE_ROOT / "package.json").read_text(encoding="utf-8"))

        self.assertEqual("sdkwork-clawrouter-pc-admin-agents", package_json["name"])
        self.assertIn("sdkwork-clawrouter-pc-admin-agents", app)
        self.assertIn("const AgentsAdmin", app)
        self.assertIn('<Route path="agents" element={<AgentsAdmin />} />', app)
        self.assertIn("'/admin/agents'", registry)
        self.assertIn("admin.menu.agents", registry)
        self.assertIn("return getClawRouterBackendSdkClient().agents;", service)
        self.assertIn("backendAgentsSdk().agentDefinitions.list", service)
        self.assertIn("backendAgentsSdk().agentDefinitions.retrieve", service)
        self.assertNotIn("getClawRouterAppSdkClient", service)
        self.assertNotIn("fetch(", service)
        self.assertNotIn("axios", service)

    def test_admin_agents_contract_openapi_and_sdk_are_backend_only(self) -> None:
        contract = yaml.safe_load(CONTRACT_PATH.read_text(encoding="utf-8"))
        operations = {
            operation["operation"]: operation
            for operation in contract.get("frontend_operations", [])
            if operation.get("route") == "/admin/agents"
        }
        self.assertEqual({"listAgents", "retrieveAgent"}, set(operations))

        list_operation = operations["listAgents"]
        retrieve_operation = operations["retrieveAgent"]
        self.assertEqual("backend", list_operation["api_surface"])
        self.assertEqual("GET", list_operation["api_method"])
        self.assertEqual("/backend/v3/api/agents", list_operation["api_path"])
        self.assertEqual("agentDefinitions.list", list_operation["operation_id"])
        self.assertEqual("read", list_operation["kind"])
        self.assertEqual(
            ["q", "owner_user_id", "status", "visibility", "page", "page_size"],
            [parameter["name"] for parameter in list_operation["query_parameters"]],
        )
        self.assertEqual(
            ["ai_agent", "ai_agent_version", "ai_agent_tool_binding", "ai_agent_mcp_server", "ai_agent_memory"],
            list_operation["read_sources"],
        )
        self.assertNotIn("write_tables", list_operation)
        self.assertEqual("AdminAgentListResponse", list_operation["response_schema"]["name"])

        self.assertEqual("backend", retrieve_operation["api_surface"])
        self.assertEqual("GET", retrieve_operation["api_method"])
        self.assertEqual("/backend/v3/api/agents/{agentId}", retrieve_operation["api_path"])
        self.assertEqual("agentDefinitions.retrieve", retrieve_operation["operation_id"])
        self.assertEqual("read", retrieve_operation["kind"])
        self.assertEqual("AdminAgentItem", retrieve_operation["response_schema"]["name"])
        self.assertNotIn("write_tables", retrieve_operation)

        openapi = json.loads(BACKEND_OPENAPI_PATH.read_text(encoding="utf-8"))
        self.assertEqual("agentDefinitions.list", openapi["paths"]["/backend/v3/api/agents"]["get"]["operationId"])
        self.assertEqual(
            "agentDefinitions.retrieve",
            openapi["paths"]["/backend/v3/api/agents/{agentId}"]["get"]["operationId"],
        )
        self.assertEqual(["agents"], openapi["paths"]["/backend/v3/api/agents"]["get"]["tags"])
        self.assertIn("AdminAgentItem", openapi["components"]["schemas"])
        self.assertIn("AdminAgentListResponse", openapi["components"]["schemas"])

        agents_api = BACKEND_AGENTS_API_PATH.read_text(encoding="utf-8")
        sdk = BACKEND_SDK_PATH.read_text(encoding="utf-8")
        item_type = (
            ROOT
            / "sdks"
            / "clawrouter-backend-sdk"
            / "clawrouter-backend-sdk-typescript"
            / "src"
            / "types"
            / "admin-agent-item.ts"
        ).read_text(encoding="utf-8")
        self.assertIn("async list(params?: AgentsAgentDefinitionsListParams): Promise<AgentDefinitionsListResult>", agents_api)
        self.assertIn("async retrieve(agentId: string): Promise<AgentDefinitionsRetrieveResult>", agents_api)
        self.assertIn("public readonly agentDefinitions: AgentsAgentDefinitionsApi;", agents_api)
        self.assertIn("readonly agents: AgentsApi;", sdk)
        self.assertIn("export interface AdminAgentItem", item_type)
        self.assertIn("ownerUserId: string;", item_type)
        self.assertIn("defaultVersion", item_type)


if __name__ == "__main__":
    unittest.main()
