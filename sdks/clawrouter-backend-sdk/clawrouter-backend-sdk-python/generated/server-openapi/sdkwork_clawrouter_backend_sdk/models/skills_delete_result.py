from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_delete_response import AdminSkillDeleteResponse


@dataclass
class SkillsDeleteResult:
    """Skills delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillDeleteResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
