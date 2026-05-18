from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_item_response import AgentItemResponse


@dataclass
class AgentsCreateResult:
    """Agents create result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentItemResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
