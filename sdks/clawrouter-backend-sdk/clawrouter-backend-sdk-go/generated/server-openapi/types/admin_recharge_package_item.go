package types

// Admin recharge package item schema exposed by Claw Router.
type AdminRechargePackageItem struct {
	BonusPoints int `json:"bonusPoints"`
	CurrencyCode string `json:"currencyCode"`
	GrantAmount int `json:"grantAmount"`
	Id string `json:"id"`
	Name string `json:"name"`
	PackageNo string `json:"packageNo"`
	Points int `json:"points"`
	PriceAmount string `json:"priceAmount"`
	SkuId string `json:"skuId"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}
