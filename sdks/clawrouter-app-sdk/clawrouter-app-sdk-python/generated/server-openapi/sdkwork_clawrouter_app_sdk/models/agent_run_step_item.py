from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentRunStepItem:
    """Agent run step item schema exposed by Claw Router."""
    created_at: str
    id: str
    run_id: str
    status: str
    step_index: int
    step_type: str
    cached_tokens: Optional[int] = None
    completed_at: Optional[str] = None
    input_tokens: Optional[int] = None
    latency_ms: Optional[int] = None
    model: Optional[str] = None
    output_tokens: Optional[int] = None
    runtime_invocation_id: Optional[str] = None
    started_at: Optional[str] = None
    title: Optional[str] = None
    tool_name: Optional[str] = None
    total_tokens: Optional[int] = None
