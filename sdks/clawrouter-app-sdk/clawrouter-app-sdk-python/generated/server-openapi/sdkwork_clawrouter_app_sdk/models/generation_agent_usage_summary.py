from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_agent_metering_event import GenerationAgentMeteringEvent


@dataclass
class GenerationAgentUsageSummary:
    """Generation agent usage summary schema exposed by Claw Router."""
    cached_tokens: int
    completion_tokens: int
    events: List[GenerationAgentMeteringEvent]
    image_count: int
    prompt_tokens: int
    total_tokens: int
    video_seconds: str
