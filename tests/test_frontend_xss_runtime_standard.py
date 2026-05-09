import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PORTAL_PACKAGES = ROOT / "apps" / "sdkwork-claw-router-portal" / "packages"


class FrontendXssRuntimeStandardTest(unittest.TestCase):
    def test_portal_packages_do_not_render_unreviewed_html_strings(self) -> None:
        offenders = []
        for path in PORTAL_PACKAGES.rglob("*.tsx"):
            if "node_modules" in path.parts:
                continue
            source = path.read_text(encoding="utf-8")
            if "dangerouslySetInnerHTML" in source:
                offenders.append(path.relative_to(ROOT).as_posix())

        self.assertEqual(
            [],
            offenders,
            "portal packages must render code, docs, and JSON through React nodes instead of raw HTML injection",
        )


if __name__ == "__main__":
    unittest.main()
