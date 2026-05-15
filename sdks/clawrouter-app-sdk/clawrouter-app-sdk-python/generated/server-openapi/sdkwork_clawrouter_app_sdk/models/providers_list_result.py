from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .providers_response import ProvidersResponse


@dataclass
class ProvidersListResult:
    """Providers list result schema exposed by Claw Router."""
    code: str
    data: Optional[ProvidersResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
