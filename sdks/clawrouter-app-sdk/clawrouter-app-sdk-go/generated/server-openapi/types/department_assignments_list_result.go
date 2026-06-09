package types

// Department assignments list result schema exposed by Claw Router.
type DepartmentAssignmentsListResult struct {
	Code string `json:"code"`
	Data IamDepartmentAssignmentListResponse `json:"data"`
	Msg string `json:"msg"`
}
