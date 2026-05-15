from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_transactions_response import AdminTransactionsResponse


@dataclass
class FinanceAdminLedgerListResult:
    """Finance admin ledger list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminTransactionsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
