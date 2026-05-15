from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ModelRankingRefreshLatestJob:
    """Model ranking refresh latest job schema exposed by Claw Router."""
    duration_ms: int
    ended_at: str
    failure_count: int
    failure_reason: Optional[str]
    generated_count: int
    id: str
    job_name: str
    next_refresh_at: str
    organization_id: int
    rank_scope: str
    snapshot_date: str
    snapshot_period: str
    source_count: int
    started_at: str
    status: str
    success_count: int
    tenant_id: int
    window_end: str
    window_start: str
