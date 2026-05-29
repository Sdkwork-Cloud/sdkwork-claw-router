from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiQuotaPolicyRecord:
    """Ai quota policy record schema exposed by Claw Router."""
    block_duration_seconds: Optional[str] = None
    burst_limit: Optional[str] = None
    channel_group_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    exhausted_at: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    policy_code: Optional[str] = None
    quota_limit: Optional[str] = None
    quota_period: Optional[str] = None
    quota_unit: Optional[str] = None
    requests_per_day: Optional[str] = None
    requests_per_minute: Optional[str] = None
    requests_per_second: Optional[str] = None
    reset_mode: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    status: Optional[str] = None
    subject_id: Optional[str] = None
    subject_ref_hash: Optional[str] = None
    subject_ref_masked: Optional[str] = None
    subject_type: Optional[str] = None
    tenant_id: Optional[str] = None
    tokens_per_minute: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
