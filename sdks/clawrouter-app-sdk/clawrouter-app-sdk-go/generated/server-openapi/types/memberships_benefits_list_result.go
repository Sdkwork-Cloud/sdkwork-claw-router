package types

// Memberships benefits list result schema exposed by Claw Router.
type MembershipsBenefitsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
