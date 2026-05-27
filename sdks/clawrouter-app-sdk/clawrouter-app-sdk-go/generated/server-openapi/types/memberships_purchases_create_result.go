package types

// Memberships purchases create result schema exposed by Claw Router.
type MembershipsPurchasesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
