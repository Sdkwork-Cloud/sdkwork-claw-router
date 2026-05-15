from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamUserLoginEventRecord:
    """Iam user login event record schema exposed by Claw Router."""
    auth_method: Optional[str] = None
    auth_provider: Optional[str] = None
    client_ip_hash: Optional[str] = None
    client_ip_masked: Optional[str] = None
    client_ip_region: Optional[str] = None
    created_at: Optional[str] = None
    device_fingerprint_hash: Optional[str] = None
    device_label: Optional[str] = None
    failure_reason_code: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    login_result: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mfa_verified: Optional[bool] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    risk_level: Optional[str] = None
    session_id_hash: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_agent_hash: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
