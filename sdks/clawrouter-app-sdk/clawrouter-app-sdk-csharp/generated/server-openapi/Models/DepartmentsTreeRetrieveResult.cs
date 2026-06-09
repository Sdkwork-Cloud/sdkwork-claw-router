using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class DepartmentsTreeRetrieveResult
    {
        public string Code { get; set; }
        public IamDepartmentTreeResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
