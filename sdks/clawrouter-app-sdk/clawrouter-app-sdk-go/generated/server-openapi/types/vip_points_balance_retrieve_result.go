package types

// Vip points balance retrieve result schema exposed by Claw Router.
type VipPointsBalanceRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePointsBalanceResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
