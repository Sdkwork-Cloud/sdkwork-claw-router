package types

// Commerce product media item schema exposed by Claw Router.
type CommerceProductMediaItem struct {
	AltText string `json:"altText"`
	Id string `json:"id"`
	MediaRole string `json:"mediaRole"`
	OwnerId string `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	Resource MediaResource `json:"resource"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
}
