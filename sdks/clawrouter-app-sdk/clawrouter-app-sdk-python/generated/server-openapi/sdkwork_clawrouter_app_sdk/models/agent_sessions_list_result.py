from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_session_list_response import AgentSessionListResponse


@dataclass
class AgentSessionsListResult:
    """Agent sessions list result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentSessionListResponse] = None
    msg: Optional[str] = None
