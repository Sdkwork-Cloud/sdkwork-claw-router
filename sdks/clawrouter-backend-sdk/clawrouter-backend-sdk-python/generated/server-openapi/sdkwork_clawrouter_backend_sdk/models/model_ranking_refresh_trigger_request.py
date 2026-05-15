from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ModelRankingRefreshTriggerRequest:
    """Model ranking refresh trigger request schema exposed by Claw Router."""
    cache_max_age_seconds: Optional[int] = None
    limit: Optional[int] = None
    lookback_days: Optional[int] = None
    rank_scope: Optional[str] = None
    refresh_interval_seconds: Optional[int] = None
    snapshot_period: Optional[str] = None
