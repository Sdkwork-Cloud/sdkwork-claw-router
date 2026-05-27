package types

// Commerce payment attempt create request schema exposed by Claw Router.
type CommercePaymentAttemptCreateRequest struct {
	ClientRequestNo string `json:"clientRequestNo"`
	MethodCode string `json:"methodCode"`
	Note string `json:"note"`
	ProviderCode string `json:"providerCode"`
	ReturnUrl string `json:"returnUrl"`
}
