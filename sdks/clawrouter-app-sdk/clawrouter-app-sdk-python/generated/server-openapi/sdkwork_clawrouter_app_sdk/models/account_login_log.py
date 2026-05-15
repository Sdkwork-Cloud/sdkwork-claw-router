from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AccountLoginLog:
    """Account login log schema exposed by Claw Router."""
    device: str
    ip: str
    location: str
    status: str
    time: str
