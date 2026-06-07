package types

// Commerce payment provider account mutation request schema exposed by Claw Router.
type CommercePaymentProviderAccountMutationRequest struct {
	AccountRole string `json:"accountRole"`
	CertificateRef string `json:"certificateRef"`
	ClientRequestNo string `json:"clientRequestNo"`
	CountryCode string `json:"countryCode"`
	Environment string `json:"environment"`
	MerchantId string `json:"merchantId"`
	Note string `json:"note"`
	ProviderCode string `json:"providerCode"`
	RotatedAt string `json:"rotatedAt"`
	SecretRef string `json:"secretRef"`
	SettlementCurrency string `json:"settlementCurrency"`
	Status string `json:"status"`
	WebhookSecretRef string `json:"webhookSecretRef"`
}
