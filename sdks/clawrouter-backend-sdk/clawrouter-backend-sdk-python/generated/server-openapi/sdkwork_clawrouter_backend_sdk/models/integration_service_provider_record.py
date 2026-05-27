from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderRecord:
    """Integration service provider record schema exposed by Claw Router."""
    activated_at: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_currency: Optional[str] = None
    default_timezone: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    display_name: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_organization_id: Optional[str] = None
    owner_tenant_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    provider_no: Optional[str] = None
    provider_type: Optional[str] = None
    risk_level: Optional[str] = None
    status: Optional[str] = None
    suspended_at: Optional[str] = None
    suspended_reason_code: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
