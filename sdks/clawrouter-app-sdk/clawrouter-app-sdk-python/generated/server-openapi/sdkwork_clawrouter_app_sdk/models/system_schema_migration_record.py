from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SystemSchemaMigrationRecord:
    """System schema migration record schema exposed by Claw Router."""
    checksum: Optional[str] = None
    error_message: Optional[str] = None
    finished_at: Optional[str] = None
    id: Optional[str] = None
    migration_key: Optional[str] = None
    migration_version: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
