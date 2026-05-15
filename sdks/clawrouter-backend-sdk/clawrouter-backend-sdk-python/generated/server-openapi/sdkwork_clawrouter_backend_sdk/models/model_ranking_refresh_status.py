from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .model_ranking_refresh_latest_job import ModelRankingRefreshLatestJob


@dataclass
class ModelRankingRefreshStatus:
    """Model ranking refresh status schema exposed by Claw Router."""
    cache_max_age_seconds: int
    generated_at: str
    generated_count: int
    latest_job: ModelRankingRefreshLatestJob
    next_refresh_at: str
    organization_id: int
    rank_scope: str
    refresh_interval_seconds: int
    snapshot_date: str
    snapshot_period: str
    source_count: int
    source_tables: List[str]
    status: str
    tenant_id: int
    window_end: str
    window_start: str
