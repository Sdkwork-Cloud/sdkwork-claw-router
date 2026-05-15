package types

// Course category item schema exposed by Claw Router.
type CourseCategoryItem struct {
	Code string `json:"code"`
	CourseCount int `json:"courseCount"`
	Description string `json:"description"`
	Icon string `json:"icon"`
	Id string `json:"id"`
	Label string `json:"label"`
	Name string `json:"name"`
	SortWeight int `json:"sortWeight"`
}
