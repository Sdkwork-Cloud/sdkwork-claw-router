from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionEventOutboxRecord:
    """Promotion event outbox record schema exposed by Claw Router."""
    aggregate_id: str
    aggregate_type: str
    created_at: str
    event_no: str
    event_type: str
    event_version: int
    occurred_at: str
    payload_json: Dict[str, str]
    status: str
    tenant_id: str
    next_retry_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    published_at: Optional[str] = None
