from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_step_response import AgentRunStepResponse


@dataclass
class AgentRunStepsSubmitResult:
    """Agent run steps submit result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentRunStepResponse] = None
    msg: Optional[str] = None
