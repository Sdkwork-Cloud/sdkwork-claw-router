from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderAdjustmentRecord:
    """Commerce usage service provider adjustment record schema exposed by Claw Router."""
    adjustment_no: Optional[str] = None
    adjustment_type: Optional[str] = None
    amount: Optional[str] = None
    approval_status: Optional[str] = None
    approved_by: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    reason_code: Optional[str] = None
    reason_message: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    seller_provider_id: Optional[str] = None
    settled_ledger_entry_id: Optional[str] = None
    statement_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_edge_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
