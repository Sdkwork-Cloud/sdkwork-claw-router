from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_template_delete_response import AdminAppTemplateDeleteResponse


@dataclass
class AppsTemplatesDeleteResult:
    """Apps templates delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppTemplateDeleteResponse] = None
    msg: Optional[str] = None
