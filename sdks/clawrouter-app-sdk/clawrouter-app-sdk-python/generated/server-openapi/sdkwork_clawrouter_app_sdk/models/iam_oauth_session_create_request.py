from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamOauthSessionCreateRequest:
    """Iam oauth session create request schema exposed by Claw Router."""
    code: str
    provider: str
    device_id: Optional[str] = None
    device_type: Optional[str] = None
    state: Optional[str] = None
