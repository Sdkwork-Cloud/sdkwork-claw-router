using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentSessionListResponse
    {
        public List<AgentSessionItem>? Items { get; set; }
    }
}
