from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_item import AgentItem


@dataclass
class AgentItemResponse:
    """Agent item response schema exposed by Claw Router."""
    item: AgentItem
