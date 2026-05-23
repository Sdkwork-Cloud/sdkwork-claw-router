from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentSessionItem:
    """Agent session item schema exposed by Claw Router."""
    agent_id: str
    created_at: str
    id: str
    run_count: int
    session_kind: str
    source_surface: str
    status: str
    step_count: int
    title: str
    updated_at: str
    agent_version_id: Optional[str] = None
    approval_policy: Optional[str] = None
    chat_conversation_id: Optional[str] = None
    cwd: Optional[str] = None
    default_model: Optional[str] = None
    last_active_at: Optional[str] = None
    last_run_id: Optional[str] = None
    last_step_id: Optional[int] = None
    memory_space_id: Optional[str] = None
    permission_mode: Optional[str] = None
    runtime: Optional[str] = None
    sandbox_policy: Optional[str] = None
    tool_call_count: Optional[int] = None
