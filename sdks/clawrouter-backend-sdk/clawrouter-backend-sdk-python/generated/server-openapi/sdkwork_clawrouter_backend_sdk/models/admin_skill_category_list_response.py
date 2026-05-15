from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_category_item import AdminSkillCategoryItem


@dataclass
class AdminSkillCategoryListResponse:
    """Admin skill category list response schema exposed by Claw Router."""
    items: List[AdminSkillCategoryItem]
