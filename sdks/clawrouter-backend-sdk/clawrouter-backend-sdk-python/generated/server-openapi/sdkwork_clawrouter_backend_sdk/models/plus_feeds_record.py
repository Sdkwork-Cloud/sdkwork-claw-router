from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusFeedsRecord:
    """Plus feeds record schema exposed by Claw Router."""
    author: Optional[Dict[str, str]] = None
    cover_images: Optional[Dict[str, str]] = None
    publish_time: Optional[str] = None
    resource_list: Optional[Dict[str, str]] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    user_id: Optional[str] = None
