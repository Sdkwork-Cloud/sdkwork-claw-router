import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STORAGE_PACKAGE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-admin-file-platform"
    / "src"
)
BACKEND_SDK_SRC = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "clawrouter-backend-sdk-typescript"
    / "src"
)


class AdminFilePlatformStorageRuntimeStandardTest(unittest.TestCase):
    def test_storage_admin_uses_canonical_oss_backend_sdk_surface(self) -> None:
        service = (STORAGE_PACKAGE / "storageService.ts").read_text(encoding="utf-8")
        definitions = (STORAGE_PACKAGE / "storageSectionDefinitions.ts").read_text(encoding="utf-8")
        sdk_source = (BACKEND_SDK_SRC / "sdk.ts").read_text(encoding="utf-8")
        oss_api_source = (BACKEND_SDK_SRC / "api" / "oss.ts").read_text(encoding="utf-8")

        self.assertIn("return getClawRouterBackendSdkClient().oss;", service)
        self.assertIn("public readonly oss: OssApi;", sdk_source)
        self.assertIn("public readonly providers: OssProvidersApi;", oss_api_source)
        self.assertIn("public readonly quotas: OssQuotasApi;", oss_api_source)
        self.assertIn("public readonly ledger: OssUsageLedgerApi;", oss_api_source)

        for forbidden in [
            "SDK_NOT_REGISTERED",
            "interface StorageProviderRecord",
            "interface StorageBucketRecord",
            "interface StorageDefaultBucketRecord",
            "interface StorageQuotaRecord",
            "interface StorageUsageRecord",
            "interface StorageReconciliationRecord",
            "interface StorageGarbageCollectionRecord",
            "not registered yet",
            "when available",
            "objectStorage",
            "storage.quotas",
            "fetch(",
            "axios",
        ]:
            self.assertNotIn(forbidden, service)
            self.assertNotIn(forbidden, definitions)
            self.assertNotIn(forbidden, sdk_source)
            self.assertNotIn(forbidden, oss_api_source)


if __name__ == "__main__":
    unittest.main()
