from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skill_detail_response import SkillDetailResponse


@dataclass
class SkillsRetrieveResult:
    """Skills retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[SkillDetailResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
