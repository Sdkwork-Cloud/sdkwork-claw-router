from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_site_model_create_request import AdminSiteModelCreateRequest


@dataclass
class AdminSiteModelsReplaceRequest:
    """Admin site models replace request schema exposed by Claw Router."""
    items: List[AdminSiteModelCreateRequest]
