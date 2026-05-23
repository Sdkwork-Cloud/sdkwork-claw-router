from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageSettlementRecord:
    """Commerce usage settlement record schema exposed by Claw Router."""
    account_id: Optional[str] = None
    account_ledger_entry_id: Optional[str] = None
    amount: Optional[str] = None
    asset_type: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    direction: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    order_id: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    payment_id: Optional[str] = None
    points: Optional[str] = None
    price_snapshot: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    settled_at: Optional[str] = None
    settlement_no: Optional[str] = None
    settlement_status: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    tokens: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
