package types

// Ops audit log record schema exposed by Claw Router.
type OpsAuditLogRecord struct {
	Action string `json:"action"`
	AfterHash string `json:"after_hash"`
	ApprovalId string `json:"approval_id"`
	BeforeHash string `json:"before_hash"`
	ChangeSummary map[string]JsonValue `json:"change_summary"`
	ClientIpHash string `json:"client_ip_hash"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OperatorId string `json:"operator_id"`
	OperatorNameSnapshot string `json:"operator_name_snapshot"`
	OperatorType string `json:"operator_type"`
	OrganizationId string `json:"organization_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RiskLevel string `json:"risk_level"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TargetUuid string `json:"target_uuid"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserAgentHash string `json:"user_agent_hash"`
	Uuid string `json:"uuid"`
}
