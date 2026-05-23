from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_entry_response import OpenPlatformEntryResponse


@dataclass
class AccountsEntriesCreateResult:
    """Accounts entries create result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformEntryResponse] = None
    msg: Optional[str] = None
