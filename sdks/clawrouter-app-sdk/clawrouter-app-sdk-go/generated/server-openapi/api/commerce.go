package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type CommerceApi struct {
    client *sdkhttp.Client
}

func NewCommerceApi(client *sdkhttp.Client) *CommerceApi {
    return &CommerceApi{client: client}
}

// Accounts Current Summary Retrieve
func (a *CommerceApi) AccountsCurrentSummaryRetrieve() (sdktypes.AccountsCurrentSummaryRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/accounts/current/summary"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsCurrentSummaryRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsCurrentSummaryRetrieveResult](raw)
}

// Addresses List
func (a *CommerceApi) AddressesList(page *int, pageSize *int, status *string) (sdktypes.AddressesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/addresses"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AddressesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AddressesListResult](raw)
}

// Addresses Create
func (a *CommerceApi) AddressesCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AddressesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/addresses"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AddressesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AddressesCreateResult](raw)
}

// Addresses Delete
func (a *CommerceApi) AddressesDelete(addressId string, idempotencyKey string, xRequestId *string) (sdktypes.AddressesDeleteResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/addresses/%s", SerializePathParameter(addressId, PathParameterSpec{Name: "addressId", Style: "simple", Explode: false}))), nil, headers)
    if err != nil {
        var zero sdktypes.AddressesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AddressesDeleteResult](raw)
}

// Addresses Update
func (a *CommerceApi) AddressesUpdate(addressId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AddressesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(AppApiPath(fmt.Sprintf("/addresses/%s", SerializePathParameter(addressId, PathParameterSpec{Name: "addressId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AddressesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AddressesUpdateResult](raw)
}

// Addresses Default Selection Create
func (a *CommerceApi) AddressesDefaultSelectionCreate(addressId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AddressesDefaultSelectionCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/addresses/%s/default_selection", SerializePathParameter(addressId, PathParameterSpec{Name: "addressId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AddressesDefaultSelectionCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AddressesDefaultSelectionCreateResult](raw)
}

// Billing History List
func (a *CommerceApi) BillingHistoryList(page *int, pageSize *int, type_ *string, status *string) (sdktypes.BillingHistoryListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "type", Value: func() interface{} { if type_ == nil { return nil }; return *type_ }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/history"), query), nil, nil)
    if err != nil {
        var zero sdktypes.BillingHistoryListResult
        return zero, err
    }
    return decodeResult[sdktypes.BillingHistoryListResult](raw)
}

// Cart Current Retrieve
func (a *CommerceApi) CartCurrentRetrieve() (sdktypes.CartCurrentRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/cart/current"), nil, nil)
    if err != nil {
        var zero sdktypes.CartCurrentRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CartCurrentRetrieveResult](raw)
}

// Cart Items Create
func (a *CommerceApi) CartItemsCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.CartItemsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/cart/items"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CartItemsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CartItemsCreateResult](raw)
}

// Cart Items Delete
func (a *CommerceApi) CartItemsDelete(cartItemId string, idempotencyKey string, xRequestId *string) (sdktypes.CartItemsDeleteResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/cart/items/%s", SerializePathParameter(cartItemId, PathParameterSpec{Name: "cartItemId", Style: "simple", Explode: false}))), nil, headers)
    if err != nil {
        var zero sdktypes.CartItemsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CartItemsDeleteResult](raw)
}

// Cart Items Update
func (a *CommerceApi) CartItemsUpdate(cartItemId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.CartItemsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(AppApiPath(fmt.Sprintf("/cart/items/%s", SerializePathParameter(cartItemId, PathParameterSpec{Name: "cartItemId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CartItemsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CartItemsUpdateResult](raw)
}

// List visible product categories
func (a *CommerceApi) CatalogCategoriesList(parentId *string, status *string, page *int, pageSize *int) (sdktypes.CatalogCategoriesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "parent_id", Value: func() interface{} { if parentId == nil { return nil }; return *parentId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/catalog/categories"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogCategoriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogCategoriesListResult](raw)
}

// List visible catalog products
func (a *CommerceApi) CatalogProductsList(q *string, categoryId *string, productType *string, status *string, page *int, pageSize *int, sort *string) (sdktypes.CatalogProductsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category_id", Value: func() interface{} { if categoryId == nil { return nil }; return *categoryId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "product_type", Value: func() interface{} { if productType == nil { return nil }; return *productType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "sort", Value: func() interface{} { if sort == nil { return nil }; return *sort }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/catalog/products"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogProductsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogProductsListResult](raw)
}

// Retrieve catalog product detail
func (a *CommerceApi) CatalogProductsRetrieve(productId string) (sdktypes.CatalogProductsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/catalog/products/%s", SerializePathParameter(productId, PathParameterSpec{Name: "productId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogProductsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogProductsRetrieveResult](raw)
}

// Retrieve catalog SKU detail
func (a *CommerceApi) CatalogSkusRetrieve(skuId string) (sdktypes.CatalogSkusRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/catalog/skus/%s", SerializePathParameter(skuId, PathParameterSpec{Name: "skuId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogSkusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogSkusRetrieveResult](raw)
}

// Checkout Sessions Create
func (a *CommerceApi) CheckoutSessionsCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.CheckoutSessionsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/checkout/sessions"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CheckoutSessionsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CheckoutSessionsCreateResult](raw)
}

// Checkout Sessions Retrieve
func (a *CommerceApi) CheckoutSessionsRetrieve(checkoutSessionId string) (sdktypes.CheckoutSessionsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/checkout/sessions/%s", SerializePathParameter(checkoutSessionId, PathParameterSpec{Name: "checkoutSessionId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CheckoutSessionsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CheckoutSessionsRetrieveResult](raw)
}

// Checkout Sessions Orders Create
func (a *CommerceApi) CheckoutSessionsOrdersCreate(checkoutSessionId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.CheckoutSessionsOrdersCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/checkout/sessions/%s/orders", SerializePathParameter(checkoutSessionId, PathParameterSpec{Name: "checkoutSessionId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CheckoutSessionsOrdersCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CheckoutSessionsOrdersCreateResult](raw)
}

// Checkout Sessions Quotes Create
func (a *CommerceApi) CheckoutSessionsQuotesCreate(checkoutSessionId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.CheckoutSessionsQuotesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/checkout/sessions/%s/quotes", SerializePathParameter(checkoutSessionId, PathParameterSpec{Name: "checkoutSessionId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CheckoutSessionsQuotesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CheckoutSessionsQuotesCreateResult](raw)
}

// Fulfillments List
func (a *CommerceApi) FulfillmentsList(page *int, pageSize *int, status *string) (sdktypes.FulfillmentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/fulfillments"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FulfillmentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.FulfillmentsListResult](raw)
}

// Fulfillments Retrieve
func (a *CommerceApi) FulfillmentsRetrieve(fulfillmentId string) (sdktypes.FulfillmentsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/fulfillments/%s", SerializePathParameter(fulfillmentId, PathParameterSpec{Name: "fulfillmentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FulfillmentsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.FulfillmentsRetrieveResult](raw)
}

// Invoices List
func (a *CommerceApi) InvoicesList(page *int, pageSize *int, status *string) (sdktypes.InvoicesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/invoices"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InvoicesListResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesListResult](raw)
}

// Invoices Create
func (a *CommerceApi) InvoicesCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.InvoicesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/invoices"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.InvoicesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesCreateResult](raw)
}

// Invoices Retrieve
func (a *CommerceApi) InvoicesRetrieve(invoiceId string) (sdktypes.InvoicesRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/invoices/%s", SerializePathParameter(invoiceId, PathParameterSpec{Name: "invoiceId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.InvoicesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesRetrieveResult](raw)
}

// Memberships Benefits List
func (a *CommerceApi) MembershipsBenefitsList(planId *int) (sdktypes.MembershipsBenefitsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/memberships/benefits"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsBenefitsListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsBenefitsListResult](raw)
}

// Memberships Current Retrieve
func (a *CommerceApi) MembershipsCurrentRetrieve() (sdktypes.MembershipsCurrentRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/current"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsCurrentRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsCurrentRetrieveResult](raw)
}

// Memberships Current Status Retrieve
func (a *CommerceApi) MembershipsCurrentStatusRetrieve() (sdktypes.MembershipsCurrentStatusRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/current/status"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsCurrentStatusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsCurrentStatusRetrieveResult](raw)
}

// Memberships Package Groups List
func (a *CommerceApi) GetMembershipsPackageGroupsList(planId *int, recommendedOnly *bool) (sdktypes.MembershipsPackageGroupsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "recommended_only", Value: func() interface{} { if recommendedOnly == nil { return nil }; return *recommendedOnly }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/memberships/package_groups"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsListResult](raw)
}

// Memberships Package Groups Retrieve
func (a *CommerceApi) MembershipsPackageGroupsRetrieve(packageGroupId string) (sdktypes.MembershipsPackageGroupsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/memberships/package_groups/%s", SerializePathParameter(packageGroupId, PathParameterSpec{Name: "packageGroupId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsRetrieveResult](raw)
}

// Memberships Package Groups Packages List
func (a *CommerceApi) GetMembershipsPackageGroupsListPackageGroups(packageGroupId string, planId *int) (sdktypes.MembershipsPackageGroupsPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath(fmt.Sprintf("/memberships/package_groups/%s/packages", SerializePathParameter(packageGroupId, PathParameterSpec{Name: "packageGroupId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsPackagesListResult](raw)
}

// Memberships Packages List
func (a *CommerceApi) MembershipsPackagesList(page *int, pageSize *int, status *string) (sdktypes.MembershipsPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/memberships/packages"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesListResult](raw)
}

// Memberships Packages Retrieve
func (a *CommerceApi) MembershipsPackagesRetrieve(packageId string) (sdktypes.MembershipsPackagesRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/memberships/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackagesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesRetrieveResult](raw)
}

// Memberships Plans List
func (a *CommerceApi) MembershipsPlansList() (sdktypes.MembershipsPlansListResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/plans"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPlansListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPlansListResult](raw)
}

// Memberships Points Balance Retrieve
func (a *CommerceApi) MembershipsPointsBalanceRetrieve() (sdktypes.MembershipsPointsBalanceRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/points/balance"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPointsBalanceRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPointsBalanceRetrieveResult](raw)
}

// Memberships Points Daily Rewards Create
func (a *CommerceApi) MembershipsPointsDailyRewardsCreate(body *sdktypes.MembershipsPointsDailyRewardsCreateRequest, xRequestId *string) (sdktypes.MembershipsPointsDailyRewardsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/memberships/points/daily_rewards"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPointsDailyRewardsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPointsDailyRewardsCreateResult](raw)
}

// Memberships Points Daily Rewards Status Retrieve
func (a *CommerceApi) MembershipsPointsDailyRewardsStatusRetrieve() (sdktypes.MembershipsPointsDailyRewardsStatusRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/points/daily_rewards/status"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPointsDailyRewardsStatusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPointsDailyRewardsStatusRetrieveResult](raw)
}

// Memberships Points History List
func (a *CommerceApi) MembershipsPointsHistoryList(page *int, pageSize *int, cursor *string) (sdktypes.MembershipsPointsHistoryListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/memberships/points/history"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPointsHistoryListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPointsHistoryListResult](raw)
}

// Memberships Privileges Speed Ups Create
func (a *CommerceApi) MembershipsPrivilegesSpeedUpsCreate(body *sdktypes.MembershipsPrivilegesSpeedUpsCreateRequest, xRequestId *string) (sdktypes.MembershipsPrivilegesSpeedUpsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/memberships/privileges/speed_ups"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPrivilegesSpeedUpsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPrivilegesSpeedUpsCreateResult](raw)
}

// Memberships Privileges Usage Retrieve
func (a *CommerceApi) MembershipsPrivilegesUsageRetrieve() (sdktypes.MembershipsPrivilegesUsageRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/memberships/privileges/usage"), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPrivilegesUsageRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPrivilegesUsageRetrieveResult](raw)
}

// Memberships Purchases Create
func (a *CommerceApi) MembershipsPurchasesCreate(body sdktypes.CommerceMembershipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.MembershipsPurchasesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/memberships/purchases"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPurchasesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPurchasesCreateResult](raw)
}

// Memberships Purchases Renew
func (a *CommerceApi) MembershipsPurchasesRenew(body sdktypes.CommerceMembershipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.MembershipsPurchasesRenewResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/memberships/purchases/renew"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPurchasesRenewResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPurchasesRenewResult](raw)
}

// Memberships Purchases Upgrade
func (a *CommerceApi) MembershipsPurchasesUpgrade(body sdktypes.CommerceMembershipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.MembershipsPurchasesUpgradeResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/memberships/purchases/upgrade"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPurchasesUpgradeResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPurchasesUpgradeResult](raw)
}

// Orders List
func (a *CommerceApi) OrdersList(page *int, pageSize *int, status *string) (sdktypes.OrdersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/orders"), query), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersListResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersListResult](raw)
}

// Orders Retrieve
func (a *CommerceApi) OrdersRetrieve(orderId string) (sdktypes.OrdersRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/orders/%s", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersRetrieveResult](raw)
}

// Orders Cancellations Create
func (a *CommerceApi) OrdersCancellationsCreate(orderId string, body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.OrdersCancellationsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/orders/%s/cancellations", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.OrdersCancellationsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersCancellationsCreateResult](raw)
}

// Orders Events List
func (a *CommerceApi) OrdersEventsList(orderId string, page *int, pageSize *int, status *string) (sdktypes.OrdersEventsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath(fmt.Sprintf("/orders/%s/events", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersEventsListResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersEventsListResult](raw)
}

// Payments Attempts Retrieve
func (a *CommerceApi) PaymentsAttemptsRetrieve(paymentAttemptId string) (sdktypes.PaymentsAttemptsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/payments/attempts/%s", SerializePathParameter(paymentAttemptId, PathParameterSpec{Name: "paymentAttemptId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsAttemptsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsAttemptsRetrieveResult](raw)
}

// Payments Intents Create
func (a *CommerceApi) PaymentsIntentsCreate(body sdktypes.CommercePaymentIntentCreateRequest, idempotencyKey string, xRequestId *string) (sdktypes.PaymentsIntentsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/payments/intents"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PaymentsIntentsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsIntentsCreateResult](raw)
}

// Payments Intents Retrieve
func (a *CommerceApi) PaymentsIntentsRetrieve(paymentIntentId string) (sdktypes.PaymentsIntentsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/payments/intents/%s", SerializePathParameter(paymentIntentId, PathParameterSpec{Name: "paymentIntentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsIntentsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsIntentsRetrieveResult](raw)
}

// Payments Intents Attempts Create
func (a *CommerceApi) PaymentsIntentsAttemptsCreate(paymentIntentId string, body sdktypes.CommercePaymentAttemptCreateRequest, idempotencyKey string, xRequestId *string) (sdktypes.PaymentsIntentsAttemptsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/payments/intents/%s/attempts", SerializePathParameter(paymentIntentId, PathParameterSpec{Name: "paymentIntentId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PaymentsIntentsAttemptsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsIntentsAttemptsCreateResult](raw)
}

// Payments Methods List
func (a *CommerceApi) PaymentsMethodsList(page *int, pageSize *int, status *string) (sdktypes.PaymentsMethodsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/payments/methods"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsMethodsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsMethodsListResult](raw)
}

// Recharges Orders Create
func (a *CommerceApi) RechargesOrdersCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.RechargesOrdersCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/recharges/orders"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RechargesOrdersCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesOrdersCreateResult](raw)
}

// Recharges Orders Retrieve
func (a *CommerceApi) RechargesOrdersRetrieve(orderId string) (sdktypes.RechargesOrdersRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/recharges/orders/%s", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesOrdersRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesOrdersRetrieveResult](raw)
}

// Recharges Packages List
func (a *CommerceApi) RechargesPackagesList(page *int, pageSize *int, status *string) (sdktypes.RechargesPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/recharges/packages"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesListResult](raw)
}

// Refunds List
func (a *CommerceApi) RefundsList(page *int, pageSize *int, status *string) (sdktypes.RefundsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/refunds"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RefundsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RefundsListResult](raw)
}

// Refunds Create
func (a *CommerceApi) RefundsCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.RefundsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/refunds"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RefundsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RefundsCreateResult](raw)
}

// Refunds Retrieve
func (a *CommerceApi) RefundsRetrieve(refundId string) (sdktypes.RefundsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/refunds/%s", SerializePathParameter(refundId, PathParameterSpec{Name: "refundId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RefundsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.RefundsRetrieveResult](raw)
}

// Shipments Retrieve
func (a *CommerceApi) ShipmentsRetrieve(shipmentId string) (sdktypes.ShipmentsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/shipments/%s", SerializePathParameter(shipmentId, PathParameterSpec{Name: "shipmentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.ShipmentsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.ShipmentsRetrieveResult](raw)
}

// Wallet Accounts List
func (a *CommerceApi) WalletAccountsList(page *int, pageSize *int, status *string) (sdktypes.WalletAccountsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/wallet/accounts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletAccountsListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletAccountsListResult](raw)
}

// Wallet Exchange Rate Retrieve
func (a *CommerceApi) WalletExchangeRateRetrieve() (sdktypes.WalletExchangeRateRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/wallet/exchange_rate"), nil, nil)
    if err != nil {
        var zero sdktypes.WalletExchangeRateRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletExchangeRateRetrieveResult](raw)
}

// Wallet Ledger Entries List
func (a *CommerceApi) WalletLedgerEntriesList(page *int, pageSize *int, status *string) (sdktypes.WalletLedgerEntriesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/wallet/ledger_entries"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletLedgerEntriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletLedgerEntriesListResult](raw)
}

// Wallet Overview Retrieve
func (a *CommerceApi) WalletOverviewRetrieve() (sdktypes.WalletOverviewRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/wallet/overview"), nil, nil)
    if err != nil {
        var zero sdktypes.WalletOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletOverviewRetrieveResult](raw)
}

// Wallet Points Exchange Rules List
func (a *CommerceApi) WalletPointsExchangeRulesList(sourceAssetType *string, targetAssetType *string) (sdktypes.WalletPointsExchangeRulesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "source_asset_type", Value: func() interface{} { if sourceAssetType == nil { return nil }; return *sourceAssetType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "target_asset_type", Value: func() interface{} { if targetAssetType == nil { return nil }; return *targetAssetType }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/wallet/points/exchanges/rules"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletPointsExchangeRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletPointsExchangeRulesListResult](raw)
}

// Wallet Tokens Retrieve
func (a *CommerceApi) WalletTokensRetrieve() (sdktypes.WalletTokensRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/wallet/tokens"), nil, nil)
    if err != nil {
        var zero sdktypes.WalletTokensRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletTokensRetrieveResult](raw)
}

type PathParameterSpec struct {
    Name    string
    Style   string
    Explode bool
}

func SerializePathParameter(value interface{}, spec PathParameterSpec) string {
    if value == nil {
        return ""
    }
    style := spec.Style
    if style == "" {
        style = "simple"
    }

    switch typed := value.(type) {
    case []string:
        return SerializePathArray(spec.Name, stringSliceToInterface(typed), style, spec.Explode)
    case []int:
        return SerializePathArray(spec.Name, intSliceToInterface(typed), style, spec.Explode)
    case []interface{}:
        return SerializePathArray(spec.Name, typed, style, spec.Explode)
    case map[string]string:
        return SerializePathObject(spec.Name, stringMapToInterface(typed), style, spec.Explode)
    case map[string]int:
        return SerializePathObject(spec.Name, intMapToInterface(typed), style, spec.Explode)
    case map[string]interface{}:
        return SerializePathObject(spec.Name, typed, style, spec.Explode)
    default:
        return PathPrefix(spec.Name, style) + url.PathEscape(fmt.Sprint(value))
    }
}

func SerializePathArray(name string, values []interface{}, style string, explode bool) string {
    serialized := make([]string, 0, len(values))
    for _, item := range values {
        if item != nil {
            serialized = append(serialized, url.PathEscape(fmt.Sprint(item)))
        }
    }
    if len(serialized) == 0 {
        return PathPrefix(name, style)
    }
    if style == "matrix" {
        if explode {
            parts := make([]string, 0, len(serialized))
            for _, item := range serialized {
                parts = append(parts, ";"+name+"="+item)
            }
            return strings.Join(parts, "")
        }
        return ";" + name + "=" + strings.Join(serialized, ",")
    }
    separator := ","
    if explode {
        separator = "."
    }
    return PathPrefix(name, style) + strings.Join(serialized, separator)
}

func SerializePathObject(name string, values map[string]interface{}, style string, explode bool) string {
    entries := make([]string, 0, len(values)*2)
    exploded := make([]string, 0, len(values))
    for key, value := range values {
        if value == nil {
            continue
        }
        escapedKey := url.PathEscape(key)
        escapedValue := url.PathEscape(fmt.Sprint(value))
        if explode {
            if style == "matrix" {
                exploded = append(exploded, ";"+escapedKey+"="+escapedValue)
            } else {
                exploded = append(exploded, escapedKey+"="+escapedValue)
            }
        } else {
            entries = append(entries, escapedKey, escapedValue)
        }
    }
    if style == "matrix" {
        if explode {
            return strings.Join(exploded, "")
        }
        return ";" + name + "=" + strings.Join(entries, ",")
    }
    if explode {
        separator := ","
        if style == "label" {
            separator = "."
        }
        return PathPrefix(name, style) + strings.Join(exploded, separator)
    }
    return PathPrefix(name, style) + strings.Join(entries, ",")
}

func PathPrefix(name string, style string) string {
    if style == "label" {
        return "."
    }
    if style == "matrix" {
        return ";" + name
    }
    return ""
}
type QueryParameterSpec struct {
    Name          string
    Value         interface{}
    Style         string
    Explode       bool
    AllowReserved bool
    ContentType   string
}

func BuildQueryString(parameters []QueryParameterSpec) string {
    pairs := make([]string, 0)
    for _, parameter := range parameters {
        AppendSerializedParameter(&pairs, parameter)
    }
    return strings.Join(pairs, "&")
}

func AppendSerializedParameter(pairs *[]string, parameter QueryParameterSpec) {
    if parameter.Value == nil {
        return
    }

    if parameter.ContentType != "" {
        encoded, _ := json.Marshal(parameter.Value)
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(string(encoded), parameter.AllowReserved))
        return
    }

    style := parameter.Style
    if style == "" {
        style = "form"
    }

    switch value := parameter.Value.(type) {
    case []string:
        AppendArrayParameter(pairs, parameter.Name, stringSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []int:
        AppendArrayParameter(pairs, parameter.Name, intSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []interface{}:
        AppendArrayParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
    case map[string]int:
        AppendObjectParameter(pairs, parameter.Name, intMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]string:
        AppendObjectParameter(pairs, parameter.Name, stringMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]interface{}:
        if style == "deepObject" {
            AppendDeepObjectParameter(pairs, parameter.Name, value, parameter.AllowReserved)
        } else {
            AppendObjectParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
        }
    default:
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(fmt.Sprint(value), parameter.AllowReserved))
    }
}

func AppendArrayParameter(pairs *[]string, name string, value []interface{}, style string, explode bool, allowReserved bool) {
    values := make([]string, 0, len(value))
    for _, item := range value {
        if item != nil {
            values = append(values, fmt.Sprint(item))
        }
    }
    if len(values) == 0 {
        return
    }
    if style == "form" && explode {
        for _, item := range values {
            *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(item, allowReserved))
        }
        return
    }
    *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(values, ","), allowReserved))
}

func AppendObjectParameter(pairs *[]string, name string, value map[string]interface{}, style string, explode bool, allowReserved bool) {
    entries := make([]string, 0, len(value)*2)
    for key, item := range value {
        if item == nil {
            continue
        }
        if style == "form" && explode {
            *pairs = append(*pairs, url.QueryEscape(key)+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
            continue
        }
        entries = append(entries, key, fmt.Sprint(item))
    }
    if len(entries) == 0 {
        return
    }
    if !(style == "form" && explode) {
        *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(entries, ","), allowReserved))
    }
}

func AppendDeepObjectParameter(pairs *[]string, name string, value map[string]interface{}, allowReserved bool) {
    for key, item := range value {
        if item == nil {
            continue
        }
        *pairs = append(*pairs, url.QueryEscape(fmt.Sprintf("%s[%s]", name, key))+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
    }
}

func EncodeQueryValue(value string, allowReserved bool) string {
    encoded := url.QueryEscape(value)
    if !allowReserved {
        return encoded
    }
    replacements := map[string]string{
        "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
        "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
        "%24": "$", "%26": "&", "%27": "'", "%28": "(",
        "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
        "%3B": ";", "%3D": "=",
    }
    for escaped, reserved := range replacements {
        encoded = strings.ReplaceAll(encoded, escaped, reserved)
    }
    return encoded
}


type ParameterSpec struct {
    Value       interface{}
    Style       string
    Explode     bool
    ContentType string
}

func BuildRequestHeaders(headers map[string]ParameterSpec, cookies map[string]ParameterSpec) map[string]string {
    requestHeaders := map[string]string{}
    for name, parameter := range headers {
        if serialized, ok := SerializeParameterValue(parameter); ok {
            requestHeaders[name] = serialized
        }
    }

    if cookieHeader := BuildCookieHeader(cookies); cookieHeader != "" {
        if existing, ok := requestHeaders["Cookie"]; ok && existing != "" {
            requestHeaders["Cookie"] = existing + "; " + cookieHeader
        } else {
            requestHeaders["Cookie"] = cookieHeader
        }
    }

    if len(requestHeaders) == 0 {
        return nil
    }
    return requestHeaders
}

func BuildCookieHeader(cookies map[string]ParameterSpec) string {
    pairs := make([]string, 0, len(cookies))
    for name, parameter := range cookies {
        if serialized, ok := SerializeParameterValue(parameter); ok {
            pairs = append(pairs, url.QueryEscape(name)+"="+url.QueryEscape(serialized))
        }
    }
    return strings.Join(pairs, "; ")
}

func SerializeParameterValue(parameter ParameterSpec) (string, bool) {
    value := parameter.Value
    if value == nil {
        return "", false
    }
    if parameter.ContentType != "" {
        encoded, _ := json.Marshal(value)
        return string(encoded), true
    }
    switch typed := value.(type) {
    case string:
        return typed, true
    case fmt.Stringer:
        return typed.String(), true
    case []string:
        return strings.Join(typed, ","), true
    case []int:
        values := make([]string, 0, len(typed))
        for _, item := range typed {
            values = append(values, fmt.Sprint(item))
        }
        return strings.Join(values, ","), true
    case map[string]string:
        return SerializeHeaderObject(stringMapToInterface(typed), parameter.Explode), true
    case map[string]int:
        return SerializeHeaderObject(intMapToInterface(typed), parameter.Explode), true
    case map[string]interface{}:
        return SerializeHeaderObject(typed, parameter.Explode), true
    default:
        return fmt.Sprint(value), true
    }
}

func SerializeHeaderObject(values map[string]interface{}, explode bool) string {
    serialized := make([]string, 0, len(values)*2)
    for key, value := range values {
        if value == nil {
            continue
        }
        if explode {
            serialized = append(serialized, key+"="+fmt.Sprint(value))
        } else {
            serialized = append(serialized, key, fmt.Sprint(value))
        }
    }
    return strings.Join(serialized, ",")
}
func stringSliceToInterface(values []string) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func intSliceToInterface(values []int) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func stringMapToInterface(values map[string]string) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}

func intMapToInterface(values map[string]int) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}
