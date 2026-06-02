from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillCategoryItem:
    """Updated skill category snapshot returned by the backend."""
    id: str
    name: str
    sort_weight: int
    status: int
    type: int
    visible: bool
    code: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
