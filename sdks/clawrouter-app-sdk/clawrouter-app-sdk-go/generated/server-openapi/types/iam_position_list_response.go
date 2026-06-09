package types

// Iam position list response schema exposed by Claw Router.
type IamPositionListResponse struct {
	Items []IamPositionItem `json:"items"`
}
