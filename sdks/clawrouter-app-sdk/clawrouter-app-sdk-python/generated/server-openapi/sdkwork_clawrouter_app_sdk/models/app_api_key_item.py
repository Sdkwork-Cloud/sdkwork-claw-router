from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppApiKeyItem:
    """Created API key metadata with masked key material."""
    created: str
    expires: str
    group: str
    id: str
    ip_limit: str
    masked_key: str
    modalities: List[str]
    name: str
    quota: str
    status: str
    used_quota: str
    rate: Optional[str] = None
