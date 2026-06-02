from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentStatementRecord:
    """Commerce payment statement record schema exposed by Claw Router."""
    created_at: str
    download_status: str
    fee_amount: str
    idempotency_key: str
    net_amount: str
    parse_status: str
    period_end: str
    period_start: str
    provider_code: str
    request_no: str
    row_count: str
    settlement_currency: str
    statement_no: str
    statement_type: str
    tenant_id: str
    total_amount: str
    updated_at: str
    downloaded_at: Optional[str] = None
    file_digest: Optional[str] = None
    file_ref: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    parsed_at: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_statement_id: Optional[str] = None
