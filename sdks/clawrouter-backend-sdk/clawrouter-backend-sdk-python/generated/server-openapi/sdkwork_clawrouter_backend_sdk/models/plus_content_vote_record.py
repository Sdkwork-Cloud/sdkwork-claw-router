from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusContentVoteRecord:
    """Plus content vote record schema exposed by Claw Router."""
    client_ip: Optional[str] = None
    device_info: Optional[str] = None
    source: Optional[str] = None
    user_id: Optional[str] = None
