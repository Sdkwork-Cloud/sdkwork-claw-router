from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_agent_usage_fact_metadata import GenerationAgentUsageFactMetadata


@dataclass
class GenerationAgentMeteringEvent:
    """Generation agent metering event schema exposed by Claw Router."""
    quantity: str
    type: str
    usage_fact_metadata: GenerationAgentUsageFactMetadata
