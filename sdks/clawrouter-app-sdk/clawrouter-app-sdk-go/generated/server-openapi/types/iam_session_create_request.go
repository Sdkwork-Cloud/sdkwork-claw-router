package types

// Iam session create request schema exposed by Claw Router.
type IamSessionCreateRequest struct {
	Code string `json:"code"`
	DeviceId string `json:"deviceId"`
	DeviceName string `json:"deviceName"`
	DeviceType string `json:"deviceType"`
	Email string `json:"email"`
	GrantType string `json:"grantType"`
	Name string `json:"name"`
	OrganizationCode string `json:"organizationCode"`
	Password string `json:"password"`
	Phone string `json:"phone"`
	Subject string `json:"subject"`
	TenantCode string `json:"tenantCode"`
	Username string `json:"username"`
}
