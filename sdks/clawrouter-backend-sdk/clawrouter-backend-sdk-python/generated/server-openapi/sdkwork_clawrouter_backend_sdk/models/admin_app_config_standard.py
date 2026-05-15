from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppConfigStandard:
    """Admin app config standard schema exposed by Claw Router."""
    app_key: str
