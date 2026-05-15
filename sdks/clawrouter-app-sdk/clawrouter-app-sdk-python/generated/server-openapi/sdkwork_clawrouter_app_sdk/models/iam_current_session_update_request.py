from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamCurrentSessionUpdateRequest:
    """Iam current session update request schema exposed by Claw Router."""
    device_name: Optional[str] = None
    organization_code: Optional[str] = None
    organization_id: Optional[str] = None
