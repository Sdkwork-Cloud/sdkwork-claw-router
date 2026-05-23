from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .account_summary_response import AccountSummaryResponse


@dataclass
class AccountSummaryRetrieveResult:
    """Account summary retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AccountSummaryResponse] = None
    msg: Optional[str] = None
