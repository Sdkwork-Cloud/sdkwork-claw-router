from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class DashboardOverviewSummary:
    """Dashboard overview summary schema exposed by Claw Router."""
    audio_requests: int
    available_credits: float
    error_count: int
    image_requests: int
    music_requests: int
    request_count: int
    rpm: float
    tpm: float
    used_credits: float
    video_requests: int
