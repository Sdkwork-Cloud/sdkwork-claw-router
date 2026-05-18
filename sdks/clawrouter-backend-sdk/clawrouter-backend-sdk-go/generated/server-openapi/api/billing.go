package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type BillingApi struct {
    client *sdkhttp.Client
}

func NewBillingApi(client *sdkhttp.Client) *BillingApi {
    return &BillingApi{client: client}
}

// List batches
func (a *BillingApi) CouponBatchesList(couponId *string, status *string, page *int, pageSize *int, cursor *string) (sdktypes.CouponBatchesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "coupon_id", Value: func() interface{} { if couponId == nil { return nil }; return *couponId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/coupon_batches"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CouponBatchesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponBatchesListResult](raw)
}

// Generate batch
func (a *BillingApi) CouponBatchesCreate(body sdktypes.AdminCouponBatchGenerateRequest, xRequestId *string) (sdktypes.CouponBatchesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/billing/coupon_batches"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponBatchesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponBatchesCreateResult](raw)
}

// List promo codes
func (a *BillingApi) CouponCodesList(couponId *string, batchId *string, status *string, page *int, pageSize *int, cursor *string) (sdktypes.CouponCodesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "coupon_id", Value: func() interface{} { if couponId == nil { return nil }; return *couponId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "batch_id", Value: func() interface{} { if batchId == nil { return nil }; return *batchId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/coupon_codes"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CouponCodesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponCodesListResult](raw)
}

// Update promo code status
func (a *BillingApi) CouponCodesStatusUpdate(codeId string, body sdktypes.AdminPromoCodeStatusUpdateRequest, xRequestId *string) (sdktypes.CouponCodesStatusUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/billing/coupon_codes/%s/status", SerializePathParameter(codeId, PathParameterSpec{Name: "codeId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponCodesStatusUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponCodesStatusUpdateResult](raw)
}

// List coupons
func (a *BillingApi) CouponsList(status *string, page *int, pageSize *int, cursor *string) (sdktypes.CouponsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/coupons"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CouponsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsListResult](raw)
}

// Create coupon
func (a *BillingApi) CouponsCreate(body sdktypes.AdminCouponCreateRequest, xRequestId *string) (sdktypes.CouponsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/billing/coupons"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsCreateResult](raw)
}

// Delete coupon
func (a *BillingApi) CouponsDelete(couponId string) (sdktypes.CouponsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/billing/coupons/%s", SerializePathParameter(couponId, PathParameterSpec{Name: "couponId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CouponsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsDeleteResult](raw)
}

// Update coupon
func (a *BillingApi) CouponsUpdate(couponId string, body sdktypes.AdminCouponCreateRequest, xRequestId *string) (sdktypes.CouponsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/billing/coupons/%s", SerializePathParameter(couponId, PathParameterSpec{Name: "couponId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsUpdateResult](raw)
}

// List exchange rules
func (a *BillingApi) ExchangeRulesList(sourceAssetType *string, targetAssetType *string, status *string) (sdktypes.ExchangeRulesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "source_asset_type", Value: func() interface{} { if sourceAssetType == nil { return nil }; return *sourceAssetType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "target_asset_type", Value: func() interface{} { if targetAssetType == nil { return nil }; return *targetAssetType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/exchange_rules"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ExchangeRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.ExchangeRulesListResult](raw)
}

// Upsert exchange rule
func (a *BillingApi) ExchangeRulesUpdate(body sdktypes.CommerceExchangeRuleUpsertRequest, xRequestId *string) (sdktypes.ExchangeRulesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath("/billing/exchange_rules"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.ExchangeRulesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.ExchangeRulesUpdateResult](raw)
}

// List transactions
func (a *BillingApi) FinanceLedgerList(page *int, pageSize *int, q *string, status *string, startTime *string, endTime *string) (sdktypes.FinanceLedgerListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "start_time", Value: func() interface{} { if startTime == nil { return nil }; return *startTime }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "end_time", Value: func() interface{} { if endTime == nil { return nil }; return *endTime }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/finance/ledger"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FinanceLedgerListResult
        return zero, err
    }
    return decodeResult[sdktypes.FinanceLedgerListResult](raw)
}

// List billing
func (a *BillingApi) FinanceUsageStatementsList(page *int, pageSize *int, q *string, status *string, startTime *string, endTime *string) (sdktypes.FinanceUsageStatementsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "start_time", Value: func() interface{} { if startTime == nil { return nil }; return *startTime }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "end_time", Value: func() interface{} { if endTime == nil { return nil }; return *endTime }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/finance/usage_statements"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FinanceUsageStatementsListResult
        return zero, err
    }
    return decodeResult[sdktypes.FinanceUsageStatementsListResult](raw)
}

// List payment attempts
func (a *BillingApi) PaymentsAttemptsList(provider *string, status *string, page *int, pageSize *int, cursor *string) (sdktypes.PaymentsAttemptsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider", Value: func() interface{} { if provider == nil { return nil }; return *provider }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/payments/attempts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsAttemptsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsAttemptsListResult](raw)
}

// List recharge packages
func (a *BillingApi) RechargesPackagesList(status *string) (sdktypes.RechargesPackagesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/recharges/packages"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesListResult](raw)
}

// Create recharge package
func (a *BillingApi) RechargesPackagesCreate(body sdktypes.CommerceRechargePackageMutationRequest, xRequestId *string) (sdktypes.RechargesPackagesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/billing/recharges/packages"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RechargesPackagesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesCreateResult](raw)
}

// Delete recharge package
func (a *BillingApi) RechargesPackagesDelete(packageId string) (sdktypes.RechargesPackagesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/billing/recharges/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesPackagesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesDeleteResult](raw)
}

// Update recharge package
func (a *BillingApi) RechargesPackagesUpdate(packageId string, body sdktypes.CommerceRechargePackageMutationRequest, xRequestId *string) (sdktypes.RechargesPackagesUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/billing/recharges/packages/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RechargesPackagesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesPackagesUpdateResult](raw)
}

// List recharge records
func (a *BillingApi) RechargesRecordsList(userId *string, status *string, page *int, pageSize *int, cursor *string) (sdktypes.RechargesRecordsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "user_id", Value: func() interface{} { if userId == nil { return nil }; return *userId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/recharges/records"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesRecordsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesRecordsListResult](raw)
}

// Retrieve recharge record
func (a *BillingApi) RechargesRecordsRetrieve(orderNo string) (sdktypes.RechargesRecordsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/billing/recharges/records/%s", SerializePathParameter(orderNo, PathParameterSpec{Name: "orderNo", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesRecordsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesRecordsRetrieveResult](raw)
}

// List referral stats
func (a *BillingApi) ReferralsStatsList() (sdktypes.ReferralsStatsListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/billing/referrals/stats"), nil, nil)
    if err != nil {
        var zero sdktypes.ReferralsStatsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ReferralsStatsListResult](raw)
}

// List redemption records
func (a *BillingApi) UsersCouponsList(userId *string, status *string, page *int, pageSize *int, cursor *string) (sdktypes.UsersCouponsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "user_id", Value: func() interface{} { if userId == nil { return nil }; return *userId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/billing/users/coupons"), query), nil, nil)
    if err != nil {
        var zero sdktypes.UsersCouponsListResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersCouponsListResult](raw)
}

// Update balance
func (a *BillingApi) UsersBalanceAdjustmentsCreate(userId string, body sdktypes.AdminUserBalanceAdjustmentRequest, xRequestId *string) (sdktypes.UsersBalanceAdjustmentsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/billing/users/%s/balance_adjustments", SerializePathParameter(userId, PathParameterSpec{Name: "userId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.UsersBalanceAdjustmentsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersBalanceAdjustmentsCreateResult](raw)
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
