package types

// Departments tree retrieve result schema exposed by Claw Router.
type DepartmentsTreeRetrieveResult struct {
	Code string `json:"code"`
	Data IamDepartmentTreeResponse `json:"data"`
	Msg string `json:"msg"`
}
