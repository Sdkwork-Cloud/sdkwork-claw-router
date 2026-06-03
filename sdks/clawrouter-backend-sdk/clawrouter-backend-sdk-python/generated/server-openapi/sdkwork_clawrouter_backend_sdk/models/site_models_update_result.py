from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_site_model_mutation_response import AdminSiteModelMutationResponse


@dataclass
class SiteModelsUpdateResult:
    """Site models update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSiteModelMutationResponse] = None
    msg: Optional[str] = None
