from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_pay_binding_list_response import OpenPlatformPayBindingListResponse


@dataclass
class AccountsPayBindingsListResult:
    """Accounts pay bindings list result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformPayBindingListResponse] = None
    msg: Optional[str] = None
