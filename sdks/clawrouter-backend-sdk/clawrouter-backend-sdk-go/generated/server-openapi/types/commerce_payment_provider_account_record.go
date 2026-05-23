package types

// Commerce payment provider account record schema exposed by Claw Router.
type CommercePaymentProviderAccountRecord struct {
	AccountNo string `json:"account_no"`
	CertificateRef string `json:"certificate_ref"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	Environment string `json:"environment"`
	MerchantId string `json:"merchant_id"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	RotatedAt string `json:"rotated_at"`
	SecretRef string `json:"secret_ref"`
	SettlementCurrency string `json:"settlement_currency"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	WebhookSecretRef string `json:"webhook_secret_ref"`
}
