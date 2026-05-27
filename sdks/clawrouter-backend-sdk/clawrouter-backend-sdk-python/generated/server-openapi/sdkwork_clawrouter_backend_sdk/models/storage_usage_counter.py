from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageUsageCounter:
    """Storage usage counter schema exposed by Claw Router."""
    file_count: int
    id: str
    reserved_bytes: int
    scope_id: str
    scope_type: str
    used_bytes: int
    files: Optional[str] = None
    reserved: Optional[str] = None
    scope: Optional[str] = None
    snapshot_at: Optional[str] = None
    updated_at: Optional[str] = None
    used: Optional[str] = None
