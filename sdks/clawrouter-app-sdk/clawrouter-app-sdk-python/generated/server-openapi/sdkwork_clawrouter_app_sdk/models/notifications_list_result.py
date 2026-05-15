from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .messages_response import MessagesResponse


@dataclass
class NotificationsListResult:
    """Notifications list result schema exposed by Claw Router."""
    code: str
    data: Optional[MessagesResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
