from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .agent_list_response import AgentListResponse


@dataclass
class AgentDefinitionsListResult:
    """Agent definitions list result schema exposed by Claw Router."""
    code: str
    data: Optional[AgentListResponse] = None
    msg: Optional[str] = None
