from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_account_response import OpenPlatformAccountResponse


@dataclass
class AccountsDeleteResult:
    """Accounts delete result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformAccountResponse] = None
    msg: Optional[str] = None
