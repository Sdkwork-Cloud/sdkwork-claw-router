package types

// Recharges settings update result schema exposed by Claw Router.
type RechargesSettingsUpdateResult struct {
	Code string `json:"code"`
	Data AdminRechargeSettingsResponse `json:"data"`
	Msg string `json:"msg"`
}
