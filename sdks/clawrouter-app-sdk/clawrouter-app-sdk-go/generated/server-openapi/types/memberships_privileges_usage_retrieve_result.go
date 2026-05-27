package types

// Memberships privileges usage retrieve result schema exposed by Claw Router.
type MembershipsPrivilegesUsageRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
