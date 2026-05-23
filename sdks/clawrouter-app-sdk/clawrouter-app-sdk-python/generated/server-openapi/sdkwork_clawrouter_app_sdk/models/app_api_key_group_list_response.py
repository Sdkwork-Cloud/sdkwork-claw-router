from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_api_key_group import AppApiKeyGroup


@dataclass
class AppApiKeyGroupListResponse:
    """App api key group list response schema exposed by Claw Router."""
    items: List[AppApiKeyGroup]
