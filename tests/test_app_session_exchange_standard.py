import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AppSessionExchangeStandardTest(unittest.TestCase):
    def test_app_session_exchange_is_signed_subject_based_audited_and_sdk_backed(self):
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_sdk_api_index = (ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "index.ts")
        session_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "sessionService.ts"
        )

        self.assertIn("operation: createAppSession", contract)
        self.assertIn("api_path: /app/v3/api/auth/session", contract)
        self.assertIn("write_tables: [iam_user_login_event]", contract)

        self.assertTrue(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_session.rs").exists()
        )
        self.assertIn("app_session_router_with_event_store", product_api_mod)
        app_session_api = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_session.rs"
        ).read_text(encoding="utf-8")
        self.assertIn('"/app/v3/api/auth/session"', app_session_api)
        self.assertIn("TrustedRequestSubject::from_headers", app_session_api)
        self.assertIn("sign_app_session_token", app_session_api)
        self.assertIn("AppSessionEventStore", app_session_api)
        self.assertIn("session_id_hash", app_session_api)
        self.assertNotIn("x-sdkwork-tenant-id", app_session_api)

        self.assertIn("trusted_request_subject_boundary", app_api)
        self.assertIn("SqliteAppSessionEventStore", app_api)
        self.assertIn("PostgresAppSessionEventStore", app_api)
        self.assertIn("app_session_router_with_event_store", app_api)

        self.assertTrue(app_sdk_api_index.exists())
        self.assertTrue(session_service.exists())
        session_source = session_service.read_text(encoding="utf-8")
        self.assertIn("@sdkwork/clawrouter-app-sdk", session_source)
        self.assertIn("createAppSession", session_source)
        self.assertNotIn("fetch(", session_source)
        self.assertNotIn("axios", session_source)

    def test_app_session_token_is_stored_and_injected_by_commons_sdk_boundary(self):
        commons_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
        )
        session_service = (commons_root / "sessionService.ts").read_text(encoding="utf-8")
        sdk_clients = (commons_root / "sdk-clients.ts").read_text(encoding="utf-8")
        index_source = (commons_root / "index.ts").read_text(encoding="utf-8")
        runtime_source = (commons_root / "runtime.ts").read_text(encoding="utf-8")
        env_source = (commons_root / "utils" / "env.ts").read_text(encoding="utf-8")
        session_token_path = commons_root / "app-session-token.ts"

        self.assertTrue(session_token_path.exists())
        session_token = session_token_path.read_text(encoding="utf-8")

        self.assertIn("storeAppSessionFromResult", session_service)
        self.assertIn("resetClawRouterSdkClients()", session_service)
        self.assertIn("const stored = storeAppSessionFromResult(result);", session_service)
        self.assertIn("code: '2000'", session_service)
        self.assertNotIn("result.code === '2000'", session_service)
        self.assertIn("getStoredAppSessionToken", sdk_clients)
        self.assertIn("appClientSessionToken", sdk_clients)
        self.assertIn("backendClientSessionToken", sdk_clients)
        self.assertIn("const sessionToken = getStoredAppSessionToken();", sdk_clients)
        self.assertIn("appClientSessionToken !== sessionToken", sdk_clients)
        self.assertIn("backendClientSessionToken !== sessionToken", sdk_clients)
        self.assertIn("authToken: options.authToken ?? getStoredAppSessionToken()", sdk_clients)
        self.assertIn("?? APP_API_PREFIX", sdk_clients)
        self.assertIn("?? BACKEND_API_PREFIX", sdk_clients)
        self.assertNotIn("?? API_BASE_URL", sdk_clients)
        self.assertIn("sessionStorage", session_token)
        self.assertIn("readApiRecord", session_token)
        self.assertIn("readAppSessionPayload", session_token)
        self.assertIn("return readApiRecord(result);", session_token)
        self.assertIn("storeAppSessionFromResult(result: unknown)", session_token)
        self.assertIn("readAppSessionPayload(result: unknown)", session_token)
        self.assertNotIn("import type { PlusApiResult }", session_token)
        self.assertNotIn("result.data", session_token)
        self.assertIn("clearStoredAppSessionToken", session_token)
        self.assertIn("export * from './app-session-token.ts';", runtime_source)
        self.assertNotIn("export * from './app-session-token';", index_source)
        self.assertNotIn("localStorage", session_token)
        self.assertNotIn("Authorization", session_service)
        self.assertNotIn("Authorization", sdk_clients)
        self.assertNotIn("apiKey?:", sdk_clients)
        self.assertNotIn("accessToken?:", sdk_clients)
        self.assertNotIn("headers?:", sdk_clients)
        self.assertIn("const DEFAULT_API_BASE_URL = '/v1';", env_source)
        self.assertNotIn("api.sdkwork.com", env_source)

    def test_api_result_readers_do_not_treat_sdk_data_field_as_raw_envelope(self):
        api_result = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "api-result.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("function isApiEnvelope(record: ApiRecord): boolean", api_result)
        self.assertIn(
            "return isKnownApiCode(record.code) && ('data' in record || 'msg' in record || 'message' in record);",
            api_result,
        )
        self.assertIn("function isKnownApiCode(value: unknown): boolean", api_result)
        self.assertIn("function isSuccessCode(value: unknown): boolean", api_result)
        self.assertIn("if (code && !isSuccessCode(record.code))", api_result)
        self.assertIn("typeof value === 'number' && Number.isInteger(value) && value >= 1000 && value <= 5999", api_result)
        self.assertIn("const code = isApiEnvelope(record) ? readString(record, 'code') : '';", api_result)
        self.assertNotIn("return 'code' in record || 'msg' in record || 'message' in record", api_result)

    def test_admin_services_do_not_manually_read_app_session_tokens(self):
        admin_packages_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
        )

        offenders = []
        for service_path in sorted(admin_packages_root.glob("sdkwork-claw-router-admin-*/src/*Service.ts*")):
            source = service_path.read_text(encoding="utf-8")
            if "getStoredAppSessionToken" in source:
                offenders.append(service_path.relative_to(ROOT).as_posix())

        self.assertEqual([], offenders)

    def test_api_playground_current_user_auth_reads_app_session_store_not_legacy_local_storage(self):
        playground = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-api-reference"
            / "src"
            / "components"
            / "ApiPlayground.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("getStoredAppSessionToken", playground)
        self.assertIn("const sessionToken = getStoredAppSessionToken();", playground)
        self.assertNotIn("localStorage.getItem('access_token')", playground)
        self.assertNotIn('localStorage.getItem("access_token")', playground)
        self.assertNotIn("localStorage.getItem('token')", playground)
        self.assertNotIn('localStorage.getItem("token")', playground)

    def test_portal_login_and_logout_use_standard_app_session_boundary(self):
        commons_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
        )
        session_service = (commons_root / "sessionService.ts").read_text(encoding="utf-8")
        navbar = (commons_root / "components" / "Navbar.tsx").read_text(encoding="utf-8")
        auth_controller = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "src"
            / "auth"
            / "clawRouterAuthController.ts"
        ).read_text(encoding="utf-8")
        auth_routes = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "src"
            / "auth"
            / "ClawRouterAuthRoutes.tsx"
        ).read_text(encoding="utf-8")
        console_layout = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-core"
            / "src"
            / "ConsoleLayout.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("clearAppSession", session_service)
        self.assertIn("clearStoredAppSessionToken()", session_service)
        self.assertIn("resetClawRouterSdkClients()", session_service)
        self.assertIn("createAppSession", auth_controller)
        self.assertIn("signInWithSessionBridge: createSessionBridgeSession", auth_controller)
        self.assertIn("loginMethods: ['sessionBridge']", auth_routes)
        self.assertIn("handleSignIn", navbar)
        self.assertNotIn("createAppSession", navbar)
        self.assertNotIn("result.code === '2000'", navbar)
        self.assertIn("navigate('/auth/login?redirect=/console')", navbar)
        self.assertIn("onClick={handleSignIn}", navbar)
        self.assertIn("clearAppSession", console_layout)
        self.assertIn("handleLogout", console_layout)
        self.assertIn("navigate('/', { replace: true })", console_layout)
        self.assertIn("onClick={handleLogout}", console_layout)
        self.assertNotIn("x-sdkwork-tenant-id", navbar.lower())
        self.assertNotIn("x-sdkwork-organization-id", navbar.lower())
        self.assertNotIn("x-sdkwork-user-id", navbar.lower())

    def test_portal_login_session_bootstrap_has_visible_retryable_failure_state(self):
        auth_controller = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "src"
            / "auth"
            / "clawRouterAuthController.ts"
        ).read_text(encoding="utf-8")
        auth_routes = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "src"
            / "auth"
            / "ClawRouterAuthRoutes.tsx"
        ).read_text(encoding="utf-8")
        navbar = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "components"
            / "Navbar.tsx"
        ).read_text(encoding="utf-8")

        self.assertIn("createSessionBridgeSession", auth_controller)
        self.assertIn("throw new Error('Claw Router session bridge did not return a reusable app session.')", auth_controller)
        self.assertIn("homePath=\"/console\"", auth_routes)
        self.assertIn("controller={clawRouterAuthController}", auth_routes)
        self.assertIn("loginMethods: ['sessionBridge']", auth_routes)
        self.assertIn("onClick={handleSignIn}", navbar)
        self.assertIn("navigate('/auth/login?redirect=/console')", navbar)
        self.assertNotIn("sessionBootstrapLoading", navbar)
        self.assertNotIn("SESSION_BOOTSTRAP_ERROR_MESSAGE", navbar)
        self.assertNotIn("error.message", navbar)
        self.assertNotIn("result.message", navbar)
        self.assertNotIn("console.error", navbar)
        self.assertNotIn("Authorization", navbar)
        self.assertNotIn("token", navbar.lower())

    def test_app_session_exchange_declares_and_sends_request_id_header(self):
        contract = (ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml").read_text(
            encoding="utf-8"
        )
        manifest = json.loads(
            (ROOT / "generated" / "api" / "api-contract-manifest.json").read_text(
                encoding="utf-8"
            )
        )
        openapi = json.loads(
            (ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json").read_text(
                encoding="utf-8"
            )
        )
        app_sdk_auth = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "auth.ts"
        ).read_text(encoding="utf-8")
        session_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "sessionService.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("operation: createAppSession", contract)
        self.assertIn("request_id_header: true", contract)

        operations = {
            operation["operation"]: operation
            for operation in manifest["operations"]
            if operation["source"].endswith("sessionService.ts")
        }
        self.assertTrue(operations["createAppSession"]["request_id_header"])

        parameters = openapi["paths"]["/app/v3/api/auth/session"]["post"]["parameters"]
        request_id_params = [
            parameter for parameter in parameters if parameter["name"] == "X-Request-Id"
        ]
        idempotency_params = [
            parameter for parameter in parameters if parameter["name"] == "Idempotency-Key"
        ]
        self.assertEqual(1, len(request_id_params))
        self.assertFalse(request_id_params[0]["required"])
        self.assertEqual([], idempotency_params)

        self.assertIn(
            "createAppSession(body?: OperationRequest, xRequestId?: string)",
            app_sdk_auth,
        )
        self.assertIn("createRequestToken('app-session')", session_service)
        self.assertIn("auth.createAppSession(undefined, requestId)", session_service)


if __name__ == "__main__":
    unittest.main()
