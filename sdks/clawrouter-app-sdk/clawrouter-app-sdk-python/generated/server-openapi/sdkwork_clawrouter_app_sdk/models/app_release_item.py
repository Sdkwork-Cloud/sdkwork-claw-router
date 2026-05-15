from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppReleaseItem:
    """App release item schema exposed by Claw Router."""
    download_url: str
    id: str
    os: str
    platform_type: str
    release_date: str
    size: str
    version: str
    whats_new: Optional[str] = None
