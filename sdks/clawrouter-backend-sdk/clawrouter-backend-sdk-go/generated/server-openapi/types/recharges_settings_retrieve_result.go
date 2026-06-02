package types

// Recharges settings retrieve result schema exposed by Claw Router.
type RechargesSettingsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminRechargeSettingsResponse `json:"data"`
	Msg string `json:"msg"`
}
