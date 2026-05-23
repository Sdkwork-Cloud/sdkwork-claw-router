from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppCategoryCreateRequest:
    """Admin app category create request schema exposed by Claw Router."""
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    visible: Optional[bool] = None
