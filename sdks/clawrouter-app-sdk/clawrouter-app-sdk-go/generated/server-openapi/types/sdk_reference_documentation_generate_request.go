package types

// Sdk reference documentation generate request schema exposed by Claw Router.
type SdkReferenceDocumentationGenerateRequest struct {
	Config map[string]interface{} `json:"config"`
	Language string `json:"language"`
	Spec map[string]JsonValue `json:"spec"`
}
