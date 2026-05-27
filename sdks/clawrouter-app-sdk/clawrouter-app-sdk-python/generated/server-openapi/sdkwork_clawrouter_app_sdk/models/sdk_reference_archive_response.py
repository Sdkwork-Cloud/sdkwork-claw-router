from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SdkReferenceArchiveResponse:
    """Sdk reference archive response schema exposed by Claw Router."""
    content_base64: str
    content_type: str
    file_name: str
    language: str
