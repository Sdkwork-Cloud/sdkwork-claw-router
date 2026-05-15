from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusCommentsRecord:
    """Plus comments record schema exposed by Claw Router."""
    author: Optional[Dict[str, str]] = None
    device_info: Optional[str] = None
    ip_address: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    user_id: Optional[str] = None
