from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_template_mutation_response import AdminAppTemplateMutationResponse


@dataclass
class AppsTemplatesUnpublishResult:
    """Apps templates unpublish result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppTemplateMutationResponse] = None
    msg: Optional[str] = None
