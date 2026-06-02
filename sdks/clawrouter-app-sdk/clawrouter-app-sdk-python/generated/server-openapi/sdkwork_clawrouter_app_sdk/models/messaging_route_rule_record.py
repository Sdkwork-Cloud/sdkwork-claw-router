from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingRouteRuleRecord:
    """Messaging route rule record schema exposed by Claw Router."""
    app_id: Optional[str] = None
    channel: Optional[str] = None
    country_code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivery_purpose: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    failover_policy: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    locale: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    priority: Optional[int] = None
    rule_code: Optional[str] = None
    scene_code: Optional[str] = None
    selection_policy: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_segment: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    weight: Optional[int] = None
