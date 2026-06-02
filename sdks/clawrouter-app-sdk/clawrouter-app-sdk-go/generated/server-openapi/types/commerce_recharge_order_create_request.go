package types

// Commerce recharge order create request schema exposed by Claw Router.
type CommerceRechargeOrderCreateRequest struct {
	Amount string `json:"amount"`
	ClientRequestNo string `json:"clientRequestNo"`
	CurrencyCode string `json:"currencyCode"`
	PackageId string `json:"packageId"`
	Source string `json:"source"`
}
