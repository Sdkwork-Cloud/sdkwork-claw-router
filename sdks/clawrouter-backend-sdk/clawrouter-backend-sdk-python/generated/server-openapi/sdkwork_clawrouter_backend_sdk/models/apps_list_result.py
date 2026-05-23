from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_list_response import AdminAppListResponse


@dataclass
class AppsListResult:
    """Apps list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppListResponse] = None
    msg: Optional[str] = None
