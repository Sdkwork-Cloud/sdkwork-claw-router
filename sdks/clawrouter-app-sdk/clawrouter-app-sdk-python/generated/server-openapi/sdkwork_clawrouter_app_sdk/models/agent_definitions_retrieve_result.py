from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_item import AgentItem


@dataclass
class AgentDefinitionsRetrieveResult:
    """Agent definitions retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentItem] = None
    msg: Optional[str] = None
