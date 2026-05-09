import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.architecture_standard_guardian import ArchitectureStandardGuardian


class ArchitectureStandardGuardianTest(unittest.TestCase):
    def write_doc(self, root: Path, relative_path: str, content: str) -> Path:
        path = root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def test_accepts_rust_first_architecture_docs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_doc(
                root,
                "docs/02-技术架构设计.md",
                """
                # 技术架构设计
                Rust-first runtime with sdkwork-claw-gateway, sdkwork-claw-app-api,
                sdkwork-claw-admin-api, /app/v3/api, /backend/v3/api and /v1.
                """,
            )
            self.write_doc(
                root,
                "docs/03-技术选型.md",
                """
                # 技术选型
                Rust-first choices: axum, tokio, sqlx, tower, hyper, utoipa,
                tracing, moka, rust_decimal.
                """,
            )
            self.write_doc(
                root,
                "docs/07-性能设计.md",
                """
                # 性能设计
                Rust-first performance uses Tokio, Axum, moka, Redis, streaming,
                batch writer and connection pool.
                """,
            )
            self.write_doc(
                root,
                "docs/09-部署架构设计.md",
                """
                # 部署架构设计
                Rust-first Rust services support desktop, server, docker,
                kubernetes, SDKWORK_CLAW_DEPLOYMENT_MODE, SDKWORK_CLAW_GATEWAY_BIND,
                SDKWORK_CLAW_APP_API_BIND and SDKWORK_CLAW_ADMIN_API_BIND.
                """,
            )

            result = ArchitectureStandardGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_rejects_spring_first_and_sidecar_drift(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_doc(
                root,
                "docs/02-技术架构设计.md",
                """
                # 技术架构设计
                第一阶段采用 Spring-first 一体化平台，后续引入 Rust/Pingora 网关热路径 Sidecar。
                """,
            )

            result = ArchitectureStandardGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "architecture doc docs/02-技术架构设计.md contains forbidden Spring-first drift term: Spring-first",
                result.messages,
            )
            self.assertIn(
                "architecture doc docs/02-技术架构设计.md contains forbidden Spring-first drift term: Rust/Pingora",
                result.messages,
            )

    def test_rejects_missing_required_rust_first_terms(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_doc(
                root,
                "docs/03-技术选型.md",
                """
                # 技术选型
                Rust-first choices: axum and tokio.
                """,
            )

            result = ArchitectureStandardGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "architecture doc docs/03-技术选型.md must mention required Rust-first term: sqlx",
                result.messages,
            )
            self.assertIn(
                "architecture doc docs/03-技术选型.md must mention required Rust-first term: rust_decimal",
                result.messages,
            )
            self.assertIn(
                "architecture doc docs/03-技术选型.md must mention required Rust-first term: hyper",
                result.messages,
            )


if __name__ == "__main__":
    unittest.main()
