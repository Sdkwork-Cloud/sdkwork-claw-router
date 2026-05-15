from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_model_catalog_item import AppModelCatalogItem


@dataclass
class AppModelCatalogResponse:
    """App model catalog response schema exposed by Claw Router."""
    items: List[AppModelCatalogItem]
