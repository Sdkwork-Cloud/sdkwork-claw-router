from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRuntimeAssemblyEvent:
    """Commerce payment runtime assembly event schema exposed by Claw Router."""
    account_no: str
    kind: str
    provider_code: str
    message: Optional[str] = None
    reason: Optional[str] = None
