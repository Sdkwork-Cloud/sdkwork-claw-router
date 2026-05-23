from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCacheSummary:
    """Admin cache summary schema exposed by Claw Router."""
    cache_deletes: int
    cache_errors: int
    cache_hits: int
    cache_inspections: int
    cache_misses: int
    cache_refreshes: int
    cache_writes: int
    expired_entries: int
    runtime_target: str
    total_entries: int
    total_instances: int
    total_namespaces: int
