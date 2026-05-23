from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .usage_snapshot import UsageSnapshot


@dataclass
class AgentRunStepCreateRequest:
    """Agent run step create request schema exposed by Claw Router."""
    input_json: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    output_json: Optional[Dict[str, str]] = None
    runtime_invocation_id: Optional[str] = None
    status: Optional[str] = None
    step_type: Optional[str] = None
    title: Optional[str] = None
    tool_name: Optional[str] = None
    usage_json: Optional[UsageSnapshot] = None
