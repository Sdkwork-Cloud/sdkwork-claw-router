from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_model_catalog_price_availability import AppModelCatalogPriceAvailability
    from .app_model_catalog_reference_price import AppModelCatalogReferencePrice


@dataclass
class AppModelCatalogItem:
    """App model catalog item schema exposed by Claw Router."""
    api_format: Optional[str]
    capabilities: List[str]
    capability_intro: Optional[str]
    catalog_key: str
    categories: List[str]
    context_tokens: Optional[int]
    description: Optional[str]
    display_name: str
    groups: List[str]
    input_modalities: List[str]
    limitations: List[str]
    max_output_tokens: Optional[int]
    modalities: List[str]
    model: str
    official_reference_prices: List[AppModelCatalogReferencePrice]
    output_modalities: List[str]
    price_availability: AppModelCatalogPriceAvailability
    provider_codes: List[str]
    release_stage: Optional[int]
    replacement_model: Optional[str]
    routing_state: Optional[int]
    shelf_state: Optional[int]
    supported_languages: List[str]
    supports_json_schema: bool
    supports_streaming: bool
    supports_tools: bool
    training_data_cutoff: Optional[str]
    use_cases: List[str]
    vendor: str
    vendor_code: str
