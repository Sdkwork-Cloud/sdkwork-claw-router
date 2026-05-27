package types

// Sdk reference documentation response schema exposed by Claw Router.
type SdkReferenceDocumentationResponse struct {
	Generated bool `json:"generated"`
	Language string `json:"language"`
	MethodDefinition string `json:"methodDefinition"`
	Readme string `json:"readme"`
	UsageExample string `json:"usageExample"`
}
