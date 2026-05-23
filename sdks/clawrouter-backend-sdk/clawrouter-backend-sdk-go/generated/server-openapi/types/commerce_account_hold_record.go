package types

// Commerce account hold record schema exposed by Claw Router.
type CommerceAccountHoldRecord struct {
	AccountId string `json:"account_id"`
	Amount string `json:"amount"`
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PreholdNo string `json:"prehold_no"`
	ReleasedAt string `json:"released_at"`
	RequestNo string `json:"request_no"`
	SettledAt string `json:"settled_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
