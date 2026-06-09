package types

// Iam organization membership list response schema exposed by Claw Router.
type IamOrganizationMembershipListResponse struct {
	Items []IamOrganizationMembershipItem `json:"items"`
}
