package types

// Runtime settings retrieve result schema exposed by Claw Router.
type RuntimeSettingsRetrieveResult struct {
	Code string `json:"code"`
	Data AuthRuntimeSettingsResponse `json:"data"`
	Msg string `json:"msg"`
}
