package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type SystemApi struct {
    client *sdkhttp.Client
}

func NewSystemApi(client *sdkhttp.Client) *SystemApi {
    return &SystemApi{client: client}
}

// Retrieve IAM auth runtime settings
func (a *SystemApi) AuthSettingsRetrieve() (sdktypes.AuthSettingsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/auth/settings"), nil, nil)
    if err != nil {
        var zero sdktypes.AuthSettingsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AuthSettingsRetrieveResult](raw)
}

// Update IAM auth runtime settings
func (a *SystemApi) AuthSettingsUpdate(body sdktypes.AdminAuthSettingsUpdateRequest, xRequestId *string) (sdktypes.AuthSettingsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Patch(BackendApiPath("/system/auth/settings"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AuthSettingsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AuthSettingsUpdateResult](raw)
}

// List dashboard data
func (a *SystemApi) DashboardAdminOverviewRetrieve() (sdktypes.DashboardAdminOverviewRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/dashboard/admin/overview"), nil, nil)
    if err != nil {
        var zero sdktypes.DashboardAdminOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.DashboardAdminOverviewRetrieveResult](raw)
}

// List firewalls
func (a *SystemApi) FirewallsRulesList() (sdktypes.FirewallsRulesListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/firewalls/rules"), nil, nil)
    if err != nil {
        var zero sdktypes.FirewallsRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.FirewallsRulesListResult](raw)
}

// Create firewall
func (a *SystemApi) FirewallsRulesCreate(body sdktypes.AdminFirewallRuleCreateRequest, xRequestId *string) (sdktypes.FirewallsRulesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/system/firewalls/rules"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.FirewallsRulesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.FirewallsRulesCreateResult](raw)
}

// Delete firewall
func (a *SystemApi) FirewallsRulesDelete(ruleId string) (sdktypes.FirewallsRulesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/system/firewalls/rules/%s", SerializePathParameter(ruleId, PathParameterSpec{Name: "ruleId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FirewallsRulesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.FirewallsRulesDeleteResult](raw)
}

// List installation status
func (a *SystemApi) InstallationStatusRetrieve() (sdktypes.InstallationStatusRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/installation/status"), nil, nil)
    if err != nil {
        var zero sdktypes.InstallationStatusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.InstallationStatusRetrieveResult](raw)
}

// List alerts
func (a *SystemApi) MonitorAlertsList() (sdktypes.MonitorAlertsListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/monitor/alerts"), nil, nil)
    if err != nil {
        var zero sdktypes.MonitorAlertsListResult
        return zero, err
    }
    return decodeResult[sdktypes.MonitorAlertsListResult](raw)
}

// List nodes
func (a *SystemApi) MonitorNodesList() (sdktypes.MonitorNodesListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/monitor/nodes"), nil, nil)
    if err != nil {
        var zero sdktypes.MonitorNodesListResult
        return zero, err
    }
    return decodeResult[sdktypes.MonitorNodesListResult](raw)
}

// List performance data
func (a *SystemApi) MonitorPerformanceList() (sdktypes.MonitorPerformanceListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/monitor/performance"), nil, nil)
    if err != nil {
        var zero sdktypes.MonitorPerformanceListResult
        return zero, err
    }
    return decodeResult[sdktypes.MonitorPerformanceListResult](raw)
}

// List token limits
func (a *SystemApi) RateLimitsApiKeysList() (sdktypes.RateLimitsApiKeysListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/rate_limits/api_keys"), nil, nil)
    if err != nil {
        var zero sdktypes.RateLimitsApiKeysListResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsApiKeysListResult](raw)
}

// Create token limit
func (a *SystemApi) RateLimitsApiKeysCreate(body sdktypes.AdminTokenLimitCreateRequest, xRequestId *string) (sdktypes.RateLimitsApiKeysCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/system/rate_limits/api_keys"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RateLimitsApiKeysCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsApiKeysCreateResult](raw)
}

// List IP limits
func (a *SystemApi) RateLimitsIpList() (sdktypes.RateLimitsIpListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/rate_limits/ip"), nil, nil)
    if err != nil {
        var zero sdktypes.RateLimitsIpListResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsIpListResult](raw)
}

// Create IP limit
func (a *SystemApi) RateLimitsIpCreate(body sdktypes.AdminIpLimitCreateRequest, xRequestId *string) (sdktypes.RateLimitsIpCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/system/rate_limits/ip"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RateLimitsIpCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsIpCreateResult](raw)
}

// List model limits
func (a *SystemApi) RateLimitsModelsList() (sdktypes.RateLimitsModelsListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/system/rate_limits/models"), nil, nil)
    if err != nil {
        var zero sdktypes.RateLimitsModelsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsModelsListResult](raw)
}

// Create model limit
func (a *SystemApi) RateLimitsModelsCreate(body sdktypes.AdminModelLimitCreateRequest, xRequestId *string) (sdktypes.RateLimitsModelsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/system/rate_limits/models"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RateLimitsModelsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RateLimitsModelsCreateResult](raw)
}

// List logs
func (a *SystemApi) RecordsList(page *int, pageSize *int, user *string, token *string, model *string) (sdktypes.RecordsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "user", Value: func() interface{} { if user == nil { return nil }; return *user }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "token", Value: func() interface{} { if token == nil { return nil }; return *token }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "model", Value: func() interface{} { if model == nil { return nil }; return *model }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/system/records"), query), nil, nil)
    if err != nil {
        var zero sdktypes.RecordsListResult
        return zero, err
    }
    return decodeResult[sdktypes.RecordsListResult](raw)
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
