from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_mutation_response import AdminSkillMutationResponse


@dataclass
class SkillsCreateResult:
    """Skills create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillMutationResponse] = None
    msg: Optional[str] = None
