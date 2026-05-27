package types

// Memberships privileges speed ups create result schema exposed by Claw Router.
type MembershipsPrivilegesSpeedUpsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
