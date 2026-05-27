from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SdkReferenceDocumentationGenerateRequest:
    """Sdk reference documentation generate request schema exposed by Claw Router."""
    config: Dict[str, Any]
    language: str
    spec: Dict[str, str]
