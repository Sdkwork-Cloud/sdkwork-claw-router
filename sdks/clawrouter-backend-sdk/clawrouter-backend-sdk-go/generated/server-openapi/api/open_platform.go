package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type OpenPlatformApi struct {
    client *sdkhttp.Client
}

func NewOpenPlatformApi(client *sdkhttp.Client) *OpenPlatformApi {
    return &OpenPlatformApi{client: client}
}

// List open platform accounts
func (a *OpenPlatformApi) AccountsList(provider *string, type_ *string, status *string, page *int, pageSize *int) (sdktypes.AccountsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider", Value: func() interface{} { if provider == nil { return nil }; return *provider }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "type", Value: func() interface{} { if type_ == nil { return nil }; return *type_ }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/open_platform/accounts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsListResult](raw)
}

// Create open platform account
func (a *OpenPlatformApi) AccountsCreate(body sdktypes.OpenPlatformAccountCreateRequest) (sdktypes.AccountsCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath("/open_platform/accounts"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AccountsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsCreateResult](raw)
}

// Delete open platform account
func (a *OpenPlatformApi) AccountsDelete(accountId string) (sdktypes.AccountsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsDeleteResult](raw)
}

// Retrieve open platform account
func (a *OpenPlatformApi) AccountsRetrieve(accountId string) (sdktypes.AccountsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsRetrieveResult](raw)
}

// Update open platform account
func (a *OpenPlatformApi) AccountsUpdate(accountId string, body sdktypes.OpenPlatformAccountUpdateRequest) (sdktypes.AccountsUpdateResult, error) {
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AccountsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsUpdateResult](raw)
}

// List open platform account entries
func (a *OpenPlatformApi) AccountsEntriesList(accountId string) (sdktypes.AccountsEntriesListResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/entries", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsEntriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsEntriesListResult](raw)
}

// Create open platform account entry
func (a *OpenPlatformApi) AccountsEntriesCreate(accountId string, body sdktypes.OpenPlatformEntryCreateRequest) (sdktypes.AccountsEntriesCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/entries", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AccountsEntriesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsEntriesCreateResult](raw)
}

// Delete open platform account entry
func (a *OpenPlatformApi) AccountsEntriesDelete(accountId string, entryId string) (sdktypes.AccountsEntriesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/entries/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}), SerializePathParameter(entryId, PathParameterSpec{Name: "entryId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsEntriesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsEntriesDeleteResult](raw)
}

// Update open platform account entry
func (a *OpenPlatformApi) AccountsEntriesUpdate(accountId string, entryId string, body sdktypes.OpenPlatformEntryUpdateRequest) (sdktypes.AccountsEntriesUpdateResult, error) {
    raw, err := a.client.Patch(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/entries/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}), SerializePathParameter(entryId, PathParameterSpec{Name: "entryId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AccountsEntriesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsEntriesUpdateResult](raw)
}

// List open platform account pay bindings
func (a *OpenPlatformApi) AccountsPayBindingsList(accountId string) (sdktypes.AccountsPayBindingsListResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/pay_bindings", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsPayBindingsListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsPayBindingsListResult](raw)
}

// Create open platform account pay binding
func (a *OpenPlatformApi) AccountsPayBindingsCreate(accountId string, body sdktypes.OpenPlatformPayBindingCreateRequest) (sdktypes.AccountsPayBindingsCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/pay_bindings", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AccountsPayBindingsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsPayBindingsCreateResult](raw)
}

// Delete open platform account pay binding
func (a *OpenPlatformApi) AccountsPayBindingsDelete(accountId string, bindingId string) (sdktypes.AccountsPayBindingsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/open_platform/accounts/%s/pay_bindings/%s", SerializePathParameter(accountId, PathParameterSpec{Name: "accountId", Style: "simple", Explode: false}), SerializePathParameter(bindingId, PathParameterSpec{Name: "bindingId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountsPayBindingsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountsPayBindingsDeleteResult](raw)
}

// List open platform manifests
func (a *OpenPlatformApi) ManifestsList(provider *string, type_ *string) (sdktypes.ManifestsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider", Value: func() interface{} { if provider == nil { return nil }; return *provider }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "type", Value: func() interface{} { if type_ == nil { return nil }; return *type_ }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/open_platform/manifests"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ManifestsListResult
        return zero, err
    }
    return decodeResult[sdktypes.ManifestsListResult](raw)
}

// List open platform providers
func (a *OpenPlatformApi) ProvidersList(status *string) (sdktypes.ProvidersListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/open_platform/providers"), query), nil, nil)
    if err != nil {
        var zero sdktypes.ProvidersListResult
        return zero, err
    }
    return decodeResult[sdktypes.ProvidersListResult](raw)
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
