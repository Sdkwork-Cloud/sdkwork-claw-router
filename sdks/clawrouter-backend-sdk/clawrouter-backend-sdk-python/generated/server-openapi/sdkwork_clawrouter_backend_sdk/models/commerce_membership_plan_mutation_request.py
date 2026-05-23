from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_membership_benefit_mutation_request import CommerceMembershipBenefitMutationRequest


@dataclass
class CommerceMembershipPlanMutationRequest:
    """Commerce membership plan mutation request schema exposed by Claw Router."""
    code: str
    name: str
    benefits: Optional[List[CommerceMembershipBenefitMutationRequest]] = None
    rank: Optional[int] = None
    status: Optional[str] = None
