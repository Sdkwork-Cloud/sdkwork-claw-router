from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsJobExecutionRecord:
    """Ops job execution record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    duration_ms: Optional[str] = None
    ended_at: Optional[str] = None
    execution_status: Optional[str] = None
    failure_count: Optional[str] = None
    failure_reason: Optional[str] = None
    id: Optional[str] = None
    job_name: Optional[str] = None
    job_type: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload: Optional[Dict[str, str]] = None
    payload_hash: Optional[str] = None
    processed_count: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    success_count: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    trigger_type: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
