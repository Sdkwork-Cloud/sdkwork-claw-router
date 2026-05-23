from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentRunCreateRequest:
    """Agent run create request schema exposed by Claw Router."""
    agent_id: str
    agent_version_id: str
    request_id: str
    execution_mode: Optional[str] = None
    input_message: Optional[str] = None
    memory_space_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    runtime: Optional[str] = None
    source_surface: Optional[str] = None
    trace_id: Optional[str] = None
