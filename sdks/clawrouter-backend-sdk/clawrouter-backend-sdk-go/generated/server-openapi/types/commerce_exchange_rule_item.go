package types

// Commerce exchange rule item schema exposed by Claw Router.
type CommerceExchangeRuleItem struct {
	Id string `json:"id"`
	Rate string `json:"rate"`
	SourceAssetType string `json:"sourceAssetType"`
	Status string `json:"status"`
	TargetAssetType string `json:"targetAssetType"`
}
