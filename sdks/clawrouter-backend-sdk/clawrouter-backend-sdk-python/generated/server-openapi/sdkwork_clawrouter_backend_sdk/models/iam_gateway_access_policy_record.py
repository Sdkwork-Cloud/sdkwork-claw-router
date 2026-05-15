from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamGatewayAccessPolicyRecord:
    """Iam gateway access policy record schema exposed by Claw Router."""
    allowed_capabilities: Optional[Dict[str, str]] = None
    allowed_models: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_retention_mode: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    denied_capabilities: Optional[Dict[str, str]] = None
    denied_models: Optional[Dict[str, str]] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    ip_allowlist: Optional[Dict[str, str]] = None
    ip_denylist: Optional[Dict[str, str]] = None
    ip_rule_count: Optional[int] = None
    max_context_tokens: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    network_policy_mode: Optional[str] = None
    organization_id: Optional[str] = None
    policy_type: Optional[str] = None
    region_allowlist: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    subject_id: Optional[str] = None
    subject_ref_hash: Optional[str] = None
    subject_ref_masked: Optional[str] = None
    subject_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
