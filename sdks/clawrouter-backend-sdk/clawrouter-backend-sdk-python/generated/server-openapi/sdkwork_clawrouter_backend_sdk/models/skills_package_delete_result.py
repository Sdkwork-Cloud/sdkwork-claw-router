from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_package_delete_response import AdminSkillPackageDeleteResponse


@dataclass
class SkillsPackageDeleteResult:
    """Skills package delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillPackageDeleteResponse] = None
    msg: Optional[str] = None
