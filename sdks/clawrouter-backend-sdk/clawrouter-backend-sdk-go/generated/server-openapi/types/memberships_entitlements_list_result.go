package types

// Memberships entitlements list result schema exposed by Claw Router.
type MembershipsEntitlementsListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
