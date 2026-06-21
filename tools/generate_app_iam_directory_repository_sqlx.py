#!/usr/bin/env python3
"""Generate repository-sqlx store modules from legacy product app IAM directory stores."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = ROOT / "services" / "sdkwork-claw-product" / "src" / "infrastructure" / "sql"
CRATE = ROOT / "crates" / "sdkwork-clawrouter-app-iam-directory-repository-sqlx" / "src"

TYPE_IMPORT = """use crate::error::{RepositoryError, RepositoryResult, sql_error};
use crate::types::{
    AppIamDepartmentAssignmentItem, AppIamDepartmentItem, AppIamDepartmentTreeItem,
    AppIamDirectoryQuery, AppIamDirectoryReadFuture, AppIamDirectoryReadStore,
    AppIamDirectorySubject, AppIamOrganizationItem, AppIamOrganizationMembershipItem,
    AppIamOrganizationTreeItem, AppIamPositionAssignmentItem, AppIamPositionItem,
    AppIamRoleBindingItem,
};"""

REPLACEMENTS = [
    (r"use crate::domain::\{DomainError, DomainResult\};\n", ""),
    (
        r"use crate::ports::\{[^}]+\};\n",
        TYPE_IMPORT + "\n",
    ),
    ("DomainResult", "RepositoryResult"),
    ("DomainError::new", "RepositoryError::new"),
    ("DomainError", "RepositoryError"),
    (
        r"\nfn sql_error\(error: sqlx::Error\) -> RepositoryError \{\n    RepositoryError::new\(error\.to_string\(\)\)\n\}\n",
        "\n",
    ),
]


def transform(source: Path, target: Path, pool_import: str) -> None:
    text = source.read_text(encoding="utf-8")
    for pattern, replacement in REPLACEMENTS:
        text = re.sub(pattern, replacement, text)
    text = re.sub(r"use sqlx::\{[^}]+\};", pool_import, text, count=1)
    target.write_text(text, encoding="utf-8")


def main() -> None:
    transform(
        PRODUCT / "postgres" / "app_iam_directory_read_store.rs",
        CRATE / "postgres.rs",
        "use sqlx::{PgPool, Row};\n",
    )
    transform(
        PRODUCT / "sqlite" / "app_iam_directory_read_store.rs",
        CRATE / "sqlite.rs",
        "use sqlx::{Row, SqlitePool};\n",
    )


if __name__ == "__main__":
    main()
