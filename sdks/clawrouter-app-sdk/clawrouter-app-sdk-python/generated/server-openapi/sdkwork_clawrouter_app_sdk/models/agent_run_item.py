from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentRunItem:
    """Agent run item schema exposed by Claw Router."""
    agent_id: str
    agent_version_id: str
    created_at: str
    execution_mode: str
    id: str
    request_id: str
    source_surface: str
    status: str
    total_steps: str
    cached_tokens: Optional[str] = None
    completed_at: Optional[str] = None
    error_message_masked: Optional[str] = None
    input_message: Optional[str] = None
    input_tokens: Optional[str] = None
    memory_space_id: Optional[str] = None
    model: Optional[str] = None
    output_message: Optional[str] = None
    output_tokens: Optional[str] = None
    runtime: Optional[str] = None
    session_id: Optional[str] = None
    started_at: Optional[str] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
