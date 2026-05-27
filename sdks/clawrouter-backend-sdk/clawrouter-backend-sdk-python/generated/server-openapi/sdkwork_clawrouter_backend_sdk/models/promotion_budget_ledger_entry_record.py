from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionBudgetLedgerEntryRecord:
    """Promotion budget ledger entry record schema exposed by Claw Router."""
    budget_account_id: str
    business_type: str
    created_at: str
    currency_code: str
    direction: str
    idempotency_key: str
    ledger_no: str
    occurred_at: str
    request_no: str
    source_id: str
    source_type: str
    tenant_id: str
    application_id: Optional[str] = None
    organization_id: Optional[str] = None
