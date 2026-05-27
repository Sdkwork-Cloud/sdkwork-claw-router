from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_template_item_response import AdminAppTemplateItemResponse


@dataclass
class AdminAppTemplateMutationResponse:
    """Admin app template mutation response schema exposed by Claw Router."""
    item: AdminAppTemplateItemResponse
