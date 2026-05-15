from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skill_package_item import SkillPackageItem


@dataclass
class SkillCatalogItem:
    """Skill catalog item schema exposed by Claw Router."""
    category: str
    clawhub_image: str
    description: str
    developer: str
    downloads: str
    features: List[str]
    frameworks: List[str]
    id: str
    image: str
    last_updated: str
    license: str
    name: str
    rating: float
    screenshots: List[str]
    size: str
    version: str
    packages: Optional[List[SkillPackageItem]] = None
