from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOperationResponse:
    """Commerce operation response schema exposed by Claw Router."""
    request_no: str
    status: str
    success: bool
