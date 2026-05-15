package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-backend-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type EcosystemApi struct {
    client *sdkhttp.Client
}

func NewEcosystemApi(client *sdkhttp.Client) *EcosystemApi {
    return &EcosystemApi{client: client}
}

// List skills
func (a *EcosystemApi) SkillsList(q *string, marketStatus *string, reviewStatus *string, visibility *string, enabled *bool, categoryId *string, page *int, pageSize *int) (sdktypes.SkillsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "market_status", Value: func() interface{} { if marketStatus == nil { return nil }; return *marketStatus }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "review_status", Value: func() interface{} { if reviewStatus == nil { return nil }; return *reviewStatus }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "visibility", Value: func() interface{} { if visibility == nil { return nil }; return *visibility }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "enabled", Value: func() interface{} { if enabled == nil { return nil }; return *enabled }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category_id", Value: func() interface{} { if categoryId == nil { return nil }; return *categoryId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/ecosystem/skills"), query), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsListResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsListResult](raw)
}

// Create skill
func (a *EcosystemApi) SkillsCreate(body sdktypes.AdminSkillCreateRequest, xRequestId *string) (sdktypes.SkillsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/ecosystem/skills"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsCreateResult](raw)
}

// List skill categories
func (a *EcosystemApi) SkillsCategoriesList() (sdktypes.SkillsCategoriesListResult, error) {
    raw, err := a.client.Get(BackendApiPath("/ecosystem/skills/categories"), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsCategoriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsCategoriesListResult](raw)
}

// Create skill category
func (a *EcosystemApi) SkillsCategoriesCreate(body sdktypes.AdminSkillCategoryCreateRequest, xRequestId *string) (sdktypes.SkillsCategoriesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/ecosystem/skills/categories"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsCategoriesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsCategoriesCreateResult](raw)
}

// List skill packages
func (a *EcosystemApi) SkillsPackageList(q *string, enabled *bool, categoryId *string, page *int, pageSize *int) (sdktypes.SkillsPackageListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "enabled", Value: func() interface{} { if enabled == nil { return nil }; return *enabled }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category_id", Value: func() interface{} { if categoryId == nil { return nil }; return *categoryId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(BackendApiPath("/ecosystem/skills/package"), query), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsPackageListResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageListResult](raw)
}

// Create skill package
func (a *EcosystemApi) SkillsPackageCreate(body sdktypes.AdminSkillPackageCreateRequest, xRequestId *string) (sdktypes.SkillsPackageCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath("/ecosystem/skills/package"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsPackageCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageCreateResult](raw)
}

// Delete skill package
func (a *EcosystemApi) SkillsPackageDelete(packageId string) (sdktypes.SkillsPackageDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/ecosystem/skills/package/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsPackageDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageDeleteResult](raw)
}

// Get skill package
func (a *EcosystemApi) SkillsPackageRetrieve(packageId string) (sdktypes.SkillsPackageRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/package/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsPackageRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageRetrieveResult](raw)
}

// Update skill package
func (a *EcosystemApi) SkillsPackageUpdate(packageId string, body sdktypes.AdminSkillPackageUpdateRequest, xRequestId *string) (sdktypes.SkillsPackageUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/ecosystem/skills/package/%s", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsPackageUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageUpdateResult](raw)
}

// Disable skill package
func (a *EcosystemApi) SkillsPackageDisable(packageId string, xRequestId *string) (sdktypes.SkillsPackageDisableResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/package/%s/disable", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsPackageDisableResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageDisableResult](raw)
}

// Enable skill package
func (a *EcosystemApi) SkillsPackageEnable(packageId string, xRequestId *string) (sdktypes.SkillsPackageEnableResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/package/%s/enable", SerializePathParameter(packageId, PathParameterSpec{Name: "packageId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsPackageEnableResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPackageEnableResult](raw)
}

// Delete skill
func (a *EcosystemApi) SkillsDelete(skillId string) (sdktypes.SkillsDeleteResult, error) {
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsDeleteResult](raw)
}

// Get skill
func (a *EcosystemApi) SkillsRetrieve(skillId string) (sdktypes.SkillsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsRetrieveResult](raw)
}

// Update skill
func (a *EcosystemApi) SkillsUpdate(skillId string, body sdktypes.AdminSkillUpdateRequest, xRequestId *string) (sdktypes.SkillsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsUpdateResult](raw)
}

// List skill artifacts
func (a *EcosystemApi) SkillsArtifactsList(skillId string) (sdktypes.SkillsArtifactsListResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/artifacts", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsArtifactsListResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsArtifactsListResult](raw)
}

// Create skill artifact
func (a *EcosystemApi) SkillsArtifactsCreate(skillId string, body sdktypes.AdminSkillArtifactCreateRequest, xRequestId *string) (sdktypes.SkillsArtifactsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/artifacts", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsArtifactsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsArtifactsCreateResult](raw)
}

// Delete skill artifact
func (a *EcosystemApi) SkillsArtifactsDelete(skillId string, artifactId string, xRequestId *string) (sdktypes.SkillsArtifactsDeleteResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/artifacts/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(artifactId, PathParameterSpec{Name: "artifactId", Style: "simple", Explode: false}))), nil, headers)
    if err != nil {
        var zero sdktypes.SkillsArtifactsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsArtifactsDeleteResult](raw)
}

// Get skill artifact
func (a *EcosystemApi) SkillsArtifactsRetrieve(skillId string, artifactId string) (sdktypes.SkillsArtifactsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/artifacts/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(artifactId, PathParameterSpec{Name: "artifactId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsArtifactsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsArtifactsRetrieveResult](raw)
}

// Update skill artifact
func (a *EcosystemApi) SkillsArtifactsUpdate(skillId string, artifactId string, body sdktypes.AdminSkillArtifactUpdateRequest, xRequestId *string) (sdktypes.SkillsArtifactsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/artifacts/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(artifactId, PathParameterSpec{Name: "artifactId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsArtifactsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsArtifactsUpdateResult](raw)
}

// List skill assets
func (a *EcosystemApi) SkillsAssetsList(skillId string) (sdktypes.SkillsAssetsListResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/assets", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsAssetsListResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsAssetsListResult](raw)
}

// Create skill asset
func (a *EcosystemApi) SkillsAssetsCreate(skillId string, body sdktypes.AdminSkillAssetCreateRequest, xRequestId *string) (sdktypes.SkillsAssetsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/assets", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsAssetsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsAssetsCreateResult](raw)
}

// Delete skill asset
func (a *EcosystemApi) SkillsAssetsDelete(skillId string, assetId string, xRequestId *string) (sdktypes.SkillsAssetsDeleteResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Delete(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/assets/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(assetId, PathParameterSpec{Name: "assetId", Style: "simple", Explode: false}))), nil, headers)
    if err != nil {
        var zero sdktypes.SkillsAssetsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsAssetsDeleteResult](raw)
}

// Get skill asset
func (a *EcosystemApi) SkillsAssetsRetrieve(skillId string, assetId string) (sdktypes.SkillsAssetsRetrieveResult, error) {
    raw, err := a.client.Get(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/assets/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(assetId, PathParameterSpec{Name: "assetId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.SkillsAssetsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsAssetsRetrieveResult](raw)
}

// Update skill asset
func (a *EcosystemApi) SkillsAssetsUpdate(skillId string, assetId string, body sdktypes.AdminSkillAssetUpdateRequest, xRequestId *string) (sdktypes.SkillsAssetsUpdateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Put(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/assets/%s", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}), SerializePathParameter(assetId, PathParameterSpec{Name: "assetId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsAssetsUpdateResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsAssetsUpdateResult](raw)
}

// Disable skill
func (a *EcosystemApi) SkillsDisable(skillId string, xRequestId *string) (sdktypes.SkillsDisableResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/disable", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsDisableResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsDisableResult](raw)
}

// Enable skill
func (a *EcosystemApi) SkillsEnable(skillId string, xRequestId *string) (sdktypes.SkillsEnableResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/enable", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsEnableResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsEnableResult](raw)
}

// Publish skill
func (a *EcosystemApi) SkillsPublish(skillId string, xRequestId *string) (sdktypes.SkillsPublishResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/publish", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsPublishResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsPublishResult](raw)
}

// Approve skill
func (a *EcosystemApi) SkillsReviewApprove(skillId string, body sdktypes.AdminSkillReviewRequest, xRequestId *string) (sdktypes.SkillsReviewApproveResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/review/approve", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsReviewApproveResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsReviewApproveResult](raw)
}

// Reject skill
func (a *EcosystemApi) SkillsReviewReject(skillId string, body sdktypes.AdminSkillReviewRequest, xRequestId *string) (sdktypes.SkillsReviewRejectResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/review/reject", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.SkillsReviewRejectResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsReviewRejectResult](raw)
}

// Offline skill
func (a *EcosystemApi) SkillsUnpublish(skillId string, xRequestId *string) (sdktypes.SkillsUnpublishResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{"X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},},
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(BackendApiPath(fmt.Sprintf("/ecosystem/skills/%s/unpublish", SerializePathParameter(skillId, PathParameterSpec{Name: "skillId", Style: "simple", Explode: false}))), nil, nil, headers, "")
    if err != nil {
        var zero sdktypes.SkillsUnpublishResult
        return zero, err
    }
    return decodeResult[sdktypes.SkillsUnpublishResult](raw)
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
