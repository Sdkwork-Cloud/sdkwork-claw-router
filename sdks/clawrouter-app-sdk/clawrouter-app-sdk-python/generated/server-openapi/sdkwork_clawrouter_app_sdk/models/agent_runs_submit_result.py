from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_response import AgentRunResponse


@dataclass
class AgentRunsSubmitResult:
    """Agent runs submit result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentRunResponse] = None
    msg: Optional[str] = None
