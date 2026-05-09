import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleUserBackendRuntimeStandardTest(unittest.TestCase):
    def test_console_user_operation_is_backed_by_real_app_api_router(self) -> None:
        product_api_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "mod.rs"
        ).read_text(encoding="utf-8")
        app_api = (ROOT / "services" / "sdkwork-claw-app-api" / "src" / "lib.rs").read_text(
            encoding="utf-8"
        )
        app_user_path = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "app_user_profile.rs"
        )

        self.assertTrue(app_user_path.exists())
        app_user = app_user_path.read_text(encoding="utf-8")

        self.assertIn("mod app_user_profile;", product_api_mod)
        self.assertIn("app_user_profile_router", product_api_mod)
        self.assertIn("app_user_profile_router_with_read_store", product_api_mod)
        self.assertIn("/app/v3/api/user/profile", app_user)
        self.assertIn("TrustedRequestSubject", app_user)
        self.assertIn("require_subject", app_user)
        self.assertIn("AppUserProfileReadStore", app_user)
        self.assertIn("EmptyAppUserProfileReadStore", app_user)
        self.assertIn('PlusApiResult::error("4010"', app_user)
        self.assertIn("app user profile read model is unavailable", app_user)

        self.assertIn("AppUserProfileReadStore", app_api)
        self.assertIn("AppUserProfileStore", app_api)
        self.assertIn("SqliteAppUserProfileReadStore", app_api)
        self.assertIn("PostgresAppUserProfileReadStore", app_api)
        self.assertIn("app_user_profile_router()", app_api)
        self.assertIn("app_user_profile_router_with_read_store", app_api)
        self.assertIn("app_request_subject_boundary", app_api)

    def test_console_user_port_exposes_only_safe_frontend_fields(self) -> None:
        ports_mod = (
            ROOT / "services" / "sdkwork-claw-product" / "src" / "ports" / "mod.rs"
        ).read_text(encoding="utf-8")
        port_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
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
            "name",
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

        self.assertIn("pub name: String,", port)
        self.assertIn("#[serde(rename_all = \"camelCase\")]", port)
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
                "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/app_user_profile_read_store.rs",
                "SqliteAppUserProfileReadStore",
            ),
            (
                "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_user_profile_read_store.rs",
                "PostgresAppUserProfileReadStore",
            ),
        ]:
            store_path = ROOT / relative
            self.assertTrue(store_path.exists())
            store = store_path.read_text(encoding="utf-8")

            self.assertIn(store_name, store)
            for table in [
                "plus_user",
                "plus_oauth_account",
                "iam_user_preference",
                "iam_user_security_setting",
                "iam_user_login_event",
            ]:
                self.assertIn(table, store)

            for scope_column in ["tenant_id", "organization_id", "user_id"]:
                self.assertIn(scope_column, store)

            for safe_column in [
                "nickname",
                "username",
                "email",
                "phone",
                "language",
                "mfa_enabled",
                "password_last_changed_at",
                "security_level",
                "client_ip_masked",
                "occurred_at",
                "oauth_provider",
            ]:
                self.assertIn(safe_column, store)

            self.assertIn("load_user_profile", store)
            self.assertIn("CAST(u.created_at AS TEXT) AS registered_at", store)
            self.assertIn("avatar_initial", store)
            self.assertIn("third_party_bound_label", store)
            self.assertIn("u.status AS user_status", store)
            self.assertIn('status: user_status_label(required_integer_cell(row, "user_status")?)?', store)
            self.assertIn("missing app user profile status from database row", store)
            self.assertIn("invalid app user profile status from database row", store)
            self.assertIn("LIMIT", store)
            self.assertIn("SELECT", store)
            self.assertNotIn("SELECT *", store)
            self.assertNotIn("COALESCE(u.status, 1) AS user_status", store)
            self.assertNotIn('status: user_status_label(integer_cell(row, "user_status"))', store)
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
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        operation_marker = "api_path: /app/v3/api/user/profile"
        self.assertIn("name: UserProfileResponse", contract)
        operation_index = contract.index(operation_marker)
        schema_index = contract.index("name: UserProfileResponse", operation_index)
        self.assertLess(schema_index - operation_index, 1200)

        for marker in [
            "required: [name, email, phone, language, avatar, isVerified, status, registeredAt, lastLogin, lastLoginIp, passwordLastChanged, twoFactorEnabled, thirdPartyBound]",
            "name: { type: string }",
            "email: { type: string }",
            "phone:",
            "avatar:",
            "lastLoginIp:",
            "thirdPartyBound:",
            "description: Precomputed user avatar initials for display.",
            "description: Masked client IP address from the latest login event.",
            "description: Safe OAuth provider binding summary without provider subject IDs or tokens.",
        ]:
            self.assertIn(marker, contract[schema_index : schema_index + 2600])

    def test_console_user_generated_sdk_and_frontend_use_precise_user_profile_type(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-user"
        )
        package = __import__("json").loads((package_root / "package.json").read_text(encoding="utf-8"))
        openapi = (
            ROOT / "generated" / "openapi" / "clawrouter-app-openapi.json"
        ).read_text(encoding="utf-8")
        sdk_user = (
            ROOT / "sdks" / "clawrouter-app-sdk" / "src" / "api" / "user.ts"
        ).read_text(encoding="utf-8")
        user_profile_response_path = (
            ROOT
            / "sdks"
            / "clawrouter-app-sdk"
            / "src"
            / "types"
            / "user-profile-response.ts"
        )
        frontend = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-user"
            / "src"
            / "userService.ts"
        ).read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertTrue((package_root / "tsconfig.json").exists())
        self.assertIn('"UserProfileResponse"', openapi)
        self.assertIn('"$ref": "#/components/schemas/UserProfileResponse"', openapi)
        self.assertTrue(user_profile_response_path.exists())

        user_profile_response = user_profile_response_path.read_text(encoding="utf-8")
        self.assertIn("export interface UserProfileResponse", user_profile_response)
        self.assertIn("name: string;", user_profile_response)
        self.assertIn("isVerified: boolean;", user_profile_response)
        self.assertIn("thirdPartyBound: string;", user_profile_response)
        self.assertIn(
            "async fetchUserProfile(params?: QueryParams): Promise<FetchUserProfileResult>",
            sdk_user,
        )

        self.assertIn("UserProfileResponse as SdkUserProfileResponse", frontend)
        self.assertIn("export interface UserProfile", frontend)
        self.assertIn("name: SdkUserProfileResponse['name'];", frontend)
        self.assertIn("isVerified: SdkUserProfileResponse['isVerified'];", frontend)
        self.assertIn("thirdPartyBound: SdkUserProfileResponse['thirdPartyBound'];", frontend)
        self.assertIn("Promise<UserProfile>", frontend)
        self.assertIn("normalizeUserProfile", frontend)
        self.assertIn("readRequiredString(data, 'email', 'User profile response missing data')", frontend)
        self.assertNotIn("as unknown as UserProfile", frontend)
        self.assertNotIn("initialAvatar", frontend)

    def test_console_user_hides_unsupported_profile_and_security_actions_until_contract_exists(
        self,
    ) -> None:
        user_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-user"
            / "src"
            / "UserView.tsx"
        ).read_text(encoding="utf-8")
        user_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-user"
            / "src"
            / "userService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")

        self.assertIn("readOnlyUserActions", user_view)
        self.assertIn("Read-only", user_view)
        self.assertIn("UserService.fetchUserProfile()", user_view)
        self.assertIn("getClawRouterAppSdkClient().user.fetchUserProfile()", user_service)
        self.assertIn("operation: fetchUserProfile", contract)
        self.assertNotIn("updateUserProfile", contract)
        self.assertNotIn("uploadAvatar", contract)
        self.assertNotIn("changePassword", contract)
        self.assertNotIn("manageTwoFactor", contract)
        self.assertNotIn("manageThirdPartyConnections", contract)

        for unsupported_action in [
            "<button",
            "cursor-pointer",
            "Upload",
            "Edit",
            "Change password",
            "Manage",
            "Manage connections",
            "编辑",
            "修改密码",
            "管理",
            "管理连接",
        ]:
            self.assertNotIn(unsupported_action, user_view)

        for supported_local_state in [
            "Profile updates require an explicit generated App SDK contract before they can be enabled.",
            "Password, 2FA, and third-party binding controls are read-only until dedicated security command contracts exist.",
            "Avatar upload is read-only until a signed upload contract exists.",
        ]:
            self.assertIn(supported_local_state, user_view)

    def test_console_user_uses_retryable_business_state_for_remote_profile_loading(
        self,
    ) -> None:
        user_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-user"
            / "src"
            / "UserView.tsx"
        ).read_text(encoding="utf-8")

        for marker in [
            "BusinessStatePanel",
            "loadUserProfile",
            "loadError",
            "setLoadError",
            "onRetry={() => void loadUserProfile()}",
            "User profile could not be loaded",
        ]:
            self.assertIn(marker, user_view)

        self.assertNotIn('<Loader2 className="w-8 h-8', user_view)


if __name__ == "__main__":
    unittest.main()
