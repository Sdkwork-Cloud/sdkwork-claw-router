from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationAttemptRecord:
    """Iam verification attempt record schema exposed by Claw Router."""
    challenge_id: Optional[str] = None
    created_at: Optional[str] = None
    device_hash: Optional[str] = None
    failure_reason: Optional[str] = None
    id: Optional[str] = None
    ip_hash: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    result: Optional[str] = None
    retention_until: Optional[str] = None
    risk_snapshot: Optional[Dict[str, str]] = None
    scene_code: Optional[str] = None
    status: Optional[str] = None
    target_hash: Optional[str] = None
    target_type: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
