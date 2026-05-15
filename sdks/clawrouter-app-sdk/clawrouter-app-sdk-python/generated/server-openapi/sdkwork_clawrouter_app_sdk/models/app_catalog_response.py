from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_catalog_item import AppCatalogItem


@dataclass
class AppCatalogResponse:
    """App catalog response schema exposed by Claw Router."""
    items: List[AppCatalogItem]
