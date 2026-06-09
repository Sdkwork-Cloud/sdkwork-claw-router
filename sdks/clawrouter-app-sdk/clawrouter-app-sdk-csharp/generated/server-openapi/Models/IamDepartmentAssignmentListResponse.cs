using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamDepartmentAssignmentListResponse
    {
        public List<IamDepartmentAssignmentItem> Items { get; set; }
    }
}
