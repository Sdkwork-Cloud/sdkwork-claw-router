package types

// Sdk reference archive generate request schema exposed by Claw Router.
type SdkReferenceArchiveGenerateRequest struct {
	Config map[string]interface{} `json:"config"`
	Language string `json:"language"`
	Spec map[string]JsonValue `json:"spec"`
}
