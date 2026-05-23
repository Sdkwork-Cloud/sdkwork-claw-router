from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceAccountLedgerEntryRecord:
    """Commerce account ledger entry record schema exposed by Claw Router."""
    account_id: str
    amount: str
    asset_type: str
    balance_after: str
    business_type: str
    created_at: str
    direction: str
    idempotency_key: str
    owner_user_id: str
    request_no: str
    tenant_id: str
    transaction_no: str
    organization_id: Optional[str] = None
    remark: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
