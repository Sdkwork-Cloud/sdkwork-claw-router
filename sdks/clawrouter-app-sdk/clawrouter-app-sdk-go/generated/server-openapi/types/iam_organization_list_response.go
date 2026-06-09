package types

// Iam organization list response schema exposed by Claw Router.
type IamOrganizationListResponse struct {
	Items []IamOrganizationItem `json:"items"`
}
