from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_session_response import AgentSessionResponse


@dataclass
class AgentSessionsCreateResult:
    """Agent sessions create result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentSessionResponse] = None
    msg: Optional[str] = None
