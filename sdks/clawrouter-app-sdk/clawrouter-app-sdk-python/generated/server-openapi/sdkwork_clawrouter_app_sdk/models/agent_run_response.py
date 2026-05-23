from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_run_item import AgentRunItem


@dataclass
class AgentRunResponse:
    """Agent run response schema exposed by Claw Router."""
    item: AgentRunItem
