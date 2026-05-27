package types

// Sdk reference archive response schema exposed by Claw Router.
type SdkReferenceArchiveResponse struct {
	ContentBase64 string `json:"contentBase64"`
	ContentType string `json:"contentType"`
	FileName string `json:"fileName"`
	Language string `json:"language"`
}
