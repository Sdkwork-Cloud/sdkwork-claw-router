from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_site_models_response import AdminSiteModelsResponse


@dataclass
class SiteModelsListResult:
    """Site models list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSiteModelsResponse] = None
    msg: Optional[str] = None
