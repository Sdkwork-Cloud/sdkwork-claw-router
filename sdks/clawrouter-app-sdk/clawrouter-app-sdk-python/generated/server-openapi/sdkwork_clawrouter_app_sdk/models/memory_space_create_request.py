from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MemorySpaceCreateRequest:
    """Memory space create request schema exposed by Claw Router."""
    title: str
    auto_extract_enabled: Optional[bool] = None
    auto_recall_enabled: Optional[bool] = None
    max_injected_tokens: Optional[str] = None
    memory_enabled: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    retention_policy: Optional[Dict[str, str]] = None
    review_required: Optional[bool] = None
    sensitivity_policy: Optional[Dict[str, str]] = None
    space_type: Optional[str] = None
