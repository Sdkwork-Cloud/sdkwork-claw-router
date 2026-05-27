package types

// Memberships purchases upgrade result schema exposed by Claw Router.
type MembershipsPurchasesUpgradeResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
