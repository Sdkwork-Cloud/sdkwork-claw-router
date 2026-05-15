from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ModelRankingRefreshTriggerResponse:
    """Model ranking refresh trigger response schema exposed by Claw Router."""
    cache_max_age_seconds: int
    generated_count: int
    next_refresh_at: str
    organization_id: int
    rank_scope: str
    refresh_interval_seconds: int
    snapshot_date: str
    snapshot_period: str
    source_count: int
    status: str
    tenant_id: int
    triggered: bool
    window_end: str
    window_start: str
