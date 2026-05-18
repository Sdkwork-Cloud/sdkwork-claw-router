package types

// Commerce exchange rule upsert request schema exposed by Claw Router.
type CommerceExchangeRuleUpsertRequest struct {
	Rate string `json:"rate"`
	SourceAssetType string `json:"sourceAssetType"`
	Status string `json:"status"`
	TargetAssetType string `json:"targetAssetType"`
}
