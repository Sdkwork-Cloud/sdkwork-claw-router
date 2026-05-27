from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .sdk_reference_archive_response import SdkReferenceArchiveResponse


@dataclass
class ArchivesCreateResult:
    """Archives create result schema exposed by Claw Router."""
    code: str
    data: Optional[SdkReferenceArchiveResponse] = None
    msg: Optional[str] = None
