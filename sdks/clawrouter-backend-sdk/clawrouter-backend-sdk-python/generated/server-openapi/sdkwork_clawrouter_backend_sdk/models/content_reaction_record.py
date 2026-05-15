from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentReactionRecord:
    """Content reaction record schema exposed by Claw Router."""
    cancelled_at: Optional[str] = None
    client_ip_hash: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    reaction_type: Optional[str] = None
    reaction_value: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    target_id: Optional[str] = None
    target_type: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_agent_hash: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
