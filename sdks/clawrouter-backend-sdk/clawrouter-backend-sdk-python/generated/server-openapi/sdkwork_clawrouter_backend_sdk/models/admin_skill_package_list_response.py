from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_package_item import AdminSkillPackageItem


@dataclass
class AdminSkillPackageListResponse:
    """Admin skill package list response schema exposed by Claw Router."""
    items: List[AdminSkillPackageItem]
