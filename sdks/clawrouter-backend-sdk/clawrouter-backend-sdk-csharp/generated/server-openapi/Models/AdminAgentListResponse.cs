using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAgentListResponse
    {
        public List<AdminAgentItem> Items { get; set; }
    }
}
