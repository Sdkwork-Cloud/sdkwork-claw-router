from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_package_list_response import AdminSkillPackageListResponse


@dataclass
class SkillsPackageListResult:
    """Skills package list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillPackageListResponse] = None
    msg: Optional[str] = None
