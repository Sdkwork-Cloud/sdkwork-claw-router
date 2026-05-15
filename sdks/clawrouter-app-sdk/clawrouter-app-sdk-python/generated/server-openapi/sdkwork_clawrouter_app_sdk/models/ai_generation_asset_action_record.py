from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiGenerationAssetActionRecord:
    """Ai generation asset action record schema exposed by Claw Router."""
    action_params: Optional[Dict[str, str]] = None
    action_type: Optional[str] = None
    asset_id: Optional[str] = None
    client_ip_hash: Optional[str] = None
    client_ip_region: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: Optional[str] = None
    failure_code: Optional[str] = None
    id: Optional[str] = None
    job_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    result_asset_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_agent_hash: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
