package types

// Commerce payment provider account status update request schema exposed by Claw Router.
type CommercePaymentProviderAccountStatusUpdateRequest struct {
	ClientRequestNo string `json:"clientRequestNo"`
	Note string `json:"note"`
	Status string `json:"status"`
}
