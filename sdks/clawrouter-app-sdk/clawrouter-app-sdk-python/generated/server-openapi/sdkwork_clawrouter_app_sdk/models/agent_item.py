from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_capabilities import AgentCapabilities
    from .agent_version_item import AgentVersionItem
    from .media_resource import MediaResource


@dataclass
class AgentItem:
    """Agent item schema exposed by Claw Router."""
    capabilities: AgentCapabilities
    code: str
    created_at: str
    default_version: AgentVersionItem
    description: str
    id: str
    name: str
    owner_user_id: int
    status: str
    updated_at: str
    visibility: str
    avatar: Optional[MediaResource] = None
    template_source: Optional[str] = None
