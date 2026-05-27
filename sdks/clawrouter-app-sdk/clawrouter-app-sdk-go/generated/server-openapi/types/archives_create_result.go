package types

// Archives create result schema exposed by Claw Router.
type ArchivesCreateResult struct {
	Code string `json:"code"`
	Data SdkReferenceArchiveResponse `json:"data"`
	Msg string `json:"msg"`
}
