from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiUsageServiceProviderChainRecord:
    """Ai usage service provider chain record schema exposed by Claw Router."""
    chain_depth: Optional[int] = None
    chain_hash: Optional[str] = None
    chain_path_snapshot: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    leaf_provider_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    resolved_subject_id: Optional[str] = None
    resolved_subject_type: Optional[str] = None
    retention_until: Optional[str] = None
    root_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
