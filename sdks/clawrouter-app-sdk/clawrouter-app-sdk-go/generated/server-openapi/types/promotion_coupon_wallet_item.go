package types

// Promotion coupon wallet item schema exposed by Claw Router.
type PromotionCouponWalletItem struct {
	ClaimSource string `json:"claimSource"`
	ClaimedAt string `json:"claimedAt"`
	CodeId string `json:"codeId"`
	CouponNo string `json:"couponNo"`
	CurrencyCode string `json:"currencyCode"`
	DiscountType string `json:"discountType"`
	ExpiresAt string `json:"expiresAt"`
	FaceValueMinor int `json:"faceValueMinor"`
	Id string `json:"id"`
	LockExpiresAt string `json:"lockExpiresAt"`
	LockedAt string `json:"lockedAt"`
	OfferId string `json:"offerId"`
	RedeemedAt string `json:"redeemedAt"`
	ReturnedAt string `json:"returnedAt"`
	SourceCodeLast4 string `json:"sourceCodeLast4"`
	Status string `json:"status"`
	StockId string `json:"stockId"`
	ValidFrom string `json:"validFrom"`
}
