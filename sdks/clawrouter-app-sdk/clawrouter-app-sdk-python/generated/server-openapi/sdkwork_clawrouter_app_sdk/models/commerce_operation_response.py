from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOperationResponse:
    """Commerce operation response schema exposed by Claw Router."""
    request_no: str
    status: str
    success: bool
    payment_id: Optional[str] = None
    qr_code_image_url: Optional[str] = None
    qr_code_payload: Optional[str] = None
