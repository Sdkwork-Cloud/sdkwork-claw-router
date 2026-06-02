package types

// Admin course mutation request schema exposed by Claw Router.
type AdminCourseMutationRequest struct {
	Category string `json:"category"`
	CourseCode string `json:"courseCode"`
	Description string `json:"description"`
	InstructorSnapshot map[string]JsonValue `json:"instructorSnapshot"`
	Level string `json:"level"`
	Metadata map[string]JsonValue `json:"metadata"`
	Status string `json:"status"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
}
