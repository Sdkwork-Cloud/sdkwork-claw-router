from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_api_keys_map_response import AdminApiKeysMapResponse


@dataclass
class ApiKeysListResult:
    """Api keys list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminApiKeysMapResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
