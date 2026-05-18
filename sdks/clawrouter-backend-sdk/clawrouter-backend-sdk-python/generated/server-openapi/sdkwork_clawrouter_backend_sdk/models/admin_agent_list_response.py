from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_agent_item import AdminAgentItem


@dataclass
class AdminAgentListResponse:
    """Admin agent list response schema exposed by Claw Router."""
    items: List[AdminAgentItem]
