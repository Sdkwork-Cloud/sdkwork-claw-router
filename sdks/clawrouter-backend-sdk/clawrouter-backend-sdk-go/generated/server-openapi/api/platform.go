package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type PlatformApi struct {
    client *sdkhttp.Client
}

func NewPlatformApi(client *sdkhttp.Client) *PlatformApi {
    return &PlatformApi{client: client}
}

// List apps
func (a *PlatformApi) AppsList(q *string, status *string, marketStatus *string, appType *string, categoryId *int, page *int, pageSize *int) (sdktypes.AppsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "market_status", Value: func() interface{} { if marketStatus == nil { return nil }; return *marketStatus }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "app_type", Value: func() interface{} { if appType == nil { return nil }; return *appType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category_id", Value: func() interface{} { if categoryId == nil { return nil }; return *categoryId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/platform/apps"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AppsListResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsListResult](raw)
}

// Create app
func (a *PlatformApi) AppsCreate(body sdktypes.AdminAppCreateRequest) (sdktypes.AppsCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath("/platform/apps"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsCreateResult](raw)
}

// List app categories
func (a *PlatformApi) AppsCategoriesList() (sdktypes.AppsCategoriesListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/platform/apps/categories"), nil, nil)
    if err != nil {
        var zero sdktypes.AppsCategoriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsCategoriesListResult](raw)
}

// Create app category
func (a *PlatformApi) AppsCategoriesCreate(body sdktypes.AdminAppCategoryCreateRequest) (sdktypes.AppsCategoriesCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath("/platform/apps/categories"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsCategoriesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsCategoriesCreateResult](raw)
}

// Delete app category
func (a *PlatformApi) AppsCategoriesDelete(categoryId string) (sdktypes.AppsCategoriesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/platform/apps/categories/%s", SerializePathParameter(categoryId, PathParameterSpec{Name: "categoryId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AppsCategoriesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsCategoriesDeleteResult](raw)
}

// Update app category
func (a *PlatformApi) AppsCategoriesUpdate(categoryId string, body sdktypes.AdminAppCategoryUpdateRequest) (sdktypes.AppsCategoriesUpdateResult, error) {
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/platform/apps/categories/%s", SerializePathParameter(categoryId, PathParameterSpec{Name: "categoryId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsCategoriesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsCategoriesUpdateResult](raw)
}

// List app templates
func (a *PlatformApi) AppsTemplatesList(q *string, publishStatus *string, templateType *string, runtime *string, categoryId *int, page *int, pageSize *int) (sdktypes.AppsTemplatesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "publish_status", Value: func() interface{} { if publishStatus == nil { return nil }; return *publishStatus }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "template_type", Value: func() interface{} { if templateType == nil { return nil }; return *templateType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "runtime", Value: func() interface{} { if runtime == nil { return nil }; return *runtime }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category_id", Value: func() interface{} { if categoryId == nil { return nil }; return *categoryId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/platform/apps/templates"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AppsTemplatesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesListResult](raw)
}

// Create app template
func (a *PlatformApi) AppsTemplatesCreate(body sdktypes.AdminAppTemplateCreateRequest) (sdktypes.AppsTemplatesCreateResult, error) {
    raw, err := a.client.Post(BackendApiPath("/platform/apps/templates"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsTemplatesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesCreateResult](raw)
}

// Delete app template
func (a *PlatformApi) AppsTemplatesDelete(templateId string) (sdktypes.AppsTemplatesDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/platform/apps/templates/%s", SerializePathParameter(templateId, PathParameterSpec{Name: "templateId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AppsTemplatesDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesDeleteResult](raw)
}

// List app template
func (a *PlatformApi) AppsTemplatesRetrieve(templateId string) (sdktypes.AppsTemplatesRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/platform/apps/templates/%s", SerializePathParameter(templateId, PathParameterSpec{Name: "templateId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AppsTemplatesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesRetrieveResult](raw)
}

// Update app template
func (a *PlatformApi) AppsTemplatesUpdate(templateId string, body sdktypes.AdminAppTemplateUpdateRequest) (sdktypes.AppsTemplatesUpdateResult, error) {
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/platform/apps/templates/%s", SerializePathParameter(templateId, PathParameterSpec{Name: "templateId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsTemplatesUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesUpdateResult](raw)
}

// Publish app template
func (a *PlatformApi) AppsTemplatesPublish(templateId string) (sdktypes.AppsTemplatesPublishResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/templates/%s/publish", SerializePathParameter(templateId, PathParameterSpec{Name: "templateId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsTemplatesPublishResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesPublishResult](raw)
}

// Offline app template
func (a *PlatformApi) AppsTemplatesUnpublish(templateId string) (sdktypes.AppsTemplatesUnpublishResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/templates/%s/unpublish", SerializePathParameter(templateId, PathParameterSpec{Name: "templateId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsTemplatesUnpublishResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsTemplatesUnpublishResult](raw)
}

// Delete app
func (a *PlatformApi) AppsDelete(appId string) (sdktypes.AppsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/platform/apps/%s", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AppsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsDeleteResult](raw)
}

// List app
func (a *PlatformApi) AppsRetrieve(appId string) (sdktypes.AppsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/platform/apps/%s", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AppsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsRetrieveResult](raw)
}

// Update app
func (a *PlatformApi) AppsUpdate(appId string, body sdktypes.AdminAppUpdateRequest) (sdktypes.AppsUpdateResult, error) {
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/platform/apps/%s", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.AppsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsUpdateResult](raw)
}

// Disable app
func (a *PlatformApi) AppsDisable(appId string) (sdktypes.AppsDisableResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/%s/disable", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsDisableResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsDisableResult](raw)
}

// Enable app
func (a *PlatformApi) AppsEnable(appId string) (sdktypes.AppsEnableResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/%s/enable", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsEnableResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsEnableResult](raw)
}

// Publish app
func (a *PlatformApi) AppsPublish(appId string) (sdktypes.AppsPublishResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/%s/publish", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsPublishResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsPublishResult](raw)
}

// Offline app
func (a *PlatformApi) AppsUnpublish(appId string) (sdktypes.AppsUnpublishResult, error) {
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/platform/apps/%s/unpublish", SerializePathParameter(appId, PathParameterSpec{Name: "appId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.AppsUnpublishResult
        return zero, err
    }
    return decodeResult[sdktypes.AppsUnpublishResult](raw)
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
