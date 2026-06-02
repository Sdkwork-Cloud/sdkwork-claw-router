package types

// Commerce payment provider account item schema exposed by Claw Router.
type CommercePaymentProviderAccountItem struct {
	AccountNo string `json:"accountNo"`
	AccountRole string `json:"accountRole"`
	CertificateRef string `json:"certificateRef"`
	CountryCode string `json:"countryCode"`
	CreatedAt string `json:"createdAt"`
	Environment string `json:"environment"`
	Id string `json:"id"`
	MerchantId string `json:"merchantId"`
	Note string `json:"note"`
	ProviderCode string `json:"providerCode"`
	RotatedAt string `json:"rotatedAt"`
	SecretRef string `json:"secretRef"`
	SettlementCurrency string `json:"settlementCurrency"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	WebhookSecretRef string `json:"webhookSecretRef"`
}
