from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceTokenBalanceResponse:
    """Commerce token balance response schema exposed by Claw Router."""
    available_tokens: int
    frozen_tokens: int
