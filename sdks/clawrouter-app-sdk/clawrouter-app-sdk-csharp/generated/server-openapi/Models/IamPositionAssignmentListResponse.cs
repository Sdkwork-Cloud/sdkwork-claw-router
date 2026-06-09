using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPositionAssignmentListResponse
    {
        public List<IamPositionAssignmentItem> Items { get; set; }
    }
}
