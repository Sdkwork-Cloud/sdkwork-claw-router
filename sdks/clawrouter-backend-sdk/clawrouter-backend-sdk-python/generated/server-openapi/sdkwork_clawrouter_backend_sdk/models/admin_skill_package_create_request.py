from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillPackageCreateRequest:
    """Admin skill package create request schema exposed by Claw Router."""
    name: str
    package_key: str
    category_id: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    featured: Optional[bool] = None
    icon: Optional[str] = None
    sort_weight: Optional[int] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None
