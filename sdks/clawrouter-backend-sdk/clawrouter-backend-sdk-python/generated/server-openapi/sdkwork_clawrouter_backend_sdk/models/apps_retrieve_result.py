from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_mutation_response import AdminAppMutationResponse


@dataclass
class AppsRetrieveResult:
    """Apps retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppMutationResponse] = None
    msg: Optional[str] = None
