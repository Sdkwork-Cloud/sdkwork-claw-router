from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_wallet_transaction_item import CommerceWalletTransactionItem


@dataclass
class WalletTransactionsListResult:
    """Wallet transactions list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceWalletTransactionItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
