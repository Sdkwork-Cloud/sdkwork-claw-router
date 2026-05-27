package types

// Memberships purchases renew result schema exposed by Claw Router.
type MembershipsPurchasesRenewResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
