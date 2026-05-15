from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_wallet_overview_response import CommerceWalletOverviewResponse


@dataclass
class WalletOverviewRetrieveResult:
    """Wallet overview retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceWalletOverviewResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
