from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .usage_snapshot import UsageSnapshot


@dataclass
class AgentRunStepCompleteRequest:
    """Agent run step complete request schema exposed by Claw Router."""
    error_message_masked: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    output_json: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    usage_json: Optional[UsageSnapshot] = None
