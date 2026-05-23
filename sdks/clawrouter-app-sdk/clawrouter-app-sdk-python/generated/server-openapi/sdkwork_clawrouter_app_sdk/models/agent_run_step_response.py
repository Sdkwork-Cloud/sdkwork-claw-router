from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_step_item import AgentRunStepItem


@dataclass
class AgentRunStepResponse:
    """Agent run step response schema exposed by Claw Router."""
    item: AgentRunStepItem
