from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_site_model_item import AdminSiteModelItem


@dataclass
class AdminSiteModelMutationResponse:
    """Admin site model mutation response schema exposed by Claw Router."""
    item: AdminSiteModelItem
