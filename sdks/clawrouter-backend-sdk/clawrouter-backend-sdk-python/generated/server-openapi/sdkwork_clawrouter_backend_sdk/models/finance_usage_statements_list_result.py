from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_billing_records_response import AdminBillingRecordsResponse


@dataclass
class FinanceUsageStatementsListResult:
    """Finance usage statements list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminBillingRecordsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
