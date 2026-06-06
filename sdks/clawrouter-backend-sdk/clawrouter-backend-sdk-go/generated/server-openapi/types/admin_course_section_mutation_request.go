package types

// Admin course section mutation request schema exposed by Claw Router.
type AdminCourseSectionMutationRequest struct {
	Description string `json:"description"`
	Metadata map[string]JsonValue `json:"metadata"`
	SectionNo string `json:"sectionNo"`
	SortOrder string `json:"sortOrder"`
	Status string `json:"status"`
	Title string `json:"title"`
}
