package types

// Commerce preflight request schema exposed by Claw Router.
type CommercePreflightRequest struct {
	Amount string `json:"amount"`
	BusinessType string `json:"businessType"`
	Remarks string `json:"remarks"`
	RequestNo string `json:"requestNo"`
}
