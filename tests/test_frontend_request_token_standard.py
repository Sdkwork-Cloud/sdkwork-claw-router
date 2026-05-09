import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUEST_ID_SOURCE = (
    ROOT
    / "apps"
    / "sdkwork-claw-router-portal"
    / "packages"
    / "sdkwork-claw-router-commons"
    / "src"
    / "request-id.ts"
)
VERIFIER_SOURCE = ROOT / "scripts" / "verify-claw-router-product.mjs"
TOOLING_TEST_SOURCE = ROOT / "scripts" / "run-claw-router-product.test.mjs"
NODE_TEST_SOURCE = ROOT / "apps" / "sdkwork-claw-router-portal" / "commons-runtime.test.ts"


class FrontendRequestTokenStandardTest(unittest.TestCase):
    def test_request_tokens_fail_closed_without_cryptographic_randomness(self) -> None:
        source = REQUEST_ID_SOURCE.read_text(encoding="utf-8")

        self.assertIn("export function createRequestToken", source)
        self.assertIn("randomUUID", source)
        self.assertIn("getRandomValues", source)
        self.assertIn("Secure random source is unavailable", source)
        self.assertIn("Secure random source returned an invalid token seed", source)
        self.assertNotIn("Math.random", source)
        self.assertNotIn("Date.now", source)
        self.assertNotIn("toString(36)", source)

    def test_request_token_runtime_test_is_part_of_product_verification(self) -> None:
        self.assertTrue(NODE_TEST_SOURCE.exists())
        verifier = VERIFIER_SOURCE.read_text(encoding="utf-8")
        tooling_test = TOOLING_TEST_SOURCE.read_text(encoding="utf-8")
        node_test = NODE_TEST_SOURCE.read_text(encoding="utf-8")

        self.assertIn("portal commons runtime tests", verifier)
        self.assertIn("apps/sdkwork-claw-router-portal/commons-runtime.test.ts", verifier)
        self.assertIn("verification plan includes portal commons runtime tests", tooling_test)
        self.assertIn("createRequestToken fails closed when secure randomness is unavailable", node_test)
        self.assertIn("createRequestToken rejects an all-zero random byte result", node_test)


if __name__ == "__main__":
    unittest.main()
