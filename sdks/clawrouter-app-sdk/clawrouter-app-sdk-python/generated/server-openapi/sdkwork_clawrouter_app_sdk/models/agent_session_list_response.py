from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_session_item import AgentSessionItem


@dataclass
class AgentSessionListResponse:
    """Agent session list response schema exposed by Claw Router."""
    items: List[AgentSessionItem]
