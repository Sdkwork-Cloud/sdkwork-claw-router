package types

// Coupons templates list result schema exposed by Claw Router.
type CouponsTemplatesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
