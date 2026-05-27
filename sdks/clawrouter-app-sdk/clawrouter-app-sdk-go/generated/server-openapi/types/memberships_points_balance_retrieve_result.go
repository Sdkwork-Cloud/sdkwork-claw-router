package types

// Memberships points balance retrieve result schema exposed by Claw Router.
type MembershipsPointsBalanceRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
