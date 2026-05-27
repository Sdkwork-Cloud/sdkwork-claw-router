import json
import re
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
        app_sdk_api_index = (ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "index.ts")
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
        self.assertIn("operation_id: sessions.create", contract)
        self.assertIn("api_path: /app/v3/api/auth/sessions", contract)
        self.assertRegex(contract, r"read_sources:\s*\n\s*-\s+iam_user\s*\n\s*-\s+iam_session")
        self.assertRegex(
            contract,
            r"write_tables:\s*\n\s*-\s+iam_session\s*\n\s*-\s+iam_security_event\s*\n\s*-\s+iam_audit_event",
        )
        self.assertIsNone(
            re.search(r"(?m)^\s*api_path:\s*/app/v3/api/auth/session\s*$", contract)
        )
        self.assertNotIn("write_tables: [iam_user_login_event]", contract)

        app_auth_api = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_auth.rs"
        ).read_text(encoding="utf-8")
        self.assertFalse(
            (ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_session.rs").exists(),
            "session bridge must live in the unified app auth router, not a second route factory",
        )
        self.assertIn('const APP_SESSION_PATH: &str = "/app/v3/api/auth/sessions";', app_auth_api)
        self.assertIn("app_sessions_router_with_store", app_auth_api)
        self.assertIn("create_session_bridge_response", app_auth_api)
        self.assertIn("TrustedRequestSubject::from_headers", app_auth_api)
        self.assertIn("AppSessionEventStore", app_auth_api)
        self.assertIn("issue_iam_session", app_auth_api)
        self.assertIn('if grant_type == "session_bridge"', app_auth_api)
        self.assertIn("sign_app_session_token", app_auth_api)
        self.assertIn("session_id_hash", app_auth_api)
        self.assertIn("access_token", app_auth_api)
        self.assertIn("auth_token", app_auth_api)
        self.assertIn("IamAppContext", app_auth_api)

        self.assertIn("AppSubjectBoundaryConfig::new", app_api)
        self.assertIn("SqliteAppSessionEventStore", app_api)
        self.assertIn("PostgresAppSessionEventStore", app_api)
        self.assertIn("app_sessions_router(", app_api)
        self.assertIn("app_sessions_router_with_store", app_api)
        self.assertIn("verified_signed_trusted_request_subject", app_auth_api)
        self.assertIn("generate_server_request_id", app_auth_api)
        self.assertNotIn('"/app/v3/api/auth/session"', app_auth_api)

        self.assertTrue(app_sdk_api_index.exists())
        self.assertTrue(session_service.exists())
        session_source = session_service.read_text(encoding="utf-8")
        self.assertIn("getClawRouterAppSdkClient", session_source)
        self.assertIn(".auth.sessions.create", session_source)
        self.assertIn("createAppSession", session_source)
        self.assertIn("grantType: 'session_bridge'", session_source)
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
        self.assertIn("type StoredAppSessionToken", session_service)
        self.assertIn("): Promise<StoredAppSessionToken>", session_service)
        self.assertIn("return stored;", session_service)
        self.assertNotIn("code: '2000'", session_service)
        self.assertNotIn("result.code === '2000'", session_service)
        self.assertIn("getStoredAppSessionAuthToken", sdk_clients)
        self.assertIn("getStoredAppSessionAccessToken", sdk_clients)
        self.assertIn("appClientSessionKey", sdk_clients)
        self.assertIn("backendClientSessionKey", sdk_clients)
        self.assertIn("const authToken = getStoredAppSessionAuthToken();", sdk_clients)
        self.assertIn("const accessToken = getStoredAppSessionAccessToken();", sdk_clients)
        self.assertIn("const sessionKey = createSessionKey(authToken, accessToken);", sdk_clients)
        self.assertIn("appClientSessionKey !== sessionKey", sdk_clients)
        self.assertIn("backendClientSessionKey !== sessionKey", sdk_clients)
        self.assertIn("createSessionKey(authToken: string | undefined, accessToken: string | undefined)", sdk_clients)
        self.assertIn("authToken: options.authToken ?? getStoredAppSessionAuthToken()", sdk_clients)
        self.assertIn("accessToken: options.accessToken ?? getStoredAppSessionAccessToken()", sdk_clients)
        self.assertIn("authToken?: string;", sdk_clients)
        self.assertIn("accessToken?: string;", sdk_clients)
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
        self.assertIn("apiKey?: string;", sdk_clients)
        self.assertNotIn("headers?:", sdk_clients)
        self.assertIn("const DEFAULT_API_BASE_URL = '/v1';", env_source)
        self.assertNotIn("api.sdkwork.com", env_source)

    def test_portal_session_current_retrieve_returns_unwrapped_session_data(self):
        portal_session = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "portal-session.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("import { readApiRecord } from './api-result.ts';", portal_session)
        self.assertIn("let currentSessionPromise: Promise<IamSessionResponse | null> | null = null;", portal_session)
        self.assertIn("const session = readCurrentPortalSession(result);", portal_session)
        self.assertIn("if (session) {", portal_session)
        self.assertIn("storeAppSessionFromResult(result);", portal_session)
        self.assertIn("resetClawRouterSdkClients();", portal_session)
        self.assertIn("return session;", portal_session)
        self.assertIn("function readCurrentPortalSession(result: unknown): IamSessionResponse | null", portal_session)
        self.assertIn(
            "function isPortalSessionResponse(value: unknown): value is IamSessionResponse",
            portal_session,
        )

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
            "return isKnownApiCode(record.code) && ('data' in record || 'msg' in record);",
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
        playground_request = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-api-reference"
            / "src"
            / "playgroundRequest.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("getStoredAppSessionAuthToken", playground)
        self.assertIn("getStoredAppSessionAccessToken", playground)
        self.assertIn("const authToken = getStoredAppSessionAuthToken();", playground)
        self.assertIn("const accessToken = getStoredAppSessionAccessToken();", playground)
        self.assertIn("authToken,", playground)
        self.assertIn("accessToken,", playground)
        self.assertIn("ACCESS_TOKEN_HEADER = 'Access-Token'", playground_request)
        self.assertIn("ACCESS_TOKEN_HEADER.toLowerCase()", playground_request)
        self.assertIn("headers.Authorization = `Bearer ${input.authToken.trim()}`", playground_request)
        self.assertIn("headers[ACCESS_TOKEN_HEADER] = input.accessToken.trim();", playground_request)
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
        portal_auth = (commons_root / "portal-auth.ts").read_text(encoding="utf-8")
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
        self.assertIn("createSdkworkIamRuntimeAuthController", auth_controller)
        self.assertIn("getRuntime: getClawRouterIamRuntime", auth_controller)
        self.assertIn("SdkworkIamAuthRoutes", auth_routes)
        self.assertIn("getRuntime={getClawRouterIamRuntime}", auth_routes)
        self.assertIn("methodUnavailableMessage={AUTH_METHOD_UNAVAILABLE_MESSAGE}", auth_routes)
        self.assertIn("useClawRouterAuthRuntimeConfig", auth_routes)
        self.assertIn("runtimeConfig={runtimeConfig}", auth_routes)
        self.assertNotIn("getClawRouterIamRuntime().service.auth.sessions.create", auth_controller)
        self.assertNotIn("signInWithSessionBridge: createSessionBridgeSession", auth_controller)
        self.assertNotIn("controller={clawRouterAuthController}", auth_routes)
        self.assertIn("handleSignIn", navbar)
        self.assertNotIn("createAppSession", navbar)
        self.assertNotIn("result.code === '2000'", navbar)
        self.assertIn("buildPortalAuthLoginRedirect(location)", navbar)
        self.assertIn("encodeURIComponent(returnPath)", portal_auth)
        self.assertIn("onClick={handleSignIn}", navbar)
        self.assertIn("revokeAppSession", console_layout)
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

        self.assertIn("createSdkworkIamRuntimeAuthController", auth_controller)
        self.assertIn("AUTH_METHOD_UNAVAILABLE_MESSAGE", auth_routes)
        self.assertIn("SdkworkIamAuthRoutes", auth_routes)
        self.assertNotIn("createSessionBridgeSession", auth_controller)
        self.assertNotIn("storeAppSessionFromResult(session)", auth_controller)
        self.assertNotIn("throw new Error('Claw Router app session is not available.')", auth_controller)
        self.assertIn("homePath=\"/console\"", auth_routes)
        self.assertIn("getRuntime={getClawRouterIamRuntime}", auth_routes)
        self.assertIn("useClawRouterAuthRuntimeConfig", auth_routes)
        self.assertIn("runtimeConfig={runtimeConfig}", auth_routes)
        self.assertIn("onClick={handleSignIn}", navbar)
        self.assertIn("buildPortalAuthLoginRedirect(location)", navbar)
        self.assertNotIn("sessionBootstrapLoading", navbar)
        self.assertNotIn("SESSION_BOOTSTRAP_ERROR_MESSAGE", navbar)
        self.assertIn("SdkworkNotificationBell", navbar)
        self.assertIn("loading: t('commons.navbar.loadingNotifications'", navbar)
        self.assertIn("retry: t('commons.navbar.retryNotifications'", navbar)
        self.assertNotIn("result.message", navbar)
        self.assertNotIn("console.error", navbar)
        self.assertNotIn("Authorization", navbar)
        self.assertNotIn("token", navbar.lower())

    def test_app_session_exchange_omits_request_id_header_and_reads_server_response_id(self):
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
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "auth.ts"
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
        self.assertIn("operation_id: sessions.create", contract)
        self.assertNotIn("request_id_header: true", contract)

        operations = {
            operation["operation_id"]: operation
            for operation in manifest["operations"]
            if operation["source"].endswith("sessionService.ts")
        }
        self.assertFalse(operations["sessions.create"]["request_id_header"])

        parameters = openapi["paths"]["/app/v3/api/auth/sessions"]["post"]["parameters"]
        request_id_params = [
            parameter for parameter in parameters if parameter["name"] == "X-Request-Id"
        ]
        idempotency_params = [
            parameter for parameter in parameters if parameter["name"] == "Idempotency-Key"
        ]
        self.assertEqual([], request_id_params)
        self.assertEqual([], idempotency_params)
        self.assertNotIn("/app/v3/api/auth/session", openapi["paths"])

        self.assertIn(
            "async create(body: IamSessionCreateRequest): Promise<SessionsCreateResult>",
            app_sdk_auth,
        )
        self.assertNotIn("xRequestId", app_sdk_auth)
        self.assertNotIn("createRequestParams('app-session')", session_service)
        self.assertIn(".auth.sessions.create(", session_service)
        self.assertIn("grantType: 'session_bridge'", session_service)
        self.assertNotIn("xRequestId", session_service)


if __name__ == "__main__":
    unittest.main()
