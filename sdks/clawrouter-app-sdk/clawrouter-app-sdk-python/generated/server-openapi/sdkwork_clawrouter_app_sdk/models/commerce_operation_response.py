from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CommerceOperationResponse:
    """Commerce operation response schema exposed by Claw Router."""
    request_no: str
    status: str
    success: bool
    payment_id: Optional[str] = None
    qr_code: Optional[MediaResource] = None
    qr_code_payload: Optional[str] = None
