package types

// Ops referral stat snapshot record schema exposed by Claw Router.
type OpsReferralStatSnapshotRecord struct {
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DirectInvitedCount string `json:"direct_invited_count"`
	Id string `json:"id"`
	InvitationCode string `json:"invitation_code"`
	InvitationCodeId string `json:"invitation_code_id"`
	InviteLink string `json:"invite_link"`
	InviterEmailSnapshot string `json:"inviter_email_snapshot"`
	InviterNameSnapshot string `json:"inviter_name_snapshot"`
	InviterUserId string `json:"inviter_user_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PaidInviteeCount string `json:"paid_invitee_count"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	RebuildVersion string `json:"rebuild_version"`
	RewardAwardedAmount string `json:"reward_awarded_amount"`
	RewardPendingAmount string `json:"reward_pending_amount"`
	SecondaryInvitedCount string `json:"secondary_invited_count"`
	SnapshotAt string `json:"snapshot_at"`
	SnapshotPeriod string `json:"snapshot_period"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalInvitedCount string `json:"total_invited_count"`
	TotalRevenueAmount string `json:"total_revenue_amount"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
}
