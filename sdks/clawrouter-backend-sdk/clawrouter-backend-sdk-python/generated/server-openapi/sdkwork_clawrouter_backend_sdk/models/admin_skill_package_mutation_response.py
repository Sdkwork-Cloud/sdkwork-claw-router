from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_package_item import AdminSkillPackageItem


@dataclass
class AdminSkillPackageMutationResponse:
    """Admin skill package mutation response schema exposed by Claw Router."""
    item: AdminSkillPackageItem
