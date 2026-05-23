from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAnalyticsSummary:
    """Admin analytics summary schema exposed by Claw Router."""
    active_models: int
    active_users: int
    average_points_per_request: float
    average_tokens_per_request: float
    error_rate: float
    failed_requests: int
    successful_requests: int
    total_points: float
    total_requests: int
    total_tokens: float
    total_users: int
    upstream_cost: float
