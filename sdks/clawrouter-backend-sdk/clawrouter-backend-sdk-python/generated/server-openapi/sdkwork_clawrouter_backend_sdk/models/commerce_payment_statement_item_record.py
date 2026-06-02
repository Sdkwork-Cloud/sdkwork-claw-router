from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentStatementItemRecord:
    """Commerce payment statement item record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    fee_amount: str
    gross_amount: str
    net_amount: str
    occurred_at: str
    provider_code: str
    raw_row_digest: str
    row_no: str
    statement_id: str
    tenant_id: str
    transaction_type: str
    id: Optional[str] = None
    metadata_json: Optional[Dict[str, str]] = None
    native_order_no: Optional[str] = None
    native_refund_id: Optional[str] = None
    native_trade_id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_status: Optional[str] = None
    sdkwork_out_refund_no: Optional[str] = None
    sdkwork_out_trade_no: Optional[str] = None
    settled_at: Optional[str] = None
