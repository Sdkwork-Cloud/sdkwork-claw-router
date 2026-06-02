from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCategorySeedInitializeRequest:
    """Commerce category seed initialize request schema exposed by Claw Router."""
    datasets: Optional[List[str]] = None
    mode: Optional[str] = None
