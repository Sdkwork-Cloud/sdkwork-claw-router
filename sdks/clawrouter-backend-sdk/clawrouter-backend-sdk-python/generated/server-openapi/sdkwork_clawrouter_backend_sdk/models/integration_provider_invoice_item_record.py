from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderInvoiceItemRecord:
    """Integration provider invoice item record schema exposed by Claw Router."""
    amount: Optional[str] = None
    billing_meter_code: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    import_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    match_status: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_request_id: Optional[str] = None
    provider_usage_id: Optional[str] = None
    quantity: Optional[str] = None
    raw_payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
