package types

// Commerce account ledger entry record schema exposed by Claw Router.
type CommerceAccountLedgerEntryRecord struct {
	AccountId string `json:"account_id"`
	Amount string `json:"amount"`
	AssetType string `json:"asset_type"`
	BalanceAfter string `json:"balance_after"`
	BusinessType string `json:"business_type"`
	CreatedAt string `json:"created_at"`
	Direction string `json:"direction"`
	IdempotencyKey string `json:"idempotency_key"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	Remark string `json:"remark"`
	RequestNo string `json:"request_no"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	TenantId string `json:"tenant_id"`
	TransactionNo string `json:"transaction_no"`
}
