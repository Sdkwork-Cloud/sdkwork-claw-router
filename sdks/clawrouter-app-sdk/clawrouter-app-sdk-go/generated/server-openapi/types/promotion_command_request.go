package types

// Promotion command request schema exposed by Claw Router.
type PromotionCommandRequest struct {
	ClientRequestNo string `json:"clientRequestNo"`
	Metadata map[string]JsonValue `json:"metadata"`
	Note string `json:"note"`
}
