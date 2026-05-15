from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRoutingRuleRecord:
    """Ai routing rule record schema exposed by Claw Router."""
    candidate_channels: Optional[Dict[str, str]] = None
    constraints: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    fallback_chain: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    match_expression: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    priority: Optional[int] = None
    profile_id: Optional[str] = None
    rate_limit_policy_id: Optional[str] = None
    rule_code: Optional[str] = None
    status: Optional[str] = None
    target_model: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
