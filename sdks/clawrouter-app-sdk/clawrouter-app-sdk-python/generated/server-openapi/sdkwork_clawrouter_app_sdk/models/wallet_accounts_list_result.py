from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_wallet_account_item import CommerceWalletAccountItem


@dataclass
class WalletAccountsListResult:
    """Wallet accounts list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceWalletAccountItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
