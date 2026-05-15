package api

import (
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type CommunicationApi struct {
    client *sdkhttp.Client
}

func NewCommunicationApi(client *sdkhttp.Client) *CommunicationApi {
    return &CommunicationApi{client: client}
}

// List messages
func (a *CommunicationApi) NotificationsList() (sdktypes.NotificationsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/communication/notifications"), nil, nil)
    if err != nil {
        var zero sdktypes.NotificationsListResult
        return zero, err
    }
    return decodeResult[sdktypes.NotificationsListResult](raw)
}
