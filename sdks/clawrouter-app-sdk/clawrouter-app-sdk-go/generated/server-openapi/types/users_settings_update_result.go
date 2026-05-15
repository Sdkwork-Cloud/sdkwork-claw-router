package types

// Users settings update result schema exposed by Claw Router.
type UsersSettingsUpdateResult struct {
	Code string `json:"code"`
	Data UpdateSettingsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
