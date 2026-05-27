package api

import (
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type SdkReferenceApi struct {
    client *sdkhttp.Client
}

func NewSdkReferenceApi(client *sdkhttp.Client) *SdkReferenceApi {
    return &SdkReferenceApi{client: client}
}

// Generate SDK archive
func (a *SdkReferenceApi) ArchivesCreate(body sdktypes.SdkReferenceArchiveGenerateRequest) (sdktypes.ArchivesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/sdk_reference/archives"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.ArchivesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.ArchivesCreateResult](raw)
}

// Generate SDK reference documentation
func (a *SdkReferenceApi) DocumentationCreate(body sdktypes.SdkReferenceDocumentationGenerateRequest) (sdktypes.DocumentationCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/sdk_reference/documentation"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.DocumentationCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.DocumentationCreateResult](raw)
}
