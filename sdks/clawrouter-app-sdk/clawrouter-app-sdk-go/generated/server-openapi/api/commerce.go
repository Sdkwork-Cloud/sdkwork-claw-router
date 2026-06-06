package api

import (
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type CommerceApi struct {
    client *sdkhttp.Client
}

func NewCommerceApi(client *sdkhttp.Client) *CommerceApi {
    return &CommerceApi{client: client}
}

// Recharges Settings Retrieve
func (a *CommerceApi) RechargesSettingsRetrieve() (sdktypes.RechargesSettingsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/recharges/settings"), nil, nil)
    if err != nil {
        var zero sdktypes.RechargesSettingsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.RechargesSettingsRetrieveResult](raw)
}
