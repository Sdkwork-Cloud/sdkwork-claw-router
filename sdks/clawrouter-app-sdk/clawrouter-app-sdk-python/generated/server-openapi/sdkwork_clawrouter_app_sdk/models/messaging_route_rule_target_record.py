from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingRouteRuleTargetRecord:
    """Messaging route rule target record schema exposed by Claw Router."""
    circuit_breaker_policy: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_code: Optional[str] = None
    route_rule_id: Optional[str] = None
    sender_identity_id: Optional[str] = None
    status: Optional[str] = None
    target_order: Optional[int] = None
    template_binding_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    weight: Optional[int] = None
