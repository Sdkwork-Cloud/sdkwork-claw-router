from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_agent_capabilities import AdminAgentCapabilities
    from .admin_agent_version_item import AdminAgentVersionItem


@dataclass
class AdminAgentItem:
    """Admin agent item schema exposed by Claw Router."""
    capabilities: AdminAgentCapabilities
    code: str
    created_at: str
    default_version: AdminAgentVersionItem
    description: str
    id: str
    name: str
    owner_user_id: int
    status: str
    updated_at: str
    visibility: str
    avatar_url: Optional[str] = None
    template_source: Optional[str] = None
