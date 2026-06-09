package types

// Departments list result schema exposed by Claw Router.
type DepartmentsListResult struct {
	Code string `json:"code"`
	Data IamDepartmentListResponse `json:"data"`
	Msg string `json:"msg"`
}
