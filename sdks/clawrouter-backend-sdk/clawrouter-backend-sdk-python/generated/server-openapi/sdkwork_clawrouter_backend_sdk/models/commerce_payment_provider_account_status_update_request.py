from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderAccountStatusUpdateRequest:
    """Commerce payment provider account status update request schema exposed by Claw Router."""
    status: str
    client_request_no: Optional[str] = None
    note: Optional[str] = None
