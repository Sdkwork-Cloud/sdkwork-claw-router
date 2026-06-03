from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_site_model_item import AdminSiteModelItem


@dataclass
class AdminSiteModelsReplaceResponse:
    """Admin site models replace response schema exposed by Claw Router."""
    items: List[AdminSiteModelItem]
