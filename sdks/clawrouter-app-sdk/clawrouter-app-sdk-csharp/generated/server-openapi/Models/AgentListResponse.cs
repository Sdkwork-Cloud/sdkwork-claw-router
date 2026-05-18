using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentListResponse
    {
        public List<AgentItem>? Items { get; set; }
    }
}
