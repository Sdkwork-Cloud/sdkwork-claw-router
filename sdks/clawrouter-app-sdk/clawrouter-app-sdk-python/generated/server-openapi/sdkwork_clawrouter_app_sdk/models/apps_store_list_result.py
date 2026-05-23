from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_catalog_response import AppCatalogResponse


@dataclass
class AppsStoreListResult:
    """Apps store list result schema exposed by Claw Router."""
    code: str
    data: Optional[AppCatalogResponse] = None
    msg: Optional[str] = None
