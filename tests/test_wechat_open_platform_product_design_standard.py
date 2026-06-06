import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PORTAL_PACKAGES = ROOT / "apps" / "sdkwork-clawrouter-pc" / "packages"
OFFICIAL_UI = (
    PORTAL_PACKAGES
    / "sdkwork-clawrouter-pc-admin-wechat-official-account"
    / "src"
    / "index.tsx"
)
OFFICIAL_SERVICE = (
    PORTAL_PACKAGES
    / "sdkwork-clawrouter-pc-admin-wechat-official-account"
    / "src"
    / "openPlatformWechatOfficialService.ts"
)
MINI_UI = (
    PORTAL_PACKAGES
    / "sdkwork-clawrouter-pc-admin-wechat-mini-program"
    / "src"
    / "index.tsx"
)
MINI_SERVICE = (
    PORTAL_PACKAGES
    / "sdkwork-clawrouter-pc-admin-wechat-mini-program"
    / "src"
    / "openPlatformWechatMiniProgramService.ts"
)
I18N = PORTAL_PACKAGES / "sdkwork-clawrouter-pc-i18n" / "src" / "index.ts"
MODEL_CONTRACT = (
    ROOT
    / "docs"
    / "schema-registry"
    / "frontend-field-contracts"
    / "models"
    / "admin-open-platform.yaml"
)
OPERATION_CONTRACT = (
    ROOT
    / "docs"
    / "schema-registry"
    / "frontend-field-contracts"
    / "operations"
    / "backend-platform.yaml"
)
BACKEND_API = ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_open_platform.rs"


class WechatOpenPlatformProductDesignStandardTest(unittest.TestCase):
    def test_account_creation_ui_uses_wechat_native_fields_and_single_column_forms(self) -> None:
        for label, ui_path in {
            "official account": OFFICIAL_UI,
            "mini program": MINI_UI,
        }.items():
            with self.subTest(surface=label):
                source = ui_path.read_text(encoding="utf-8")
                account_dialog = source.split("function AccountDialog", 1)[1].split(
                    "function EntryDialog",
                    1,
                )[0]

                self.assertIn('<div className="space-y-4">', account_dialog)
                self.assertNotIn("md:grid-cols-2", account_dialog)
                self.assertNotIn("draft.key", account_dialog)
                self.assertNotIn("form.key", account_dialog)
                self.assertNotIn("Account key", account_dialog)

                for token in [
                    "form.appId",
                    "form.appSecret",
                    "form.token",
                    "form.encodingAesKey",
                    "configuredSecretPlaceholder",
                    'type="password"',
                    "CredentialStatusPills",
                    "columns.configuration",
                ]:
                    self.assertIn(token, source)

                for forbidden in [
                    "credentialRef",
                    "Credential Refs",
                    "tokenRef",
                    "secretRef",
                    "aesKeyRef",
                    "vault://",
                    "secret://",
                ]:
                    self.assertNotIn(forbidden, account_dialog)

    def test_account_ui_does_not_surface_internal_account_key(self) -> None:
        for label, ui_path in {
            "official account": OFFICIAL_UI,
            "mini program": MINI_UI,
        }.items():
            with self.subTest(surface=label):
                source = ui_path.read_text(encoding="utf-8")
                self.assertNotIn("account.key", source)
                self.assertNotIn("selectedAccount.key", source)

    def test_services_and_contracts_submit_product_fields_not_internal_secret_refs(self) -> None:
        model_contract = MODEL_CONTRACT.read_text(encoding="utf-8")
        operation_contract = OPERATION_CONTRACT.read_text(encoding="utf-8")
        backend_api = BACKEND_API.read_text(encoding="utf-8")

        for label, service_path in {
            "official account": OFFICIAL_SERVICE,
            "mini program": MINI_SERVICE,
        }.items():
            with self.subTest(surface=label):
                service = service_path.read_text(encoding="utf-8")
                create_request = service.split(
                    "const request: OpenPlatformAccountCreateRequest = {",
                    1,
                )[1].split(
                    "const result = await getClawRouterBackendSdkClient().openPlatform.accounts.create",
                    1,
                )[0]
                update_request = service.split(
                    "const request: OpenPlatformAccountUpdateRequest = {",
                    1,
                )[1].split(
                    "const result = await getClawRouterBackendSdkClient().openPlatform.accounts.update",
                    1,
                )[0]

                for token in ["appSecret", "token", "encodingAesKey"]:
                    self.assertIn(token, create_request)
                    self.assertIn(token, update_request)
                    self.assertIn(f"- {token}", model_contract)
                    self.assertIn(f"      {token}:", operation_contract)

                for forbidden in ["secretRef", "tokenRef", "aesKeyRef"]:
                    self.assertNotIn(f"{forbidden}:", create_request)
                    self.assertNotIn(f"{forbidden}:", update_request)

        self.assertIn("reject_technical_credential_request_fields(&request)?", backend_api)
        self.assertIn("submit AppSecret, Token, or EncodingAESKey", backend_api)
        self.assertNotIn(
            "plaintext open platform secrets are not accepted; submit only secretRef, tokenRef, and aesKeyRef",
            backend_api,
        )

    def test_i18n_copy_uses_wechat_platform_names_without_secret_locator_language(self) -> None:
        i18n = I18N.read_text(encoding="utf-8")

        for token in [
            '"admin.openPlatform.wechatOfficial.form.appId": "AppID"',
            '"admin.openPlatform.wechatOfficial.form.appSecret": "AppSecret"',
            '"admin.openPlatform.wechatOfficial.form.token": "Token"',
            '"admin.openPlatform.wechatOfficial.form.encodingAesKey": "EncodingAESKey"',
            '"admin.openPlatform.wechatMini.form.appId": "AppID"',
            '"admin.openPlatform.wechatMini.form.appSecret": "AppSecret"',
            '"admin.openPlatform.wechatMini.form.token": "Token"',
            '"admin.openPlatform.wechatMini.form.encodingAesKey": "EncodingAESKey"',
        ]:
            self.assertIn(token, i18n)

        for forbidden in [
            "wechatOfficial.form.tokenRef",
            "wechatOfficial.form.secretRef",
            "wechatOfficial.form.aesKeyRef",
            "wechatOfficial.form.credentialRefHint",
            "wechatMini.form.tokenRef",
            "wechatMini.form.secretRef",
            "wechatMini.form.aesKeyRef",
            "wechatMini.form.credentialRefHint",
            "admin.openPlatform.wechatOfficial.actions.copyKey",
            "admin.openPlatform.wechatMini.actions.copyKey",
            "admin.openPlatform.wechatOfficial.validation.keyInvalid",
            "admin.openPlatform.wechatMini.validation.keyInvalid",
        ]:
            self.assertNotIn(forbidden, i18n)


if __name__ == "__main__":
    unittest.main()
