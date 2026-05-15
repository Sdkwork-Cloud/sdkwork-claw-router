from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UsageLogItem:
    """Usage log item schema exposed by Claw Router."""
    base_input_price: str
    base_output_price: str
    cache_read_price: str
    cache_read_tokens: int
    cost: str
    group: str
    id: str
    input_tokens: int
    ip: str
    is_stream: bool
    model: str
    multiplier: str
    output_tokens: int
    path: str
    reasoning_effort: str
    request_id: str
    time: str
    token_name: str
    total_time: str
    ttft: str
    type: str
