package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type CommerceApi struct {
    client *sdkhttp.Client
}

func NewCommerceApi(client *sdkhttp.Client) *CommerceApi {
    return &CommerceApi{client: client}
}

// Audit Commerce Events List
func (a *CommerceApi) AuditCommerceEventsList(page *int, pageSize *int, status *string) (sdktypes.AuditCommerceEventsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/audit/commerce_events"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AuditCommerceEventsListResult
        return zero, err
    }
    return decodeResult[sdktypes.AuditCommerceEventsListResult](raw)
}

// List product attributes
func (a *CommerceApi) CatalogAttributesList(scope *string, status *string, page *int, pageSize *int) (sdktypes.CatalogAttributesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "scope", Value: func() interface{} { if scope == nil { return nil }; return *scope }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/catalog/attributes"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogAttributesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogAttributesListResult](raw)
}

// Create product attribute
func (a *CommerceApi) CatalogAttributesCreate(body sdktypes.CommerceProductAttributeMutationRequest, idempotencyKey string) (sdktypes.CatalogAttributesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/catalog/attributes"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogAttributesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogAttributesCreateResult](raw)
}

// List product categories for admin management
func (a *CommerceApi) CatalogCategoriesList(parentId *string, status *string, page *int, pageSize *int) (sdktypes.CatalogCategoriesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "parent_id", Value: func() interface{} { if parentId == nil { return nil }; return *parentId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/catalog/categories"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogCategoriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogCategoriesListResult](raw)
}

// Create product category
func (a *CommerceApi) CatalogCategoriesCreate(body sdktypes.CommerceProductCategoryMutationRequest, idempotencyKey string) (sdktypes.CatalogCategoriesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/catalog/categories"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogCategoriesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogCategoriesCreateResult](raw)
}

// Delete product category
func (a *CommerceApi) CatalogCategoriesDelete(categoryId string) (sdktypes.CatalogCategoriesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/catalog/categories/%s", SerializePathParameter(categoryId, PathParameterSpec{Name: "categoryId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogCategoriesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogCategoriesDeleteResult](raw)
}

// Update product category
func (a *CommerceApi) CatalogCategoriesUpdate(categoryId string, body sdktypes.CommerceProductCategoryMutationRequest, idempotencyKey string) (sdktypes.CatalogCategoriesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/catalog/categories/%s", SerializePathParameter(categoryId, PathParameterSpec{Name: "categoryId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogCategoriesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogCategoriesUpdateResult](raw)
}

// List product price lists
func (a *CommerceApi) CatalogPriceLists(currencyCode *string, marketCode *string, status *string, page *int, pageSize *int) (sdktypes.CatalogPriceListsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "currency_code", Value: func() interface{} { if currencyCode == nil { return nil }; return *currencyCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "market_code", Value: func() interface{} { if marketCode == nil { return nil }; return *marketCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/catalog/price_lists"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogPriceListsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogPriceListsListResult](raw)
}

// Create product price list
func (a *CommerceApi) CatalogPriceListsCreate(body sdktypes.CommercePriceListMutationRequest, idempotencyKey string) (sdktypes.CatalogPriceListsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/catalog/price_lists"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogPriceListsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogPriceListsCreateResult](raw)
}

// List products for admin management
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
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/catalog/products"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogProductsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogProductsListResult](raw)
}

// Create product SPU
func (a *CommerceApi) CatalogProductsCreate(body sdktypes.CommerceProductSpuMutationRequest, idempotencyKey string) (sdktypes.CatalogProductsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/catalog/products"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogProductsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogProductsCreateResult](raw)
}

// Update product SPU
func (a *CommerceApi) CatalogProductsUpdate(productId string, body sdktypes.CommerceProductSpuMutationRequest, idempotencyKey string) (sdktypes.CatalogProductsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/catalog/products/%s", SerializePathParameter(productId, PathParameterSpec{Name: "productId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogProductsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogProductsUpdateResult](raw)
}

// List product SKUs for admin management
func (a *CommerceApi) CatalogSkusList(productId *string, fulfillmentType *string, status *string, page *int, pageSize *int) (sdktypes.CatalogSkusListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "product_id", Value: func() interface{} { if productId == nil { return nil }; return *productId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "fulfillment_type", Value: func() interface{} { if fulfillmentType == nil { return nil }; return *fulfillmentType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/catalog/skus"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CatalogSkusListResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogSkusListResult](raw)
}

// Create product SKU
func (a *CommerceApi) CatalogSkusCreate(body sdktypes.CommerceProductSkuMutationRequest, idempotencyKey string) (sdktypes.CatalogSkusCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/catalog/skus"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogSkusCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogSkusCreateResult](raw)
}

// Update product SKU
func (a *CommerceApi) CatalogSkusUpdate(skuId string, body sdktypes.CommerceProductSkuMutationRequest, idempotencyKey string) (sdktypes.CatalogSkusUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/catalog/skus/%s", SerializePathParameter(skuId, PathParameterSpec{Name: "skuId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CatalogSkusUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CatalogSkusUpdateResult](raw)
}

// Commerce Reports Order Revenue List
func (a *CommerceApi) ReportsOrderRevenueList(page *int, pageSize *int, status *string) (sdktypes.CommerceReportsOrderRevenueListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/commerce_reports/order_revenue"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CommerceReportsOrderRevenueListResult
        return zero, err
    }
    return decodeResult[sdktypes.CommerceReportsOrderRevenueListResult](raw)
}

// Commerce Reports Payment Reconciliation Retrieve
func (a *CommerceApi) ReportsPaymentReconciliationRetrieve() (sdktypes.CommerceReportsPaymentReconciliationRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath("/commerce_reports/payment_reconciliation"), nil, nil)
    if err != nil {
        var zero sdktypes.CommerceReportsPaymentReconciliationRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CommerceReportsPaymentReconciliationRetrieveResult](raw)
}

// Commerce Reports Refunds List
func (a *CommerceApi) ReportsRefundsList(page *int, pageSize *int, status *string) (sdktypes.CommerceReportsRefundsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/commerce_reports/refunds"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CommerceReportsRefundsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CommerceReportsRefundsListResult](raw)
}

// Fulfillments List
func (a *CommerceApi) FulfillmentsList(page *int, pageSize *int, status *string) (sdktypes.FulfillmentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/fulfillments"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FulfillmentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.FulfillmentsListResult](raw)
}

// List inventory ledger entries
func (a *CommerceApi) InventoryLedgerEntriesList(skuId *string, warehouseId *string, sourceType *string, sourceId *string, page *int, pageSize *int) (sdktypes.InventoryLedgerEntriesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "sku_id", Value: func() interface{} { if skuId == nil { return nil }; return *skuId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "warehouse_id", Value: func() interface{} { if warehouseId == nil { return nil }; return *warehouseId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "source_type", Value: func() interface{} { if sourceType == nil { return nil }; return *sourceType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "source_id", Value: func() interface{} { if sourceId == nil { return nil }; return *sourceId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/inventory/ledger_entries"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InventoryLedgerEntriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.InventoryLedgerEntriesListResult](raw)
}

// List inventory reservations
func (a *CommerceApi) InventoryReservationsList(skuId *string, orderId *string, checkoutSessionId *string, status *string, page *int, pageSize *int) (sdktypes.InventoryReservationsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "sku_id", Value: func() interface{} { if skuId == nil { return nil }; return *skuId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "order_id", Value: func() interface{} { if orderId == nil { return nil }; return *orderId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "checkout_session_id", Value: func() interface{} { if checkoutSessionId == nil { return nil }; return *checkoutSessionId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/inventory/reservations"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InventoryReservationsListResult
        return zero, err
    }
    return decodeResult[sdktypes.InventoryReservationsListResult](raw)
}

// List inventory stock records
func (a *CommerceApi) InventoryStocksList(skuId *string, warehouseId *string, status *string, page *int, pageSize *int) (sdktypes.InventoryStocksListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "sku_id", Value: func() interface{} { if skuId == nil { return nil }; return *skuId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "warehouse_id", Value: func() interface{} { if warehouseId == nil { return nil }; return *warehouseId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/inventory/stocks"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InventoryStocksListResult
        return zero, err
    }
    return decodeResult[sdktypes.InventoryStocksListResult](raw)
}

// Update inventory stock
func (a *CommerceApi) InventoryStocksUpdate(stockId string, body sdktypes.CommerceInventoryStockUpdateRequest, idempotencyKey string) (sdktypes.InventoryStocksUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/inventory/stocks/%s", SerializePathParameter(stockId, PathParameterSpec{Name: "stockId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.InventoryStocksUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.InventoryStocksUpdateResult](raw)
}

// Invoices List
func (a *CommerceApi) InvoicesList(page *int, pageSize *int, status *string) (sdktypes.InvoicesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/invoices"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InvoicesListResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesListResult](raw)
}

// Invoices Titles List
func (a *CommerceApi) InvoicesTitlesList(page *int, pageSize *int, status *string) (sdktypes.InvoicesTitlesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/invoices/titles"), query), nil, nil)
    if err != nil {
        var zero sdktypes.InvoicesTitlesListResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesTitlesListResult](raw)
}

// Invoices Retrieve
func (a *CommerceApi) InvoicesRetrieve(invoiceId string) (sdktypes.InvoicesRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/invoices/%s", SerializePathParameter(invoiceId, PathParameterSpec{Name: "invoiceId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.InvoicesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.InvoicesRetrieveResult](raw)
}

// Memberships Entitlements List
func (a *CommerceApi) MembershipsEntitlementsList(page *int, pageSize *int, planId *string, membershipId *string, status *string) (sdktypes.MembershipsEntitlementsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "membership_id", Value: func() interface{} { if membershipId == nil { return nil }; return *membershipId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/memberships/entitlements"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsEntitlementsListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsEntitlementsListResult](raw)
}

// Memberships Members List
func (a *CommerceApi) MembershipsMembersList(page *int, pageSize *int, cursor *string, userId *string, planId *string, status *string) (sdktypes.MembershipsMembersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "user_id", Value: func() interface{} { if userId == nil { return nil }; return *userId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/memberships/members"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsMembersListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsMembersListResult](raw)
}

// Memberships Members Status Update
func (a *CommerceApi) MembershipsMembersStatusUpdate(membershipId string, body sdktypes.CommerceMembershipMemberStatusRequest, idempotencyKey string) (sdktypes.MembershipsMembersStatusUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/memberships/members/%s/status", SerializePathParameter(membershipId, PathParameterSpec{Name: "membershipId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsMembersStatusUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsMembersStatusUpdateResult](raw)
}

// Memberships Package Groups List
func (a *CommerceApi) MembershipsPackageGroupsList(page *int, pageSize *int, status *string) (sdktypes.MembershipsPackageGroupsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/memberships/package_groups"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsListResult](raw)
}

// Memberships Package Groups Create
func (a *CommerceApi) MembershipsPackageGroupsCreate(body sdktypes.CommerceMembershipPackageGroupMutationRequest, idempotencyKey string) (sdktypes.MembershipsPackageGroupsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/memberships/package_groups"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsCreateResult](raw)
}

// Memberships Package Groups Delete
func (a *CommerceApi) MembershipsPackageGroupsDelete(packageGroupId string) (sdktypes.MembershipsPackageGroupsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/memberships/package_groups/%s", SerializePathParameter(packageGroupId, PathParameterSpec{Name: "packageGroupId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsDeleteResult](raw)
}

// Memberships Package Groups Update
func (a *CommerceApi) MembershipsPackageGroupsUpdate(packageGroupId string, body sdktypes.CommerceMembershipPackageGroupMutationRequest, idempotencyKey string) (sdktypes.MembershipsPackageGroupsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/memberships/package_groups/%s", SerializePathParameter(packageGroupId, PathParameterSpec{Name: "packageGroupId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPackageGroupsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackageGroupsUpdateResult](raw)
}

// Memberships Packages List
func (a *CommerceApi) MembershipsPackagesList(page *int, pageSize *int, packageGroupId *string, planId *string, status *string) (sdktypes.MembershipsPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "package_group_id", Value: func() interface{} { if packageGroupId == nil { return nil }; return *packageGroupId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "plan_id", Value: func() interface{} { if planId == nil { return nil }; return *planId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/memberships/packages"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesListResult](raw)
}

// Memberships Packages Create
func (a *CommerceApi) MembershipsPackagesCreate(body sdktypes.CommerceMembershipPackageMutationRequest, idempotencyKey string) (sdktypes.MembershipsPackagesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/memberships/packages"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPackagesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesCreateResult](raw)
}

// Memberships Packages Delete
func (a *CommerceApi) MembershipsPackagesDelete(packageId string) (sdktypes.MembershipsPackagesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/memberships/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPackagesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesDeleteResult](raw)
}

// Memberships Packages Update
func (a *CommerceApi) MembershipsPackagesUpdate(packageId string, body sdktypes.CommerceMembershipPackageMutationRequest, idempotencyKey string) (sdktypes.MembershipsPackagesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/memberships/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPackagesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPackagesUpdateResult](raw)
}

// Memberships Plans List
func (a *CommerceApi) MembershipsPlansList(page *int, pageSize *int, status *string) (sdktypes.MembershipsPlansListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/memberships/plans"), query), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPlansListResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPlansListResult](raw)
}

// Memberships Plans Create
func (a *CommerceApi) MembershipsPlansCreate(body sdktypes.CommerceMembershipPlanMutationRequest, idempotencyKey string) (sdktypes.MembershipsPlansCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/memberships/plans"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPlansCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPlansCreateResult](raw)
}

// Memberships Plans Delete
func (a *CommerceApi) MembershipsPlansDelete(planId string) (sdktypes.MembershipsPlansDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/memberships/plans/%s", SerializePathParameter(planId, PathParameterSpec{Name: "planId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.MembershipsPlansDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPlansDeleteResult](raw)
}

// Memberships Plans Update
func (a *CommerceApi) MembershipsPlansUpdate(planId string, body sdktypes.CommerceMembershipPlanMutationRequest, idempotencyKey string) (sdktypes.MembershipsPlansUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/memberships/plans/%s", SerializePathParameter(planId, PathParameterSpec{Name: "planId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.MembershipsPlansUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.MembershipsPlansUpdateResult](raw)
}

// Orders List
func (a *CommerceApi) OrdersList(page *int, pageSize *int, status *string) (sdktypes.OrdersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/orders"), query), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersListResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersListResult](raw)
}

// Orders Retrieve
func (a *CommerceApi) OrdersRetrieve(orderId string) (sdktypes.OrdersRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/orders/%s", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersRetrieveResult](raw)
}

// Orders Events List
func (a *CommerceApi) OrdersEventsList(orderId string, page *int, pageSize *int, status *string) (sdktypes.OrdersEventsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath(fmt.Sprintf("/orders/%s/events", SerializePathParameter(orderId, PathParameterSpec{Name: "orderId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.OrdersEventsListResult
        return zero, err
    }
    return decodeResult[sdktypes.OrdersEventsListResult](raw)
}

// Payments Attempts List
func (a *CommerceApi) PaymentsAttemptsList(intentId *string, providerCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsAttemptsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "intent_id", Value: func() interface{} { if intentId == nil { return nil }; return *intentId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "provider_code", Value: func() interface{} { if providerCode == nil { return nil }; return *providerCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/attempts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsAttemptsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsAttemptsListResult](raw)
}

// Payments Channels List
func (a *CommerceApi) PaymentsChannelsList(providerAccountId *string, methodCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsChannelsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider_account_id", Value: func() interface{} { if providerAccountId == nil { return nil }; return *providerAccountId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "method_code", Value: func() interface{} { if methodCode == nil { return nil }; return *methodCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/channels"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsChannelsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsChannelsListResult](raw)
}

// Payments Intents List
func (a *CommerceApi) PaymentsIntentsList(orderId *string, providerCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsIntentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "order_id", Value: func() interface{} { if orderId == nil { return nil }; return *orderId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "provider_code", Value: func() interface{} { if providerCode == nil { return nil }; return *providerCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/intents"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsIntentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsIntentsListResult](raw)
}

// Payments Methods List
func (a *CommerceApi) PaymentsMethodsList(page *int, pageSize *int, status *string) (sdktypes.PaymentsMethodsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/methods"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsMethodsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsMethodsListResult](raw)
}

// Payments Provider Accounts List
func (a *CommerceApi) PaymentsProviderAccountsList(providerCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsProviderAccountsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider_code", Value: func() interface{} { if providerCode == nil { return nil }; return *providerCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/provider_accounts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsProviderAccountsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsProviderAccountsListResult](raw)
}

// Payments Provider Accounts Create
func (a *CommerceApi) PaymentsProviderAccountsCreate(body sdktypes.CommercePaymentProviderAccountMutationRequest, idempotencyKey string) (sdktypes.PaymentsProviderAccountsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/payments/provider_accounts"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PaymentsProviderAccountsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsProviderAccountsCreateResult](raw)
}

// Payments Providers List
func (a *CommerceApi) PaymentsProvidersList(page *int, pageSize *int, status *string) (sdktypes.PaymentsProvidersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/providers"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsProvidersListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsProvidersListResult](raw)
}

// Payments Reconciliation Runs List
func (a *CommerceApi) PaymentsReconciliationRunsList(providerCode *string, businessDate *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsReconciliationRunsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider_code", Value: func() interface{} { if providerCode == nil { return nil }; return *providerCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "business_date", Value: func() interface{} { if businessDate == nil { return nil }; return *businessDate }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/reconciliation_runs"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsReconciliationRunsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsReconciliationRunsListResult](raw)
}

// Payments Route Rules List
func (a *CommerceApi) PaymentsRouteRulesList(methodCode *string, countryCode *string, currencyCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsRouteRulesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "method_code", Value: func() interface{} { if methodCode == nil { return nil }; return *methodCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "country_code", Value: func() interface{} { if countryCode == nil { return nil }; return *countryCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "currency_code", Value: func() interface{} { if currencyCode == nil { return nil }; return *currencyCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/route_rules"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsRouteRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsRouteRulesListResult](raw)
}

// Payments Webhook Events List
func (a *CommerceApi) PaymentsWebhookEventsList(providerCode *string, page *int, pageSize *int, status *string) (sdktypes.PaymentsWebhookEventsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider_code", Value: func() interface{} { if providerCode == nil { return nil }; return *providerCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/payments/webhook_events"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsWebhookEventsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsWebhookEventsListResult](raw)
}

// Recharges Orders List
func (a *CommerceApi) RechargesOrdersList(page *int, pageSize *int, status *string) (sdktypes.RechargesOrdersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/recharges/orders"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesOrdersListResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesOrdersListResult](raw)
}

// Recharges Packages List
func (a *CommerceApi) RechargesPackagesList(page *int, pageSize *int, status *string) (sdktypes.RechargesPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/recharges/packages"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesListResult](raw)
}

// Recharges Packages Create
func (a *CommerceApi) RechargesPackagesCreate(body sdktypes.CommerceRechargePackageMutationRequest, idempotencyKey string) (sdktypes.RechargesPackagesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/recharges/packages"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RechargesPackagesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesCreateResult](raw)
}

// Recharges Packages Delete
func (a *CommerceApi) RechargesPackagesDelete(packageId string) (sdktypes.RechargesPackagesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/recharges/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesPackagesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesDeleteResult](raw)
}

// Recharges Packages Update
func (a *CommerceApi) RechargesPackagesUpdate(packageId string, body sdktypes.CommerceRechargePackageMutationRequest, idempotencyKey string) (sdktypes.RechargesPackagesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/recharges/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RechargesPackagesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesUpdateResult](raw)
}

// Refunds List
func (a *CommerceApi) RefundsList(page *int, pageSize *int, status *string) (sdktypes.RefundsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/refunds"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RefundsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RefundsListResult](raw)
}

// Refunds Retrieve
func (a *CommerceApi) RefundsRetrieve(refundId string) (sdktypes.RefundsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/refunds/%s", SerializePathParameter(refundId, PathParameterSpec{Name: "refundId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RefundsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.RefundsRetrieveResult](raw)
}

// Shipments List
func (a *CommerceApi) ShipmentsList(page *int, pageSize *int, status *string) (sdktypes.ShipmentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/shipments"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ShipmentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ShipmentsListResult](raw)
}

// Shipments Tracking Events List
func (a *CommerceApi) ShipmentsTrackingEventsList(shipmentId string, page *int, pageSize *int, status *string) (sdktypes.ShipmentsTrackingEventsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath(fmt.Sprintf("/shipments/%s/tracking_events", SerializePathParameter(shipmentId, PathParameterSpec{Name: "shipmentId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.ShipmentsTrackingEventsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ShipmentsTrackingEventsListResult](raw)
}

// Wallet Accounts List
func (a *CommerceApi) WalletAccountsList(page *int, pageSize *int, status *string) (sdktypes.WalletAccountsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/wallet/accounts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletAccountsListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletAccountsListResult](raw)
}

// Wallet Adjustments Create
func (a *CommerceApi) WalletAdjustmentsCreate(body sdktypes.CommerceStandardCommandRequest, idempotencyKey string) (sdktypes.WalletAdjustmentsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/wallet/adjustments"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.WalletAdjustmentsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletAdjustmentsCreateResult](raw)
}

// Wallet Exchange Rules List
func (a *CommerceApi) WalletExchangeRulesList(page *int, pageSize *int, status *string) (sdktypes.WalletExchangeRulesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/wallet/exchange_rules"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletExchangeRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletExchangeRulesListResult](raw)
}

// Wallet Ledger Entries List
func (a *CommerceApi) WalletLedgerEntriesList(page *int, pageSize *int, status *string) (sdktypes.WalletLedgerEntriesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/wallet/ledger_entries"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletLedgerEntriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletLedgerEntriesListResult](raw)
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
