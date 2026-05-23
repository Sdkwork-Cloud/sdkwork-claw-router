from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_api_key_group_list_response import AppApiKeyGroupListResponse


@dataclass
class ApiKeyGroupsListResult:
    """Api key groups list result schema exposed by Claw Router."""
    code: str
    data: Optional[AppApiKeyGroupListResponse] = None
    msg: Optional[str] = None
