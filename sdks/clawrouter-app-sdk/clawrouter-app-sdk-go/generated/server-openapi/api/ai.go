package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type AiApi struct {
    client *sdkhttp.Client
}

func NewAiApi(client *sdkhttp.Client) *AiApi {
    return &AiApi{client: client}
}

// List dashboard overview
func (a *AiApi) DashboardOverviewRetrieve(timeRange *string, startTime *string, endTime *string) (sdktypes.DashboardOverviewRetrieveResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "time_range", Value: func() interface{} { if timeRange == nil { return nil }; return *timeRange }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "start_time", Value: func() interface{} { if startTime == nil { return nil }; return *startTime }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "end_time", Value: func() interface{} { if endTime == nil { return nil }; return *endTime }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/ai/dashboard/overview"), query), nil, nil)
    if err != nil {
        var zero sdktypes.DashboardOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.DashboardOverviewRetrieveResult](raw)
}

// List traces
func (a *AiApi) GatewayTracesList() (sdktypes.GatewayTracesListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/gateway/traces"), nil, nil)
    if err != nil {
        var zero sdktypes.GatewayTracesListResult
        return zero, err
    }
    return decodeResult[sdktypes.GatewayTracesListResult](raw)
}

// List generation history
func (a *AiApi) GenerationsList() (sdktypes.GenerationsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/generations"), nil, nil)
    if err != nil {
        var zero sdktypes.GenerationsListResult
        return zero, err
    }
    return decodeResult[sdktypes.GenerationsListResult](raw)
}

// List model rankings
func (a *AiApi) ModelRankingsList(rankScope *string, vendorCode *string, modality *string, q *string, limit *int) (sdktypes.ModelRankingsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "rank_scope", Value: func() interface{} { if rankScope == nil { return nil }; return *rankScope }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "vendor_code", Value: func() interface{} { if vendorCode == nil { return nil }; return *vendorCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "modality", Value: func() interface{} { if modality == nil { return nil }; return *modality }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/ai/model_rankings"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ModelRankingsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ModelRankingsListResult](raw)
}

// List ranking vendor filters
func (a *AiApi) ModelVendorsList() (sdktypes.ModelVendorsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/model_vendors"), nil, nil)
    if err != nil {
        var zero sdktypes.ModelVendorsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ModelVendorsListResult](raw)
}

// List models
func (a *AiApi) ModelsList(billingMeter *string, vendorCode *string, vendorCodes []string, modalities []string, capabilities []string, categories []string, groups []string, q *string, limit *int) (sdktypes.ModelsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "billing_meter", Value: func() interface{} { if billingMeter == nil { return nil }; return *billingMeter }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "vendor_code", Value: func() interface{} { if vendorCode == nil { return nil }; return *vendorCode }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "vendor_codes", Value: func() interface{} { if vendorCodes == nil { return nil }; return *vendorCodes }(), Style: "form", Explode: false, AllowReserved: false},
        {Name: "modalities", Value: func() interface{} { if modalities == nil { return nil }; return *modalities }(), Style: "form", Explode: false, AllowReserved: false},
        {Name: "capabilities", Value: func() interface{} { if capabilities == nil { return nil }; return *capabilities }(), Style: "form", Explode: false, AllowReserved: false},
        {Name: "categories", Value: func() interface{} { if categories == nil { return nil }; return *categories }(), Style: "form", Explode: false, AllowReserved: false},
        {Name: "groups", Value: func() interface{} { if groups == nil { return nil }; return *groups }(), Style: "form", Explode: false, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/ai/models"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ModelsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ModelsListResult](raw)
}

// List providers
func (a *AiApi) ProvidersList() (sdktypes.ProvidersListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/providers"), nil, nil)
    if err != nil {
        var zero sdktypes.ProvidersListResult
        return zero, err
    }
    return decodeResult[sdktypes.ProvidersListResult](raw)
}

// List API keys
func (a *AiApi) RoutingApiKeysList() (sdktypes.RoutingApiKeysListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/routing/api_keys"), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingApiKeysListResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingApiKeysListResult](raw)
}

// List channels
func (a *AiApi) RoutingChannelsList() (sdktypes.RoutingChannelsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/routing/channels"), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingChannelsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsListResult](raw)
}

// Create channel
func (a *AiApi) RoutingChannelsCreate(body sdktypes.CreateRoutingChannelRequest, xRequestId *string) (sdktypes.RoutingChannelsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/ai/routing/channels"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RoutingChannelsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsCreateResult](raw)
}

// Delete channel
func (a *AiApi) RoutingChannelsDelete(channelId string) (sdktypes.RoutingChannelsDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/ai/routing/channels/%s", SerializePathParameter(channelId, PathParameterSpec{Name: "channelId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingChannelsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsDeleteResult](raw)
}

// Update channel
func (a *AiApi) RoutingChannelsUpdate(channelId string, body sdktypes.UpdateRoutingChannelRequest, xRequestId *string) (sdktypes.RoutingChannelsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(AppApiPath(fmt.Sprintf("/ai/routing/channels/%s", SerializePathParameter(channelId, PathParameterSpec{Name: "channelId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RoutingChannelsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsUpdateResult](raw)
}

// Set channel status
func (a *AiApi) RoutingChannelsStatusUpdate(channelId string, body sdktypes.SetRoutingChannelStatusRequest, xRequestId *string) (sdktypes.RoutingChannelsStatusUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(AppApiPath(fmt.Sprintf("/ai/routing/channels/%s/status", SerializePathParameter(channelId, PathParameterSpec{Name: "channelId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RoutingChannelsStatusUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsStatusUpdateResult](raw)
}

// Test channel
func (a *AiApi) RoutingChannelsVerify(channelId string, xRequestId *string) (sdktypes.RoutingChannelsVerifyResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/ai/routing/channels/%s/verify", SerializePathParameter(channelId, PathParameterSpec{Name: "channelId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.RoutingChannelsVerifyResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingChannelsVerifyResult](raw)
}

// List request traces
func (a *AiApi) RoutingRequestTracesList() (sdktypes.RoutingRequestTracesListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/routing/request_traces"), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingRequestTracesListResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingRequestTracesListResult](raw)
}

// List strategy
func (a *AiApi) RoutingStrategyList() (sdktypes.RoutingStrategyListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/routing/strategy"), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingStrategyListResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingStrategyListResult](raw)
}

// Update strategy
func (a *AiApi) RoutingStrategyUpdate(body sdktypes.UpdateRoutingStrategyRequest) (sdktypes.RoutingStrategyUpdateResult, error) {
    raw, err := a.client.Put(AppApiPath("/ai/routing/strategy"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.RoutingStrategyUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingStrategyUpdateResult](raw)
}

// List usage data
func (a *AiApi) RoutingUsageList() (sdktypes.RoutingUsageListResult, error) {
    raw, err := a.client.Get(AppApiPath("/ai/routing/usage"), nil, nil)
    if err != nil {
        var zero sdktypes.RoutingUsageListResult
        return zero, err
    }
    return decodeResult[sdktypes.RoutingUsageListResult](raw)
}

// List logs
func (a *AiApi) UsageLogsList(page *int, pageSize *int, q *string, status *string, startTime *string, endTime *string) (sdktypes.UsageLogsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "start_time", Value: func() interface{} { if startTime == nil { return nil }; return *startTime }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "end_time", Value: func() interface{} { if endTime == nil { return nil }; return *endTime }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/ai/usage/logs"), query), nil, nil)
    if err != nil {
        var zero sdktypes.UsageLogsListResult
        return zero, err
    }
    return decodeResult[sdktypes.UsageLogsListResult](raw)
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
