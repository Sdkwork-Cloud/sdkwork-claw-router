package types

// Integration service provider price change request record schema exposed by Claw Router.
type IntegrationServiceProviderPriceChangeRequestRecord struct {
	AfterHash string `json:"after_hash"`
	ApprovalStatus string `json:"approval_status"`
	ApprovedBy string `json:"approved_by"`
	BeforeHash string `json:"before_hash"`
	BuyerProviderId string `json:"buyer_provider_id"`
	ChangeNo string `json:"change_no"`
	ChangeType string `json:"change_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DraftPayload map[string]JsonValue `json:"draft_payload"`
	EffectiveFrom string `json:"effective_from"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RequestedBy string `json:"requested_by"`
	SellerProviderId string `json:"seller_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
