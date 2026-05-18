from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamLoginQrCodeConfirmRequest:
    """Iam login qr code confirm request schema exposed by Claw Router."""
    qr_key: str
