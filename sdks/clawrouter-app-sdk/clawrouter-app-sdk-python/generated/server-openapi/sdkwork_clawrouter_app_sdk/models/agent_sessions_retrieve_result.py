from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_session_item import AgentSessionItem


@dataclass
class AgentSessionsRetrieveResult:
    """Agent sessions retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentSessionItem] = None
    msg: Optional[str] = None
