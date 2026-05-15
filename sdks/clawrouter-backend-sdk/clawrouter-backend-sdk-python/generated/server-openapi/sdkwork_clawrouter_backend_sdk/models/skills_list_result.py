from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_list_response import AdminSkillListResponse


@dataclass
class SkillsListResult:
    """Skills list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillListResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
