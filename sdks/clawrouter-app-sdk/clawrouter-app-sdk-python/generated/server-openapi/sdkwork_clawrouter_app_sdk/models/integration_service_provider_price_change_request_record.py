from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderPriceChangeRequestRecord:
    """Integration service provider price change request record schema exposed by Claw Router."""
    after_hash: Optional[str] = None
    approval_status: Optional[str] = None
    approved_by: Optional[str] = None
    before_hash: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    change_no: Optional[str] = None
    change_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    draft_payload: Optional[Dict[str, str]] = None
    effective_from: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    requested_by: Optional[str] = None
    seller_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
