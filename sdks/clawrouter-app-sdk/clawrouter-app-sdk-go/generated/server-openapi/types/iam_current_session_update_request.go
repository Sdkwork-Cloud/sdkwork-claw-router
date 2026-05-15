package types

// Iam current session update request schema exposed by Claw Router.
type IamCurrentSessionUpdateRequest struct {
	DeviceName string `json:"deviceName"`
	OrganizationCode string `json:"organizationCode"`
	OrganizationId string `json:"organizationId"`
}
