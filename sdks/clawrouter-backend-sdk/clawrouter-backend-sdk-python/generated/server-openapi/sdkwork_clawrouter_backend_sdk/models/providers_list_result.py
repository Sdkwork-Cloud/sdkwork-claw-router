from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_provider_list_response import OpenPlatformProviderListResponse


@dataclass
class ProvidersListResult:
    """Providers list result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformProviderListResponse] = None
    msg: Optional[str] = None
