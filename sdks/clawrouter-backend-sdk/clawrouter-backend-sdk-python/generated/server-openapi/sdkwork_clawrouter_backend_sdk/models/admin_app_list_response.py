from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_item_response import AdminAppItemResponse


@dataclass
class AdminAppListResponse:
    """Admin app list response schema exposed by Claw Router."""
    items: List[AdminAppItemResponse]
