from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentDisputeEventRecord:
    """Commerce payment dispute event record schema exposed by Claw Router."""
    actor_type: str
    created_at: str
    dispute_id: str
    event_no: str
    event_type: str
    tenant_id: str
    to_status: str
    actor_id: Optional[str] = None
    from_status: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    payload_json: Optional[Dict[str, str]] = None
