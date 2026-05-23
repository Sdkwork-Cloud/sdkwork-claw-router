from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_pay_binding_response import OpenPlatformPayBindingResponse


@dataclass
class AccountsPayBindingsCreateResult:
    """Accounts pay bindings create result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformPayBindingResponse] = None
    msg: Optional[str] = None
