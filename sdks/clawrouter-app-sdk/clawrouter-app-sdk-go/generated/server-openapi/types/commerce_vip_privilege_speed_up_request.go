package types

// Commerce vip privilege speed up request schema exposed by Claw Router.
type CommerceVipPrivilegeSpeedUpRequest struct {
	PrivilegeCode string `json:"privilegeCode"`
	Remarks string `json:"remarks"`
	RequestNo string `json:"requestNo"`
}
