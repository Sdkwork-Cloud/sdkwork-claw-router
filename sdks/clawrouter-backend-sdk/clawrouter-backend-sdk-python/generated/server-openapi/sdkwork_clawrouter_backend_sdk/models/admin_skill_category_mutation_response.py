from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_category_item import AdminSkillCategoryItem


@dataclass
class AdminSkillCategoryMutationResponse:
    """Admin skill category mutation response schema exposed by Claw Router."""
    item: AdminSkillCategoryItem
