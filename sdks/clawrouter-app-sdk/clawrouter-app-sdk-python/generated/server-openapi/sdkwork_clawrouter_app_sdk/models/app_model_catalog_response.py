from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_model_catalog_group_option import AppModelCatalogGroupOption
    from .app_model_catalog_item import AppModelCatalogItem


@dataclass
class AppModelCatalogResponse:
    """App model catalog response schema exposed by Claw Router."""
    groups: List[AppModelCatalogGroupOption]
    items: List[AppModelCatalogItem]
