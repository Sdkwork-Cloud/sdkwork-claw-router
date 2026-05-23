from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_entry_list_response import OpenPlatformEntryListResponse


@dataclass
class AccountsEntriesListResult:
    """Accounts entries list result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformEntryListResponse] = None
    msg: Optional[str] = None
