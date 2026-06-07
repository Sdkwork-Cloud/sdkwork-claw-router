package types

// Commerce payment method item schema exposed by Claw Router.
type CommercePaymentMethodItem struct {
	CheckoutScenes []string `json:"checkoutScenes"`
	CreatedAt string `json:"createdAt"`
	DisplayName string `json:"displayName"`
	Id string `json:"id"`
	MethodCode string `json:"methodCode"`
	MethodType string `json:"methodType"`
	ProviderCode string `json:"providerCode"`
	SortOrder string `json:"sortOrder"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}
