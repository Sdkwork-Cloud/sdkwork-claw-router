from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_agent_list_response import AdminAgentListResponse


@dataclass
class AgentsListResult:
    """Agents list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAgentListResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
