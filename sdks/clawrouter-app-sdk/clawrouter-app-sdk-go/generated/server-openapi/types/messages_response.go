package types

// Messages response schema exposed by Claw Router.
type MessagesResponse struct {
	Items []Message `json:"items"`
}
