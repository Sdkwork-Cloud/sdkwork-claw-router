package types

// Documentation create result schema exposed by Claw Router.
type DocumentationCreateResult struct {
	Code string `json:"code"`
	Data SdkReferenceDocumentationResponse `json:"data"`
	Msg string `json:"msg"`
}
