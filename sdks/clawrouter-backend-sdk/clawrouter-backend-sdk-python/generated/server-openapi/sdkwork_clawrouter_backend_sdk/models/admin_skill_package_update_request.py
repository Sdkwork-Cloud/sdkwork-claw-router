from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillPackageUpdateRequest:
    """Admin skill package update request schema exposed by Claw Router."""
    category_id: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    featured: Optional[bool] = None
    icon: Optional[str] = None
    name: Optional[str] = None
    package_key: Optional[str] = None
    sort_weight: Optional[int] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None
