package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type AuthApi struct {
    client *sdkhttp.Client
}

func NewAuthApi(client *sdkhttp.Client) *AuthApi {
    return &AuthApi{client: client}
}

// Retrieve OAuth authorization URL
func (a *AuthApi) OauthAuthorizationUrlsRetrieve(provider string, redirectUri string, state *string, scope *string) (sdktypes.OauthAuthorizationUrlsRetrieveResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "provider", Value: provider, Style: "form", Explode: true, AllowReserved: false},
        {Name: "redirect_uri", Value: redirectUri, Style: "form", Explode: true, AllowReserved: false},
        {Name: "state", Value: func() interface{} { if state == nil { return nil }; return *state }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "scope", Value: func() interface{} { if scope == nil { return nil }; return *scope }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/auth/oauth_authorization_urls"), query), nil, nil)
    if err != nil {
        var zero sdktypes.OauthAuthorizationUrlsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.OauthAuthorizationUrlsRetrieveResult](raw)
}

// Create OAuth IAM session
func (a *AuthApi) OauthSessionsCreate(body sdktypes.IamOauthSessionCreateRequest) (sdktypes.OauthSessionsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/oauth_sessions"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.OauthSessionsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.OauthSessionsCreateResult](raw)
}

// Create password reset request
func (a *AuthApi) PasswordResetRequestsCreate(body sdktypes.IamPasswordResetRequestCreateRequest) (sdktypes.PasswordResetRequestsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/password_reset_requests"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.PasswordResetRequestsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PasswordResetRequestsCreateResult](raw)
}

// Create password reset
func (a *AuthApi) PasswordResetsCreate(body sdktypes.IamPasswordResetCreateRequest) (sdktypes.PasswordResetsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/password_resets"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.PasswordResetsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PasswordResetsCreateResult](raw)
}

// Create IAM registration
func (a *AuthApi) RegistrationsCreate(body sdktypes.IamRegistrationCreateRequest, xRequestId *string) (sdktypes.RegistrationsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/auth/registrations"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.RegistrationsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.RegistrationsCreateResult](raw)
}

// Create IAM session
func (a *AuthApi) SessionsCreate(body sdktypes.IamSessionCreateRequest, xRequestId *string) (sdktypes.SessionsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/auth/sessions"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SessionsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SessionsCreateResult](raw)
}

// Delete current IAM session
func (a *AuthApi) SessionsCurrentDelete() (sdktypes.SessionsCurrentDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath("/auth/sessions/current"), nil, nil)
    if err != nil {
        var zero sdktypes.SessionsCurrentDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.SessionsCurrentDeleteResult](raw)
}

// Retrieve current IAM session
func (a *AuthApi) SessionsCurrentRetrieve() (sdktypes.SessionsCurrentRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/auth/sessions/current"), nil, nil)
    if err != nil {
        var zero sdktypes.SessionsCurrentRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.SessionsCurrentRetrieveResult](raw)
}

// Update current IAM session
func (a *AuthApi) SessionsCurrentUpdate(body sdktypes.IamCurrentSessionUpdateRequest) (sdktypes.SessionsCurrentUpdateResult, error) {
    raw, err := a.client.Patch(AppApiPath("/auth/sessions/current"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.SessionsCurrentUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.SessionsCurrentUpdateResult](raw)
}

// Refresh IAM session
func (a *AuthApi) SessionsRefresh(body sdktypes.IamSessionRefreshRequest) (sdktypes.SessionsRefreshResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/sessions/refresh"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.SessionsRefreshResult
        return zero, err
    }
    return decodeResult[sdktypes.SessionsRefreshResult](raw)
}

// Create verification code
func (a *AuthApi) VerificationCodesCreate(body sdktypes.IamVerificationCodeCreateRequest) (sdktypes.VerificationCodesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/verification_codes"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.VerificationCodesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.VerificationCodesCreateResult](raw)
}

// Verify verification code
func (a *AuthApi) VerificationCodesVerify(body sdktypes.IamVerificationCodeVerifyRequest) (sdktypes.VerificationCodesVerifyResult, error) {
    raw, err := a.client.Post(AppApiPath("/auth/verification_codes/verify"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.VerificationCodesVerifyResult
        return zero, err
    }
    return decodeResult[sdktypes.VerificationCodesVerifyResult](raw)
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
