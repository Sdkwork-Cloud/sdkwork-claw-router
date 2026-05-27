from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SdkReferenceDocumentationResponse:
    """Sdk reference documentation response schema exposed by Claw Router."""
    generated: bool
    language: str
    readme: str
    method_definition: Optional[str] = None
    usage_example: Optional[str] = None
