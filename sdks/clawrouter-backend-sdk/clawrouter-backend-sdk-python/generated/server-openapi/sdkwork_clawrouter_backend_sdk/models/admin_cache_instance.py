from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCacheInstance:
    """Admin cache instance schema exposed by Claw Router."""
    cache_deletes: int
    cache_errors: int
    cache_hits: int
    cache_inspections: int
    cache_misses: int
    cache_refreshes: int
    cache_writes: int
    default_ttl_seconds: int
    entry_count: int
    expired_entry_count: int
    key_prefix: str
    name: str
    provider_kind: str
    purpose: str
    status: str
    supports_delete: bool
    supports_inspect: bool
    supports_refresh: bool
    connection_profile_name: Optional[str] = None
    max_entries: Optional[int] = None
