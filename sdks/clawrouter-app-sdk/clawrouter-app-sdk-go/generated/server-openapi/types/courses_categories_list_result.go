package types

// Courses categories list result schema exposed by Claw Router.
type CoursesCategoriesListResult struct {
	Code string `json:"code"`
	Data CourseCategoryList `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
