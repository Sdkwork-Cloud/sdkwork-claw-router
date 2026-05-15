package types

// Commerce points exchange rate response schema exposed by Claw Router.
type CommercePointsExchangeRateResponse struct {
	Rate string `json:"rate"`
	SourceAssetType string `json:"sourceAssetType"`
	TargetAssetType string `json:"targetAssetType"`
}
