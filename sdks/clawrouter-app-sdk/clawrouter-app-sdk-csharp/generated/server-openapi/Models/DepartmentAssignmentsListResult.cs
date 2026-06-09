using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class DepartmentAssignmentsListResult
    {
        public string Code { get; set; }
        public IamDepartmentAssignmentListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
