from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminAppCategoryCreateRequest:
    """Admin app category create request schema exposed by Claw Router."""
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    visible: Optional[bool] = None
