from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderSettlementRecord:
    """Commerce usage service provider settlement record schema exposed by Claw Router."""
    amount: Optional[str] = None
    buyer_account_id: Optional[str] = None
    buyer_ledger_entry_id: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    direction: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    seller_account_id: Optional[str] = None
    seller_ledger_entry_id: Optional[str] = None
    seller_provider_id: Optional[str] = None
    settled_at: Optional[str] = None
    settlement_mode: Optional[str] = None
    settlement_no: Optional[str] = None
    settlement_status: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_edge_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
