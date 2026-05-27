from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderReconciliationItemRecord:
    """Commerce usage service provider reconciliation item record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    difference_amount: Optional[str] = None
    external_amount: Optional[str] = None
    id: Optional[str] = None
    internal_amount: Optional[str] = None
    legal_hold: Optional[bool] = None
    match_status: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_invoice_item_id: Optional[str] = None
    reason_code: Optional[str] = None
    request_id: Optional[str] = None
    resolution_status: Optional[str] = None
    retention_until: Optional[str] = None
    run_id: Optional[str] = None
    statement_item_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_edge_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
