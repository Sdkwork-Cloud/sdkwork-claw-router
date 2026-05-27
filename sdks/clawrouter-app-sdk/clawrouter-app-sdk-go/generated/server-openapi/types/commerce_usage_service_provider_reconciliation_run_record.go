package types

// Commerce usage service provider reconciliation run record schema exposed by Claw Router.
type CommerceUsageServiceProviderReconciliationRunRecord struct {
	CreatedAt string `json:"created_at"`
	DifferenceAmount string `json:"difference_amount"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	MatchedCount string `json:"matched_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	MismatchCount string `json:"mismatch_count"`
	MissingExternalCount string `json:"missing_external_count"`
	MissingInternalCount string `json:"missing_internal_count"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RunNo string `json:"run_no"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalExternalAmount string `json:"total_external_amount"`
	TotalInternalAmount string `json:"total_internal_amount"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
