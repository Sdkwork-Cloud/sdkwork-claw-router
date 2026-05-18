from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_agent_item import AdminAgentItem


@dataclass
class AgentsRetrieveResult:
    """Agents retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAgentItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
