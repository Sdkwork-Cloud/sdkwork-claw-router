from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_template_list_response import AdminAppTemplateListResponse


@dataclass
class AppsTemplatesListResult:
    """Apps templates list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppTemplateListResponse] = None
    msg: Optional[str] = None
