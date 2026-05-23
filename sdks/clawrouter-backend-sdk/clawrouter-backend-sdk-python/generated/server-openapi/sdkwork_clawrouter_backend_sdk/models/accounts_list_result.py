from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_account_list_response import OpenPlatformAccountListResponse


@dataclass
class AccountsListResult:
    """Accounts list result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformAccountListResponse] = None
    msg: Optional[str] = None
