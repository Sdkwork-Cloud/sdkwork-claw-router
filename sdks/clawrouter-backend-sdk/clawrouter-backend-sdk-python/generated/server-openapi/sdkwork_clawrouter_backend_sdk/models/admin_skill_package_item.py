from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillPackageItem:
    """Enabled skill package snapshot returned by the backend."""
    created_at: str
    enabled: bool
    featured: bool
    id: str
    name: str
    package_key: str
    sort_weight: int
    tags: List[str]
    updated_at: str
    category_id: Optional[str] = None
    cover: Optional[MediaResource] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    latest_published_at: Optional[str] = None
    summary: Optional[str] = None
