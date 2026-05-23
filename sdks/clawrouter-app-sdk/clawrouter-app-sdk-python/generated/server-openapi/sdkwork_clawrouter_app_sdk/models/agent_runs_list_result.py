from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_list_response import AgentRunListResponse


@dataclass
class AgentRunsListResult:
    """Agent runs list result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentRunListResponse] = None
    msg: Optional[str] = None
