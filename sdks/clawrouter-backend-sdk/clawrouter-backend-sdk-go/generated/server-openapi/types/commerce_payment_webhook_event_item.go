package types

// Commerce payment webhook event item schema exposed by Claw Router.
type CommercePaymentWebhookEventItem struct {
	EventNo string `json:"eventNo"`
	EventType string `json:"eventType"`
	ExternalEventId string `json:"externalEventId"`
	Id string `json:"id"`
	ProcessStatus string `json:"processStatus"`
	ProcessedAt string `json:"processedAt"`
	ProviderCode string `json:"providerCode"`
	ReceivedAt string `json:"receivedAt"`
}
