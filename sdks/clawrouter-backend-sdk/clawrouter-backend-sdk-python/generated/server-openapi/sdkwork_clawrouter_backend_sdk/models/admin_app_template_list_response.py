from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_template_item_response import AdminAppTemplateItemResponse


@dataclass
class AdminAppTemplateListResponse:
    """Admin app template list response schema exposed by Claw Router."""
    has_next_page: bool
    items: List[AdminAppTemplateItemResponse]
    page: str
    page_size: str
    total: str
