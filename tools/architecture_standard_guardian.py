from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ArchitectureStandardGuardianResult:
    ok: bool
    messages: list[str]


@dataclass(frozen=True)
class ArchitectureDocRule:
    relative_path: str
    required_terms: tuple[str, ...]


class ArchitectureStandardGuardian:
    """Guard architecture docs against drifting back to the old Spring-first design."""

    FORBIDDEN_DRIFT_TERMS: tuple[str, ...] = (
        "Spring-first",
        "Java 21",
        "Spring Boot",
        "Spring WebFlux",
        "Rust/Pingora",
        "Sidecar",
        "Caffeine",
        "Micrometer",
        "SLF4J",
        "Logback",
        "Local Spring",
    )
    DOC_RULES: tuple[ArchitectureDocRule, ...] = (
        ArchitectureDocRule(
            relative_path="docs/02-技术架构设计.md",
            required_terms=(
                "Rust-first",
                "sdkwork-claw-gateway",
                "sdkwork-claw-app-api",
                "sdkwork-claw-admin-api",
                "/app/v3/api",
                "/backend/v3/api",
                "/v1",
            ),
        ),
        ArchitectureDocRule(
            relative_path="docs/03-技术选型.md",
            required_terms=(
                "Rust-first",
                "axum",
                "tokio",
                "sqlx",
                "tower",
                "hyper",
                "utoipa",
                "tracing",
                "moka",
                "rust_decimal",
            ),
        ),
        ArchitectureDocRule(
            relative_path="docs/07-性能设计.md",
            required_terms=(
                "Rust-first",
                "Tokio",
                "Axum",
                "moka",
                "Redis",
                "streaming",
                "batch writer",
                "connection pool",
            ),
        ),
        ArchitectureDocRule(
            relative_path="docs/09-部署架构设计.md",
            required_terms=(
                "Rust-first",
                "Rust services",
                "desktop",
                "server",
                "docker",
                "kubernetes",
                "SDKWORK_CLAW_DEPLOYMENT_MODE",
                "SDKWORK_CLAW_GATEWAY_BIND",
                "SDKWORK_CLAW_APP_API_BIND",
                "SDKWORK_CLAW_ADMIN_API_BIND",
            ),
        ),
    )

    def __init__(self, root: Path) -> None:
        self.root = Path(root).resolve()

    def run(self) -> ArchitectureStandardGuardianResult:
        messages: list[str] = []
        for rule in self.DOC_RULES:
            path = self.root / rule.relative_path
            if not path.exists():
                continue
            text = path.read_text(encoding="utf-8")
            messages.extend(self._validate_doc(rule, text))

        return ArchitectureStandardGuardianResult(ok=not messages, messages=messages)

    def _validate_doc(self, rule: ArchitectureDocRule, text: str) -> list[str]:
        messages: list[str] = []
        for term in self.FORBIDDEN_DRIFT_TERMS:
            if term in text:
                messages.append(
                    f"architecture doc {rule.relative_path} contains forbidden Spring-first drift term: {term}"
                )
        for term in rule.required_terms:
            if term not in text:
                messages.append(f"architecture doc {rule.relative_path} must mention required Rust-first term: {term}")
        return messages


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate sdkwork-claw-router Rust-first architecture documents.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    args = parser.parse_args()

    result = ArchitectureStandardGuardian(root=args.root).run()
    if result.ok:
        print("Architecture standard guardian passed")
        return 0

    for message in result.messages:
        print(message)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
