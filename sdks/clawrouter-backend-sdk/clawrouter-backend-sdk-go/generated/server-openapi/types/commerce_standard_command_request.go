package types

// Commerce standard command request schema exposed by Claw Router.
type CommerceStandardCommandRequest struct {
	ClientRequestNo string `json:"clientRequestNo"`
	Metadata map[string]JsonValue `json:"metadata"`
	Note string `json:"note"`
}
