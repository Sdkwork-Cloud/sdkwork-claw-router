from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .sdk_reference_documentation_response import SdkReferenceDocumentationResponse


@dataclass
class DocumentationCreateResult:
    """Documentation create result schema exposed by Claw Router."""
    code: str
    data: Optional[SdkReferenceDocumentationResponse] = None
    msg: Optional[str] = None
