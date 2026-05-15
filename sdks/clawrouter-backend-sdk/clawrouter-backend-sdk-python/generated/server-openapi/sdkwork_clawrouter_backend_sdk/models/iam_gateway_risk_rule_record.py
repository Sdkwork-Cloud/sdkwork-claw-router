from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamGatewayRiskRuleRecord:
    """Iam gateway risk rule record schema exposed by Claw Router."""
    action: Optional[str] = None
    block_duration_seconds: Optional[str] = None
    burst_limit: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    hit_count: Optional[str] = None
    id: Optional[str] = None
    last_hit_at: Optional[str] = None
    match_mode: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    priority: Optional[int] = None
    reason: Optional[str] = None
    requests_per_day: Optional[str] = None
    requests_per_minute: Optional[str] = None
    requests_per_second: Optional[str] = None
    rule_category: Optional[str] = None
    rule_name: Optional[str] = None
    rule_type: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    status: Optional[str] = None
    target_type: Optional[str] = None
    target_value: Optional[str] = None
    target_value_cipher_ref: Optional[str] = None
    target_value_hash: Optional[str] = None
    target_value_masked: Optional[str] = None
    tenant_id: Optional[str] = None
    tokens_per_minute: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
