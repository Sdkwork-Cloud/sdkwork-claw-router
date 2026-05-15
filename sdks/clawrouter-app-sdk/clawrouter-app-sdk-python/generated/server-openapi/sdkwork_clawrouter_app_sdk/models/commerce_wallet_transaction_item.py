from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceWalletTransactionItem:
    """Commerce wallet transaction item schema exposed by Claw Router."""
    amount: str
    balance_after: str
    business_type: str
    created_at: str
    direction: str
    id: str
    transaction_no: str
