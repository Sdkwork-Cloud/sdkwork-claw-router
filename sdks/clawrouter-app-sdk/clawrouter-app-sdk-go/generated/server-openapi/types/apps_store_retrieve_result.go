package types

// Apps store retrieve result schema exposed by Claw Router.
type AppsStoreRetrieveResult struct {
	Code string `json:"code"`
	Data AppDetailResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
