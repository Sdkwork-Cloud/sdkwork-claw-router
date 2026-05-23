from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentReconciliationRunItem:
    """Commerce payment reconciliation run item schema exposed by Claw Router."""
    business_date: str
    created_at: str
    id: str
    provider_code: str
    run_no: str
    status: str
    finished_at: Optional[str] = None
