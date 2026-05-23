package types

// Commerce exchange rule record schema exposed by Claw Router.
type CommerceExchangeRuleRecord struct {
	CreatedAt string `json:"created_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrganizationId string `json:"organization_id"`
	Rate string `json:"rate"`
	Remark string `json:"remark"`
	RequestNo string `json:"request_no"`
	RuleNo string `json:"rule_no"`
	SourceAssetType string `json:"source_asset_type"`
	Status string `json:"status"`
	TargetAssetType string `json:"target_asset_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
