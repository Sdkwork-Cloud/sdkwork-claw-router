from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminChannelCredentialItem:
    """Admin channel credential item schema exposed by Claw Router."""
    base_url: str
    credential_id: str
    errors: int
    id: str
    masked_label: str
    name: str
    priority: int
    secret_ref: str
    status: str
    weight: int
    api_key: Optional[str] = None
