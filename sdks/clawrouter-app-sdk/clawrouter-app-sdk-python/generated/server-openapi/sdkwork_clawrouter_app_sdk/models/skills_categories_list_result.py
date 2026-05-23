from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skill_categories_response import SkillCategoriesResponse


@dataclass
class SkillsCategoriesListResult:
    """Skills categories list result schema exposed by Claw Router."""
    code: str
    data: Optional[SkillCategoriesResponse] = None
    msg: Optional[str] = None
