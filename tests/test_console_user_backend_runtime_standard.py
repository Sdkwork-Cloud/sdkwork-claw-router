import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]


class ConsoleUserBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_user_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-clawrouter-router-service" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-clawrouter-app-api-server" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        app_user_path = (
            ROOT / "services" / "sdkwork-clawrouter-router-service" / "src" / "api" / "app_user_profile.rs"
        )

        self.assertTrue(app_user_path.exists())
        app_user = app_user_path.read_text(encoding="utf-8")

        self.assertIn("mod app_user_profile;", product_api_mod)
        self.assertIn("app_user_profile_router", product_api_mod)
        self.assertIn("app_user_profile_router_with_read_store", product_api_mod)
        self.assertIn("/app/v3/api/iam/users/current", app_user)
        self.assertNotIn("/app/v3/api/user/profile", app_user)
        self.assertIn("TrustedRequestSubject", app_user)
        self.assertIn("require_subject", app_user)
        self.assertIn("AppUserProfileReadStore", app_user)
        self.assertIn("EmptyAppUserProfileReadStore", app_user)
        self.assertIn('PlusApiResult::error("4010"', app_user)
        self.assertIn("app user profile read model is unavailable", app_user)

        self.assertNotIn("AppUserProfileStore", app_api)
        self.assertNotIn("SqliteAppUserProfileReadStore", app_api)
        self.assertNotIn("PostgresAppUserProfileReadStore", app_api)
        self.assertNotIn("app_user_profile_router()", app_api)
        self.assertNotIn("app_user_profile_router_with_read_store", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_user_port_exposes_only_safe_frontend_fields(self) -> None:
        ports_mod = (
            ROOT / "services" / "sdkwork-clawrouter-router-service" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        port_path = (
            ROOT
            / "services"
            / "sdkwork-clawrouter-router-service"
            / "src"
            / "ports"
            / "app_user_profile_read_store.rs"
        )

        self.assertTrue(port_path.exists())
        port = port_path.read_text(encoding="utf-8")

        self.assertIn("mod app_user_profile_read_store;", ports_mod)
        for export_name in [
            "AppUserProfileReadFuture",
            "AppUserProfileReadStore",
            "AppUserProfileSnapshot",
            "AppUserProfileSubject",
        ]:
            self.assertIn(export_name, ports_mod)
            self.assertIn(export_name, port)

        for field_name in [
            "id",
            "username",
            "display_name",
            "email",
            "phone",
            "language",
            "avatar",
            "is_verified",
            "status",
            "registered_at",
            "last_login",
            "last_login_ip",
            "password_last_changed",
            "two_factor_enabled",
            "third_party_bound",
        ]:
            self.assertIn(field_name, port)

        self.assertIn("pub display_name: String,", port)
        self.assertIn("Value", port)
        self.assertIn("pub avatar: Value,", port)
        self.assertIn("#[serde(rename_all = \"camelCase\")]", port)
        self.assertNotIn("avatar_url", port)
        for sensitive_field in [
            "password_hash",
            "salt",
            "secret",
            "token",
            "open_id",
            "union_id",
            "client_ip_hash",
            "device_fingerprint_hash",
            "user_agent_hash",
            "session_id_hash",
            "third_party_bound_snapshot",
        ]:
            self.assertNotIn(sensitive_field, port.lower())
        self.assertNotIn("mock", port.lower())

    def test_console_user_sql_read_stores_use_real_tables_scope_and_safe_columns(self) -> None:
        for relative, store_name in [
            (
                "crates/sdkwork-clawrouter-app-user-profile-repository-sqlx/src/sqlite.rs",
                "SqliteAppUserProfileReadStore",
            ),
            (
                "crates/sdkwork-clawrouter-app-user-profile-repository-sqlx/src/postgres.rs",
                "PostgresAppUserProfileReadStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")
            compact_store = " ".join(store.split())

            self.assertIn(store_name, store)
            for table in [
                "iam_user",
                "iam_organization_membership",
                "iam_session",
                "iam_user_login_event",
                "iam_user_identity",
            ]:
                self.assertIn(table, store)

            for scope_column in ["tenant_id", "organization_id", "user_id"]:
                self.assertIn(scope_column, store)

            for safe_column in [
                "username",
                "display_name",
                "email",
                "phone",
                "language",
                "avatar_resource_snapshot",
                "user_status",
                "registered_at",
                "last_login",
                "last_login_ip",
                "password_last_changed",
                "mfa_enabled",
                "identity_binding_count",
            ]:
                self.assertIn(safe_column, store)

            self.assertIn("load_user_profile", store)
            self.assertIn("CAST(u.created_at AS TEXT) AS registered_at", store)
            self.assertIn("COALESCE(NULLIF(u.display_name, ''), NULLIF(u.username, ''), 'SDKWork User') AS display_name", store)
            self.assertIn("u.avatar_resource_snapshot", store)
            self.assertIn("AS avatar_resource_snapshot", store)
            self.assertIn('avatar: media_resource_from_row(row, "avatar_resource_snapshot", "image")', compact_store)
            self.assertIn("COALESCE(u.status, '') AS user_status", store)
            self.assertIn(
                'third_party_bound: integer_cell(row, "identity_binding_count") .max(0) .to_string()',
                compact_store,
            )
            self.assertIn("missing app user profile status from database row", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            self.assertNotIn("avatar_url", store)
            self.assertNotIn("COALESCE(u.status, 1) AS user_status", store)
            self.assertNotIn('status: user_status_label(integer_cell(row, "user_status"))', store)
            self.assertNotIn("plus_user", store)
            self.assertNotIn("plus_oauth_account", store)
            for sensitive_column in [
                "u.password",
                "password_hash",
                "u.salt",
                "secret",
                "token",
                "open_id",
                "union_id",
                "client_ip_hash",
                "last_login_ip_hash",
                "device_fingerprint_hash",
                "user_agent_hash",
                "session_id_hash",
                "third_party_bound_snapshot",
                "oauth_user_info",
            ]:
                self.assertNotIn(sensitive_column, store.lower())

    def test_console_user_contract_response_schema_is_precise(self) -> None:
        contract_text = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        contract = yaml.safe_load(contract_text)
        operation = next(
            (
                item
                for item in contract["frontend_operations"]
                if item.get("operation_id") == "users.current.retrieve"
            ),
            None,
        )
        def iter_schema_nodes(value):
            if isinstance(value, dict):
                yield value
                for child in value.values():
                    yield from iter_schema_nodes(child)
            elif isinstance(value, list):
                for child in value:
                    yield from iter_schema_nodes(child)

        schema = next(
            (
                item
                for item in iter_schema_nodes(contract)
                if item.get("name") == "IamUserResponse"
                and item.get("type") == "object"
                and "properties" in item
            ),
            None,
        )

        self.assertIsNotNone(operation)
        self.assertEqual("/app/v3/api/iam/users/current", operation["api_path"])
        self.assertEqual("IamUserResponse", operation["response_schema"]["name"])
        self.assertEqual(
            {"$ref": "#/components/schemas/IamUserResponse"},
            operation["response_schema"]["schema"],
        )

        self.assertIsNotNone(schema)
        self.assertEqual("object", schema["type"])
        self.assertFalse(schema["additionalProperties"])
        self.assertEqual(
            [
                "id",
                "username",
                "displayName",
                "email",
                "avatar",
                "phone",
                "language",
                "isVerified",
                "status",
                "registeredAt",
                "lastLogin",
                "lastLoginIp",
                "passwordLastChanged",
                "twoFactorEnabled",
                "thirdPartyBound",
            ],
            schema["required"],
        )

        properties = schema["properties"]
        self.assertEqual(
            {"type": "string", "minLength": 1, "maxLength": 128},
            properties["displayName"],
        )
        self.assertEqual({"type": "string", "maxLength": 256}, properties["email"])
        self.assertEqual({"$ref": "#/components/schemas/MediaResource"}, properties["avatar"])
        self.assertEqual(
            "Safe display phone value, empty when unavailable.",
            properties["phone"]["description"],
        )
        self.assertEqual(
            "Masked client IP address from the latest login event.",
            properties["lastLoginIp"]["description"],
        )
        self.assertEqual(
            "Safe OAuth provider binding summary without provider subject IDs or tokens.",
            properties["thirdPartyBound"]["description"],
        )

    def test_console_user_generated_sdk_and_frontend_use_precise_user_profile_type(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
        )
        package = __import__("json").loads((package_root / "package.json").read_text(encoding="utf-8"))
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_iam = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "clawrouter-app-sdk-typescript" / "src" / "api" / "iam.ts"
        ).read_text(encoding="utf-8")
        iam_user_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "clawrouter-app-sdk-typescript"
            / "src"
            / "types"
            / "iam-user-response.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "userService.ts"
        ).read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertTrue((package_root / "tsconfig.json").exists())
        self.assertIn('"IamUserResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/IamUserResponse"', openapi)
        self.assertTrue(iam_user_response_path.exists())

        iam_user_response = iam_user_response_path.read_text(encoding="utf-8")
        self.assertIn("export interface IamUserResponse", iam_user_response)
        self.assertIn("displayName: string;", iam_user_response)
        self.assertIn("avatar: MediaResource;", iam_user_response)
        self.assertNotIn("avatarUrl", iam_user_response)
        self.assertIn("isVerified: boolean;", iam_user_response)
        self.assertIn("thirdPartyBound: string;", iam_user_response)
        self.assertIn(
            "async retrieve(): Promise<UsersCurrentRetrieveResult>",
            sdk_iam,
        )

        self.assertIn("IamUserResponse as SdkUserProfileResponse", frontend)
        self.assertIn("export interface UserProfile", frontend)
        self.assertIn("name: SdkUserProfileResponse['displayName'];", frontend)
        self.assertIn("avatar: SdkUserProfileResponse['avatar'];", frontend)
        self.assertIn("isVerified: SdkUserProfileResponse['isVerified'];", frontend)
        self.assertIn("thirdPartyBound: SdkUserProfileResponse['thirdPartyBound'];", frontend)
        self.assertIn("Promise<UserProfile>", frontend)
        self.assertIn("normalizeUserProfile", frontend)
        self.assertIn("readRequiredString(data, 'email', 'User profile response missing data')", frontend)
        self.assertIn("getSdkworkAppbaseAppSdkClient().iam.users.current.retrieve()", frontend)
        self.assertNotIn("getClawRouterAppSdkClient().user.fetchUserProfile()", frontend)
        self.assertNotIn("as unknown as UserProfile", frontend)
        self.assertNotIn("initialAvatar", frontend)

    def test_console_user_hides_unsupported_profile_and_security_actions_until_contract_exists(
        self,
    ) -> None:
        user_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "UserView.tsx"
        ).read_text(encoding="utf-8")
        user_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "userService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertNotIn("readOnlyUserActions", user_view)
        self.assertNotIn("Read-only", user_view)
        self.assertNotIn("read-only", user_view)
        self.assertNotIn("command contract", user_view)
        self.assertIn("UserService.fetchCurrentUser()", user_view)
        self.assertIn("getSdkworkAppbaseAppSdkClient().iam.users.current.retrieve()", user_service)
        self.assertIn("operation: fetchCurrentUser", contract)
        self.assertIn("operation_id: users.current.retrieve", contract)
        self.assertNotIn("updateUserProfile", contract)
        self.assertNotIn("uploadAvatar", contract)
        self.assertNotIn("changePassword", contract)
        self.assertNotIn("manageTwoFactor", contract)
        self.assertNotIn("manageThirdPartyConnections", contract)

        unsupported_action_codepoints = [
            (0x7F02, 0x682C, 0x7DEB),
            (0x6DC7, 0xE1BD, 0x657C, 0x7035, 0x55D9, 0x721C),
            (0x7EE0, 0xFF04, 0x608A),
            (0x7EE0, 0xFF04, 0x608A, 0x6769, 0x70B4, 0x5E34),
        ]
        unsupported_actions = [
            "<button",
            "cursor-pointer",
            "Upload",
            "Edit",
            "Change password",
            "Manage",
            "Manage connections",
            *(
                "".join(chr(codepoint) for codepoint in action)
                for action in unsupported_action_codepoints
            ),
        ]
        for unsupported_action in unsupported_actions:
            self.assertNotIn(unsupported_action, user_view)

        for removed_explanatory_copy in [
            "Profile updates require an explicit generated App SDK contract before they can be enabled.",
            "Password, 2FA, and third-party binding controls are read-only until dedicated security command contracts exist.",
            "Avatar upload is read-only until a signed upload contract exists.",
        ]:
            self.assertNotIn(removed_explanatory_copy, user_view)

    def test_console_user_uses_retryable_business_state_for_remote_profile_loading(
        self,
    ) -> None:
        user_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "UserView.tsx"
        ).read_text(encoding="utf-8")

        for marker in [
            "BusinessStatePanel",
            "loadUserProfile",
            "loadError",
            "setLoadError",
            "onRetry={() => void loadUserProfile()}",
            "console.user.states.loadErrorTitle",
        ]:
            self.assertIn(marker, user_view)

        self.assertNotIn('<Loader2 className="w-8 h-8', user_view)

    def test_console_user_product_states_are_localized(self) -> None:
        user_view = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "UserView.tsx"
        ).read_text(encoding="utf-8")
        user_service = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-console-user"
            / "src"
            / "userService.ts"
        ).read_text(encoding="utf-8")
        i18n = (
            ROOT
            / "apps"
            / "sdkwork-clawrouter-pc"
            / "packages"
            / "sdkwork-clawrouter-pc-i18n"
            / "src"
            / "resources"
            / "console"
            / "account.ts"
        ).read_text(encoding="utf-8")

        for marker in [
            "console.user.states.loading",
            "console.user.states.loadErrorTitle",
            "console.user.states.loadErrorFallback",
            "console.user.states.emptyTitle",
            "console.user.states.emptyDescription",
        ]:
            self.assertIn(marker, user_view + user_service + i18n)
            self.assertGreaterEqual(i18n.count(f'"{marker}"'), 2)

        for hardcoded_copy in [
            "Loading user profile...",
            "User profile could not be loaded",
            "Failed to load user profile.",
            "No user profile found",
            "The user profile API returned no profile data for the active session.",
            "Failed to fetch current user",
        ]:
            self.assertNotIn(hardcoded_copy, user_view)
            self.assertNotIn(hardcoded_copy, user_service)


if __name__ == "__main__":
    unittest.main()
