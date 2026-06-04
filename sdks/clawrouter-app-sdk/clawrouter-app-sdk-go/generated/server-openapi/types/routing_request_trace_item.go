package types

// Routing request trace item schema exposed by Claw Router.
type RoutingRequestTraceItem struct {
	Channel string `json:"channel"`
	Duration string `json:"duration"`
	EndedAt string `json:"endedAt"`
	ErrorMessageMasked string `json:"errorMessageMasked"`
	ErrorType string `json:"errorType"`
	HttpMethod string `json:"httpMethod"`
	Id string `json:"id"`
	Model string `json:"model"`
	ProviderErrorCode string `json:"providerErrorCode"`
	RequestBytes int `json:"requestBytes"`
	RequestId string `json:"requestId"`
	RequestPath string `json:"requestPath"`
	RequestPayloadHash string `json:"requestPayloadHash"`
	ResponseBytes int `json:"responseBytes"`
	ResponsePayloadHash string `json:"responsePayloadHash"`
	StartedAt string `json:"startedAt"`
	Status int `json:"status"`
	Streaming bool `json:"streaming"`
	Time string `json:"time"`
	Tokens int `json:"tokens"`
	TraceId string `json:"traceId"`
}
