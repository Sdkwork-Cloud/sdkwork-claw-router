from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class Message:
    """Message schema exposed by Claw Router."""
    content: str
    desc: str
    id: str
    read: bool
    show_as_popup: bool
    time: str
    title: str
    type: str
