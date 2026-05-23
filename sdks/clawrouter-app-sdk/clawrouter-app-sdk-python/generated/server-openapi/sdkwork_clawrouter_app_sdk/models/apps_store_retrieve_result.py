from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_detail_response import AppDetailResponse


@dataclass
class AppsStoreRetrieveResult:
    """Apps store retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AppDetailResponse] = None
    msg: Optional[str] = None
