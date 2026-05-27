from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AuditCommerceEventsListResult, CatalogAttributesCreateResult, CatalogAttributesListResult, CatalogCategoriesCreateResult, CatalogCategoriesDeleteResult, CatalogCategoriesListResult, CatalogCategoriesUpdateResult, CatalogPriceListsCreateResult, CatalogPriceListsListResult, CatalogProductsCreateResult, CatalogProductsListResult, CatalogProductsUpdateResult, CatalogSkusCreateResult, CatalogSkusListResult, CatalogSkusUpdateResult, CommerceInventoryStockUpdateRequest, CommerceMembershipMemberStatusRequest, CommerceMembershipPackageGroupMutationRequest, CommerceMembershipPackageMutationRequest, CommerceMembershipPlanMutationRequest, CommercePaymentProviderAccountMutationRequest, CommercePriceListMutationRequest, CommerceProductAttributeMutationRequest, CommerceProductCategoryMutationRequest, CommerceProductSkuMutationRequest, CommerceProductSpuMutationRequest, CommerceRechargePackageMutationRequest, CommerceReportsOrderRevenueListResult, CommerceReportsPaymentReconciliationRetrieveResult, CommerceReportsRefundsListResult, CommerceStandardCommandRequest, FulfillmentsListResult, InventoryLedgerEntriesListResult, InventoryReservationsListResult, InventoryStocksListResult, InventoryStocksUpdateResult, InvoicesListResult, InvoicesRetrieveResult, InvoicesTitlesListResult, MembershipsEntitlementsListResult, MembershipsMembersListResult, MembershipsMembersStatusUpdateResult, MembershipsPackageGroupsCreateResult, MembershipsPackageGroupsDeleteResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsUpdateResult, MembershipsPackagesCreateResult, MembershipsPackagesDeleteResult, MembershipsPackagesListResult, MembershipsPackagesUpdateResult, MembershipsPlansCreateResult, MembershipsPlansDeleteResult, MembershipsPlansListResult, MembershipsPlansUpdateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsListResult, PaymentsChannelsListResult, PaymentsIntentsListResult, PaymentsMethodsListResult, PaymentsProviderAccountsCreateResult, PaymentsProviderAccountsListResult, PaymentsProvidersListResult, PaymentsReconciliationRunsListResult, PaymentsRouteRulesListResult, PaymentsWebhookEventsListResult, RechargesOrdersListResult, RechargesPackagesCreateResult, RechargesPackagesDeleteResult, RechargesPackagesListResult, RechargesPackagesUpdateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsListResult, ShipmentsTrackingEventsListResult, WalletAccountsListResult, WalletAdjustmentsCreateResult, WalletExchangeRulesListResult, WalletLedgerEntriesListResult

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
        self.audit = CommerceAuditApi(client)
        self.catalog = CommerceCatalogApi(client)
        self.commerce_reports = CommerceCommerceReportsApi(client)
        self.fulfillments = CommerceFulfillmentsApi(client)
        self.inventory = CommerceInventoryApi(client)
        self.invoices = CommerceInvoicesApi(client)
        self.memberships = CommerceMembershipsApi(client)
        self.orders = CommerceOrdersApi(client)
        self.payments = CommercePaymentsApi(client)
        self.recharges = CommerceRechargesApi(client)
        self.refunds = CommerceRefundsApi(client)
        self.shipments = CommerceShipmentsApi(client)
        self.wallet = CommerceWalletApi(client)


class CommerceAuditApi:
    """commerce commerce.audit API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.commerce_events = CommerceAuditCommerceEventsApi(client)


class CommerceAuditCommerceEventsApi:
    """commerce commerce.audit.commerce_events API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> AuditCommerceEventsListResult:
        """Audit Commerce Events List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/audit/commerce_events", query))

class CommerceCatalogApi:
    """commerce commerce.catalog API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.attributes = CommerceCatalogAttributesApi(client)
        self.categories = CommerceCatalogCategoriesApi(client)
        self.price_lists = CommerceCatalogPriceListsApi(client)
        self.products = CommerceCatalogProductsApi(client)
        self.skus = CommerceCatalogSkusApi(client)


class CommerceCatalogAttributesApi:
    """commerce commerce.catalog.attributes API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, scope: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CatalogAttributesListResult:
        """List product attributes"""
        query = build_query_string([
            {'name': 'scope', 'value': scope, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/attributes", query))

    def create(self, body: CommerceProductAttributeMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogAttributesCreateResult:
        """Create product attribute"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/attributes", json=body, headers=request_headers)

class CommerceCatalogCategoriesApi:
    """commerce commerce.catalog.categories API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, parent_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CatalogCategoriesListResult:
        """List product categories for admin management"""
        query = build_query_string([
            {'name': 'parent_id', 'value': parent_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/categories", query))

    def create(self, body: CommerceProductCategoryMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogCategoriesCreateResult:
        """Create product category"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/categories", json=body, headers=request_headers)

    def delete(self, category_id: str, x_request_id: Optional[str] = None) -> CatalogCategoriesDeleteResult:
        """Delete product category"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/catalog/categories/{serialize_path_parameter(category_id, {'name': 'categoryId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, category_id: str, body: CommerceProductCategoryMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogCategoriesUpdateResult:
        """Update product category"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/catalog/categories/{serialize_path_parameter(category_id, {'name': 'categoryId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceCatalogPriceListsApi:
    """commerce commerce.catalog.price_lists API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, currency_code: Optional[str] = None, market_code: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CatalogPriceListsListResult:
        """List product price lists"""
        query = build_query_string([
            {'name': 'currency_code', 'value': currency_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'market_code', 'value': market_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/price_lists", query))

    def create(self, body: CommercePriceListMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogPriceListsCreateResult:
        """Create product price list"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/price_lists", json=body, headers=request_headers)

class CommerceCatalogProductsApi:
    """commerce commerce.catalog.products API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, q: Optional[str] = None, category_id: Optional[str] = None, product_type: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, sort: Optional[str] = None) -> CatalogProductsListResult:
        """List products for admin management"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'product_type', 'value': product_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'sort', 'value': sort, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/products", query))

    def create(self, body: CommerceProductSpuMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogProductsCreateResult:
        """Create product SPU"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/products", json=body, headers=request_headers)

    def update(self, product_id: str, body: CommerceProductSpuMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogProductsUpdateResult:
        """Update product SPU"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/catalog/products/{serialize_path_parameter(product_id, {'name': 'productId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceCatalogSkusApi:
    """commerce commerce.catalog.skus API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, product_id: Optional[str] = None, fulfillment_type: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CatalogSkusListResult:
        """List product SKUs for admin management"""
        query = build_query_string([
            {'name': 'product_id', 'value': product_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'fulfillment_type', 'value': fulfillment_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/catalog/skus", query))

    def create(self, body: CommerceProductSkuMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogSkusCreateResult:
        """Create product SKU"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/catalog/skus", json=body, headers=request_headers)

    def update(self, sku_id: str, body: CommerceProductSkuMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CatalogSkusUpdateResult:
        """Update product SKU"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/catalog/skus/{serialize_path_parameter(sku_id, {'name': 'skuId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceCommerceReportsApi:
    """commerce commerce.commerce_reports API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.order_revenue = CommerceCommerceReportsOrderRevenueApi(client)
        self.payment_reconciliation = CommerceCommerceReportsPaymentReconciliationApi(client)
        self.refunds = CommerceCommerceReportsRefundsApi(client)


class CommerceCommerceReportsOrderRevenueApi:
    """commerce commerce.commerce_reports.order_revenue API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> CommerceReportsOrderRevenueListResult:
        """Commerce Reports Order Revenue List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/commerce_reports/order_revenue", query))

class CommerceCommerceReportsPaymentReconciliationApi:
    """commerce commerce.commerce_reports.payment_reconciliation API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> CommerceReportsPaymentReconciliationRetrieveResult:
        """Commerce Reports Payment Reconciliation Retrieve"""
        return self._client.get(f"/backend/v3/api/commerce_reports/payment_reconciliation")

class CommerceCommerceReportsRefundsApi:
    """commerce commerce.commerce_reports.refunds API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> CommerceReportsRefundsListResult:
        """Commerce Reports Refunds List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/commerce_reports/refunds", query))

class CommerceFulfillmentsApi:
    """commerce commerce.fulfillments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> FulfillmentsListResult:
        """Fulfillments List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/fulfillments", query))

class CommerceInventoryApi:
    """commerce commerce.inventory API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.ledger_entries = CommerceInventoryLedgerEntriesApi(client)
        self.reservations = CommerceInventoryReservationsApi(client)
        self.stocks = CommerceInventoryStocksApi(client)


class CommerceInventoryLedgerEntriesApi:
    """commerce commerce.inventory.ledger_entries API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, sku_id: Optional[str] = None, warehouse_id: Optional[str] = None, source_type: Optional[str] = None, source_id: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> InventoryLedgerEntriesListResult:
        """List inventory ledger entries"""
        query = build_query_string([
            {'name': 'sku_id', 'value': sku_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'warehouse_id', 'value': warehouse_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'source_type', 'value': source_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'source_id', 'value': source_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/inventory/ledger_entries", query))

class CommerceInventoryReservationsApi:
    """commerce commerce.inventory.reservations API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, sku_id: Optional[str] = None, order_id: Optional[str] = None, checkout_session_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> InventoryReservationsListResult:
        """List inventory reservations"""
        query = build_query_string([
            {'name': 'sku_id', 'value': sku_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'order_id', 'value': order_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'checkout_session_id', 'value': checkout_session_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/inventory/reservations", query))

class CommerceInventoryStocksApi:
    """commerce commerce.inventory.stocks API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, sku_id: Optional[str] = None, warehouse_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> InventoryStocksListResult:
        """List inventory stock records"""
        query = build_query_string([
            {'name': 'sku_id', 'value': sku_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'warehouse_id', 'value': warehouse_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/inventory/stocks", query))

    def update(self, stock_id: str, body: CommerceInventoryStockUpdateRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> InventoryStocksUpdateResult:
        """Update inventory stock"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/inventory/stocks/{serialize_path_parameter(stock_id, {'name': 'stockId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceInvoicesApi:
    """commerce commerce.invoices API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.titles = CommerceInvoicesTitlesApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> InvoicesListResult:
        """Invoices List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/invoices", query))

    def retrieve(self, invoice_id: str) -> InvoicesRetrieveResult:
        """Invoices Retrieve"""
        return self._client.get(f"/backend/v3/api/invoices/{serialize_path_parameter(invoice_id, {'name': 'invoiceId', 'style': 'simple', 'explode': False})}")

class CommerceInvoicesTitlesApi:
    """commerce commerce.invoices.titles API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> InvoicesTitlesListResult:
        """Invoices Titles List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/invoices/titles", query))

class CommerceMembershipsApi:
    """commerce commerce.memberships API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.entitlements = CommerceMembershipsEntitlementsApi(client)
        self.members = CommerceMembershipsMembersApi(client)
        self.package_groups = CommerceMembershipsPackageGroupsApi(client)
        self.packages = CommerceMembershipsPackagesApi(client)
        self.plans = CommerceMembershipsPlansApi(client)


class CommerceMembershipsEntitlementsApi:
    """commerce commerce.memberships.entitlements API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, plan_id: Optional[str] = None, membership_id: Optional[str] = None, status: Optional[str] = None) -> MembershipsEntitlementsListResult:
        """Memberships Entitlements List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'membership_id', 'value': membership_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/memberships/entitlements", query))

class CommerceMembershipsMembersApi:
    """commerce commerce.memberships.members API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = CommerceMembershipsMembersStatusApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None, user_id: Optional[str] = None, plan_id: Optional[str] = None, status: Optional[str] = None) -> MembershipsMembersListResult:
        """Memberships Members List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/memberships/members", query))

class CommerceMembershipsMembersStatusApi:
    """commerce commerce.memberships.members.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, membership_id: str, body: CommerceMembershipMemberStatusRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsMembersStatusUpdateResult:
        """Memberships Members Status Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/memberships/members/{serialize_path_parameter(membership_id, {'name': 'membershipId', 'style': 'simple', 'explode': False})}/status", json=body, headers=request_headers)

class CommerceMembershipsPackageGroupsApi:
    """commerce commerce.memberships.package_groups API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> MembershipsPackageGroupsListResult:
        """Memberships Package Groups List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/memberships/package_groups", query))

    def create(self, body: CommerceMembershipPackageGroupMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPackageGroupsCreateResult:
        """Memberships Package Groups Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/memberships/package_groups", json=body, headers=request_headers)

    def delete(self, package_group_id: str, x_request_id: Optional[str] = None) -> MembershipsPackageGroupsDeleteResult:
        """Memberships Package Groups Delete"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/memberships/package_groups/{serialize_path_parameter(package_group_id, {'name': 'packageGroupId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, package_group_id: str, body: CommerceMembershipPackageGroupMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPackageGroupsUpdateResult:
        """Memberships Package Groups Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/package_groups/{serialize_path_parameter(package_group_id, {'name': 'packageGroupId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceMembershipsPackagesApi:
    """commerce commerce.memberships.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, package_group_id: Optional[str] = None, plan_id: Optional[str] = None, status: Optional[str] = None) -> MembershipsPackagesListResult:
        """Memberships Packages List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'package_group_id', 'value': package_group_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/memberships/packages", query))

    def create(self, body: CommerceMembershipPackageMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPackagesCreateResult:
        """Memberships Packages Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/memberships/packages", json=body, headers=request_headers)

    def delete(self, package_id: str, x_request_id: Optional[str] = None) -> MembershipsPackagesDeleteResult:
        """Memberships Packages Delete"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/memberships/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, package_id: str, body: CommerceMembershipPackageMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPackagesUpdateResult:
        """Memberships Packages Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceMembershipsPlansApi:
    """commerce commerce.memberships.plans API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> MembershipsPlansListResult:
        """Memberships Plans List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/memberships/plans", query))

    def create(self, body: CommerceMembershipPlanMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPlansCreateResult:
        """Memberships Plans Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/memberships/plans", json=body, headers=request_headers)

    def delete(self, plan_id: str, x_request_id: Optional[str] = None) -> MembershipsPlansDeleteResult:
        """Memberships Plans Delete"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/memberships/plans/{serialize_path_parameter(plan_id, {'name': 'planId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, plan_id: str, body: CommerceMembershipPlanMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> MembershipsPlansUpdateResult:
        """Memberships Plans Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/memberships/plans/{serialize_path_parameter(plan_id, {'name': 'planId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceOrdersApi:
    """commerce commerce.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.events = CommerceOrdersEventsApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> OrdersListResult:
        """Orders List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/orders", query))

    def retrieve(self, order_id: str) -> OrdersRetrieveResult:
        """Orders Retrieve"""
        return self._client.get(f"/backend/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}")

class CommerceOrdersEventsApi:
    """commerce commerce.orders.events API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, order_id: str, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> OrdersEventsListResult:
        """Orders Events List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}/events", query))

class CommercePaymentsApi:
    """commerce commerce.payments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.attempts = CommercePaymentsAttemptsApi(client)
        self.channels = CommercePaymentsChannelsApi(client)
        self.intents = CommercePaymentsIntentsApi(client)
        self.methods = CommercePaymentsMethodsApi(client)
        self.provider_accounts = CommercePaymentsProviderAccountsApi(client)
        self.providers = CommercePaymentsProvidersApi(client)
        self.reconciliation_runs = CommercePaymentsReconciliationRunsApi(client)
        self.route_rules = CommercePaymentsRouteRulesApi(client)
        self.webhook_events = CommercePaymentsWebhookEventsApi(client)


class CommercePaymentsAttemptsApi:
    """commerce commerce.payments.attempts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, intent_id: Optional[str] = None, provider_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsAttemptsListResult:
        """Payments Attempts List"""
        query = build_query_string([
            {'name': 'intent_id', 'value': intent_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'provider_code', 'value': provider_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/attempts", query))

class CommercePaymentsChannelsApi:
    """commerce commerce.payments.channels API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, provider_account_id: Optional[str] = None, method_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsChannelsListResult:
        """Payments Channels List"""
        query = build_query_string([
            {'name': 'provider_account_id', 'value': provider_account_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'method_code', 'value': method_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/channels", query))

class CommercePaymentsIntentsApi:
    """commerce commerce.payments.intents API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, order_id: Optional[str] = None, provider_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsIntentsListResult:
        """Payments Intents List"""
        query = build_query_string([
            {'name': 'order_id', 'value': order_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'provider_code', 'value': provider_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/intents", query))

class CommercePaymentsMethodsApi:
    """commerce commerce.payments.methods API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsMethodsListResult:
        """Payments Methods List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/methods", query))

class CommercePaymentsProviderAccountsApi:
    """commerce commerce.payments.provider_accounts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, provider_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsProviderAccountsListResult:
        """Payments Provider Accounts List"""
        query = build_query_string([
            {'name': 'provider_code', 'value': provider_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/provider_accounts", query))

    def create(self, body: CommercePaymentProviderAccountMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> PaymentsProviderAccountsCreateResult:
        """Payments Provider Accounts Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/payments/provider_accounts", json=body, headers=request_headers)

class CommercePaymentsProvidersApi:
    """commerce commerce.payments.providers API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsProvidersListResult:
        """Payments Providers List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/providers", query))

class CommercePaymentsReconciliationRunsApi:
    """commerce commerce.payments.reconciliation_runs API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, provider_code: Optional[str] = None, business_date: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsReconciliationRunsListResult:
        """Payments Reconciliation Runs List"""
        query = build_query_string([
            {'name': 'provider_code', 'value': provider_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'business_date', 'value': business_date, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/reconciliation_runs", query))

class CommercePaymentsRouteRulesApi:
    """commerce commerce.payments.route_rules API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, method_code: Optional[str] = None, country_code: Optional[str] = None, currency_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsRouteRulesListResult:
        """Payments Route Rules List"""
        query = build_query_string([
            {'name': 'method_code', 'value': method_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'country_code', 'value': country_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'currency_code', 'value': currency_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/route_rules", query))

class CommercePaymentsWebhookEventsApi:
    """commerce commerce.payments.webhook_events API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, provider_code: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> PaymentsWebhookEventsListResult:
        """Payments Webhook Events List"""
        query = build_query_string([
            {'name': 'provider_code', 'value': provider_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/payments/webhook_events", query))

class CommerceRechargesApi:
    """commerce commerce.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.orders = CommerceRechargesOrdersApi(client)
        self.packages = CommerceRechargesPackagesApi(client)


class CommerceRechargesOrdersApi:
    """commerce commerce.recharges.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> RechargesOrdersListResult:
        """Recharges Orders List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/recharges/orders", query))

class CommerceRechargesPackagesApi:
    """commerce commerce.recharges.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> RechargesPackagesListResult:
        """Recharges Packages List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/recharges/packages", query))

    def create(self, body: CommerceRechargePackageMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> RechargesPackagesCreateResult:
        """Recharges Packages Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/recharges/packages", json=body, headers=request_headers)

    def delete(self, package_id: str, x_request_id: Optional[str] = None) -> RechargesPackagesDeleteResult:
        """Recharges Packages Delete"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/recharges/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, package_id: str, body: CommerceRechargePackageMutationRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> RechargesPackagesUpdateResult:
        """Recharges Packages Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/recharges/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceRefundsApi:
    """commerce commerce.refunds API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> RefundsListResult:
        """Refunds List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/refunds", query))

    def retrieve(self, refund_id: str) -> RefundsRetrieveResult:
        """Refunds Retrieve"""
        return self._client.get(f"/backend/v3/api/refunds/{serialize_path_parameter(refund_id, {'name': 'refundId', 'style': 'simple', 'explode': False})}")

class CommerceShipmentsApi:
    """commerce commerce.shipments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.tracking_events = CommerceShipmentsTrackingEventsApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> ShipmentsListResult:
        """Shipments List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/shipments", query))

class CommerceShipmentsTrackingEventsApi:
    """commerce commerce.shipments.tracking_events API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, shipment_id: str, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> ShipmentsTrackingEventsListResult:
        """Shipments Tracking Events List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/shipments/{serialize_path_parameter(shipment_id, {'name': 'shipmentId', 'style': 'simple', 'explode': False})}/tracking_events", query))

class CommerceWalletApi:
    """commerce commerce.wallet API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.accounts = CommerceWalletAccountsApi(client)
        self.adjustments = CommerceWalletAdjustmentsApi(client)
        self.exchange_rules = CommerceWalletExchangeRulesApi(client)
        self.ledger_entries = CommerceWalletLedgerEntriesApi(client)


class CommerceWalletAccountsApi:
    """commerce commerce.wallet.accounts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> WalletAccountsListResult:
        """Wallet Accounts List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/wallet/accounts", query))

class CommerceWalletAdjustmentsApi:
    """commerce commerce.wallet.adjustments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> WalletAdjustmentsCreateResult:
        """Wallet Adjustments Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/wallet/adjustments", json=body, headers=request_headers)

class CommerceWalletExchangeRulesApi:
    """commerce commerce.wallet.exchange_rules API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> WalletExchangeRulesListResult:
        """Wallet Exchange Rules List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/wallet/exchange_rules", query))

class CommerceWalletLedgerEntriesApi:
    """commerce commerce.wallet.ledger_entries API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> WalletLedgerEntriesListResult:
        """Wallet Ledger Entries List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/wallet/ledger_entries", query))
