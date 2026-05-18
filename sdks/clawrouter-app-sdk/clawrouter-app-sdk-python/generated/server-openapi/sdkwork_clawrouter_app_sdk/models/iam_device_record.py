from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamDeviceRecord:
    """Iam device record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    device_fingerprint: Optional[str] = None
    id: Optional[str] = None
    last_seen_at: Optional[str] = None
    name: Optional[str] = None
    tenant_id: Optional[str] = None
    trusted: Optional[bool] = None
    user_id: Optional[str] = None
