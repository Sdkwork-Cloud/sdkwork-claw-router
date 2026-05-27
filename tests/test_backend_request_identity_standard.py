import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PRODUCT_API_ROOT = ROOT / "services" / "sdkwork-claw-product" / "src" / "api"


class BackendRequestIdentityStandardTest(unittest.TestCase):
    def test_product_api_modules_use_canonical_request_id_helper(self) -> None:
        forbidden_patterns = [
            re.compile(r"\bfn\s+normalize_request_id\s*\("),
            re.compile(r"\brequired_header\s*\(\s*headers\s*,\s*REQUEST_ID_HEADER\s*\)"),
            re.compile(r"\boptional_header\s*\(\s*headers\s*,\s*REQUEST_ID_HEADER\s*\)"),
            re.compile(r"\brequest_id_from_headers\s*\("),
            re.compile(r"\boptional_request_id_from_headers\s*\("),
            re.compile(r"\bREQUEST_ID_HEADER\b"),
        ]
        offenders: list[str] = []

        for source_path in PRODUCT_API_ROOT.glob("*.rs"):
            if source_path.name == "request_id.rs":
                continue
            source = source_path.read_text(encoding="utf-8")
            if any(pattern.search(source) for pattern in forbidden_patterns):
                offenders.append(str(source_path.relative_to(ROOT)))

        self.assertEqual([], offenders)

    def test_request_id_helper_is_server_generated_only(self) -> None:
        source = (PRODUCT_API_ROOT / "request_id.rs").read_text(encoding="utf-8")

        self.assertIn("pub fn generate_server_request_id()", source)
        self.assertNotIn("headers.get", source)
        self.assertNotIn("X-Request-Id", source)
        self.assertNotIn("optional_request_id_from_headers", source)


if __name__ == "__main__":
    unittest.main()
