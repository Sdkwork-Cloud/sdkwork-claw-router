from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_config import ProviderConfig


@dataclass
class ProvidersResponse:
    """Providers response schema exposed by Claw Router."""
    items: List[ProviderConfig]
