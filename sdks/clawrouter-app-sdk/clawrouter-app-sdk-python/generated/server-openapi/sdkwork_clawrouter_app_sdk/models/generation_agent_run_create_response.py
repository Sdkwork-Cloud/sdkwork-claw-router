from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_agent_metering_event import GenerationAgentMeteringEvent
    from .generation_agent_run_snapshot import GenerationAgentRunSnapshot
    from .generation_agent_run_step_snapshot import GenerationAgentRunStepSnapshot
    from .generation_agent_snapshot import GenerationAgentSnapshot
    from .generation_agent_usage_summary import GenerationAgentUsageSummary
    from .generation_history_item import GenerationHistoryItem


@dataclass
class GenerationAgentRunCreateResponse:
    """Generation agent run create response schema exposed by Claw Router."""
    agent: GenerationAgentSnapshot
    item: GenerationHistoryItem
    metering_events: List[GenerationAgentMeteringEvent]
    run: GenerationAgentRunSnapshot
    status: str
    steps: List[GenerationAgentRunStepSnapshot]
    target_type: str
    usage: GenerationAgentUsageSummary
