from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import CatalogCategoryAttributesCreateResult, CatalogCategoryAttributesDeleteResult, CatalogCategoryAttributesListResult, CatalogCategoryAttributesUpdateResult, CatalogCategorySeedsCreateResult, CatalogProductsDeleteResult, CatalogSkusDeleteResult, CommerceCategorySeedInitializeRequest, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountStatusUpdateRequest, CommerceProductCategoryAttributeMutationRequest, CommerceRechargeSettingsUpdateRequest, InventoryStocksUpdateResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesUpdateResult, MembershipsPlansUpdateResult, OrdersRetrieveResult, PaymentsProviderAccountsDeleteResult, PaymentsProviderAccountsStatusUpdateResult, PaymentsProvidersListResult, PaymentsRuntimeSnapshotRetrieveResult, RechargesPackagesDeleteResult, RechargesSettingsRetrieveResult, RechargesSettingsUpdateResult, ShipmentsTrackingEventsListResult

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"

def serialize_path_parameter(value: Any, spec: Dict[str, Any]) -> str:
    if value is None:
        return ''

    style = str(spec.get('style') or 'simple')
    name = str(spec.get('name') or '')
    explode = bool(spec.get('explode'))
    if isinstance(value, (list, tuple)):
        return serialize_path_array(name, value, style, explode)
    if isinstance(value, dict):
        return serialize_path_object(name, value, style, explode)
    return path_prefix(name, style) + encode_path_value(serialize_path_primitive(value))


def serialize_path_array(name: str, values: Any, style: str, explode: bool) -> str:
    serialized = [encode_path_value(serialize_path_primitive(item)) for item in values if item is not None]
    if not serialized:
        return path_prefix(name, style)
    if style == 'matrix':
        return ''.join(f";{name}={item}" for item in serialized) if explode else f";{name}={','.join(serialized)}"
    return path_prefix(name, style) + ('.' if explode else ',').join(serialized)


def serialize_path_object(name: str, value: Dict[str, Any], style: str, explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return path_prefix(name, style)
    if style == 'matrix':
        if explode:
            return ''.join(f";{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
        return f";{name}={serialized}"
    if explode:
        separator = '.' if style == 'label' else ','
        serialized = separator.join(f"{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
    else:
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
    return path_prefix(name, style) + serialized


def path_prefix(name: str, style: str) -> str:
    if style == 'label':
        return '.'
    if style == 'matrix':
        return f";{name}"
    return ''


def encode_path_value(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def serialize_path_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)


def build_query_string(parameters: List[Dict[str, Any]]) -> str:
    pairs: List[str] = []
    for parameter in parameters:
        append_serialized_parameter(pairs, parameter)
    return '&'.join(pairs)


def append_serialized_parameter(pairs: List[str], parameter: Dict[str, Any]) -> None:
    value = parameter.get('value')
    if value is None:
        return

    name = str(parameter.get('name') or '')
    allow_reserved = bool(parameter.get('allow_reserved'))
    content_type = parameter.get('content_type')
    if content_type:
        import json

        pairs.append(f"{encode_query_component(name)}={encode_query_value(json.dumps(value, separators=(',', ':')), allow_reserved)}")
        return

    style = str(parameter.get('style') or 'form')
    explode = bool(parameter.get('explode'))
    if style == 'deepObject':
        append_deep_object_parameter(pairs, name, value, allow_reserved)
        return
    if isinstance(value, (list, tuple)):
        append_array_parameter(pairs, name, value, style, explode, allow_reserved)
        return
    if isinstance(value, dict):
        append_object_parameter(pairs, name, value, style, explode, allow_reserved)
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")


def append_array_parameter(
    pairs: List[str],
    name: str,
    value: Any,
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    values = [serialize_primitive(item) for item in value if item is not None]
    if not values:
        return

    if style == 'form' and explode:
        for item in values:
            pairs.append(f"{encode_query_component(name)}={encode_query_value(item, allow_reserved)}")
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(','.join(values), allow_reserved)}")


def append_object_parameter(
    pairs: List[str],
    name: str,
    value: Dict[str, Any],
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return

    if style == 'form' and explode:
        for key, entry_value in entries:
            pairs.append(f"{encode_query_component(str(key))}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")
        return

    serialized = ','.join(
        item
        for key, entry_value in entries
        for item in (str(key), serialize_primitive(entry_value))
    )
    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialized, allow_reserved)}")


def append_deep_object_parameter(pairs: List[str], name: str, value: Any, allow_reserved: bool) -> None:
    if not isinstance(value, dict):
        pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")
        return

    for key, entry_value in value.items():
        if entry_value is None:
            continue
        pairs.append(f"{encode_query_component(f'{name}[{key}]')}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")


def serialize_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)


def encode_query_component(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def encode_query_value(value: str, allow_reserved: bool) -> str:
    from urllib.parse import quote

    return quote(value, safe=':/?#[]@!$&\'()*+,;=' if allow_reserved else '')

def build_request_headers(headers: Dict[str, Dict[str, Any]], cookies: Optional[Dict[str, Dict[str, Any]]] = None) -> Optional[Dict[str, str]]:
    request_headers: Dict[str, str] = {}
    for name, parameter in headers.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            request_headers[name] = serialized

    cookie_header = build_cookie_header(cookies or {})
    if cookie_header:
        request_headers['Cookie'] = (
            f"{request_headers['Cookie']}; {cookie_header}"
            if 'Cookie' in request_headers
            else cookie_header
        )

    return request_headers or None


def build_cookie_header(cookies: Dict[str, Dict[str, Any]]) -> Optional[str]:
    from urllib.parse import quote

    pairs: List[str] = []
    for name, parameter in cookies.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            pairs.append(f"{quote(str(name), safe='')}={quote(serialized, safe='')}")
    return '; '.join(pairs) if pairs else None


def serialize_parameter_value(parameter: Optional[Dict[str, Any]]) -> Optional[str]:
    value = None if parameter is None else parameter.get('value')
    if value is None:
        return None
    if parameter and parameter.get('content_type'):
        import json

        return json.dumps(value, separators=(',', ':'))
    if isinstance(value, (list, tuple)):
        return ','.join(serialize_header_primitive(item) for item in value if item is not None)
    if isinstance(value, dict):
        return serialize_header_object(value, bool(parameter and parameter.get('explode')))
    return serialize_header_primitive(value)


def serialize_header_object(value: Dict[str, Any], explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if explode:
        return ','.join(f"{key}={serialize_header_primitive(entry_value)}" for key, entry_value in entries)
    return ','.join(item for key, entry_value in entries for item in (str(key), serialize_header_primitive(entry_value)))


def serialize_header_primitive(value: Any) -> str:
    return str(value)


class CommerceApi:
    """commerce commerce API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.catalog = CommerceCatalogApi(client)
        self.inventory = CommerceInventoryApi(client)
        self.memberships = CommerceMembershipsApi(client)
        self.orders = CommerceOrdersApi(client)
        self.payments = CommercePaymentsApi(client)
        self.recharges = CommerceRechargesApi(client)
        self.shipments = CommerceShipmentsApi(client)


class CommerceCatalogApi:
    """commerce commerce.catalog API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.category_attributes = CommerceCatalogCategoryAttributesApi(client)
        self.category_seeds = CommerceCatalogCategorySeedsApi(client)
        self.products = CommerceCatalogProductsApi(client)
        self.skus = CommerceCatalogSkusApi(client)


class CommerceCatalogCategoryAttributesApi:
    """commerce commerce.catalog.category_attributes API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, category_id: Optional[str] = None, attribute_id: Optional[str] = None, status: Optional[str] = None, page: Optional[str] = None, page_size: Optional[str] = None) -> CatalogCategoryAttributesListResult:
        """List category attribute bindings"""
        query = build_query_string([
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'attribute_id', 'value': attribute_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/category_attributes", query))

    def create(self, body: CommerceProductCategoryAttributeMutationRequest, idempotency_key: str) -> CatalogCategoryAttributesCreateResult:
        """Create category attribute binding"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/category_attributes", json=body, headers=request_headers)

    def delete(self, binding_id: str) -> CatalogCategoryAttributesDeleteResult:
        """Delete category attribute binding"""
        return self._client.delete(f"/backend/v3/api/catalog/category_attributes/{serialize_path_parameter(binding_id, {'name': 'bindingId', 'style': 'simple', 'explode': False})}")

    def update(self, binding_id: str, body: CommerceProductCategoryAttributeMutationRequest, idempotency_key: str) -> CatalogCategoryAttributesUpdateResult:
        """Update category attribute binding"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/catalog/category_attributes/{serialize_path_parameter(binding_id, {'name': 'bindingId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceCatalogCategorySeedsApi:
    """commerce commerce.catalog.category_seeds API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceCategorySeedInitializeRequest, idempotency_key: str) -> CatalogCategorySeedsCreateResult:
        """Initialize admin category seed datasets"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/category_seeds/initialize", json=body, headers=request_headers)

class CommerceCatalogProductsApi:
    """commerce commerce.catalog.products API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, product_id: str) -> CatalogProductsDeleteResult:
        """Delete product SPU"""
        return self._client.delete(f"/backend/v3/api/catalog/products/{serialize_path_parameter(product_id, {'name': 'productId', 'style': 'simple', 'explode': False})}")

class CommerceCatalogSkusApi:
    """commerce commerce.catalog.skus API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, sku_id: str) -> CatalogSkusDeleteResult:
        """Delete product SKU"""
        return self._client.delete(f"/backend/v3/api/catalog/skus/{serialize_path_parameter(sku_id, {'name': 'skuId', 'style': 'simple', 'explode': False})}")

class CommerceInventoryApi:
    """commerce commerce.inventory API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.stocks = CommerceInventoryStocksApi(client)


class CommerceInventoryStocksApi:
    """commerce commerce.inventory.stocks API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, stock_id: str, body: CommerceInventoryStockUpdateRequest, idempotency_key: str) -> InventoryStocksUpdateResult:
        """Update inventory stock"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/inventory/stocks/{serialize_path_parameter(stock_id, {'name': 'stockId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceMembershipsApi:
    """commerce commerce.memberships API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.members = CommerceMembershipsMembersApi(client)
        self.package_groups = CommerceMembershipsPackageGroupsApi(client)
        self.packages = CommerceMembershipsPackagesApi(client)
        self.plans = CommerceMembershipsPlansApi(client)


class CommerceMembershipsMembersApi:
    """commerce commerce.memberships.members API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = CommerceMembershipsMembersStatusApi(client)


class CommerceMembershipsMembersStatusApi:
    """commerce commerce.memberships.members.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, membership_id: str, body: CommerceMembershipMemberStatusRequest, idempotency_key: str) -> MembershipsMembersStatusUpdateResult:
        """Memberships Members Status Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/memberships/members/{serialize_path_parameter(membership_id, {'name': 'membershipId', 'style': 'simple', 'explode': False})}/status", json=body, headers=request_headers)

class CommerceMembershipsPackageGroupsApi:
    """commerce commerce.memberships.package_groups API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, package_group_id: str, body: CommerceMembershipPackageGroupMutationRequest, idempotency_key: str) -> MembershipsPackageGroupsUpdateResult:
        """Memberships Package Groups Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/package_groups/{serialize_path_parameter(package_group_id, {'name': 'packageGroupId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceMembershipsPackagesApi:
    """commerce commerce.memberships.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, package_id: str, body: CommerceMembershipPackageMutationRequest, idempotency_key: str) -> MembershipsPackagesUpdateResult:
        """Memberships Packages Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceMembershipsPlansApi:
    """commerce commerce.memberships.plans API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, plan_id: str, body: CommerceMembershipPlanMutationRequest, idempotency_key: str) -> MembershipsPlansUpdateResult:
        """Memberships Plans Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/plans/{serialize_path_parameter(plan_id, {'name': 'planId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceOrdersApi:
    """commerce commerce.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, order_id: str) -> OrdersRetrieveResult:
        """Orders Retrieve"""
        return self._client.get(f"/backend/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}")

class CommercePaymentsApi:
    """commerce commerce.payments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.provider_accounts = CommercePaymentsProviderAccountsApi(client)
        self.providers = CommercePaymentsProvidersApi(client)
        self.runtime = CommercePaymentsRuntimeApi(client)


class CommercePaymentsProviderAccountsApi:
    """commerce commerce.payments.provider_accounts API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = CommercePaymentsProviderAccountsStatusApi(client)


    def delete(self, provider_account_id: str) -> PaymentsProviderAccountsDeleteResult:
        """Payments Provider Accounts Delete"""
        return self._client.delete(f"/backend/v3/api/payments/provider_accounts/{serialize_path_parameter(provider_account_id, {'name': 'providerAccountId', 'style': 'simple', 'explode': False})}")

class CommercePaymentsProviderAccountsStatusApi:
    """commerce commerce.payments.provider_accounts.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, provider_account_id: str, body: CommercePaymentProviderAccountStatusUpdateRequest, idempotency_key: str) -> PaymentsProviderAccountsStatusUpdateResult:
        """Payments Provider Accounts Status Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/payments/provider_accounts/{serialize_path_parameter(provider_account_id, {'name': 'providerAccountId', 'style': 'simple', 'explode': False})}/status", json=body, headers=request_headers)

class CommercePaymentsProvidersApi:
    """commerce commerce.payments.providers API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[str] = None, page_size: Optional[str] = None, status: Optional[str] = None) -> PaymentsProvidersListResult:
        """Payments Providers List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/providers", query))

class CommercePaymentsRuntimeApi:
    """commerce commerce.payments.runtime API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.snapshot = CommercePaymentsRuntimeSnapshotApi(client)


class CommercePaymentsRuntimeSnapshotApi:
    """commerce commerce.payments.runtime.snapshot API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, environment: Optional[str] = None) -> PaymentsRuntimeSnapshotRetrieveResult:
        """Payments Runtime Snapshot Retrieve"""
        query = build_query_string([
            {'name': 'environment', 'value': environment, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/runtime/snapshot", query))

class CommerceRechargesApi:
    """commerce commerce.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.packages = CommerceRechargesPackagesApi(client)
        self.settings = CommerceRechargesSettingsApi(client)


class CommerceRechargesPackagesApi:
    """commerce commerce.recharges.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, package_id: str) -> RechargesPackagesDeleteResult:
        """Recharges Packages Delete"""
        return self._client.delete(f"/backend/v3/api/recharges/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}")

class CommerceRechargesSettingsApi:
    """commerce commerce.recharges.settings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> RechargesSettingsRetrieveResult:
        """Recharges Settings Retrieve"""
        return self._client.get(f"/backend/v3/api/recharges/settings")

    def update(self, body: CommerceRechargeSettingsUpdateRequest) -> RechargesSettingsUpdateResult:
        """Recharges Settings Update"""
        return self._client.put(f"/backend/v3/api/recharges/settings", json=body)

class CommerceShipmentsApi:
    """commerce commerce.shipments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.tracking_events = CommerceShipmentsTrackingEventsApi(client)


class CommerceShipmentsTrackingEventsApi:
    """commerce commerce.shipments.tracking_events API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, shipment_id: str, page: Optional[str] = None, page_size: Optional[str] = None, status: Optional[str] = None) -> ShipmentsTrackingEventsListResult:
        """Shipments Tracking Events List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/shipments/{serialize_path_parameter(shipment_id, {'name': 'shipmentId', 'style': 'simple', 'explode': False})}/tracking_events", query))
