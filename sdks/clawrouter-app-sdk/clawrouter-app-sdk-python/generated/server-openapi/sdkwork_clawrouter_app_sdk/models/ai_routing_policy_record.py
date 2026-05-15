from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRoutingPolicyRecord:
    """Ai routing policy record schema exposed by Claw Router."""
    capability: Optional[str] = None
    cost_ceiling: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    default_profile_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    fallback_mode: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    policy_code: Optional[str] = None
    policy_scope: Optional[str] = None
    slo_latency_ms: Optional[int] = None
    slo_success_rate: Optional[str] = None
    status: Optional[str] = None
    subject_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
