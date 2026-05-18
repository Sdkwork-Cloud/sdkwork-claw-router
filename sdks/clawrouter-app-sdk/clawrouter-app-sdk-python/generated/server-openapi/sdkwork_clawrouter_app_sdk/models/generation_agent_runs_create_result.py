from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_agent_run_create_response import GenerationAgentRunCreateResponse


@dataclass
class GenerationAgentRunsCreateResult:
    """Generation agent runs create result schema exposed by Claw Router."""
    code: str
    data: Optional[GenerationAgentRunCreateResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
