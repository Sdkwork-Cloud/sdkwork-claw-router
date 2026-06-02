from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AccountsCurrentSummaryRetrieveResult, AddressesCreateResult, AddressesDefaultSelectionCreateResult, AddressesDeleteResult, AddressesListResult, AddressesUpdateResult, BillingHistoryListResult, CartCurrentRetrieveResult, CartItemsCreateResult, CartItemsDeleteResult, CartItemsUpdateResult, CatalogCategoriesListResult, CatalogProductsListResult, CatalogProductsRetrieveResult, CatalogSkusRetrieveResult, CheckoutSessionsCreateResult, CheckoutSessionsOrdersCreateResult, CheckoutSessionsQuotesCreateResult, CheckoutSessionsRetrieveResult, CommerceMembershipPurchaseRequest, CommercePaymentAttemptCreateRequest, CommercePaymentIntentCreateRequest, CommerceRechargeOrderCreateRequest, CommerceStandardCommandRequest, FulfillmentsListResult, FulfillmentsRetrieveResult, InvoicesCreateResult, InvoicesListResult, InvoicesRetrieveResult, MembershipsBenefitsListResult, MembershipsCurrentRetrieveResult, MembershipsCurrentStatusRetrieveResult, MembershipsPackageGroupsListResult, MembershipsPackageGroupsPackagesListResult, MembershipsPackageGroupsRetrieveResult, MembershipsPackagesListResult, MembershipsPackagesRetrieveResult, MembershipsPlansListResult, MembershipsPointsBalanceRetrieveResult, MembershipsPointsDailyRewardsCreateRequest, MembershipsPointsDailyRewardsCreateResult, MembershipsPointsDailyRewardsStatusRetrieveResult, MembershipsPointsHistoryListResult, MembershipsPrivilegesSpeedUpsCreateRequest, MembershipsPrivilegesSpeedUpsCreateResult, MembershipsPrivilegesUsageRetrieveResult, MembershipsPurchasesCreateResult, MembershipsPurchasesRenewResult, MembershipsPurchasesUpgradeResult, OrdersCancellationsCreateResult, OrdersEventsListResult, OrdersListResult, OrdersRetrieveResult, PaymentsAttemptsRetrieveResult, PaymentsIntentsAttemptsCreateResult, PaymentsIntentsCreateResult, PaymentsIntentsRetrieveResult, PaymentsMethodsListResult, RechargesOrdersCreateResult, RechargesOrdersRetrieveResult, RechargesPackagesListResult, RechargesSettingsRetrieveResult, RefundsCreateResult, RefundsListResult, RefundsRetrieveResult, ShipmentsRetrieveResult, WalletAccountsListResult, WalletExchangeRateRetrieveResult, WalletLedgerEntriesListResult, WalletOverviewRetrieveResult, WalletPointsExchangeRulesListResult, WalletTokensRetrieveResult

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
        self.accounts = CommerceAccountsApi(client)
        self.addresses = CommerceAddressesApi(client)
        self.billing = CommerceBillingApi(client)
        self.cart = CommerceCartApi(client)
        self.catalog = CommerceCatalogApi(client)
        self.checkout = CommerceCheckoutApi(client)
        self.fulfillments = CommerceFulfillmentsApi(client)
        self.invoices = CommerceInvoicesApi(client)
        self.memberships = CommerceMembershipsApi(client)
        self.orders = CommerceOrdersApi(client)
        self.payments = CommercePaymentsApi(client)
        self.recharges = CommerceRechargesApi(client)
        self.refunds = CommerceRefundsApi(client)
        self.shipments = CommerceShipmentsApi(client)
        self.wallet = CommerceWalletApi(client)


class CommerceAccountsApi:
    """commerce commerce.accounts API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = CommerceAccountsCurrentApi(client)


class CommerceAccountsCurrentApi:
    """commerce commerce.accounts.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.summary = CommerceAccountsCurrentSummaryApi(client)


class CommerceAccountsCurrentSummaryApi:
    """commerce commerce.accounts.current.summary API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> AccountsCurrentSummaryRetrieveResult:
        """Accounts Current Summary Retrieve"""
        return self._client.get(f"/app/v3/api/accounts/current/summary")

class CommerceAddressesApi:
    """commerce commerce.addresses API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.default_selection = CommerceAddressesDefaultSelectionApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> AddressesListResult:
        """Addresses List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/addresses", query))

    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str) -> AddressesCreateResult:
        """Addresses Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/addresses", json=body, headers=request_headers)

    def delete(self, address_id: str, idempotency_key: str) -> AddressesDeleteResult:
        """Addresses Delete"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/app/v3/api/addresses/{serialize_path_parameter(address_id, {'name': 'addressId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, address_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> AddressesUpdateResult:
        """Addresses Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/app/v3/api/addresses/{serialize_path_parameter(address_id, {'name': 'addressId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceAddressesDefaultSelectionApi:
    """commerce commerce.addresses.default_selection API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, address_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> AddressesDefaultSelectionCreateResult:
        """Addresses Default Selection Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/addresses/{serialize_path_parameter(address_id, {'name': 'addressId', 'style': 'simple', 'explode': False})}/default_selection", json=body, headers=request_headers)

class CommerceBillingApi:
    """commerce commerce.billing API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.history = CommerceBillingHistoryApi(client)


class CommerceBillingHistoryApi:
    """commerce commerce.billing.history API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, type: Optional[str] = None, status: Optional[str] = None) -> BillingHistoryListResult:
        """Billing History List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'type', 'value': type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/history", query))

class CommerceCartApi:
    """commerce commerce.cart API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = CommerceCartCurrentApi(client)
        self.items = CommerceCartItemsApi(client)


class CommerceCartCurrentApi:
    """commerce commerce.cart.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> CartCurrentRetrieveResult:
        """Cart Current Retrieve"""
        return self._client.get(f"/app/v3/api/cart/current")

class CommerceCartItemsApi:
    """commerce commerce.cart.items API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str) -> CartItemsCreateResult:
        """Cart Items Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/cart/items", json=body, headers=request_headers)

    def delete(self, cart_item_id: str, idempotency_key: str) -> CartItemsDeleteResult:
        """Cart Items Delete"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/app/v3/api/cart/items/{serialize_path_parameter(cart_item_id, {'name': 'cartItemId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def update(self, cart_item_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> CartItemsUpdateResult:
        """Cart Items Update"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/app/v3/api/cart/items/{serialize_path_parameter(cart_item_id, {'name': 'cartItemId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class CommerceCatalogApi:
    """commerce commerce.catalog API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.categories = CommerceCatalogCategoriesApi(client)
        self.products = CommerceCatalogProductsApi(client)
        self.skus = CommerceCatalogSkusApi(client)


class CommerceCatalogCategoriesApi:
    """commerce commerce.catalog.categories API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, parent_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CatalogCategoriesListResult:
        """List visible product categories"""
        query = build_query_string([
            {'name': 'parent_id', 'value': parent_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/catalog/categories", query))

class CommerceCatalogProductsApi:
    """commerce commerce.catalog.products API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, q: Optional[str] = None, category_id: Optional[str] = None, product_type: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, sort: Optional[str] = None) -> CatalogProductsListResult:
        """List visible catalog products"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'product_type', 'value': product_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'sort', 'value': sort, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/catalog/products", query))

    def retrieve(self, product_id: str) -> CatalogProductsRetrieveResult:
        """Retrieve catalog product detail"""
        return self._client.get(f"/app/v3/api/catalog/products/{serialize_path_parameter(product_id, {'name': 'productId', 'style': 'simple', 'explode': False})}")

class CommerceCatalogSkusApi:
    """commerce commerce.catalog.skus API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, sku_id: str) -> CatalogSkusRetrieveResult:
        """Retrieve catalog SKU detail"""
        return self._client.get(f"/app/v3/api/catalog/skus/{serialize_path_parameter(sku_id, {'name': 'skuId', 'style': 'simple', 'explode': False})}")

class CommerceCheckoutApi:
    """commerce commerce.checkout API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.sessions = CommerceCheckoutSessionsApi(client)


class CommerceCheckoutSessionsApi:
    """commerce commerce.checkout.sessions API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.orders = CommerceCheckoutSessionsOrdersApi(client)
        self.quotes = CommerceCheckoutSessionsQuotesApi(client)


    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str) -> CheckoutSessionsCreateResult:
        """Checkout Sessions Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/checkout/sessions", json=body, headers=request_headers)

    def retrieve(self, checkout_session_id: str) -> CheckoutSessionsRetrieveResult:
        """Checkout Sessions Retrieve"""
        return self._client.get(f"/app/v3/api/checkout/sessions/{serialize_path_parameter(checkout_session_id, {'name': 'checkoutSessionId', 'style': 'simple', 'explode': False})}")

class CommerceCheckoutSessionsOrdersApi:
    """commerce commerce.checkout.sessions.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, checkout_session_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> CheckoutSessionsOrdersCreateResult:
        """Checkout Sessions Orders Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/checkout/sessions/{serialize_path_parameter(checkout_session_id, {'name': 'checkoutSessionId', 'style': 'simple', 'explode': False})}/orders", json=body, headers=request_headers)

class CommerceCheckoutSessionsQuotesApi:
    """commerce commerce.checkout.sessions.quotes API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, checkout_session_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> CheckoutSessionsQuotesCreateResult:
        """Checkout Sessions Quotes Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/checkout/sessions/{serialize_path_parameter(checkout_session_id, {'name': 'checkoutSessionId', 'style': 'simple', 'explode': False})}/quotes", json=body, headers=request_headers)

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
        return self._client.get(_append_query_string(f"/app/v3/api/fulfillments", query))

    def retrieve(self, fulfillment_id: str) -> FulfillmentsRetrieveResult:
        """Fulfillments Retrieve"""
        return self._client.get(f"/app/v3/api/fulfillments/{serialize_path_parameter(fulfillment_id, {'name': 'fulfillmentId', 'style': 'simple', 'explode': False})}")

class CommerceInvoicesApi:
    """commerce commerce.invoices API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> InvoicesListResult:
        """Invoices List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/invoices", query))

    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str) -> InvoicesCreateResult:
        """Invoices Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/invoices", json=body, headers=request_headers)

    def retrieve(self, invoice_id: str) -> InvoicesRetrieveResult:
        """Invoices Retrieve"""
        return self._client.get(f"/app/v3/api/invoices/{serialize_path_parameter(invoice_id, {'name': 'invoiceId', 'style': 'simple', 'explode': False})}")

class CommerceMembershipsApi:
    """commerce commerce.memberships API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.benefits = CommerceMembershipsBenefitsApi(client)
        self.current = CommerceMembershipsCurrentApi(client)
        self.package_groups = CommerceMembershipsPackageGroupsApi(client)
        self.packages = CommerceMembershipsPackagesApi(client)
        self.plans = CommerceMembershipsPlansApi(client)
        self.points = CommerceMembershipsPointsApi(client)
        self.privileges = CommerceMembershipsPrivilegesApi(client)
        self.purchases = CommerceMembershipsPurchasesApi(client)


class CommerceMembershipsBenefitsApi:
    """commerce commerce.memberships.benefits API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, plan_id: Optional[int] = None) -> MembershipsBenefitsListResult:
        """Memberships Benefits List"""
        query = build_query_string([
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/memberships/benefits", query))

class CommerceMembershipsCurrentApi:
    """commerce commerce.memberships.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = CommerceMembershipsCurrentStatusApi(client)


    def retrieve(self) -> MembershipsCurrentRetrieveResult:
        """Memberships Current Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/current")

class CommerceMembershipsCurrentStatusApi:
    """commerce commerce.memberships.current.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> MembershipsCurrentStatusRetrieveResult:
        """Memberships Current Status Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/current/status")

class CommerceMembershipsPackageGroupsApi:
    """commerce commerce.memberships.package_groups API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.packages = CommerceMembershipsPackageGroupsPackagesApi(client)


    def list(self, plan_id: Optional[int] = None, recommended_only: Optional[bool] = None) -> MembershipsPackageGroupsListResult:
        """Memberships Package Groups List"""
        query = build_query_string([
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'recommended_only', 'value': recommended_only, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/memberships/package_groups", query))

    def retrieve(self, package_group_id: str) -> MembershipsPackageGroupsRetrieveResult:
        """Memberships Package Groups Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/package_groups/{serialize_path_parameter(package_group_id, {'name': 'packageGroupId', 'style': 'simple', 'explode': False})}")

class CommerceMembershipsPackageGroupsPackagesApi:
    """commerce commerce.memberships.package_groups.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, package_group_id: str, plan_id: Optional[int] = None) -> MembershipsPackageGroupsPackagesListResult:
        """Memberships Package Groups Packages List"""
        query = build_query_string([
            {'name': 'plan_id', 'value': plan_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/memberships/package_groups/{serialize_path_parameter(package_group_id, {'name': 'packageGroupId', 'style': 'simple', 'explode': False})}/packages", query))

class CommerceMembershipsPackagesApi:
    """commerce commerce.memberships.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> MembershipsPackagesListResult:
        """Memberships Packages List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/memberships/packages", query))

    def retrieve(self, package_id: str) -> MembershipsPackagesRetrieveResult:
        """Memberships Packages Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}")

class CommerceMembershipsPlansApi:
    """commerce commerce.memberships.plans API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> MembershipsPlansListResult:
        """Memberships Plans List"""
        return self._client.get(f"/app/v3/api/memberships/plans")

class CommerceMembershipsPointsApi:
    """commerce commerce.memberships.points API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.balance = CommerceMembershipsPointsBalanceApi(client)
        self.daily_rewards = CommerceMembershipsPointsDailyRewardsApi(client)
        self.history = CommerceMembershipsPointsHistoryApi(client)


class CommerceMembershipsPointsBalanceApi:
    """commerce commerce.memberships.points.balance API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> MembershipsPointsBalanceRetrieveResult:
        """Memberships Points Balance Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/points/balance")

class CommerceMembershipsPointsDailyRewardsApi:
    """commerce commerce.memberships.points.daily_rewards API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = CommerceMembershipsPointsDailyRewardsStatusApi(client)


    def create(self, body: Optional[MembershipsPointsDailyRewardsCreateRequest] = None) -> MembershipsPointsDailyRewardsCreateResult:
        """Memberships Points Daily Rewards Create"""
        return self._client.post(f"/app/v3/api/memberships/points/daily_rewards", json=body)

class CommerceMembershipsPointsDailyRewardsStatusApi:
    """commerce commerce.memberships.points.daily_rewards.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> MembershipsPointsDailyRewardsStatusRetrieveResult:
        """Memberships Points Daily Rewards Status Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/points/daily_rewards/status")

class CommerceMembershipsPointsHistoryApi:
    """commerce commerce.memberships.points.history API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> MembershipsPointsHistoryListResult:
        """Memberships Points History List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/memberships/points/history", query))

class CommerceMembershipsPrivilegesApi:
    """commerce commerce.memberships.privileges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.speed_ups = CommerceMembershipsPrivilegesSpeedUpsApi(client)
        self.usage = CommerceMembershipsPrivilegesUsageApi(client)


class CommerceMembershipsPrivilegesSpeedUpsApi:
    """commerce commerce.memberships.privileges.speed_ups API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: Optional[MembershipsPrivilegesSpeedUpsCreateRequest] = None) -> MembershipsPrivilegesSpeedUpsCreateResult:
        """Memberships Privileges Speed Ups Create"""
        return self._client.post(f"/app/v3/api/memberships/privileges/speed_ups", json=body)

class CommerceMembershipsPrivilegesUsageApi:
    """commerce commerce.memberships.privileges.usage API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> MembershipsPrivilegesUsageRetrieveResult:
        """Memberships Privileges Usage Retrieve"""
        return self._client.get(f"/app/v3/api/memberships/privileges/usage")

class CommerceMembershipsPurchasesApi:
    """commerce commerce.memberships.purchases API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceMembershipPurchaseRequest, idempotency_key: str) -> MembershipsPurchasesCreateResult:
        """Memberships Purchases Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/memberships/purchases", json=body, headers=request_headers)

    def renew(self, body: CommerceMembershipPurchaseRequest, idempotency_key: str) -> MembershipsPurchasesRenewResult:
        """Memberships Purchases Renew"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/memberships/purchases/renew", json=body, headers=request_headers)

    def upgrade(self, body: CommerceMembershipPurchaseRequest, idempotency_key: str) -> MembershipsPurchasesUpgradeResult:
        """Memberships Purchases Upgrade"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/memberships/purchases/upgrade", json=body, headers=request_headers)

class CommerceOrdersApi:
    """commerce commerce.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.cancellations = CommerceOrdersCancellationsApi(client)
        self.events = CommerceOrdersEventsApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, status: Optional[str] = None) -> OrdersListResult:
        """Orders List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/orders", query))

    def retrieve(self, order_id: str) -> OrdersRetrieveResult:
        """Orders Retrieve"""
        return self._client.get(f"/app/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}")

class CommerceOrdersCancellationsApi:
    """commerce commerce.orders.cancellations API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, order_id: str, body: CommerceStandardCommandRequest, idempotency_key: str) -> OrdersCancellationsCreateResult:
        """Orders Cancellations Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}/cancellations", json=body, headers=request_headers)

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
        return self._client.get(_append_query_string(f"/app/v3/api/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}/events", query))

class CommercePaymentsApi:
    """commerce commerce.payments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.attempts = CommercePaymentsAttemptsApi(client)
        self.intents = CommercePaymentsIntentsApi(client)
        self.methods = CommercePaymentsMethodsApi(client)


class CommercePaymentsAttemptsApi:
    """commerce commerce.payments.attempts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, payment_attempt_id: str) -> PaymentsAttemptsRetrieveResult:
        """Payments Attempts Retrieve"""
        return self._client.get(f"/app/v3/api/payments/attempts/{serialize_path_parameter(payment_attempt_id, {'name': 'paymentAttemptId', 'style': 'simple', 'explode': False})}")

class CommercePaymentsIntentsApi:
    """commerce commerce.payments.intents API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.attempts = CommercePaymentsIntentsAttemptsApi(client)


    def create(self, body: CommercePaymentIntentCreateRequest, idempotency_key: str) -> PaymentsIntentsCreateResult:
        """Payments Intents Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/payments/intents", json=body, headers=request_headers)

    def retrieve(self, payment_intent_id: str) -> PaymentsIntentsRetrieveResult:
        """Payments Intents Retrieve"""
        return self._client.get(f"/app/v3/api/payments/intents/{serialize_path_parameter(payment_intent_id, {'name': 'paymentIntentId', 'style': 'simple', 'explode': False})}")

class CommercePaymentsIntentsAttemptsApi:
    """commerce commerce.payments.intents.attempts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, payment_intent_id: str, body: CommercePaymentAttemptCreateRequest, idempotency_key: str) -> PaymentsIntentsAttemptsCreateResult:
        """Payments Intents Attempts Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/payments/intents/{serialize_path_parameter(payment_intent_id, {'name': 'paymentIntentId', 'style': 'simple', 'explode': False})}/attempts", json=body, headers=request_headers)

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
        return self._client.get(_append_query_string(f"/app/v3/api/payments/methods", query))

class CommerceRechargesApi:
    """commerce commerce.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.orders = CommerceRechargesOrdersApi(client)
        self.packages = CommerceRechargesPackagesApi(client)
        self.settings = CommerceRechargesSettingsApi(client)


class CommerceRechargesOrdersApi:
    """commerce commerce.recharges.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceRechargeOrderCreateRequest, idempotency_key: str) -> RechargesOrdersCreateResult:
        """Recharges Orders Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/recharges/orders", json=body, headers=request_headers)

    def retrieve(self, order_id: str) -> RechargesOrdersRetrieveResult:
        """Recharges Orders Retrieve"""
        return self._client.get(f"/app/v3/api/recharges/orders/{serialize_path_parameter(order_id, {'name': 'orderId', 'style': 'simple', 'explode': False})}")

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
        return self._client.get(_append_query_string(f"/app/v3/api/recharges/packages", query))

class CommerceRechargesSettingsApi:
    """commerce commerce.recharges.settings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> RechargesSettingsRetrieveResult:
        """Recharges Settings Retrieve"""
        return self._client.get(f"/app/v3/api/recharges/settings")

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
        return self._client.get(_append_query_string(f"/app/v3/api/refunds", query))

    def create(self, body: CommerceStandardCommandRequest, idempotency_key: str) -> RefundsCreateResult:
        """Refunds Create"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/refunds", json=body, headers=request_headers)

    def retrieve(self, refund_id: str) -> RefundsRetrieveResult:
        """Refunds Retrieve"""
        return self._client.get(f"/app/v3/api/refunds/{serialize_path_parameter(refund_id, {'name': 'refundId', 'style': 'simple', 'explode': False})}")

class CommerceShipmentsApi:
    """commerce commerce.shipments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, shipment_id: str) -> ShipmentsRetrieveResult:
        """Shipments Retrieve"""
        return self._client.get(f"/app/v3/api/shipments/{serialize_path_parameter(shipment_id, {'name': 'shipmentId', 'style': 'simple', 'explode': False})}")

class CommerceWalletApi:
    """commerce commerce.wallet API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.accounts = CommerceWalletAccountsApi(client)
        self.exchange_rate = CommerceWalletExchangeRateApi(client)
        self.ledger_entries = CommerceWalletLedgerEntriesApi(client)
        self.overview = CommerceWalletOverviewApi(client)
        self.points = CommerceWalletPointsApi(client)
        self.tokens = CommerceWalletTokensApi(client)


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
        return self._client.get(_append_query_string(f"/app/v3/api/wallet/accounts", query))

class CommerceWalletExchangeRateApi:
    """commerce commerce.wallet.exchange_rate API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> WalletExchangeRateRetrieveResult:
        """Wallet Exchange Rate Retrieve"""
        return self._client.get(f"/app/v3/api/wallet/exchange_rate")

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
        return self._client.get(_append_query_string(f"/app/v3/api/wallet/ledger_entries", query))

class CommerceWalletOverviewApi:
    """commerce commerce.wallet.overview API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> WalletOverviewRetrieveResult:
        """Wallet Overview Retrieve"""
        return self._client.get(f"/app/v3/api/wallet/overview")

class CommerceWalletPointsApi:
    """commerce commerce.wallet.points API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.exchange_rules = CommerceWalletPointsExchangeRulesApi(client)


class CommerceWalletPointsExchangeRulesApi:
    """commerce commerce.wallet.points.exchange_rules API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, source_asset_type: Optional[str] = None, target_asset_type: Optional[str] = None) -> WalletPointsExchangeRulesListResult:
        """Wallet Points Exchange Rules List"""
        query = build_query_string([
            {'name': 'source_asset_type', 'value': source_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'target_asset_type', 'value': target_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/wallet/points/exchanges/rules", query))

class CommerceWalletTokensApi:
    """commerce commerce.wallet.tokens API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> WalletTokensRetrieveResult:
        """Wallet Tokens Retrieve"""
        return self._client.get(f"/app/v3/api/wallet/tokens")
