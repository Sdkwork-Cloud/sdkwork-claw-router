package types

// Iam runtime retrieve result schema exposed by Claw Router.
type IamRuntimeRetrieveResult struct {
	Code string `json:"code"`
	Data AuthRuntimeSettingsResponse `json:"data"`
	Msg string `json:"msg"`
}
