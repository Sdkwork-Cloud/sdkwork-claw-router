from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_release_item import AppReleaseItem
    from .media_resource import MediaResource


@dataclass
class AppCatalogItem:
    """App catalog item schema exposed by Claw Router."""
    category: str
    description: str
    developer: str
    downloads: str
    features: List[str]
    id: str
    image: MediaResource
    name: str
    rating: float
    releases: List[AppReleaseItem]
    screenshots: List[MediaResource]
