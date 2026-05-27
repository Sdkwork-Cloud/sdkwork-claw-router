from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformQrAuthSessionCreateRequest:
    """Open platform qr auth session create request schema exposed by Claw Router."""
    purpose: str
