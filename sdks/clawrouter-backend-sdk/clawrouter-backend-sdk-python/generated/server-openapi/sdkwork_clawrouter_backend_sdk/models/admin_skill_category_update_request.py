from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillCategoryUpdateRequest:
    """Admin skill category update request schema exposed by Claw Router."""
    code: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    name: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    type: Optional[int] = None
    visible: Optional[bool] = None
