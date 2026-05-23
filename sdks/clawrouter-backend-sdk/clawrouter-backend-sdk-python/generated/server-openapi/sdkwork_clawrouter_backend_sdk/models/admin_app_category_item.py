from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppCategoryItem:
    """Updated app store category snapshot returned by the backend."""
    id: str
    name: str
    sort_weight: int
    status: int
    type: int
    visible: bool
    code: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
