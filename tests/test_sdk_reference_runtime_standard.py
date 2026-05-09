import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SDK_REFERENCE_ROOT = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-sdk-reference"
    / "src"
)


class SdkReferenceRuntimeStandardTest(unittest.TestCase):
    def test_sdk_reference_examples_use_generated_sdk_client_mounts(self) -> None:
        sdk_data = (SDK_REFERENCE_ROOT / "data" / "sdkData.ts").read_text(encoding="utf-8")

        for expected in [
            "client.apikey.fetchApiKeysMap()",
            "client.user.fetchUserProfile()",
        ]:
            self.assertIn(expected, sdk_data)

        for stale_example in [
            "client.apiKeys.list()",
            "client.users.list()",
            "client.api_keys.list()",
            "client.users.list",
            "client.users().list()",
            "client.ApiKeys.ListAsync()",
            "client.Users.ListAsync()",
            "client.api_keys().list()",
            "client.users().list().await",
        ]:
            self.assertNotIn(stale_example, sdk_data)

    def test_sdk_reference_uses_shared_openapi_endpoint_types(self) -> None:
        sdk_reference = SDK_REFERENCE_ROOT / "pages" / "SdkReference.tsx"
        endpoint_view = SDK_REFERENCE_ROOT / "components" / "SdkEndpointView.tsx"
        sdk_reference_source = sdk_reference.read_text(encoding="utf-8")
        endpoint_view_source = endpoint_view.read_text(encoding="utf-8")

        for token in [
            "import type { ApiReferenceEndpoint } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { ApiParameter } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { OpenApiDocument } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { OpenApiJsonSchema } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { OpenApiOperation } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { OpenApiParameter } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "import type { OpenApiPathItem } from 'sdkwork-claw-router-api-reference/openapiTypes'",
            "isOpenApiDocument(payload)",
            "isOpenApiOperation(operation)",
            "OPEN_API_OPERATION_METHODS",
        ]:
            self.assertIn(token, sdk_reference_source)

        self.assertIn("interface GeneratedSdkToolConfig", sdk_reference_source)
        self.assertIn("const [activeSdkConfig, setActiveSdkConfig] = useState<GeneratedSdkToolConfig | null>(null)", sdk_reference_source)
        self.assertIn("const payload: unknown = await response.json()", sdk_reference_source)
        self.assertIn("const errorData: unknown = await generateResponse.json()", sdk_reference_source)
        self.assertIn("readErrorMessage(errorData)", sdk_reference_source)

        self.assertIn("import type { ApiParameter } from 'sdkwork-claw-router-api-reference/openapiTypes'", endpoint_view_source)
        self.assertIn("import type { ApiReferenceEndpoint } from 'sdkwork-claw-router-api-reference/openapiTypes'", endpoint_view_source)
        self.assertIn("interface SdkEndpointData", endpoint_view_source)
        self.assertIn("function toSdkMethodName(endpoint: ApiReferenceEndpoint): string", endpoint_view_source)
        self.assertIn("function upperPathSegment(_match: string, chr: string): string", endpoint_view_source)
        self.assertIn("params.map((p: ApiParameter)", endpoint_view_source)

        for source_name, source in [
            ("SdkReference.tsx", sdk_reference_source),
            ("SdkEndpointView.tsx", endpoint_view_source),
        ]:
            with self.subTest(source=source_name):
                self.assertNotIn(": any", source)
                self.assertNotIn("as any", source)
                self.assertNotIn("unknown as", source)
                self.assertNotIn("useState<any", source)
                self.assertNotIn("Promise<any>", source)

    def test_sdk_reference_sidebar_uses_fixed_width_without_resize_drag_handle(self) -> None:
        sdk_reference_source = (SDK_REFERENCE_ROOT / "pages" / "SdkReference.tsx").read_text(encoding="utf-8")
        portal_css = (ROOT / "apps" / "sdkwork-claw-router-portal" / "src" / "index.css").read_text(encoding="utf-8")

        self.assertIn("md:w-[360px] md:max-w-[360px] md:basis-[360px]", sdk_reference_source)
        self.assertIn("md:h-full overflow-y-auto custom-scrollbar py-6 px-6 md:py-8", sdk_reference_source)
        self.assertNotIn("useReferenceSidebarResize", sdk_reference_source)
        self.assertNotIn("reference-sidebar-resizable", sdk_reference_source)
        self.assertNotIn("sidebarStyle", sdk_reference_source)
        self.assertNotIn("style={sidebarStyle}", sdk_reference_source)
        self.assertNotIn("data-reference-sidebar-resizable", sdk_reference_source)
        self.assertNotIn('aria-label="Resize SDK reference sidebar"', sdk_reference_source)
        self.assertNotIn('role="separator"', sdk_reference_source)
        self.assertNotIn('cursor-ew-resize', sdk_reference_source)
        self.assertNotIn('onPointerDown={startSidebarResize}', sdk_reference_source)
        self.assertNotIn("reference-sidebar-resizable", portal_css)
        self.assertNotIn("translate-x-1/2", sdk_reference_source)
        self.assertNotIn("reference-sidebar-resizable relative w-full", sdk_reference_source)
        self.assertNotIn("py-6 px-6 md:py-8 overflow-y-auto custom-scrollbar bg-slate", sdk_reference_source)
        self.assertNotIn("md:w-[var(--reference-sidebar-width)]", sdk_reference_source)
        self.assertNotIn("md:w-64", sdk_reference_source)


if __name__ == "__main__":
    unittest.main()
