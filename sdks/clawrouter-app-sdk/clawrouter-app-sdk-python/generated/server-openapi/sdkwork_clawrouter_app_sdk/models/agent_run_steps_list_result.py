from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_step_list_response import AgentRunStepListResponse


@dataclass
class AgentRunStepsListResult:
    """Agent run steps list result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentRunStepListResponse] = None
    msg: Optional[str] = None
