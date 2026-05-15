import json
import unittest
from pathlib import Path

from tools.api_contract_manifest import ApiContractManifestGenerator


ROOT = Path(__file__).resolve().parents[1]


class AdminGroupRuntimeStandardTest(unittest.TestCase):
    def test_admin_group_write_contracts_use_operation_specific_payloads(self) -> None:
        manifest = ApiContractManifestGenerator(root=ROOT).generate()
        operations = {operation["key"]: operation for operation in manifest["operations"]}

        add_group = operations[
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-group/src/groupService.ts#addGroup"
        ]
        update_group = operations[
            "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-group/src/groupService.ts#updateGroup"
        ]

        self.assertEqual("AdminAccessGroupCreateRequest", add_group["request_schema"]["name"])
        self.assertEqual(["name"], add_group["request_schema"]["schema"]["required"])
        self.assertEqual("AdminAccessGroupMutationResponse", add_group["response_schema"]["name"])
        self.assertEqual(["item"], add_group["response_schema"]["schema"]["required"])

        self.assertEqual("AdminAccessGroupUpdateRequest", update_group["request_schema"]["name"])
        self.assertEqual([], update_group["request_schema"]["schema"]["required"])
        self.assertEqual("AdminAccessGroupMutationResponse", update_group["response_schema"]["name"])
        self.assertEqual(["item"], update_group["response_schema"]["schema"]["required"])

    def test_admin_group_frontend_and_backend_sdk_do_not_use_generic_write_payloads(self) -> None:
        service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-group"
            / "src"
            / "groupService.ts"
        ).read_text(encoding="utf-8")
        iam_api = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "api" / "iam.ts"
        ).read_text(encoding="utf-8")
        type_exports = (
            ROOT / "sdks" / "clawrouter-backend-sdk" / "clawrouter-backend-sdk-typescript" / "src" / "types" / "index.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("AdminAccessGroupCreateRequest", service)
        self.assertIn("AdminAccessGroupUpdateRequest", service)
        self.assertIn("toCreateGroupRequest", service)
        self.assertIn("toUpdateGroupRequest", service)
        self.assertNotIn("as unknown as Record<string, unknown>", service)
        self.assertNotIn("updates as Record<string, unknown>", service)

        self.assertIn("AdminAccessGroupCreateRequest", iam_api)
        self.assertIn("AdminAccessGroupUpdateRequest", iam_api)
        self.assertIn("AccessGroupsCreateResult", iam_api)
        self.assertIn("AccessGroupsUpdateResult", iam_api)
        self.assertIn(
            "async create(body: AdminAccessGroupCreateRequest, params?: IamAccessGroupsCreateParams): Promise<AccessGroupsCreateResult>",
            iam_api,
        )
        self.assertIn(
            "async update(groupId: string, body: AdminAccessGroupUpdateRequest, params?: IamAccessGroupsUpdateParams): Promise<AccessGroupsUpdateResult>",
            iam_api,
        )
        self.assertNotIn("async create(body?: OperationRequest): Promise<PlusApiResult>", iam_api)
        self.assertNotIn(
            "async update(groupId: string | number, body?: OperationRequest): Promise<PlusApiResult>",
            iam_api,
        )
        self.assertNotIn("async update(groupId: string | number", iam_api)
        self.assertNotIn("headers?: Record<string, string>", iam_api)

        self.assertIn("export type { AdminAccessGroupCreateRequest }", type_exports)
        self.assertIn("export type { AdminAccessGroupUpdateRequest }", type_exports)
        self.assertIn("export type { AdminAccessGroupMutationResponse }", type_exports)
        self.assertIn("export type { AccessGroupsCreateResult }", type_exports)
        self.assertIn("export type { AccessGroupsUpdateResult }", type_exports)

    def test_admin_group_frontend_uses_standard_domain_values_without_mojibake(self) -> None:
        package = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-group"
            / "src"
        )
        service = (package / "groupService.ts").read_text(encoding="utf-8")
        view = (package / "index.tsx").read_text(encoding="utf-8")

        for token in ["鍏", "涓", "姝", "寮", "é", "æ", "ç"]:
            self.assertNotIn(token, service)
            self.assertNotIn(token, view)

        combined_source = service + view + (package / "groupForm.ts").read_text(encoding="utf-8")
        for token in [
            "type: 'public' | 'dedicated'",
            "status: 'active' | 'disabled'",
            "return type === 'dedicated' ? 'dedicated' : 'public'",
            "return status === 'disabled' ? 'disabled' : 'active'",
            "type: formData.get('isPublic') ? 'public' : 'dedicated'",
            "status: 'active'",
        ]:
            self.assertIn(token, combined_source)

    def test_admin_group_create_form_uses_dedicated_input_without_client_fake_ids(self) -> None:
        package_root = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-admin-group"
        )
        package = json.loads((package_root / "package.json").read_text(encoding="utf-8"))
        service = (package_root / "src" / "groupService.ts").read_text(encoding="utf-8")
        view = (package_root / "src" / "index.tsx").read_text(encoding="utf-8")
        form = (package_root / "src" / "groupForm.ts").read_text(encoding="utf-8")
        verifier = (ROOT / "scripts" / "verify-claw-router-product.mjs").read_text(encoding="utf-8")

        self.assertEqual(package["type"], "module")
        self.assertEqual(package["scripts"]["typecheck"], "tsc --noEmit")
        self.assertIn("export type GroupCreateInput", service)
        self.assertIn("export type GroupUpdateInput", service)
        self.assertIn("static async addGroup(group: GroupCreateInput): Promise<GroupData>", service)
        self.assertIn("static async updateGroup(id: string, updates: GroupUpdateInput): Promise<GroupData>", service)
        self.assertIn("readRequiredApiItem(result, 'Updated group response is missing data')", service)
        self.assertIn("function toCreateGroupRequest(group: GroupCreateInput)", service)
        self.assertIn("function toUpdateGroupRequest(updates: GroupUpdateInput)", service)
        self.assertNotIn("Partial<GroupData", service)
        self.assertIn("createGroupInputFromForm", view)
        self.assertIn("GroupService.addGroup(createGroupInputFromForm(formData))", view)
        self.assertNotIn("Date.now()", view)
        self.assertNotIn("Math.random()", view)
        self.assertNotIn("const newGroup: GroupData", view)
        self.assertIn("export function createGroupInputFromForm", form)
        self.assertIn("export function createGroupUpdateInputFromForm", form)
        self.assertNotIn("Date.now()", form)
        self.assertNotIn("Math.random()", form)
        self.assertIn("admin-group-runtime.test.ts", verifier)

    def test_admin_group_read_model_fails_closed_for_billing_type_group_type_and_status(self) -> None:
        store_paths = [
            "services/sdkwork-claw-product/src/infrastructure/sql/sqlite/admin_access_group_store.rs",
            "services/sdkwork-claw-product/src/infrastructure/sql/postgres/admin_access_group_store.rs",
        ]

        for relative_path in store_paths:
            store = (ROOT / relative_path).read_text(encoding="utf-8")
            compact_store = " ".join(store.split())
            with self.subTest(store=relative_path):
                self.assertIn(
                    'billing_type: billing_type_label(required_integer_cell( &row, "billing_type", "billing_type", )?)?',
                    compact_store,
                )
                self.assertIn(
                    'group_type: group_type_label(required_integer_cell(&row, "group_type", "group_type")?)?',
                    compact_store,
                )
                self.assertIn(
                    'status: status_label(required_integer_cell(&row, "status", "status")?)?',
                    compact_store,
                )
                self.assertIn(
                    "fn billing_type_label(value: i64) -> DomainResult<String>",
                    compact_store,
                )
                self.assertIn(
                    "fn group_type_label(value: i64) -> DomainResult<String>",
                    compact_store,
                )
                self.assertIn(
                    "fn status_label(value: i64) -> DomainResult<String>",
                    compact_store,
                )
                self.assertIn("missing admin access group billing_type from database row", store)
                self.assertIn("missing admin access group group_type from database row", store)
                self.assertIn("missing admin access group status from database row", store)
                self.assertIn("invalid admin access group billing_type from database row", store)
                self.assertIn("invalid admin access group group_type from database row", store)
                self.assertIn("invalid admin access group status from database row", store)
                self.assertNotIn('billing_type_label(optional_integer_cell(&row, "billing_type"))', store)
                self.assertNotIn('group_type_label(optional_integer_cell(&row, "group_type"))', store)
                self.assertNotIn('status_label(optional_integer_cell(&row, "status"))', store)


if __name__ == "__main__":
    unittest.main()
