package types

// Commerce product media item schema exposed by Claw Router.
type CommerceProductMediaItem struct {
	AltText string `json:"altText"`
	Id string `json:"id"`
	MediaType string `json:"mediaType"`
	OwnerId string `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
	Url string `json:"url"`
}
