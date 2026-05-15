package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type IamApi struct {
    client *sdkhttp.Client
}

func NewIamApi(client *sdkhttp.Client) *IamApi {
    return &IamApi{client: client}
}

// List keys
func (a *IamApi) ApiKeysList() (sdktypes.ApiKeysListResult, error) {
    raw, err := a.client.Get(AppApiPath("/iam/api_keys"), nil, nil)
    if err != nil {
        var zero sdktypes.ApiKeysListResult
        return zero, err
    }
    return decodeResult[sdktypes.ApiKeysListResult](raw)
}

// Create key
func (a *IamApi) ApiKeysCreate(body sdktypes.CreateApiKeyRequest, idempotencyKey string, xRequestId *string) (sdktypes.ApiKeysCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/iam/api_keys"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.ApiKeysCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.ApiKeysCreateResult](raw)
}

// Retrieve current IAM user
func (a *IamApi) UsersCurrentRetrieve() (sdktypes.UsersCurrentRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/iam/users/current"), nil, nil)
    if err != nil {
        var zero sdktypes.UsersCurrentRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersCurrentRetrieveResult](raw)
}

// List settings
func (a *IamApi) UsersSettingsRetrieve() (sdktypes.UsersSettingsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/iam/users/settings"), nil, nil)
    if err != nil {
        var zero sdktypes.UsersSettingsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersSettingsRetrieveResult](raw)
}

// Update settings
func (a *IamApi) UsersSettingsUpdate(body sdktypes.UpdateSettingsRequest) (sdktypes.UsersSettingsUpdateResult, error) {
    raw, err := a.client.Put(AppApiPath("/iam/users/settings"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.UsersSettingsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersSettingsUpdateResult](raw)
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
