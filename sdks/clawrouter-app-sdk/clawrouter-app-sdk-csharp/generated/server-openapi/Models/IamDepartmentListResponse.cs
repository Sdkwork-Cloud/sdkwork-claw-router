using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamDepartmentListResponse
    {
        public List<IamDepartmentItem> Items { get; set; }
    }
}
