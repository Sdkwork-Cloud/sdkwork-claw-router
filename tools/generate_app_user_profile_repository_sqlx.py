#!/usr/bin/env python3
"""Generate app-user-profile repository-sqlx store modules from legacy router-service sources."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = ROOT / "services" / "sdkwork-clawrouter-router-service" / "src" / "infrastructure" / "sql"
CRATE = ROOT / "crates" / "sdkwork-clawrouter-app-user-profile-repository-sqlx" / "src"

POSTGRES_HEADER = """use sqlx::{PgPool, Row};

use crate::error::{RepositoryError, RepositoryResult, store_error};
use crate::media_resource::media_resource_from_snapshot;
use crate::types::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};"""

SQLITE_HEADER = """use sqlx::{Row, SqlitePool};

use crate::error::{RepositoryError, RepositoryResult, store_error};
use crate::media_resource::media_resource_from_snapshot;
use crate::types::{
    AppUserProfileReadFuture, AppUserProfileReadStore, AppUserProfileSnapshot,
    AppUserProfileSubject,
};"""


def strip_leading_import_block(text: str) -> str:
    lines = text.splitlines()
    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("const ") or stripped.startswith("#[derive") or stripped.startswith("pub struct"):
            return "\n".join(lines[index:])
    return text


def apply_common_replacements(text: str) -> str:
    text = text.replace("DomainResult", "RepositoryResult")
    text = text.replace("DomainError::new", "RepositoryError::new")
    text = text.replace("DomainError", "RepositoryError")
    text = re.sub(
        r"\.map_err\(sql_error\)(\?)??",
        lambda match: f".map_err(|error| store_error(\"app user profile query\", error)){match.group(1) or ''}",
        text,
    )
    text = re.sub(
        r"\nfn sql_error\(error: sqlx::Error\) -> RepositoryError \{[^}]+\}\n",
        "\n",
        text,
        count=1,
    )
    text = text.replace("if status.is_empty()", "if sdkwork_utils_rust::is_blank(Some(status.as_str()))")
    text = text.replace(
        "if trimmed.is_empty()",
        "if sdkwork_utils_rust::is_blank(Some(trimmed))",
    )
    return text


def write_postgres() -> None:
    source = PRODUCT / "postgres" / "app_user_profile_read_store.rs"
    body = apply_common_replacements(strip_leading_import_block(source.read_text(encoding="utf-8")))
    (CRATE / "postgres.rs").write_text(POSTGRES_HEADER + "\n\n" + body + "\n", encoding="utf-8")


def write_sqlite() -> None:
    source = PRODUCT / "sqlite" / "app_user_profile_read_store.rs"
    body = apply_common_replacements(strip_leading_import_block(source.read_text(encoding="utf-8")))
    (CRATE / "sqlite.rs").write_text(SQLITE_HEADER + "\n\n" + body + "\n", encoding="utf-8")


def main() -> None:
    CRATE.mkdir(parents=True, exist_ok=True)
    write_postgres()
    write_sqlite()


if __name__ == "__main__":
    main()
