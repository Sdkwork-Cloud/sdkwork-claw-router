from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentAttemptCreateRequest:
    """Commerce payment attempt create request schema exposed by Claw Router."""
    method_code: str
    client_request_no: Optional[str] = None
    note: Optional[str] = None
    provider_code: Optional[str] = None
    return_url: Optional[str] = None
