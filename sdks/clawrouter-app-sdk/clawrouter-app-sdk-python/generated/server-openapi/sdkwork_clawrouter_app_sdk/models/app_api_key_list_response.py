from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_api_key_group import AppApiKeyGroup
    from .app_api_key_item import AppApiKeyItem


@dataclass
class AppApiKeyListResponse:
    """App api key list response schema exposed by Claw Router."""
    groups: List[AppApiKeyGroup]
    items: List[AppApiKeyItem]
