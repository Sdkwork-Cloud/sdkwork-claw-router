import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AdminDestructiveActionStandardTest(unittest.TestCase):
    def test_admin_destructive_actions_use_shared_confirm_dialog_instead_of_window_confirm(self) -> None:
        package_roots = [
            "sdkwork-claw-router-admin-announcement",
            "sdkwork-claw-router-admin-channel",
            "sdkwork-claw-router-admin-group",
            "sdkwork-claw-router-admin-marketing",
            "sdkwork-claw-router-admin-model",
            "sdkwork-claw-router-admin-ratelimit",
        ]
        base = ROOT / "apps" / "sdkwork-claw-router-portal" / "packages"

        for package in package_roots:
            with self.subTest(package=package):
                source = (base / package / "src" / "index.tsx").read_text(encoding="utf-8")
                self.assertNotIn("window.confirm", source)
                self.assertNotIn(".confirm(", source)
                self.assertIn("ConfirmDialog", source)
                self.assertIn("role=\"alertdialog\"", (
                    base
                    / "sdkwork-claw-router-commons"
                    / "src"
                    / "components"
                    / "ConfirmDialog.tsx"
                ).read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
