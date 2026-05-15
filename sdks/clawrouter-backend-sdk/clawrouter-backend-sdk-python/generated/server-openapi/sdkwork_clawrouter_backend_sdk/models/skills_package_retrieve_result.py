from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_package_mutation_response import AdminSkillPackageMutationResponse


@dataclass
class SkillsPackageRetrieveResult:
    """Skills package retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillPackageMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
